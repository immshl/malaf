-- Check if email confirmation is required and causing delays
-- This query will help identify the root cause of signup timeouts
SELECT 
  setting_name,
  setting_value 
FROM auth.config 
WHERE setting_name IN ('MAILER_AUTOCONFIRM', 'SMTP_ADMIN_EMAIL', 'EXTERNAL_EMAIL_ENABLED');