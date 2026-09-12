import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface StoryMoment {
  year: string
  title: string
  description: string
}

const storyData: StoryMoment[] = [
  {
    year: 'Febrero 2022',
    title: 'El comienzo',
    description:
      'Nuestros caminos se cruzaron y, sin imaginar todo lo que vendría después, comenzó nuestra historia.',
  },
  {
    year: 'Abril 2022',
    title: 'Un “sí” a nosotros',
    description:
      'Dos meses después decidimos caminar juntos. Entre risas, planes y muchas primeras veces, comenzó nuestra aventura como novios.',
  },
  {
    year: '2022 - 2025',
    title: 'Juntos en cada aventura',
    description:
      'Viajes, risas, aprendizajes y recuerdos que hoy atesoramos. Con cada momento compartido fuimos construyendo la vida que soñábamos juntos.',
  },
  {
    year: 'Febrero 2026',
    title: 'La gran pregunta',
    description:
      'Cuatro años después de aquel primer encuentro, febrero volvió a regalarnos un momento inolvidable. Esta vez hubo una pregunta, un anillo y un sí para toda la vida.',
  },
  {
    year: 'Noviembre 2026',
    title: 'El día más esperado',
    description:
      'Y ahora estamos a punto de comenzar nuestro capítulo favorito. Rodeados de las personas que amamos, celebraremos el inicio de nuestro para siempre. Gracias por ser parte de nuestra historia.',
  },
]

export default function OurStory() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heading = sectionRef.current?.querySelector('.story-heading')
      if (heading) gsap.from(heading, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: heading, start: 'top 82%', once: true },
      })

      const items = sectionRef.current?.querySelectorAll('.story-item')
      items?.forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          x: i % 2 === 0 ? -50 : 50,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 82%', once: true },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 px-6" style={{ backgroundColor: '#EDE0D0' }}>
      <div className="max-w-3xl mx-auto">
        <div className="story-heading text-center mb-20">
          <p
            className="font-sans text-xs tracking-[0.42em] uppercase mb-3"
            style={{ color: '#C4714A' }}
          >
            Dos vidas, una historia
          </p>
          <h2
            className="font-serif font-light"
            style={{ color: '#2C2416', fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
          >
            Nuestra Historia
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{ backgroundColor: 'rgba(196,113,74,0.2)' }}
          />

          <div className="flex flex-col gap-12">
            {storyData.map((moment, i) => (
              <div
                key={i}
                className={`story-item flex flex-col md:flex-row items-center gap-6 md:gap-0 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Text side */}
                <div
                  className={`flex-1 ${
                    i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'
                  }`}
                >
                  <span
                    className="font-sans text-xs tracking-[0.3em] uppercase block mb-2"
                    style={{ color: '#C4714A' }}
                  >
                    {moment.year}
                  </span>
                  <h3
                    className="font-serif font-light mb-3"
                    style={{ color: '#2C2416', fontSize: '1.35rem' }}
                  >
                    {moment.title}
                  </h3>
                  <p
                    className="font-sans text-sm leading-relaxed"
                    style={{ color: 'rgba(44,36,22,0.62)' }}
                  >
                    {moment.description}
                  </p>
                </div>

                {/* Center dot */}
                <div className="relative z-10 shrink-0 hidden md:flex items-center justify-center w-10 h-10">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#C4714A', opacity: 0.7 }}
                  />
                  <div
                    className="absolute w-6 h-6 rounded-full"
                    style={{ border: '1px solid rgba(196,113,74,0.35)' }}
                  />
                </div>

                {/* Empty side */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
