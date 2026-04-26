import { supabase } from '@/lib/supabase/config'

// Update user time with better error handling
export const updateUserTime = async (userId: string, additionalMinutes: number) => {
  const today = new Date().toISOString().split('T')[0]
  
  try {
    // First ensure user exists
    const { error: userError } = await supabase
      .from('users')
      .upsert({ id: userId }, { onConflict: 'id' })

    if (userError) console.warn('User upsert warning:', userError)

    // Update progress
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        date: today,
        time_spent: additionalMinutes,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,date',
        ignoreDuplicates: false
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error updating user time:', error)
    return { data: null, error }
  }
}

// Get user progress with fallback
export const getUserProgress = async (userId: string, days: number = 30) => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true })

    return { data: data || [], error }
  } catch (error) {
    console.error('Error getting user progress:', error)
    return { data: [], error }
  }
}

// Get user stats with better aggregation
export const getUserStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('time_spent, date, modules')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(365)

    return { data: data || [], error }
  } catch (error) {
    console.error('Error getting user stats:', error)
    return { data: [], error }
  }
}

// Batch update for offline sync
export const batchUpdateProgress = async (userId: string, progressData: Array<{date: string, time_spent: number, modules?: string[]}>) => {
  try {
    const updates = progressData.map(item => ({
      user_id: userId,
      date: item.date,
      time_spent: item.time_spent,
      modules: item.modules || [],
      updated_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('user_progress')
      .upsert(updates, { onConflict: 'user_id,date' })
      .select()

    return { data, error }
  } catch (error) {
    console.error('Error batch updating progress:', error)
    return { data: null, error }
  }
}