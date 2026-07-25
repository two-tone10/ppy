import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ccwpuwyqapvklvclzsmi.supabase.co';
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_YVntSYL3TkSmzn_ADLeFag_Q-zhdPN7';

export const supabase = createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });
export async function ensureYouthSession() {
  const current = await supabase.auth.getSession();
  if (current.data.session) return current.data.session;
  const result = await supabase.auth.signInAnonymously();
  return result.data.session;
}
export async function staffSignIn(email, password) { return supabase.auth.signInWithPassword({ email, password }); }
export async function staffSignOut() { return supabase.auth.signOut(); }
export async function saveMoment({body, tag, programCode, magnitude=null}) { const session = await ensureYouthSession(); return supabase.from('fieldbook_moments').insert({participant_id:session?.user?.id, body, tag, magnitude, setting:programCode, private_to_participant:true, shared_with_program:false}); }
export async function saveMood({x, y, programCode}) { const session = await ensureYouthSession(); return supabase.from('fieldbook_mood_entries').insert({participant_id:session?.user?.id, x, y, setting:programCode}); }
export async function loadYouthData() { const session = await ensureYouthSession(); if (!session?.user) return {mood:null, moments:[], signals:[]}; const [moods,moments] = await Promise.all([supabase.from('fieldbook_mood_entries').select('x,y').eq('participant_id',session.user.id).order('created_at',{ascending:false}).limit(1), supabase.from('fieldbook_moments').select('body,tag').eq('participant_id',session.user.id).order('created_at',{ascending:false}).limit(30)]); return {mood:moods.data?.[0] || null, moments:moments.data?.map(x=>x.body).filter(Boolean) || [], signals:moments.data?.map(x=>({body:x.body,tag:x.tag})).filter(x=>x.body) || []}; }
export async function loadGroupMoods(programCode='pilot') { const result = await supabase.rpc('fieldbook_group_moods', {p_program_code:programCode}); return result.data || []; }
