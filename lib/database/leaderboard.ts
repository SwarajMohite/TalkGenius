import { supabase } from '@/lib/supabase/config'

export const getLeaderboard = async (period: 'daily' | 'weekly' | 'all-time' = 'all-time') => {
  let query = supabase
    .from('leaderboard')
    .select('*')
    .order('total_time', { ascending: false })
    .limit(50)

  // For real implementation, you'd filter by date based on period
  const { data, error } = await query

  return { data, error }
}

export const getTodayLeaderboard = async () => {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      time_spent,
      users (
        display_name,
        email
      )
    `)
    .eq('date', today)
    .order('time_spent', { ascending: false })
    .limit(20)

  return { data, error }
}