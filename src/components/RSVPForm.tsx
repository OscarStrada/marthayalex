import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { submitRSVP } from '../services/sheetsService'

type FormState = 'idle' | 'loading' | 'success-attending' | 'success-declined' | 'error'

const panelVariants: Variants = {
  initial: { opacity: 0, y: 20, filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55 },
  },
  exit: {
    opacity: 0,
    y: -14,
    filter: 'blur(6px)',
    transition: { duration: 0.28 },
  },
}

export default function RSVPForm() {
  const sectionRef = useRef<HTMLElement>(null)
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState(false)
  const [formState, setFormState] = useState<FormState>('idle')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 55,
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

  const handleSubmit = async (attending: boolean) => {
    if (!name.trim()) {
      setNameError(true)
      return
    }
    setNameError(false)
    setFormState('loading')

    const result = await submitRSVP({
      name: name.trim(),
      attending,
      timestamp: new Date().toISOString(),
    })

    setFormState(result === 'success' ? (attending ? 'success-attending' : 'success-declined') : 'error')
  }

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 text-center"
      style={{ backgroundColor: '#F2E8DC' }}
    >
      <div className="max-w-md mx-auto">
        <p
          className="font-sans text-xs tracking-[0.42em] uppercase mb-3"
          style={{ color: '#C4714A' }}
        >
          Tu presencia
        </p>
        <h2
          className="font-serif font-light mb-4"
          style={{ color: '#2C2416', fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
        >
          Confirma tu Asistencia
        </h2>
        <p
          className="font-sans text-sm leading-relaxed mb-16"
          style={{ color: 'rgba(44,36,22,0.55)' }}
        >
          Por favor confírmanos antes del 1° de octubre de 2026
        </p>

        <div className="min-h-60 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {formState === 'idle' && (
              <motion.div
                key="idle"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full space-y-7"
              >
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={e => {
                      setName(e.target.value)
                      setNameError(false)
                    }}
                    placeholder="Tu nombre completo"
                    className="w-full bg-transparent py-3 px-0 font-serif text-lg focus:outline-none transition-colors duration-200"
                    style={{
                      borderBottom: nameError
                        ? '1px solid rgba(180,50,50,0.7)'
                        : '1px solid rgba(44,36,22,0.18)',
                      color: '#2C2416',
                    }}
                    onFocus={e => {
                      if (!nameError) e.currentTarget.style.borderBottomColor = '#C4714A'
                    }}
                    onBlur={e => {
                      if (!nameError)
                        e.currentTarget.style.borderBottomColor = 'rgba(44,36,22,0.18)'
                    }}
                  />
                  {nameError && (
                    <p
                      className="text-xs mt-2 text-left font-sans"
                      style={{ color: 'rgba(180,50,50,0.85)' }}
                    >
                      Por favor ingresa tu nombre
                    </p>
                  )}
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => handleSubmit(true)}
                    className="flex-1 py-4 font-sans text-xs tracking-[0.25em] uppercase transition-all duration-300"
                    style={{
                      border: '1px solid #C4714A',
                      color: '#C4714A',
                      background: 'transparent',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#C4714A'
                      e.currentTarget.style.color = '#F5EDE3'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#C4714A'
                    }}
                  >
                    Asistiré con gusto
                  </button>
                  <button
                    onClick={() => handleSubmit(false)}
                    className="flex-1 py-4 font-sans text-xs tracking-[0.25em] uppercase transition-all duration-300"
                    style={{
                      border: '1px solid rgba(44,36,22,0.22)',
                      color: 'rgba(44,36,22,0.5)',
                      background: 'transparent',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(44,36,22,0.55)'
                      e.currentTarget.style.color = 'rgba(44,36,22,0.8)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(44,36,22,0.22)'
                      e.currentTarget.style.color = 'rgba(44,36,22,0.5)'
                    }}
                  >
                    No podré ir
                  </button>
                </div>
              </motion.div>
            )}

            {formState === 'loading' && (
              <motion.div
                key="loading"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center gap-5"
              >
                <div
                  className="w-10 h-10 rounded-full animate-spin"
                  style={{ border: '2px solid #E8D5C0', borderTopColor: '#C4714A' }}
                />
                <p className="font-serif italic" style={{ color: 'rgba(44,36,22,0.55)' }}>
                  Enviando...
                </p>
              </motion.div>
            )}

            {formState === 'success-attending' && (
              <motion.div
                key="success-yes"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-5"
              >
                <div className="font-serif text-5xl" style={{ color: '#C4714A' }}>
                  ✦
                </div>
                <h3
                  className="font-serif font-light"
                  style={{ color: '#2C2416', fontSize: '1.8rem' }}
                >
                  ¡Nos alegra mucho!
                </h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(44,36,22,0.65)' }}>
                  Tu confirmación ha sido recibida.
                  <br />
                  Te esperamos con todo el amor ese día.
                </p>
              </motion.div>
            )}

            {formState === 'success-declined' && (
              <motion.div
                key="success-no"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-5"
              >
                <div className="font-serif text-5xl" style={{ color: '#6B7645' }}>
                  ✦
                </div>
                <h3
                  className="font-serif font-light"
                  style={{ color: '#2C2416', fontSize: '1.8rem' }}
                >
                  Lo entendemos
                </h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(44,36,22,0.65)' }}>
                  Gracias por avisarnos.
                  <br />
                  Te llevaremos en el corazón ese día.
                </p>
              </motion.div>
            )}

            {formState === 'error' && (
              <motion.div
                key="error"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-5"
              >
                <p className="font-serif" style={{ color: '#2C2416', fontSize: '1.5rem' }}>
                  Algo salió mal
                </p>
                <p className="font-sans text-sm" style={{ color: 'rgba(44,36,22,0.6)' }}>
                  Por favor intenta de nuevo
                </p>
                <button
                  onClick={() => setFormState('idle')}
                  className="font-sans text-xs tracking-[0.22em] uppercase underline underline-offset-4"
                  style={{ color: '#C4714A' }}
                >
                  Intentar de nuevo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
