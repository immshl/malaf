import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://mfchmiwxlkvkwtucizzl.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mY2htaXd4bGt2a3d0dWNpenpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNzUyNjAsImV4cCI6MjA2NzY1MTI2MH0.yANZJcQaq1QFsRtbayN9Y8pvBmnow60tE1aVrpDcDko"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)