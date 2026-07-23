import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ccwpuwyqapvklvclzsmi.supabase.co';
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_YVntSYL3TkSmzn_ADLeFag_Q-zhdPN7';

export const supabase = createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });
export async function staffSignIn(email, password) { return supabase.auth.signInWithPassword({ email, password }); }
export async function staffSignOut() { return supabase.auth.signOut(); }
export async function saveMoment({body, tag, programCode}) { const {data:{user}} = await supabase.auth.getUser(); return supabase.from('fieldbook_moments').insert({participant_id:user?.id || null, body, tag, setting:programCode, private_to_participant:true, shared_with_program:false}); }
