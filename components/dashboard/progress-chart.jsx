"use client"

import { useEffect, useState } from 'react'
import { getUserStats } from '@/lib/database/progress'
import { getCurrentUser } from '@/lib/firebase/auth'

export function ProgressChart() {
  const [progressData, setProgressData] = useState([]) // REMOVE: <any[]>

  useEffect(() => {
    const fetchProgress = async () => {
      const user = await getCurrentUser()
      if (user && 'uid' in user) {
        const { data } = await getUserStats(user.uid)
        setProgressData(data || [])
      }
    }
    fetchProgress()
  }, [])

  return (
    <div className="progress-card">
      <h3>Your Progress</h3>
      <div className="stats-chart">
        {progressData.slice(0, 7).map((day, index) => (
          <div key={index} className="chart-bar">
            <div 
              className="bar-fill" 
              style={{ height: `${(day.time_spent / 60) * 2}px` }}
            ></div>
            <span className="bar-label">
              {new Date(day.date).getDate()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}