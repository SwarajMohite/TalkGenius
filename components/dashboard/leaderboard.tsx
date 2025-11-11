"use client"

import { useEffect, useState } from 'react'
import { getLeaderboard } from '@/lib/database/leaderboard'
import { Crown, Trophy, Star, Clock, Sparkles } from 'lucide-react'

interface LeaderboardUser {
  id: string
  display_name: string
  total_time: number
  active_days: number
}

// Temporary data for demonstration
const tempUsers: LeaderboardUser[] = [
  {
    id: '1',
    display_name: 'Swaraj',
    total_time: 125, // 209 minutes
    active_days: 14,
  },
  {
    id: '2',
    display_name: 'Sarthak',
    total_time: 112, // 188 minutes
    active_days: 12,
  },
  {
    id: '3',
    display_name: 'Temp',
    total_time: 90, // 164 minutes
    active_days: 10,
  },
  {
    id: '?',
    display_name: 'You?',
    total_time: 0, // 0 minutes - motivational slot
    active_days: 0,
  }
]

export function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await getLeaderboard()
        // Use temporary data if no real data exists
        setUsers(data && data.length > 0 ? data.slice(0, 5) : tempUsers)
      } catch (error) {
        // Fallback to temporary data
        setUsers(tempUsers)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-4 h-4" />
      case 1:
        return <Trophy className="w-4 h-4" />
      case 2:
        return <Star className="w-4 h-4" />
      default:
        return null
    }
  }

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-500/25'
      case 1:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-500/25'
      case 2:
        return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/25'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    }
  }

  if (loading) return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-40 animate-pulse"></div>
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl animate-pulse">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Performers</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Your spot is waiting!</p>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {users.map((user, index) => (
          <div 
            key={user.id} 
            className={`
              leaderboard-item flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group
              ${index < 4 ? 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-dashed border-blue-200 dark:border-blue-700'}
              ${index === 4 ? 'hover:scale-[1.02] hover:shadow-lg cursor-pointer' : ''}
            `}
          >
            {/* Rank Badge */}
            <div className={`rank w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${getRankStyle(index)}`}>
              {index < 3 ? getRankIcon(index) : `#${index + 1}`}
            </div>

            {/* User Info */}
            <div className="user-info flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className={`name font-semibold truncate ${
                  index === 4 
                    ? 'text-blue-600 dark:text-blue-400 text-lg' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {user.display_name}
                </div>
                {index < 3 && (
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200' :
                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  }`}>
                    Top {index + 1}
                  </div>
                )}
                {index === 4 && (
                  <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                )}
              </div>
              {index < 4 && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {user.active_days} active days
                </div>
              )}
            </div>

            {/* Time Stats */}
            <div className="stats text-right">
              <div className="flex items-center gap-1 justify-end text-sm font-semibold text-gray-900 dark:text-white">
                <Clock className="w-3 h-3 text-blue-500" />
                {user.total_time > 0 ? `${Math.round(user.total_time / 60)}h` : '0h'}
              </div>
              {index === 4 && (
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1 animate-pulse">
                  Start practicing!
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Motivational Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-blue-600 dark:text-blue-400">Next could be you!</span>{' '}
            Practice daily to climb the ranks 🚀
          </p>
        </div>
      </div>
    </div>
  )
}