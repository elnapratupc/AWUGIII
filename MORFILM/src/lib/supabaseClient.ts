import { createClient, User, Session, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gadqyesmcdyoscdepqms.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZHF5ZXNtY2R5b3NjZGVwcW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjAyODgsImV4cCI6MjA2MDM5NjI4OH0.2QxiKGjreRStQpJGLX6uxMA5cNjJ8u74tWShBvIgSes';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type { User, Session };