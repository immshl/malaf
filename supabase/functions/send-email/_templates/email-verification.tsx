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
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    </Head>
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
  backgroundColor: '#fafafa',
  fontFamily: 'Cairo, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  direction: 'rtl' as const,
  padding: '0',
  margin: '0',
  lineHeight: '1.6',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '0',
  boxShadow: 'none',
  overflow: 'hidden',
}

const logoSection = {
  background: '#ffffff',
  padding: '48px 0 32px 0',
  textAlign: 'center' as const,
  borderBottom: '1px solid #f0f0f0',
}

const logoContainer = {
  display: 'inline-block',
}

const logoText = {
  color: '#000000',
  fontSize: '32px',
  fontWeight: '600',
  margin: '0',
  lineHeight: '1',
  letterSpacing: '-0.02em',
}

const logoSubtext = {
  color: '#666666',
  fontSize: '14px',
  margin: '4px 0 0 0',
  letterSpacing: '1px',
  fontWeight: '400',
}

const contentSection = {
  padding: '48px 48px 64px 48px',
  backgroundColor: '#ffffff',
}

const h1 = {
  color: '#1d1d1f',
  fontSize: '28px',
  fontWeight: '600',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
  lineHeight: '1.3',
  letterSpacing: '-0.02em',
}

const welcomeText = {
  color: '#1d1d1f',
  fontSize: '17px',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
  fontWeight: '400',
}

const instructionText = {
  color: '#86868b',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '0 0 32px 0',
  textAlign: 'center' as const,
  fontWeight: '400',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const verifyButton = {
  backgroundColor: '#1d1d1f',
  color: '#ffffff',
  fontSize: '17px',
  fontWeight: '500',
  textDecoration: 'none',
  padding: '16px 32px',
  borderRadius: '8px',
  display: 'inline-block',
  border: 'none',
  cursor: 'pointer',
  letterSpacing: '-0.01em',
}

const noteText = {
  color: '#86868b',
  fontSize: '13px',
  lineHeight: '1.4',
  margin: '8px 0',
  textAlign: 'right' as const,
  paddingRight: '16px',
  fontWeight: '400',
}

const linkContainer = {
  backgroundColor: '#f5f5f7',
  border: '1px solid #e8e8ed',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const linkText = {
  color: '#86868b',
  fontSize: '11px',
  fontFamily: 'SF Mono, Monaco, Inconsolata, "Roboto Mono", Consolas, "Courier New", monospace',
  wordBreak: 'break-all' as const,
  lineHeight: '1.4',
  margin: '0',
  fontWeight: '400',
}

const divider = {
  height: '1px',
  backgroundColor: '#f0f0f0',
  margin: '40px 0',
  border: 'none',
}

const footerText = {
  color: '#86868b',
  fontSize: '13px',
  lineHeight: '1.4',
  margin: '0 0 32px 0',
  textAlign: 'center' as const,
  fontWeight: '400',
}

const brandFooter = {
  textAlign: 'center' as const,
  borderTop: '1px solid #f0f0f0',
  paddingTop: '32px',
  backgroundColor: '#fbfbfd',
  margin: '0 -48px -64px -48px',
  padding: '32px 48px 48px 48px',
}

const brandText = {
  margin: '0 0 8px 0',
}

const brandLink = {
  color: '#1d1d1f',
  fontSize: '15px',
  textDecoration: 'none',
  fontWeight: '500',
  letterSpacing: '-0.01em',
}

const taglineText = {
  color: '#86868b',
  fontSize: '13px',
  margin: '0',
  fontWeight: '400',
  lineHeight: '1.4',
}