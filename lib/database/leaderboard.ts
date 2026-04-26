import { supabase } from '@/lib/supabase/config'

interface LeaderboardUser {
  id: string
  display_name: string
  email: string
  total_time: number
  active_days: number
  last_active: string
}

// Get main leaderboard with real data
export const getLeaderboard = async (period: 'daily' | 'weekly' | 'all-time' = 'all-time', limit: number = 50) => {
  try {
    let query = supabase
      .from('leaderboard')
      .select('*')
      .order('total_time', { ascending: false })
      .limit(limit)

    // For daily/weekly, we'd need different logic
    if (period === 'daily') {
      const today = new Date().toISOString().split('T')[0]
      query = supabase
        .from('user_progress')
        .select(`
          time_spent,
          user_id,
          users!inner (
            id,
            display_name,
            email
          )
        `)
        .eq('date', today)
        .order('time_spent', { ascending: false })
        .limit(limit)
    }

    const { data, error } = await query
    
    // Transform daily data if needed
    if (period === 'daily' && data) {
      const transformedData = data.map((item: any) => ({
        id: item.users.id,
        display_name: item.users.display_name || 'Anonymous',
        email: item.users.email,
        total_time: item.time_spent,
        active_days: 1,
        last_active: new Date().toISOString().split('T')[0]
      }))
      return { data: transformedData, error }
    }

    return { data: data || [], error }
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return { data: [], error }
  }
}

// Get today's leaderboard
export const getTodayLeaderboard = async () => {
  const today = new Date().toISOString().split('T')[0]
  
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        time_spent,
        user_id,
        users!inner (
          id,
          display_name,
          email
        )
      `)
      .eq('date', today)
      .gt('time_spent', 0)
      .order('time_spent', { ascending: false })
      .limit(20)

    const transformedData = data?.map(item => ({
      id: item.users.id,
      display_name: item.users.display_name || 'Anonymous',
      email: item.users.email,
      total_time: item.time_spent,
      active_days: 1,
      last_active: today
    })) || []

    return { data: transformedData, error }
  } catch (error) {
    console.error('Error getting today leaderboard:', error)
    return { data: [], error }
  }
}

// Get user rank
export const getUserRank = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('id, total_time')
      .order('total_time', { ascending: false })

    if (error || !data) return { rank: null, error }

    const userIndex = data.findIndex(user => user.id === userId)
    return { rank: userIndex >= 0 ? userIndex + 1 : null, error: null }
  } catch (error) {
    console.error('Error getting user rank:', error)
    return { rank: null, error }
  }
}

// Update user profile for leaderboard
export const updateUserProfile = async (userId: string, displayName: string, email: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        display_name: displayName,
        email: email,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { data: null, error }
  }
}