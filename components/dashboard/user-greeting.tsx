"use client"

import { useEffect, useState } from 'react'
import { getUserProfile } from '@/lib/database/users'
import { getCurrentUser } from '@/lib/firebase/auth'
import { User } from 'firebase/auth'

export function UserGreeting() {
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser() as User | null
      if (user && user.uid) {
        const { data } = await getUserProfile(user.uid)
        setUserName(data?.display_name || 'Friend')
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mb-3"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-80"></div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>
      
      <div className="relative">
        {/* Main greeting */}
        <div className="flex flex-col space-y-3">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
            Welcome back,{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {userName}
              </span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-blue-100 dark:bg-blue-900/30 -rotate-1 -z-0 rounded-lg"></span>
            </span>
            !
          </h1>
          
          {/* Subtitle with animated elements */}
          <div className="flex items-center space-x-4">
            <p className="text-xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Ready to master your communication skills today?
            </p>
            
            {/* Animated dots */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>

        {/* Stats row - optional, can be removed if not needed */}
        <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Session ready</span>
          </div>
        </div>
      </div>
    </div>
  )
}