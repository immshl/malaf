import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Img,
  Section,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface EmailVerificationProps {
  verification_url: string
  user_email: string
}

export const EmailVerificationTemplate = ({
  verification_url,
  user_email,
}: EmailVerificationProps) => (
  <Html>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');
      `}</style>
    </Head>
    <Preview>تأكيد البريد الإلكتروني - منصة ملف</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with Malaf branding */}
        <Section style={header}>
          <div style={brandSection}>
            <Img 
              src="https://mfchmiwxlkvkwtucizzl.supabase.co/storage/v1/object/public/portfolio/malaf-logo.png"
              alt="شعار ملف"
              width="80"
              height="80"
              style={logoStyle}
            />
            <h1 style={brandName}>ملف</h1>
            <p style={brandTagline}>ملف مهني خاص بك</p>
          </div>
        </Section>

        {/* Main content */}
        <Section style={content}>
          <h2 style={title}>تأكيد البريد الإلكتروني</h2>
          
          <p style={greeting}>
            مرحباً {user_email}،
          </p>
          
          <p style={message}>
            شكراً لك على التسجيل في منصة ملف! يرجى النقر على الزر أدناه لتأكيد بريدك الإلكتروني:
          </p>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Link href={verification_url} style={verifyButton}>
              تأكيد البريد الإلكتروني
            </Link>
          </Section>
          
          <p style={alternativeText}>
            إذا لم يعمل الزر أعلاه، يمكنك نسخ الرابط التالي ولصقه في متصفحك:
          </p>
          
          <Section style={linkContainer}>
            <p style={linkText}>{verification_url}</p>
          </Section>
        </Section>

        {/* Security note */}
        <Section style={securitySection}>
          <p style={securityText}>
            🔒 لحماية حسابك، هذا الرابط صالح لمدة 24 ساعة فقط.
          </p>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <p style={footerText}>
            مع أطيب التحيات،<br />
            فريق منصة ملف
          </p>
          
          <p style={disclaimer}>
            إذا لم تقم بإنشاء حساب في منصة ملف، يمكنك تجاهل هذا الإيميل بأمان.
          </p>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default EmailVerificationTemplate

// Malaf brand styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: 'Cairo, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  margin: '0',
  padding: '20px',
  direction: 'rtl' as const,
}

const container = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  margin: '0 auto',
  maxWidth: '600px',
  overflow: 'hidden',
}

const header = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '40px 20px',
  textAlign: 'center' as const,
}

const brandSection = {
  color: '#ffffff',
}

const brandName = {
  fontSize: '36px',
  fontWeight: '700',
  margin: '0 0 8px 0',
  color: '#ffffff',
  letterSpacing: '2px',
}

const logoStyle = {
  marginBottom: '16px',
  borderRadius: '12px',
}

const brandTagline = {
  fontSize: '16px',
  fontWeight: '400',
  margin: '0',
  color: '#f1f5f9',
  opacity: '0.9',
}

const content = {
  padding: '40px 30px',
}

const title = {
  color: '#1a202c',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
}

const greeting = {
  color: '#4a5568',
  fontSize: '16px',
  fontWeight: '400',
  margin: '0 0 16px 0',
  textAlign: 'right' as const,
}

const message = {
  color: '#2d3748',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '1.6',
  margin: '0 0 30px 0',
  textAlign: 'right' as const,
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const verifyButton = {
  backgroundColor: '#667eea',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  padding: '14px 28px',
  textDecoration: 'none',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.2s ease',
}

const alternativeText = {
  color: '#718096',
  fontSize: '14px',
  fontWeight: '400',
  margin: '24px 0 12px 0',
  textAlign: 'center' as const,
}

const linkContainer = {
  backgroundColor: '#f7fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '12px',
  margin: '12px 0',
}

const linkText = {
  color: '#667eea',
  fontSize: '12px',
  fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  margin: '0',
  wordBreak: 'break-all' as const,
  textAlign: 'center' as const,
}

const securitySection = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fbbf24',
  borderRadius: '6px',
  margin: '20px 30px',
  padding: '16px',
}

const securityText = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: '400',
  margin: '0',
  textAlign: 'center' as const,
}

const footer = {
  backgroundColor: '#f7fafc',
  borderTop: '1px solid #e2e8f0',
  padding: '30px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#4a5568',
  fontSize: '14px',
  fontWeight: '400',
  margin: '0 0 16px 0',
}

const disclaimer = {
  color: '#718096',
  fontSize: '12px',
  fontWeight: '400',
  margin: '0',
}