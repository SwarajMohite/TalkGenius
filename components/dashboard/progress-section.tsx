"use client"

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/firebase/auth'
import { getUserStats, updateUserTime } from '@/lib/database/progress'
import { TrendingUp, Clock, Target, Award, Calendar, Activity, Download, Zap, Star, Trophy } from 'lucide-react'

const STORAGE_KEYS = {
  AUTO_TRACKER_START: 'speech_auto_tracker_start',
  TOTAL_TIME: 'speech_total_time',
  TODAY_TIME: 'speech_today_time',
  LAST_ACTIVE: 'speech_last_active',
  PROGRESS_DATA: 'speech_progress_data',
  SESSION_HISTORY: 'speech_session_history'
}

export function ProgressSection() {
  const [progressData, setProgressData] = useState<any[]>([])
  const [totalTime, setTotalTime] = useState(0)
  const [todayTime, setTodayTime] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [loading, setLoading] = useState(true)

  // Initialize auto-tracking and load data
  useEffect(() => {
    const initializeAutoTracking = async () => {
      try {
        setLoading(true)
        const user = await getCurrentUser()
        const today = new Date().toISOString().split('T')[0]
        
        // Start auto-tracking immediately
        startAutoTracking()

        if (user && 'uid' in user) {
          // Load from database
          const { data: dbData } = await getUserStats(user.uid)
          
          // Load from localStorage
          const storedTotal = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_TIME) || '0')
          const storedToday = parseInt(localStorage.getItem(STORAGE_KEYS.TODAY_TIME) || '0')
          const storedProgress = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS_DATA) || '[]')
          
          // Calculate elapsed time since last active
          const lastActive = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE)
          if (lastActive) {
            const elapsedMinutes = calculateElapsedTime(parseInt(lastActive))
            if (elapsedMinutes > 0) {
              const newToday = storedToday + elapsedMinutes
              const newTotal = storedTotal + elapsedMinutes
              
              setTodayTime(newToday)
              setTotalTime(newTotal)
              
              localStorage.setItem(STORAGE_KEYS.TODAY_TIME, newToday.toString())
              localStorage.setItem(STORAGE_KEYS.TOTAL_TIME, newTotal.toString())
              
              // Update progress data
              updateProgressData(today, elapsedMinutes)
              
              // Sync with database in background
              if (elapsedMinutes >= 1) {
                syncWithDatabase(user.uid, elapsedMinutes)
              }
            } else {
              setTodayTime(storedToday)
              setTotalTime(storedTotal)
            }
          } else {
            setTodayTime(storedToday)
            setTotalTime(storedTotal)
          }

          // Merge progress data
          const mergedProgress = mergeProgressData(dbData || [], storedProgress)
          setProgressData(mergedProgress)
          calculateStreak(mergedProgress)
        }

        // Update last active timestamp
        localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString())
        
      } catch (error) {
        console.error('Error initializing tracker:', error)
        // Fallback to localStorage only
        const storedTotal = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_TIME) || '0')
        const storedToday = parseInt(localStorage.getItem(STORAGE_KEYS.TODAY_TIME) || '0')
        const storedProgress = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS_DATA) || '[]')
        
        setTotalTime(storedTotal)
        setTodayTime(storedToday)
        setProgressData(storedProgress)
        calculateStreak(storedProgress)
      } finally {
        setLoading(false)
      }
    }

    initializeAutoTracking()

    // Set up periodic saving
    const saveInterval = setInterval(() => {
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString())
    }, 30000) // Save every 30 seconds

    // Set up online/offline detection
    const handleOnline = () => {
      setIsOnline(true)
      syncAllData()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Auto-save before page unload
    const handleBeforeUnload = () => {
      const elapsed = calculateElapsedTime(parseInt(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE) || '0'))
      if (elapsed > 0) {
        updateTimeLocally(elapsed)
      }
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString())
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearInterval(saveInterval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      
      // Final save on component unmount
      const elapsed = calculateElapsedTime(parseInt(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE) || '0'))
      if (elapsed > 0) {
        updateTimeLocally(elapsed)
      }
    }
  }, [])

  const startAutoTracking = () => {
    localStorage.setItem(STORAGE_KEYS.AUTO_TRACKER_START, Date.now().toString())
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString())
    
    // Initialize storage if not exists
    if (!localStorage.getItem(STORAGE_KEYS.TOTAL_TIME)) {
      localStorage.setItem(STORAGE_KEYS.TOTAL_TIME, '0')
      localStorage.setItem(STORAGE_KEYS.TODAY_TIME, '0')
      localStorage.setItem(STORAGE_KEYS.PROGRESS_DATA, '[]')
    }
  }

  const calculateElapsedTime = (lastActive: number) => {
    if (!lastActive) return 0
    const elapsedMs = Date.now() - lastActive
    const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60))
    
    // Only count time if user was active in the last 30 minutes
    return elapsedMinutes <= 30 ? elapsedMinutes : 0
  }

  const updateTimeLocally = (minutes: number) => {
    if (minutes <= 0) return

    const today = new Date().toISOString().split('T')[0]
    const newToday = todayTime + minutes
    const newTotal = totalTime + minutes

    setTodayTime(newToday)
    setTotalTime(newTotal)

    localStorage.setItem(STORAGE_KEYS.TODAY_TIME, newToday.toString())
    localStorage.setItem(STORAGE_KEYS.TOTAL_TIME, newTotal.toString())

    updateProgressData(today, minutes)
  }

  const updateProgressData = (date: string, minutes: number) => {
    const currentData = [...progressData]
    const existingDayIndex = currentData.findIndex(day => day.date === date)
    
    if (existingDayIndex >= 0) {
      currentData[existingDayIndex].time_spent += minutes
    } else {
      currentData.push({
        date,
        time_spent: minutes,
        modules: ['Auto-tracked Practice']
      })
    }

    setProgressData(currentData)
    localStorage.setItem(STORAGE_KEYS.PROGRESS_DATA, JSON.stringify(currentData))
    calculateStreak(currentData)
  }

  const mergeProgressData = (dbData: any[], localData: any[]) => {
    const merged = [...dbData]
    
    localData.forEach(localDay => {
      const existingIndex = merged.findIndex(dbDay => dbDay.date === localDay.date)
      if (existingIndex >= 0) {
        // Use the larger value
        merged[existingIndex].time_spent = Math.max(
          merged[existingIndex].time_spent,
          localDay.time_spent
        )
      } else {
        merged.push(localDay)
      }
    })

    return merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const calculateStreak = (data: any[]) => {
    if (!data.length) {
      setStreak(0)
      return
    }

    let currentStreak = 0
    const today = new Date()
    const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    for (let i = 0; i < sortedData.length; i++) {
      const dayDate = new Date(sortedData[i].date)
      const diffTime = today.getTime() - dayDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === i && sortedData[i].time_spent > 0) {
        currentStreak++
      } else {
        break
      }
    }
    
    setStreak(currentStreak)
  }

  const syncWithDatabase = async (userId: string, minutes: number) => {
    if (!isOnline) return
    
    try {
      await updateUserTime(userId, minutes)
      console.log('Synced with database:', minutes, 'minutes')
    } catch (error) {
      console.error('Failed to sync with database:', error)
    }
  }

  const syncAllData = async () => {
    if (!isOnline) return
    
    try {
      const user = await getCurrentUser()
      if (user && 'uid' in user) {
        const localTotal = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_TIME) || '0')
        const { data: dbData } = await getUserStats(user.uid)
        const dbTotal = dbData?.reduce((sum: number, day: any) => sum + (day.time_spent || 0), 0) || 0
        
        if (localTotal > dbTotal) {
          const difference = localTotal - dbTotal
          await updateUserTime(user.uid, difference)
          console.log('Synced all data to database')
        }
      }
    } catch (error) {
      console.error('Error syncing all data:', error)
    }
  }

  const getWeeklyData = () => {
    const last7Days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayData = progressData.find((d: any) => d.date === dateStr)
      last7Days.push({
        date: dateStr,
        time_spent: dayData?.time_spent || 0,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNumber: date.getDate()
      })
    }
    
    return last7Days
  }

  const exportProgressData = () => {
    const exportData = {
      summary: {
        total_time_minutes: totalTime,
        total_time_hours: Math.round(totalTime / 60),
        current_streak: streak,
        tracking_started: localStorage.getItem(STORAGE_KEYS.AUTO_TRACKER_START)
      },
      daily_progress: progressData,
      exported_at: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `speech-progress-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const weeklyData = getWeeklyData()
  const maxTime = Math.max(...weeklyData.map(day => day.time_spent), 1)
  const totalHours = Math.round(totalTime / 60)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 animate-pulse">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Automatic Progress Tracking
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your practice time is automatically tracked in the background. Every minute counts!
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isOnline 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              {isOnline ? 'Online - Auto-saving' : 'Offline - Saving locally'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Main Stats Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Time Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Total Practice</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lifetime achievement</p>
              </div>
            </div>
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{totalHours}</div>
              <div className="text-gray-600 dark:text-gray-400 text-lg">hours mastered</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalTime}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">total minutes</div>
            </div>
          </div>

          {/* Today's Progress Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Today's Progress</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatic tracking active</p>
              </div>
            </div>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{todayTime}</div>
              <div className="text-gray-600 dark:text-gray-400 text-lg">minutes today</div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((todayTime / 60) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {Math.max(60 - todayTime, 0)} minutes to daily goal
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Current Streak</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Keep the momentum!</p>
              </div>
            </div>
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{streak}</div>
              <div className="text-gray-600 dark:text-gray-400 text-lg">consecutive days</div>
            </div>
            <div className={`text-center text-lg font-semibold ${
              streak >= 7 ? 'text-green-600 dark:text-green-400' :
              streak >= 3 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-blue-600 dark:text-blue-400'
            }`}>
              {streak >= 7 ? '🔥 Amazing streak!' :
               streak >= 3 ? '📈 Great consistency!' :
               '🌟 Building momentum!'}
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Activity</h3>
                <p className="text-gray-600 dark:text-gray-400">Your automatic practice tracking</p>
              </div>
            </div>
            <button 
              onClick={exportProgressData}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Export Data
            </button>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-3 px-6">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group">
                <div className="text-center mb-3">
                  <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {day.time_spent}m
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {day.dayName}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {day.dateNumber}
                  </div>
                </div>
                <div 
                  className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-2xl transition-all duration-500 group-hover:from-purple-600 group-hover:to-pink-600 cursor-pointer shadow-lg group-hover:shadow-xl"
                  style={{ height: `${(day.time_spent / maxTime) * 200}px` }}
                  title={`${day.time_spent} minutes on ${day.date}`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity & Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {progressData.slice(0, 7).map((day, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-2xl hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {day.modules?.join(', ') || 'Auto-tracked Practice'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {day.time_spent}m
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round(day.time_spent / 60)}h
                    </div>
                  </div>
                </div>
              ))}
              
              {progressData.length === 0 && (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No activity yet</p>
                  <p className="text-gray-500 dark:text-gray-500">
                    Your practice time will appear here automatically!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Milestones</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Practice Days</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total active days</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {progressData.filter(day => day.time_spent > 0).length}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Consistency</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Practice regularity</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {progressData.length > 0 ? Math.min(Math.round((streak / progressData.length) * 100), 100) : 0}%
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Hours Mastered</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total learning time</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {totalHours}
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Next Milestone</div>
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {totalHours >= 50 ? '100 Hours' :
                   totalHours >= 25 ? '50 Hours' :
                   totalHours >= 10 ? '25 Hours' :
                   totalHours >= 5 ? '10 Hours' : '5 Hours'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.max(
                    totalHours >= 50 ? 100 - totalHours :
                    totalHours >= 25 ? 50 - totalHours :
                    totalHours >= 10 ? 25 - totalHours :
                    totalHours >= 5 ? 10 - totalHours : 5 - totalHours, 0
                  )} hours to go
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Zap className="w-6 h-6 text-green-500" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Automatic Tracking Active
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your practice time is automatically tracked in the background. 
            Data is saved locally and synced when online. 
            No need to start/stop timers - just focus on your practice! 🚀
          </p>
        </div>
      </div>
    </div>
  )
}