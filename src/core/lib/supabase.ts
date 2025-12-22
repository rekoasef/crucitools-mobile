import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Reemplazá estos valores con los que figuran en:
// Supabase Dashboard -> Settings -> API
const supabaseUrl = 'https://nplwevkoesvhsfdvcovc.supabase.co';
const supabaseAnonKey = 'sb_publishable_DPeLs4GwRv-FayiQjOD_kw_EocLhZzf';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});