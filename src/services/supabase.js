import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const SUPABASE_PROJECT_REF = SUPABASE_URL ? new URL(SUPABASE_URL).hostname.split('.')[0] : '';
const SUPABASE_STORAGE_KEY = SUPABASE_PROJECT_REF ? `sb-${SUPABASE_PROJECT_REF}-auth-token` : '';

export const supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (SUPABASE_STORAGE_KEY) {
  window.localStorage.removeItem(SUPABASE_STORAGE_KEY);
}

export const supabase = supabaseEnabled
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.sessionStorage
      }
    })
  : null;

export async function getUserFamilies(userId) {
  if (!supabaseEnabled) return [];

  const { data, error } = await supabase
    .from('family_members')
    .select('role, families:family_id(id, name, owner_id, currency, language, created_at)')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data || []).map((item) => ({
    ...item.families,
    role: item.role
  }));
}

export async function createInitialFamily({ user, name, familyName, currency = 'BRL', language = 'pt' }) {
  if (!supabaseEnabled) return null;

  const { data: family, error } = await supabase.rpc('create_family_with_owner', {
    owner_name: name,
    owner_email: user.email,
    family_name: familyName,
    family_currency: currency,
    family_language: language
  });

  if (error) throw error;
  return family;
}

export async function getSnapshot(familyId) {
  if (!supabaseEnabled) return null;

  const { data, error } = await supabase.from('app_snapshots').select('payload, updated_at').eq('family_id', familyId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertSnapshot(familyId, payload) {
  if (!supabaseEnabled) return;

  const { error } = await supabase.from('app_snapshots').upsert({
    family_id: familyId,
    payload,
    updated_at: new Date().toISOString()
  });

  if (error) throw error;
}

export async function createSupabaseFamily({ name, currency, language }) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data: family, error } = await supabase.rpc('create_family_with_owner', {
    owner_name: userData.user?.user_metadata?.name || userData.user?.email?.split('@')[0] || 'Usuario principal',
    owner_email: userData.user?.email || '',
    family_name: name,
    family_currency: currency,
    family_language: language
  });

  if (error) throw error;
  return family;
}

export async function inviteSupabaseMember({ familyId, invitedBy, name, email }) {
  const token = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const { data, error } = await supabase
    .from('family_invitations')
    .insert({ family_id: familyId, invited_by: invitedBy, name, email, token })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function sendPasswordResetEmail(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth`
  });

  if (error) throw error;
}

export async function updateSupabasePassword(password) {
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  return data;
}

export async function acceptSupabaseInvitation(token) {
  const { data, error } = await supabase.rpc('accept_family_invitation', {
    invitation_token: token
  });

  if (error) throw error;
  return data;
}
