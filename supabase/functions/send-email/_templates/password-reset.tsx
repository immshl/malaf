import React from 'npm:react@18.3.1'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Text,
  Link,
  Button,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface PasswordResetTemplateProps {
  reset_url: string
  user_email: string
}

export const PasswordResetTemplate = ({ reset_url, user_email }: PasswordResetTemplateProps) => {
  return (
    <Html dir="rtl">
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header with gradient */}
          <Section style={headerSection}>
            <Img
              src="https://malaf.me/malaf-email-logo.png"
              width="120"
              height="60"
              alt="منصة ملف"
              style={logo}
            />
          </Section>

          {/* Main content card */}
          <Section style={contentCard}>
            <Text style={title}>🔐 إعادة تعيين كلمة المرور</Text>
            
            <Text style={greeting}>مرحباً</Text>
            
            <Text style={description}>
              تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في منصة ملف.
            </Text>

            <Text style={description}>
              انقر على الزر أدناه لإعادة تعيين كلمة المرور الخاصة بك:
            </Text>

            {/* Reset button */}
            <Section style={buttonSection}>
              <Button href={reset_url} style={resetButton}>
                إعادة تعيين كلمة المرور
              </Button>
            </Section>

            {/* Security note */}
            <Section style={securityCard}>
              <Text style={securityTitle}>🛡️ ملاحظة أمنية</Text>
              <Text style={securityText}>
                • هذا الرابط صالح لمدة ساعة واحدة فقط
              </Text>
              <Text style={securityText}>
                • إذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذا الإيميل
              </Text>
              <Text style={securityText}>
                • لا تشارك هذا الرابط مع أي شخص آخر
              </Text>
            </Section>

            <Hr style={divider} />

            <Text style={footerText}>
              إذا لم يعمل الزر أعلاه، انسخ الرابط التالي والصقه في متصفحك:
            </Text>
            <Link href={reset_url} style={linkText}>
              {reset_url}
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              مع تحيات فريق منصة ملف 💜
            </Text>
            <Text style={copyrightText}>
              © 2024 منصة ملف. جميع الحقوق محفوظة.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '20px 0',
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
}

const headerSection = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '40px 20px',
  textAlign: 'center' as const,
}

const logo = {
  margin: '0 auto',
  borderRadius: '8px',
}

const contentCard = {
  padding: '40px 30px',
  backgroundColor: '#ffffff',
}

const title = {
  fontSize: '28px',
  fontWeight: '700',
  textAlign: 'center' as const,
  color: '#1a202c',
  marginBottom: '20px',
  lineHeight: '1.3',
}

const greeting = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#2d3748',
  marginBottom: '15px',
}

const description = {
  fontSize: '16px',
  color: '#4a5568',
  lineHeight: '1.6',
  marginBottom: '20px',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '35px 0',
}

const resetButton = {
  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  padding: '15px 35px',
  textDecoration: 'none',
  borderRadius: '8px',
  display: 'inline-block',
  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
  transition: 'all 0.3s ease',
}

const securityCard = {
  backgroundColor: '#fff5f5',
  border: '1px solid #fed7d7',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '30px',
}

const securityTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#c53030',
  marginBottom: '10px',
}

const securityText = {
  fontSize: '14px',
  color: '#7e1a1a',
  margin: '5px 0',
  lineHeight: '1.5',
}

const divider = {
  borderColor: '#e2e8f0',
  margin: '30px 0',
}

const linkText = {
  color: '#667eea',
  fontSize: '14px',
  wordBreak: 'break-all' as const,
  textDecoration: 'underline',
}

const footer = {
  backgroundColor: '#f7fafc',
  padding: '30px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '14px',
  color: '#4a5568',
  lineHeight: '1.5',
  margin: '10px 0',
}

const copyrightText = {
  fontSize: '12px',
  color: '#a0aec0',
  marginTop: '15px',
}