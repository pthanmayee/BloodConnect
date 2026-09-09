import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ttwzrmueeglhyprxahov.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0d3pybXVlZWdsaHlwcnhhaG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NzgzOTksImV4cCI6MjEwMzE1NDM5OX0.wUPdB166Z2LRhzuSyR8wVfQ1aozG_PGQko5RFuAjkX4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
