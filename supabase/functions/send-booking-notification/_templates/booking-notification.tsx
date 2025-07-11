import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface BookingNotificationProps {
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

export const BookingNotificationTemplate = ({
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
}: BookingNotificationProps) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>
      {isAlternativeRequest 
        ? `طلب حجز جديد مع اقتراح موعد من ${clientName}`
        : `طلب حجز اجتماع جديد من ${clientName}`
      }
    </Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <img 
            src="https://mfchmiwxlkvkwtucizzl.supabase.co/storage/v1/object/public/avatars/malaf-email-logo.png"
            alt="ملف - منصة الفريلانسرز"
            style={logoImage}
          />
          <Text style={logo}>ملف</Text>
          <Text style={tagline}>منصة الفريلانسرز</Text>
        </Section>

        {/* Greeting */}
        <Section style={content}>
          <Heading style={h1}>مرحباً {freelancerName} 👋</Heading>
          <Text style={text}>
            {isAlternativeRequest 
              ? 'لديك طلب حجز جديد مع اقتراح موعد بديل!'
              : 'لديك طلب حجز اجتماع جديد!'
            }
          </Text>
        </Section>

        {/* Client Information */}
        <Section style={infoSection}>
          <Heading style={h2}>📋 بيانات العميل</Heading>
          <Row style={infoRow}>
            <Column style={labelColumn}>
              <Text style={label}>الاسم:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{clientName}</Text>
            </Column>
          </Row>
          <Row style={infoRow}>
            <Column style={labelColumn}>
              <Text style={label}>البريد الإلكتروني:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{clientEmail}</Text>
            </Column>
          </Row>
          {clientPhone && (
            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>رقم الجوال:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{clientPhone}</Text>
              </Column>
            </Row>
          )}
        </Section>

        {/* Meeting Details */}
        <Section style={infoSection}>
          <Heading style={h2}>
            {isAlternativeRequest ? '📅 الموعد المقترح' : '📅 موعد الاجتماع'}
          </Heading>
          {isAlternativeRequest ? (
            <>
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>اليوم المقترح:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{suggestedDay}</Text>
                </Column>
              </Row>
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>الفترة المقترحة:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{suggestedTimeSlot}</Text>
                </Column>
              </Row>
            </>
          ) : (
            <>
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>اليوم:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{requestedDay}</Text>
                </Column>
              </Row>
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>الوقت:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{requestedTime}</Text>
                </Column>
              </Row>
            </>
          )}
        </Section>

        {/* Notes */}
        {notes && (
          <Section style={infoSection}>
            <Heading style={h2}>📝 ملاحظات العميل</Heading>
            <Text style={notesText}>{notes}</Text>
          </Section>
        )}

        <Hr style={hr} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            يمكنك إدارة حجوزاتك من خلال لوحة التحكم في منصة ملف
          </Text>
          <Text style={footerText}>
            هذا إشعار تلقائي من منصة ملف - لا تحتاج للرد على هذا الإيميل
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default BookingNotificationTemplate

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#ffffff',
  borderRadius: '12px 12px 0 0',
  padding: '24px',
  textAlign: 'center' as const,
  borderBottom: '1px solid #e6ebf1',
}

const logo = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#1a1a1a',
  margin: '0 0 8px 0',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

const tagline = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
}

const content = {
  backgroundColor: '#ffffff',
  padding: '24px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '0 0 16px 0',
}

const h2 = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '0 0 16px 0',
}

const text = {
  color: '#6b7280',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

const infoSection = {
  backgroundColor: '#ffffff',
  padding: '0 24px 24px 24px',
}

const infoRow = {
  marginBottom: '12px',
}

const labelColumn = {
  width: '140px',
  verticalAlign: 'top' as const,
}

const valueColumn = {
  verticalAlign: 'top' as const,
}

const label = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
}

const value = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
}

const notesText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footer = {
  backgroundColor: '#ffffff',
  borderRadius: '0 0 12px 12px',
  padding: '24px',
  textAlign: 'center' as const,
}

const logoImage = {
  width: '64px',
  height: '64px',
  margin: '0 auto 16px auto',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
}

const footerText = {
  color: '#8b949e',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
}