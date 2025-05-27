import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xzhumugyywnpykbfndwl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6aHVtdWd5eXducHlrYmZuZHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjc5MTYsImV4cCI6MjA2Mzk0MzkxNn0.oE1Wklncz1NurCuUjUIQZsJjpXdptMWDdAmVE0LTrjA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
