import { useState, useEffect } from 'react'

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
}

export function useCountdown(targetDate: string): TimeLeft {
  const calculate = (): TimeLeft => {
    const diff = new Date(targetDate).getTime() - Date.now()
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isPast: false,
    }
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculate)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calculate()), 1000)
    return () => clearInterval(id)
  }, [targetDate]) // eslint-disable-line react-hooks/exhaustive-deps

  return timeLeft
}
