"use client"

import { useEffect, useState } from 'react'
import { updateUserTime, getUserStats } from '@/lib/database/progress'
import { getCurrentUser } from '@/lib/firebase/auth'
import { Play, Pause, Square, Clock, Target, Trophy, Zap, RotateCcw } from 'lucide-react'

const STORAGE_KEYS = {
  SESSION_DATA: 'speech_timer_session_data',
  TODAY_MINUTES: 'speech_timer_today_minutes',
  TOTAL_MINUTES: 'speech_timer_total_minutes',
  LAST_SAVED_DATE: 'speech_timer_last_saved_date',
  SESSION_START_TIME: 'speech_timer_session_start'
}

export function TimeTracker() {
  const [isTracking, setIsTracking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [todayMinutes, setTodayMinutes] = useState(0)
  const [sessionSeconds, setSessionSeconds] = useState(0)

  // Load all data on component mount
  useEffect(() => {
    const initializeTracker = async () => {
      try {
        const user = await getCurrentUser()
        const today = new Date().toISOString().split('T')[0]
        
        // Check if it's a new day
        const lastSavedDate = localStorage.getItem(STORAGE_KEYS.LAST_SAVED_DATE)
        const isNewDay = lastSavedDate !== today

        if (user && 'uid' in user) {
          // Get data from database
          const { data } = await getUserStats(user.uid)
          const todayData = data?.find((day: any) => day.date === today)
          const dbTodayMinutes = todayData?.time_spent || 0
          
          let finalTodayMinutes = dbTodayMinutes
          let finalTotalMinutes = data?.reduce((sum: number, day: any) => sum + (day.time_spent || 0), 0) || dbTodayMinutes

          if (!isNewDay) {
            // Load from localStorage for same day
            const savedTodayMinutes = parseInt(localStorage.getItem(STORAGE_KEYS.TODAY_MINUTES) || '0')
            const savedTotalMinutes = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_MINUTES) || '0')
            
            // Use the larger value between DB and localStorage
            finalTodayMinutes = Math.max(dbTodayMinutes, savedTodayMinutes)
            finalTotalMinutes = Math.max(finalTotalMinutes, savedTotalMinutes)
            
            // Restore session if it was active
            const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION_DATA)
            if (savedSession) {
              const session = JSON.parse(savedSession)
              const sessionStart = localStorage.getItem(STORAGE_KEYS.SESSION_START_TIME)
              
              if (session.isTracking && !session.isPaused && sessionStart) {
                // Calculate elapsed time since session start
                const elapsedSeconds = Math.floor((Date.now() - parseInt(sessionStart)) / 1000)
                setSessionSeconds(elapsedSeconds)
                setIsTracking(true)
                setIsPaused(false)
              } else {
                setSessionSeconds(session.seconds || 0)
                setIsTracking(session.isTracking || false)
                setIsPaused(session.isPaused || false)
              }
            }
          } else {
            // New day - reset today's counter but keep total
            resetLocalStorageForNewDay()
          }

          setTodayMinutes(finalTodayMinutes)
          setTotalMinutes(finalTotalMinutes)
          updateLocalStorage(finalTodayMinutes, finalTotalMinutes, today)
        }
      } catch (error) {
        console.error('Error initializing tracker:', error)
        // Fallback to localStorage only
        const savedToday = parseInt(localStorage.getItem(STORAGE_KEYS.TODAY_MINUTES) || '0')
        const savedTotal = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_MINUTES) || '0')
        setTodayMinutes(savedToday)
        setTotalMinutes(savedTotal)
      }
    }

    initializeTracker()
  }, [])

  // Save session state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionData = {
        seconds: sessionSeconds,
        isTracking,
        isPaused,
        lastUpdated: Date.now()
      }
      localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(sessionData))
      
      if (isTracking && !isPaused) {
        localStorage.setItem(STORAGE_KEYS.SESSION_START_TIME, Date.now().toString())
      } else {
        localStorage.removeItem(STORAGE_KEYS.SESSION_START_TIME)
      }
    }
  }, [sessionSeconds, isTracking, isPaused])

  // Save minutes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TODAY_MINUTES, todayMinutes.toString())
      localStorage.setItem(STORAGE_KEYS.TOTAL_MINUTES, totalMinutes.toString())
      localStorage.setItem(STORAGE_KEYS.LAST_SAVED_DATE, new Date().toISOString().split('T')[0])
    }
  }, [todayMinutes, totalMinutes])

  // Main timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        setSessionSeconds(prev => {
          const newSeconds = prev + 1
          
          if (newSeconds >= 60) {
            // One minute completed
            const minutesToAdd = 1
            const newToday = todayMinutes + minutesToAdd
            const newTotal = totalMinutes + minutesToAdd
            
            setTodayMinutes(newToday)
            setTotalMinutes(newTotal)
            saveTimeToDB(minutesToAdd)
            return 0 // Reset seconds
          }
          
          return newSeconds
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isTracking, isPaused, todayMinutes, totalMinutes])

  const saveTimeToDB = async (minutes: number) => {
    try {
      const user = await getCurrentUser()
      if (user && 'uid' in user) {
        await updateUserTime(user.uid, minutes)
        console.log('Saved to DB:', minutes, 'minutes')
      }
    } catch (error) {
      console.error('Failed to save to DB:', error)
    }
  }

  const updateLocalStorage = (today: number, total: number, date: string) => {
    localStorage.setItem(STORAGE_KEYS.TODAY_MINUTES, today.toString())
    localStorage.setItem(STORAGE_KEYS.TOTAL_MINUTES, total.toString())
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED_DATE, date)
  }

  const resetLocalStorageForNewDay = () => {
    localStorage.setItem(STORAGE_KEYS.TODAY_MINUTES, '0')
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED_DATE, new Date().toISOString().split('T')[0])
    localStorage.removeItem(STORAGE_KEYS.SESSION_DATA)
    localStorage.removeItem(STORAGE_KEYS.SESSION_START_TIME)
  }

  const startTracking = () => {
    setIsTracking(true)
    setIsPaused(false)
    localStorage.setItem(STORAGE_KEYS.SESSION_START_TIME, Date.now().toString())
  }

  const pauseTracking = () => {
    setIsPaused(true)
    localStorage.removeItem(STORAGE_KEYS.SESSION_START_TIME)
  }

  const resumeTracking = () => {
    setIsPaused(false)
    localStorage.setItem(STORAGE_KEYS.SESSION_START_TIME, Date.now().toString())
  }

  const stopTracking = async () => {
    // Save partial minute if >= 30 seconds
    if (sessionSeconds >= 30) {
      const minutesToAdd = 1
      const newToday = todayMinutes + minutesToAdd
      const newTotal = totalMinutes + minutesToAdd
      
      setTodayMinutes(newToday)
      setTotalMinutes(newTotal)
      await saveTimeToDB(minutesToAdd)
    }
    
    setIsTracking(false)
    setIsPaused(false)
    setSessionSeconds(0)
    
    localStorage.removeItem(STORAGE_KEYS.SESSION_DATA)
    localStorage.removeItem(STORAGE_KEYS.SESSION_START_TIME)
  }

  const resetSession = () => {
    setSessionSeconds(0)
    localStorage.removeItem(STORAGE_KEYS.SESSION_DATA)
    localStorage.removeItem(STORAGE_KEYS.SESSION_START_TIME)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSessionProgress = () => Math.min(todayMinutes + Math.floor(sessionSeconds / 60), 60)

  const getMotivationalMessage = () => {
    const totalToday = todayMinutes + Math.floor(sessionSeconds / 60)
    if (totalToday >= 60) return "Amazing! You've mastered today! 🎯"
    if (totalToday >= 45) return "Almost there! Keep pushing! 💪"
    if (totalToday >= 30) return "Great progress! Halfway to mastery! ✨"
    if (totalToday >= 15) return "Good start! Consistency is key! 🌟"
    return "Every minute counts! Start your journey! 🚀"
  }

  const hasLocalData = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEYS.SESSION_DATA)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Practice Timer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track your learning journey</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isTracking 
              ? isPaused 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {isTracking ? (isPaused ? 'PAUSED' : 'LIVE') : 'READY'}
          </div>
          {hasLocalData && (
            <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Auto-saved
            </div>
          )}
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className="w-48 h-48 mx-auto mb-4 relative">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200 dark:text-gray-700" />
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" className="text-blue-500 transition-all duration-1000 ease-out" strokeDasharray={`${(sessionSeconds % 60) * 4.71} 282.74`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formatTime(sessionSeconds)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Session Time</div>
          </div>
        </div>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {getMotivationalMessage()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4 text-center border border-blue-200 dark:border-blue-700">
          <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{todayMinutes}m</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Today</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-4 text-center border border-purple-200 dark:border-purple-700">
          <Trophy className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalMinutes}m</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Daily Goal Progress</span>
          <span>{getSessionProgress()}/60 min</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min((getSessionProgress() / 60) * 100, 100)}%` }}></div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          {60 - getSessionProgress()} minutes to daily goal
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3">
        {!isTracking ? (
          <button onClick={startTracking} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            <Play className="w-5 h-5" /> Start Practice
          </button>
        ) : (
          <>
            {isPaused ? (
              <button onClick={resumeTracking} className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 px-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Resume
              </button>
            ) : (
              <button onClick={pauseTracking} className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white py-3 px-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <Pause className="w-5 h-5" /> Pause
              </button>
            )}
            <button onClick={stopTracking} className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 px-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <Square className="w-5 h-5" /> Stop
            </button>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>Auto-saves locally</span>
        </div>
        <button onClick={resetSession} className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>
    </div>
  )
}