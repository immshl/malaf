import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'npm:resend@4.0.0'
import React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { BookingNotificationTemplate } from './_templates/booking-notification.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BookingNotificationRequest {
  freelancerEmail: string
  freelancerName: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  requestedDay?: string
  requestedTime?: string
  suggestedDay?: string
  suggestedTimeSlot?: string
  notes?: string
  isAlternativeRequest: boolean
}

serve(async (req: Request): Promise<Response> => {
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
    const {
      freelancerEmail,
      freelancerName,
      clientName,
      clientEmail,
      clientPhone,
      requestedDay,
      requestedTime,
      suggestedDay,
      suggestedTimeSlot,
      notes,
      isAlternativeRequest
    }: BookingNotificationRequest = await req.json()

    console.log('Sending booking notification to:', freelancerEmail)

    // Generate HTML from React Email template
    const html = await renderAsync(
      React.createElement(BookingNotificationTemplate, {
        freelancerName,
        clientName,
        clientEmail,
        clientPhone,
        requestedDay,
        requestedTime,
        suggestedDay,
        suggestedTimeSlot,
        notes,
        isAlternativeRequest,
      })
    )

    console.log('Booking notification template generated successfully')

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: 'ملف - Malaf <notifications@resend.dev>',
      to: [freelancerEmail],
      subject: isAlternativeRequest 
        ? '🗓️ طلب حجز جديد - اقتراح موعد بديل'
        : '🗓️ طلب حجز اجتماع جديد',
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Booking notification email sent successfully to:', freelancerEmail)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      },
    })

  } catch (error) {
    console.error('Send booking notification error:', error)
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
})