import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { searchGuests, updateRSVPStatus, type Guest } from '../services/sheetsService'

type Stage =
  | 'search'
  | 'searching'
  | 'not-found'
  | 'results'
  | 'submitting'
  | 'success'
  | 'error'

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

function fullName(guest: Guest): string {
  return [guest.nombre, guest.apellidoPaterno, guest.apellidoMaterno].filter(Boolean).join(' ')
}

interface PillButtonProps {
  label: string
  active: boolean
  activeColor: string
  onClick: () => void
}

function PillButton({ label, active, activeColor, onClick }: PillButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-2 font-sans text-[10px] tracking-[0.18em] uppercase transition-all duration-200"
      style={{
        border: `1px solid ${active ? activeColor : 'rgba(44,36,22,0.22)'}`,
        background: active ? activeColor : 'transparent',
        color: active ? '#F5EDE3' : 'rgba(44,36,22,0.55)',
      }}
    >
      {label}
    </button>
  )
}

export default function RSVPForm() {
  const sectionRef = useRef<HTMLElement>(null)
  const [query, setQuery] = useState('')
  const [queryError, setQueryError] = useState(false)
  const [stage, setStage] = useState<Stage>('search')
  const [guests, setGuests] = useState<Guest[]>([])
  const [selections, setSelections] = useState<Record<number, boolean>>({})

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

  const handleSearch = async () => {
    const wordCount = query.trim().split(/\s+/).filter(Boolean).length
    if (wordCount < 2) {
      setQueryError(true)
      return
    }
    setQueryError(false)
    setStage('searching')

    const results = await searchGuests(query)
    if (results.length === 0) {
      setStage('not-found')
      return
    }

    const initialSelections: Record<number, boolean> = {}
    results.forEach(guest => {
      if (guest.asistira === 'Sí') initialSelections[guest.row] = true
      else if (guest.asistira === 'No') initialSelections[guest.row] = false
    })

    setGuests(results)
    setSelections(initialSelections)
    setStage('results')
  }

  const handleReset = () => {
    setQuery('')
    setQueryError(false)
    setGuests([])
    setSelections({})
    setStage('search')
  }

  const setFamilySelection = (familia: string, attending: boolean) => {
    setSelections(prev => {
      const next = { ...prev }
      guests.filter(g => g.familia === familia).forEach(g => (next[g.row] = attending))
      return next
    })
  }

  const handleSave = async () => {
    const updates = Object.entries(selections).map(([row, attending]) => ({
      row: Number(row),
      attending,
    }))
    if (updates.length === 0) return

    setStage('submitting')
    const result = await updateRSVPStatus(updates)
    setStage(result === 'success' ? 'success' : 'error')
  }

  const familias = Array.from(new Set(guests.map(g => g.familia)))
  const hasSelections = Object.keys(selections).length > 0

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-24 px-6 text-center"
      style={{ backgroundColor: 'rgba(242,232,220,0.8)' }}
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
            {stage === 'search' && (
              <motion.div
                key="search"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full space-y-7"
              >
                <div>
                  <input
                    type="text"
                    value={query}
                    onChange={e => {
                      setQuery(e.target.value)
                      setQueryError(false)
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSearch()
                    }}
                    placeholder="Tu nombre completo o el apellido de tu familia"
                    className="w-full bg-transparent py-3 px-0 font-serif text-lg focus:outline-none transition-colors duration-200"
                    style={{
                      borderBottom: queryError
                        ? '1px solid rgba(180,50,50,0.7)'
                        : '1px solid rgba(44,36,22,0.18)',
                      color: '#2C2416',
                    }}
                    onFocus={e => {
                      if (!queryError) e.currentTarget.style.borderBottomColor = '#C4714A'
                    }}
                    onBlur={e => {
                      if (!queryError)
                        e.currentTarget.style.borderBottomColor = 'rgba(44,36,22,0.18)'
                    }}
                  />
                  {queryError && (
                    <p
                      className="text-xs mt-2 text-left font-sans"
                      style={{ color: 'rgba(180,50,50,0.85)' }}
                    >
                      Escribe tu nombre completo (ej. "Martha Rico López") o el
                      apellido completo de tu familia (ej. "Rico López")
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full py-4 font-sans text-xs tracking-[0.25em] uppercase transition-all duration-300"
                  style={{ border: '1px solid #C4714A', color: '#C4714A', background: 'transparent' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#C4714A'
                    e.currentTarget.style.color = '#F5EDE3'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#C4714A'
                  }}
                >
                  Buscar mi nombre
                </button>
              </motion.div>
            )}

            {stage === 'searching' && (
              <motion.div
                key="searching"
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
                  Buscando...
                </p>
              </motion.div>
            )}

            {stage === 'not-found' && (
              <motion.div
                key="not-found"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-5"
              >
                <p className="font-serif" style={{ color: '#2C2416', fontSize: '1.5rem' }}>
                  No te encontramos
                </p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(44,36,22,0.6)' }}>
                  Verifica que tu nombre completo o el apellido de tu familia estén bien escritos.
                  <br />
                  Si el problema sigue, contáctanos directamente.
                </p>
                <button
                  onClick={handleReset}
                  className="font-sans text-xs tracking-[0.22em] uppercase underline underline-offset-4"
                  style={{ color: '#C4714A' }}
                >
                  Buscar de nuevo
                </button>
              </motion.div>
            )}

            {stage === 'results' && (
              <motion.div
                key="results"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full space-y-8 text-left"
              >
                {familias.length > 1 && (
                  <p
                    className="font-sans text-xs leading-relaxed"
                    style={{ color: 'rgba(44,36,22,0.5)' }}
                  >
                    Encontramos {familias.length} familias con ese apellido. Si no reconoces la
                    tuya, prueba escribiendo el apellido completo (ej. "Rico López").
                  </p>
                )}

                {familias.map(familia => (
                  <div key={familia} className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <p
                        className="font-sans text-xs tracking-[0.2em] uppercase"
                        style={{ color: 'rgba(44,36,22,0.45)' }}
                      >
                        Familia {familia}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setFamilySelection(familia, true)}
                          className="font-sans text-[10px] tracking-wider uppercase underline underline-offset-2"
                          style={{ color: '#C4714A' }}
                        >
                          Todos asisten
                        </button>
                        <button
                          onClick={() => setFamilySelection(familia, false)}
                          className="font-sans text-[10px] tracking-wider uppercase underline underline-offset-2"
                          style={{ color: 'rgba(44,36,22,0.45)' }}
                        >
                          Ninguno asiste
                        </button>
                      </div>
                    </div>

                    {guests
                      .filter(g => g.familia === familia)
                      .map(guest => (
                        <div
                          key={guest.row}
                          className="pb-4"
                          style={{ borderBottom: '1px solid rgba(44,36,22,0.12)' }}
                        >
                          <div className="flex items-baseline justify-between gap-2 mb-2">
                            <p className="font-serif" style={{ color: '#2C2416', fontSize: '1.05rem' }}>
                              {fullName(guest)}
                            </p>
                            {(guest.ninos > 0 || guest.acompanante > 0) && (
                              <span
                                className="font-sans text-[10px] tracking-wider uppercase whitespace-nowrap"
                                style={{ color: 'rgba(44,36,22,0.4)' }}
                              >
                                {guest.acompanante > 0 &&
                                  `+${guest.acompanante} acompañante${guest.acompanante > 1 ? 's' : ''}`}
                                {guest.acompanante > 0 && guest.ninos > 0 && ' · '}
                                {guest.ninos > 0 &&
                                  `${guest.ninos} niño${guest.ninos > 1 ? 's' : ''}`}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <PillButton
                              label="Asistirá"
                              active={selections[guest.row] === true}
                              activeColor="#C4714A"
                              onClick={() =>
                                setSelections(prev => ({ ...prev, [guest.row]: true }))
                              }
                            />
                            <PillButton
                              label="No asistirá"
                              active={selections[guest.row] === false}
                              activeColor="#6B7645"
                              onClick={() =>
                                setSelections(prev => ({ ...prev, [guest.row]: false }))
                              }
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                ))}

                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={!hasSelections}
                    className="w-full py-4 font-sans text-xs tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-40"
                    style={{ border: '1px solid #C4714A', color: '#C4714A', background: 'transparent' }}
                    onMouseEnter={e => {
                      if (hasSelections) {
                        e.currentTarget.style.background = '#C4714A'
                        e.currentTarget.style.color = '#F5EDE3'
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#C4714A'
                    }}
                  >
                    Guardar confirmación
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full font-sans text-xs tracking-[0.22em] uppercase underline underline-offset-4"
                    style={{ color: 'rgba(44,36,22,0.45)' }}
                  >
                    Buscar otro nombre
                  </button>
                </div>
              </motion.div>
            )}

            {stage === 'submitting' && (
              <motion.div
                key="submitting"
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
                  Guardando...
                </p>
              </motion.div>
            )}

            {stage === 'success' && (
              <motion.div
                key="success"
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
                  ¡Gracias por confirmar!
                </h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(44,36,22,0.65)' }}>
                  Tu respuesta ha sido guardada.
                  <br />
                  Te esperamos con todo el amor ese día.
                </p>
                <button
                  onClick={handleReset}
                  className="font-sans text-xs tracking-[0.22em] uppercase underline underline-offset-4"
                  style={{ color: '#C4714A' }}
                >
                  Confirmar otra familia
                </button>
              </motion.div>
            )}

            {stage === 'error' && (
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
                  onClick={handleSave}
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
