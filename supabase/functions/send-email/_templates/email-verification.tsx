import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface EmailVerificationProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email: string
}

export const EmailVerificationTemplate = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  user_email,
}: EmailVerificationProps) => (
  <Html>
    <Head />
    <Preview>تأكيد حسابك في ملف - منصة الفريلانسرز</Preview>
    <Body style={main}>
      <Container style={container}>
        <div style={logoSection}>
          <div style={logoContainer}>
            <Text style={logoText}>ملف</Text>
            <Text style={logoSubtext}>malaf</Text>
          </div>
        </div>
        
        <div style={contentSection}>
          <Heading style={h1}>أهلاً بك في ملف! 🎉</Heading>
          
          <Text style={welcomeText}>
            مرحباً بك في منصة الفريلانسرز المحترفة
          </Text>

          <Text style={instructionText}>
            اضغط على الزر أدناه لتأكيد حسابك وبدء رحلتك معنا:
          </Text>
          
          <div style={buttonContainer}>
            <Link 
              href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
              style={verifyButton}
            >
              تأكيد الحساب ✨
            </Link>
          </div>

          <Text style={noteText}>
            • هذا الرابط صالح لمدة 24 ساعة
          </Text>
          <Text style={noteText}>
            • إذا لم يعمل الزر، يمكنك نسخ الرابط أدناه ولصقه في المتصفح
          </Text>
          
          <div style={linkContainer}>
            <Text style={linkText}>
              {`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
            </Text>
          </div>

          <div style={divider}></div>

          <Text style={footerText}>
            إذا لم تقم بإنشاء حساب في ملف، يمكنك تجاهل هذه الرسالة بأمان.
          </Text>

          <div style={brandFooter}>
            <Text style={brandText}>
              <Link href="https://malaf.me" target="_blank" style={brandLink}>
                ملف - منصة الفريلانسرز المحترفة
              </Link>
            </Text>
            <Text style={taglineText}>
              ابني ملفك المهني واعرض مهاراتك للعالم
            </Text>
          </div>
        </div>
      </Container>
    </Body>
  </Html>
)

export default EmailVerificationTemplate

const main = {
  backgroundColor: '#f8fafc',
  fontFamily: 'Cairo, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  direction: 'rtl' as const,
  padding: '40px 20px',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}

const logoSection = {
  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
  padding: '40px 0',
  textAlign: 'center' as const,
}

const logoContainer = {
  display: 'inline-block',
}

const logoText = {
  color: '#ffffff',
  fontSize: '36px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1',
}

const logoSubtext = {
  color: '#e9d5ff',
  fontSize: '16px',
  margin: '8px 0 0 0',
  letterSpacing: '2px',
}

const contentSection = {
  padding: '48px 40px',
}

const h1 = {
  color: '#1e293b',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
}

const welcomeText = {
  color: '#475569',
  fontSize: '18px',
  lineHeight: '28px',
  margin: '0 0 32px 0',
  textAlign: 'center' as const,
}

const instructionText = {
  color: '#64748b',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 32px 0',
  textAlign: 'center' as const,
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '40px 0',
}

const verifyButton = {
  backgroundColor: '#7c3aed',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '16px 32px',
  borderRadius: '12px',
  display: 'inline-block',
  boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
  transition: 'all 0.3s ease',
}

const linkContainer = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const linkText = {
  color: '#64748b',
  fontSize: '12px',
  fontFamily: 'monospace',
  wordBreak: 'break-all' as const,
  lineHeight: '1.5',
  margin: '0',
}

const noteText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
  textAlign: 'right' as const,
  paddingRight: '16px',
}

const divider = {
  height: '1px',
  backgroundColor: '#e2e8f0',
  margin: '40px 0',
}

const footerText = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 32px 0',
  textAlign: 'center' as const,
}

const brandFooter = {
  textAlign: 'center' as const,
  borderTop: '1px solid #e2e8f0',
  paddingTop: '32px',
}

const brandText = {
  margin: '0 0 8px 0',
}

const brandLink = {
  color: '#7c3aed',
  fontSize: '16px',
  textDecoration: 'none',
  fontWeight: 'bold',
}

const taglineText = {
  color: '#94a3b8',
  fontSize: '14px',
  margin: '0',
}