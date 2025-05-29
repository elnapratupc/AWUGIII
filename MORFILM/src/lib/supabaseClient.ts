import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://jrlxttozcpfxezfpgzsh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpybHh0dG96Y3BmeGV6ZnBnenNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzAxOTIsImV4cCI6MjA2NDEwNjE5Mn0.PVavqDzL5Kbrjd5amNVK2QtAK0j5mNV13oIlh87xraw';

//const SUPABASE_URL = 'https://xzhumugyywnpykbfndwl.supabase.co';
//const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6aHVtdWd5eXducHlrYmZuZHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjc5MTYsImV4cCI6MjA2Mzk0MzkxNn0.oE1Wklncz1NurCuUjUIQZsJjpXdptMWDdAmVE0LTrjA';


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
