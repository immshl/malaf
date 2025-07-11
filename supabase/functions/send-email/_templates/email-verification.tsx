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
  Hr,
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
    <Head />
    <Preview>تأكيد حسابك في منصة ملف</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with logo */}
        <Section style={header}>
          <Img
            src="https://5db6d598-99de-437b-a03d-617c9f33bbce.lovableproject.com/lovable-uploads/be1d2269-8206-422b-a395-e4fb9e1a88cc.png"
            alt="ملف"
            width="40"
            height="40"
            style={logo}
          />
          <Text style={brandName}>ملف</Text>
        </Section>

        <Hr style={divider} />

        {/* Main content */}
        <Heading style={h1}>أهلاً بك في منصة ملف! 👋</Heading>
        
        <Text style={text}>
          شكراً لك على التسجيل في منصة ملف - المنصة الاحترافية للفريلانسرز والمحترفين المستقلين.
        </Text>

        <Text style={text}>
          لإكمال إنشاء حسابك وبدء استخدام المنصة، يرجى تأكيد عنوان بريدك الإلكتروني بالنقر على الزر أدناه:
        </Text>

        {/* CTA Button */}
        <Section style={buttonContainer}>
          <Link href={verification_url} style={button}>
            تأكيد البريد الإلكتروني ✅
          </Link>
        </Section>

        <Text style={text}>
          أو يمكنك نسخ الرابط التالي ولصقه في متصفحك:
        </Text>
        <Text style={linkText}>{verification_url}</Text>

        <Hr style={divider} />

        {/* Footer */}
        <Text style={footer}>
          هذا الرابط صالح لمدة 24 ساعة فقط. إذا لم تقم بإنشاء حساب في منصة ملف، يمكنك تجاهل هذا البريد الإلكتروني.
        </Text>

        <Text style={footerBrand}>
          <Link href="https://malaf.me" style={brandLink}>
            منصة ملف
          </Link>
          {' • '}
          المنصة الاحترافية للفريلانسرز
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailVerificationTemplate

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: 'Cairo, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  margin: '40px auto',
  padding: '40px',
  maxWidth: '560px',
}

const header = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '32px',
}

const logo = {
  marginLeft: '12px',
}

const brandName = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1e293b',
  margin: '0',
}

const divider = {
  borderColor: '#e2e8f0',
  margin: '24px 0',
}

const h1 = {
  color: '#1e293b',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '32px 0',
}

const text = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  textAlign: 'right' as const,
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
}

const linkText = {
  color: '#3b82f6',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
  textAlign: 'center' as const,
  margin: '16px 0',
}

const footer = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '32px 0 16px 0',
}

const footerBrand = {
  color: '#64748b',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '0',
}

const brandLink = {
  color: '#3b82f6',
  textDecoration: 'none',
  fontWeight: 'bold',
}