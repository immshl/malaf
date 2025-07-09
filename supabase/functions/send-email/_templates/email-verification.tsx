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
    <Preview>تحقق من بريدك الإلكتروني لتفعيل حسابك في ملف</Preview>
    <Body style={main}>
      <Container style={container}>
        <div style={header}>
          <Heading style={h1}>مرحباً بك في ملف! 🎉</Heading>
        </div>
        
        <Text style={text}>
          شكراً لك على التسجيل في منصة ملف. لإكمال إنشاء حسابك، يرجى تأكيد بريدك الإلكتروني.
        </Text>

        <div style={buttonContainer}>
          <Link
            href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
            target="_blank"
            style={button}
          >
            تأكيد البريد الإلكتروني
          </Link>
        </div>

        <Text style={orText}>أو</Text>

        <Text style={text}>
          يمكنك نسخ ولصق كود التحقق التالي:
        </Text>
        
        <div style={codeContainer}>
          <code style={code}>{token.slice(0, 6)}</code>
        </div>

        <Text style={smallText}>
          هذا الكود صالح لمدة 24 ساعة فقط.
        </Text>

        <Text style={footerText}>
          إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة بأمان.
        </Text>

        <div style={footer}>
          <Text style={footerBrand}>
            <Link
              href="https://malaf.me"
              target="_blank"
              style={footerLink}
            >
              ملف - منصة الفريلانسرز المحترفة
            </Link>
          </Text>
        </div>
      </Container>
    </Body>
  </Html>
)

export default EmailVerificationTemplate

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Cairo, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  direction: 'rtl' as const,
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}

const header = {
  padding: '0 48px',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  textAlign: 'center' as const,
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 48px',
  textAlign: 'center' as const,
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#7c3aed',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  transition: 'background-color 0.3s ease',
}

const orText = {
  color: '#666',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '24px 0',
}

const codeContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const code = {
  display: 'inline-block',
  padding: '16px 24px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '2px solid #e2e8f0',
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: 'bold',
  letterSpacing: '4px',
  fontFamily: 'monospace',
}

const smallText = {
  color: '#666',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '16px 48px',
}

const footerText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 48px 16px',
  textAlign: 'center' as const,
}

const footer = {
  borderTop: '1px solid #e2e8f0',
  paddingTop: '32px',
  margin: '32px 48px 0',
}

const footerBrand = {
  margin: '0',
  textAlign: 'center' as const,
}

const footerLink = {
  color: '#7c3aed',
  fontSize: '14px',
  textDecoration: 'none',
  fontWeight: 'bold',
}