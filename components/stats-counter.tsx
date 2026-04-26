"use client"

import { useEffect, useState } from "react"

interface StatsCounterProps {
  end: number
  duration?: number
  suffix?: string
}

export function StatsCounter({ end, duration = 2000, suffix = "" }: StatsCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration])

  return (
    <span className="font-space-grotesk text-4xl font-bold text-primary">
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}
