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
  <Html dir="rtl">
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');
      `}</style>
    </Head>
    <Preview>تأكيد حسابك في منصة ملف - خطوة واحدة متبقية!</Preview>
    <Body style={main}>
      {/* Spacer for better mobile rendering */}
      <Section style={spacer} />
      
      <Container style={container}>
        {/* Logo Section with Apple-like minimalism */}
        <Section style={logoSection}>
          <Img
            src="https://5db6d598-99de-437b-a03d-617c9f33bbce.lovableproject.com/lovable-uploads/be1d2269-8206-422b-a395-e4fb9e1a88cc.png"
            alt="ملف"
            width="56"
            height="56"
            style={logo}
          />
        </Section>

        {/* Hero Section */}
        <Section style={heroSection}>
          <Heading style={h1}>مرحباً بك في ملف</Heading>
          <Text style={subtitle}>
            نحن متحمسون لانضمامك إلى مجتمع المحترفين المستقلين
          </Text>
        </Section>

        {/* Content Card */}
        <Section style={contentCard}>
          <Text style={text}>
            لإكمال إنشاء حسابك والبدء في استخدام منصة ملف، نحتاج لتأكيد عنوان بريدك الإلكتروني.
          </Text>
          
          <Text style={emailText}>
            {user_email}
          </Text>
        </Section>

        {/* CTA Section with Apple-style button */}
        <Section style={ctaSection}>
          <Link href={verification_url} style={primaryButton}>
            تأكيد البريد الإلكتروني
          </Link>
          
          <Text style={alternativeText}>
            إذا لم يعمل الزر أعلاه، يمكنك استخدام الرابط التالي:
          </Text>
          
          <Section style={linkSection}>
            <Link href={verification_url} style={linkText}>
              افتح رابط التحقق
            </Link>
          </Section>
        </Section>

        {/* Security Note */}
        <Section style={securityNote}>
          <Text style={noteText}>
            🔒 هذا الرابط صالح لمدة 24 ساعة فقط
          </Text>
          <Text style={noteText}>
            إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذا البريد بأمان
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Link href="https://malaf.me" style={footerLink}>
            منصة ملف
          </Link>
          <Text style={footerText}>
            المنصة الاحترافية للمحترفين المستقلين والفريلانسرز
          </Text>
        </Section>
      </Container>
      
      {/* Bottom spacer */}
      <Section style={spacer} />
    </Body>
  </Html>
)

export default EmailVerificationTemplate

// Apple-inspired modern styles
const main = {
  backgroundColor: '#fafafa',
  fontFamily: 'Cairo, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  margin: '0',
  padding: '0',
}

const spacer = {
  height: '20px',
}

const container = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  margin: '0 auto',
  maxWidth: '600px',
  overflow: 'hidden',
}

const logoSection = {
  backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '40px 0',
  textAlign: 'center' as const,
}

const logo = {
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
}

const heroSection = {
  padding: '40px 32px 20px',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: '600',
  lineHeight: '1.2',
  margin: '0 0 12px 0',
  letterSpacing: '-0.5px',
}

const subtitle = {
  color: '#6b7280',
  fontSize: '18px',
  fontWeight: '400',
  lineHeight: '1.4',
  margin: '0',
}

const contentCard = {
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  margin: '20px 32px',
  padding: '24px',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
  textAlign: 'right' as const,
}

const emailText = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  color: '#4f46e5',
  fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
  padding: '12px 16px',
  textAlign: 'center' as const,
}

const ctaSection = {
  padding: '32px',
  textAlign: 'center' as const,
}

const primaryButton = {
  backgroundColor: '#4f46e5',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  padding: '16px 32px',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
}

const alternativeText = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '400',
  margin: '24px 0 16px 0',
}

const linkSection = {
  backgroundColor: '#f1f5f9',
  borderRadius: '8px',
  margin: '16px 0',
  padding: '16px',
}

const linkText = {
  color: '#4f46e5',
  fontSize: '12px',
  fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  lineHeight: '1.4',
  margin: '0',
  wordBreak: 'break-all' as const,
}

const securityNote = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #fbbf24',
  margin: '24px 32px',
  padding: '16px 20px',
}

const noteText = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
  textAlign: 'right' as const,
}

const footer = {
  borderTop: '1px solid #e5e7eb',
  padding: '32px',
  textAlign: 'center' as const,
}

const footerLink = {
  color: '#4f46e5',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
}

const footerText = {
  color: '#9ca3af',
  fontSize: '14px',
  fontWeight: '400',
  margin: '8px 0 0 0',
}