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
        className="relative flex items-center justify-center w-[128px] h-[128px] sm:w-[clamp(72px,14vw,108px)] sm:h-[clamp(72px,14vw,108px)]"
        style={{ border: '1px solid rgba(196,113,74,0.28)' }}
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
          className="font-serif font-light tabular-nums text-[2.75rem] sm:text-[clamp(2rem,6vw,3.5rem)]"
          style={{
            color: '#2C2416',
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
  const contentRef = useRef<HTMLDivElement>(null)
  const { days, hours, minutes, seconds } = useCountdown('2026-11-14T17:00:00')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
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
    <section ref={sectionRef} className="relative py-24 px-6 text-center">
      <div className="absolute inset-0" style={{ backgroundColor: '#EDE0D0' }} />

      <div ref={contentRef} className="relative z-10">
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

        <div className="grid grid-cols-2 gap-y-8 gap-x-10 justify-items-center sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-10">
          <CountUnit value={days} label="Días" />
          <span
            className="hidden sm:inline-block font-serif text-3xl pb-8"
            style={{ color: 'rgba(196,113,74,0.5)' }}
          >
            ·
          </span>
          <CountUnit value={hours} label="Horas" />
          <span
            className="hidden sm:inline-block font-serif text-3xl pb-8"
            style={{ color: 'rgba(196,113,74,0.5)' }}
          >
            ·
          </span>
          <CountUnit value={minutes} label="Minutos" />
          <span
            className="hidden sm:inline-block font-serif text-3xl pb-8"
            style={{ color: 'rgba(196,113,74,0.5)' }}
          >
            ·
          </span>
          <CountUnit value={seconds} label="Segundos" />
        </div>
      </div>
    </section>
  )
}
