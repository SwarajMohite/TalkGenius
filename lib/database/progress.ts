import { supabase } from '@/lib/supabase/config'

export const updateUserTime = async (userId: string, additionalMinutes: number) => {
  const today = new Date().toISOString().split('T')[0]
  
  // First get current time for today
  const { data: existing } = await supabase
    .from('user_progress')
    .select('time_spent')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  const newTimeSpent = (existing?.time_spent || 0) + additionalMinutes

  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      date: today,
      time_spent: newTimeSpent,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  return { data, error }
}

export const getUserProgress = async (userId: string, days: number = 30) => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true })

  return { data, error }
}

export const getUserStats = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('time_spent, date')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(365)

  return { data, error }
}