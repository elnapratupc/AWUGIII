// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ethcrcxaduqsndhxbxle.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0aGNyY3hhZHVxc25kaHhieGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNTczODQsImV4cCI6MjA1ODczMzM4NH0._TXK0L3KDdqKLdljCZ-DP1sBnygLiL8rLnqnCJ8JdYY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
