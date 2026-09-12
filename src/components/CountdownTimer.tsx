import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCountdown } from '../hooks/useCountdown'

interface UnitProps {
  value: number
  label: string
}

function CountUnit({ value, label }: UnitProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 'clamp(72px, 14vw, 108px)',
          height: 'clamp(72px, 14vw, 108px)',
          border: '1px solid rgba(196,113,74,0.28)',
        }}
      >
        {/* Corner marks */}
        <span
          className="absolute top-1.5 left-1.5 w-2.5 h-2.5"
          style={{ borderTop: '1px solid rgba(196,113,74,0.5)', borderLeft: '1px solid rgba(196,113,74,0.5)' }}
        />
        <span
          className="absolute top-1.5 right-1.5 w-2.5 h-2.5"
          style={{ borderTop: '1px solid rgba(196,113,74,0.5)', borderRight: '1px solid rgba(196,113,74,0.5)' }}
        />
        <span
          className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5"
          style={{ borderBottom: '1px solid rgba(196,113,74,0.5)', borderLeft: '1px solid rgba(196,113,74,0.5)' }}
        />
        <span
          className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5"
          style={{ borderBottom: '1px solid rgba(196,113,74,0.5)', borderRight: '1px solid rgba(196,113,74,0.5)' }}
        />
        <span
          className="font-serif font-light tabular-nums"
          style={{
            color: '#2C2416',
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            lineHeight: 1,
          }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span
        className="font-sans text-xs tracking-[0.28em] uppercase"
        style={{ color: '#6B7645' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function CountdownTimer() {
  const sectionRef = useRef<HTMLElement>(null)
  const { days, hours, minutes, seconds } = useCountdown('2026-11-14T17:00:00')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          once: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Refresh ScrollTrigger after mount
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-24 px-6 text-center"
      style={{ backgroundColor: 'rgba(237,224,208,0.8)' }}
    >
      <p
        className="font-sans text-xs tracking-[0.42em] uppercase mb-4"
        style={{ color: '#C4714A' }}
      >
        La cuenta regresiva
      </p>
      <h2
        className="font-serif font-light mb-16"
        style={{ color: '#2C2416', fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
      >
        Faltan...
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-5 md:gap-10">
        <CountUnit value={days} label="Días" />
        <span className="font-serif text-3xl pb-8" style={{ color: 'rgba(196,113,74,0.5)' }}>
          ·
        </span>
        <CountUnit value={hours} label="Horas" />
        <span className="font-serif text-3xl pb-8" style={{ color: 'rgba(196,113,74,0.5)' }}>
          ·
        </span>
        <CountUnit value={minutes} label="Minutos" />
        <span className="font-serif text-3xl pb-8" style={{ color: 'rgba(196,113,74,0.5)' }}>
          ·
        </span>
        <CountUnit value={seconds} label="Segundos" />
      </div>
    </section>
  )
}
