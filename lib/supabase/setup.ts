import { supabase } from './config'

export const setupDatabase = async () => {
  try {
    console.log('Setting up database...')

    // Create users table
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          display_name TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (usersError) console.warn('Users table setup warning:', usersError)

    // Create user_progress table
    const { error: progressError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          date DATE NOT NULL,
          time_spent INTEGER DEFAULT 0,
          modules TEXT[] DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, date)
        );
      `
    })

    if (progressError) console.warn('Progress table setup warning:', progressError)

    // Create leaderboard view
    const { error: leaderboardError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE VIEW leaderboard AS
        SELECT 
          u.id,
          u.display_name,
          u.email,
          COALESCE(SUM(up.time_spent), 0) as total_time,
          COUNT(CASE WHEN up.time_spent > 0 THEN 1 END) as active_days,
          MAX(up.date) as last_active
        FROM users u
        LEFT JOIN user_progress up ON u.id = up.user_id
        GROUP BY u.id, u.display_name, u.email
        ORDER BY total_time DESC;
      `
    })

    if (leaderboardError) console.warn('Leaderboard view setup warning:', leaderboardError)

    console.log('Database setup completed!')
    return { success: true }
  } catch (error) {
    console.error('Database setup failed:', error)
    return { success: false, error }
  }
}

// Initialize sample data for testing
export const initializeSampleData = async () => {
  try {
    const sampleUsers = [
      { id: '550e8400-e29b-41d4-a716-446655440001', email: 'sarthak@talkgenius.com', display_name: 'Sarthak Nalawade' },
      { id: '550e8400-e29b-41d4-a716-446655440002', email: 'omkar@talkgenius.com', display_name: 'Omkar Jagtap' },
      { id: '550e8400-e29b-41d4-a716-446655440003', email: 'siddhi@talkgenius.com', display_name: 'Siddhi More' },
      { id: '550e8400-e29b-41d4-a716-446655440004', email: 'nikita@talkgenius.com', display_name: 'Nikita Nale' },
      { id: '550e8400-e29b-41d4-a716-446655440005', email: 'alex@example.com', display_name: 'Alex Chen' },
      { id: '550e8400-e29b-41d4-a716-446655440006', email: 'sarah@example.com', display_name: 'Sarah Johnson' },
      { id: '550e8400-e29b-41d4-a716-446655440007', email: 'mike@example.com', display_name: 'Mike Rodriguez' },
      { id: '550e8400-e29b-41d4-a716-446655440008', email: 'emma@example.com', display_name: 'Emma Wilson' },
      { id: '550e8400-e29b-41d4-a716-446655440009', email: 'david@example.com', display_name: 'David Kumar' },
      { id: '550e8400-e29b-41d4-a716-446655440010', email: 'lisa@example.com', display_name: 'Lisa Thompson' }
    ]

    // Insert sample users
    const { error: usersError } = await supabase
      .from('users')
      .upsert(sampleUsers, { onConflict: 'id' })

    if (usersError) console.warn('Sample users warning:', usersError)

    // Insert sample progress data
    const today = new Date()
    const sampleProgress = []
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      sampleUsers.forEach((user, userIndex) => {
        const baseTime = [180, 165, 150, 140, 135, 120, 110, 95, 85, 75][userIndex] || 60
        const timeSpent = Math.floor(Math.random() * 60) + baseTime
        sampleProgress.push({
          user_id: user.id,
          date: dateStr,
          time_spent: timeSpent,
          modules: ['Practice Session', 'AI Roleplay', 'Interview Prep']
        })
      })
    }

    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert(sampleProgress, { onConflict: 'user_id,date' })

    if (progressError) console.warn('Sample progress warning:', progressError)

    console.log('Sample data initialized!')
    return { success: true }
  } catch (error) {
    console.error('Sample data initialization failed:', error)
    return { success: false, error }
  }
}