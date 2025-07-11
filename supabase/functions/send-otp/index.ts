import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface SendOTPRequest {
  email: string;
  type: 'signup' | 'recovery';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type }: SendOTPRequest = await req.json();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database with expiry (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    
    const { error: dbError } = await supabase
      .from('otp_codes')
      .upsert({
        email,
        code: otp,
        type,
        expires_at: expiresAt.toISOString(),
        used: false
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store OTP');
    }

    // Send email with OTP
    const subject = type === 'signup' ? 'كود التحقق من ملف - منصة الفريلانسرز' : 'استعادة كلمة المرور - ملف';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: center; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #7c3aed, #3b82f6); padding: 40px; border-radius: 12px; color: white; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">ملف</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">منصة الفريلانسرز</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">
            ${type === 'signup' ? 'مرحباً بك في ملف!' : 'استعادة كلمة المرور'}
          </h2>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 30px;">
            ${type === 'signup' 
              ? 'لإكمال إنشاء حسابك، يرجى إدخال كود التحقق التالي:' 
              : 'لاستعادة كلمة المرور، يرجى إدخال كود التحقق التالي:'}
          </p>
          
          <div style="background: white; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #7c3aed; text-align: center;">
            ${otp}
          </div>
          
          <p style="color: #ef4444; font-size: 14px; margin-top: 20px;">
            هذا الكود صالح لمدة 5 دقائق فقط
          </p>
        </div>
        
        <div style="color: #64748b; font-size: 14px; line-height: 1.6;">
          <p>إذا لم تطلب هذا الكود، يرجى تجاهل هذه الرسالة.</p>
          <p>للمساعدة، تواصل معنا على: hello@malaf.me</p>
        </div>
      </div>
    `;

    const { error: emailError } = await resend.emails.send({
      from: "ملف - Malaf <hello@malaf.me>",
      to: [email],
      subject,
      html: emailHtml,
    });

    if (emailError) {
      console.error('Email error:', emailError);
      throw new Error('Failed to send OTP email');
    }

    console.log('OTP sent successfully to:', email);

    return new Response(
      JSON.stringify({ success: true, message: 'OTP sent successfully' }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Send OTP error:', error);
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