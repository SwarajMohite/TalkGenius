import { useEffect, useRef, useState } from 'react'
import { getCurrentUser } from '@/lib/firebase/auth'
import { updateUserTime } from '@/lib/database/progress'
import { updateUserProfile } from '@/lib/database/leaderboard'

export const useProgressSync = () => {
  const [isTracking, setIsTracking] = useState(false)
  const [todayMinutes, setTodayMinutes] = useState(0)
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    const initializeSync = async () => {
      try {
        const user = await getCurrentUser()
        if (!user || !('uid' in user)) {
          console.log('No user found for progress tracking')
          return
        }

        console.log('Initializing progress tracking for user:', user.uid)
        setIsTracking(true)
        
        // Update user profile in database
        await updateUserProfile(user.uid, user.displayName || 'Anonymous', user.email || '')

        // Load today's progress from localStorage
        const today = new Date().toISOString().split('T')[0]
        const storedMinutes = parseInt(localStorage.getItem(`progress_${today}`) || '0')
        setTodayMinutes(storedMinutes)

        // Reset if it's a new day
        const lastDate = localStorage.getItem('last_tracking_date')
        if (lastDate !== today) {
          localStorage.setItem(`progress_${today}`, '0')
          localStorage.setItem('last_tracking_date', today)
          setTodayMinutes(0)
        }

        // Start tracking immediately
        startTimeRef.current = Date.now()

        // Update every 10 seconds for demo purposes
        syncIntervalRef.current = setInterval(async () => {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / (1000 * 60)) // minutes
          if (elapsed >= 1) {
            const newTotal = storedMinutes + elapsed
            setTodayMinutes(newTotal)
            localStorage.setItem(`progress_${today}`, newTotal.toString())
            
            try {
              await updateUserTime(user.uid, elapsed)
              console.log(`Synced ${elapsed} minutes to database. Total today: ${newTotal}`)
            } catch (error) {
              console.error('Database sync failed:', error)
            }
            
            startTimeRef.current = Date.now()
          }
        }, 10000) // Check every 10 seconds

        // Sync on page visibility change
        const handleVisibilityChange = () => {
          if (!document.hidden && user) {
            console.log('Page visible - syncing progress')
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / (1000 * 60))
            if (elapsed >= 1) {
              updateUserTime(user.uid, elapsed)
              startTimeRef.current = Date.now()
            }
          }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
      } catch (error) {
        console.error('Error initializing progress sync:', error)
        setIsTracking(false)
      }
    }

    initializeSync()

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
      setIsTracking(false)
    }
  }, [])

  return { isTracking, todayMinutes }
}