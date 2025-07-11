import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { EmailVerificationTemplate } from './_templates/email-verification.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    })
  }

  try {
    console.log('Received email request:', req.headers.get('content-type'));
    
    const payload = await req.text()
    console.log('Payload received:', payload.substring(0, 200));

    // Try to parse as webhook first, then as direct call
    let user, email_data;
    
    try {
      // Try webhook format first
      const headers = Object.fromEntries(req.headers)
      const wh = new Webhook(hookSecret)
      
      const webhookData = wh.verify(payload, headers) as {
        user: { email: string }
        email_data: {
          token: string
          token_hash: string
          redirect_to: string
          email_action_type: string
          site_url: string
        }
      }
      
      user = webhookData.user;
      email_data = webhookData.email_data;
      console.log('Processed as webhook');
      
    } catch (webhookError) {
      console.log('Webhook parsing failed, trying direct format:', webhookError.message);
      
      // Try direct call format
      const data = JSON.parse(payload);
      user = { email: data.email };
      email_data = {
        token: data.token || '123456',
        token_hash: data.token_hash || '',
        redirect_to: data.redirect_to || `${req.headers.get('origin')}/verify-email`,
        email_action_type: data.email_action_type || 'signup',
        site_url: Deno.env.get('SUPABASE_URL') || ''
      };
      console.log('Processed as direct call');
    }

    console.log('Generating email for:', user.email);

    // Generate HTML from React Email template
    const html = await renderAsync(
      React.createElement(EmailVerificationTemplate, {
        supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
        token: email_data.token,
        token_hash: email_data.token_hash,
        redirect_to: email_data.redirect_to,
        email_action_type: email_data.email_action_type,
        user_email: user.email,
      })
    )

    console.log('Email template generated successfully');

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: 'ملف - Malaf <onboarding@resend.dev>',
      to: [user.email],
      subject: 'كود التحقق من ملف - منصة الفريلانسرز',
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully to:', user.email)

  } catch (error) {
    console.error('Send email error:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR',
        },
      }),
      {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      }
    )
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      ...corsHeaders 
    },
  })
})