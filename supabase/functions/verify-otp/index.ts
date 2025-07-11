import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface VerifyOTPRequest {
  email: string;
  code: string;
  type: 'signup' | 'recovery';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code, type }: VerifyOTPRequest = await req.json();

    // Get OTP from database
    const { data: otpData, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('type', type)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (fetchError || !otpData) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP code' }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Mark OTP as used
    const { error: updateError } = await supabase
      .from('otp_codes')
      .update({ used: true })
      .eq('id', otpData.id);

    if (updateError) {
      console.error('Failed to mark OTP as used:', updateError);
    }

    if (type === 'signup') {
      // Get user by email
      const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
      
      if (getUserError) {
        throw new Error('Failed to get user');
      }

      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Confirm user email
      const { error: confirmError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirmed_at: new Date().toISOString() }
      );

      if (confirmError) {
        throw new Error('Failed to confirm user email');
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'OTP verified successfully' }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);