import { supabase } from '@/lib/supabase/config'

export const createUserProfile = async (userId: string, email: string, displayName?: string) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      email: email,
      display_name: displayName || email.split('@')[0],
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  return { data, error }
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: { display_name?: string }) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}