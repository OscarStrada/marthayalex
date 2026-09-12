import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DetailCardProps {
  symbol: string;
  title: string;
  lines: string[];
}

function DetailCard({ symbol, title, lines }: DetailCardProps) {
  return (
    <div
      className="detail-card flex flex-col items-center text-center gap-4 p-8"
      style={{ border: "1px solid rgba(232,213,192,0.7)" }}
    >
      <span className="font-serif text-2xl" style={{ color: "#C4714A" }}>
        {symbol}
      </span>
      <h3
        className="font-serif font-light tracking-wide"
        style={{ color: "#2C2416", fontSize: "1.2rem" }}
      >
        {title}
      </h3>
      <div
        className="h-px w-10"
        style={{ backgroundColor: "rgba(196,113,74,0.4)" }}
      />
      {lines.map((line, i) => (
        <p
          key={i}
          className="font-sans text-sm leading-relaxed"
          style={{ color: "rgba(44,36,22,0.65)" }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}

export default function EventDetails() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 82%",
          once: true,
        },
      });

      const cards = cardsRef.current?.querySelectorAll(".detail-card");
      if (cards) {
        gsap.from(cards, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 78%",
            once: true,
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6"
    >
      <div className="absolute inset-0" style={{ backgroundColor: "#F5EDE3" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <p
            className="font-sans text-xs tracking-[0.42em] uppercase mb-3"
            style={{ color: "#C4714A" }}
          >
            El gran día
          </p>
          <h2
            className="font-serif font-light"
            style={{ color: "#2C2416", fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
          >
            Detalles del Evento
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <DetailCard
            symbol="◈"
            title="Fecha"
            lines={["Sábado", "14 de Noviembre", "2026"]}
          />
          <DetailCard
            symbol="◈"
            title="Hora"
            lines={[
              "Boda Religiosa: 4:00 pm",
              "Recepción: 6:00 pm",
              "Boda Civil: 7:00 pm",
            ]}
          />
          <DetailCard
            symbol="◈"
            title="Lugar"
            lines={[
              "Parroquia de Santiago Apóstol",
              "Campery Club",
              "Ometepec, Guerrero",
            ]}
          />
          <DetailCard
            symbol="◈"
            title="Vestimenta"
            lines={["Formal", "Sin blanco"]}
          />
        </div>

        {/* Decorative quote */}
        <div className="text-center mt-20">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div
              className="h-px flex-1 max-w-20"
              style={{ backgroundColor: "rgba(196,113,74,0.3)" }}
            />
            <p
              className="font-serif italic font-light"
              style={{
                color: "rgba(44,36,22,0.55)",
                fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
              }}
            >
              "Dos almas que se encuentran, un amor que trasciende"
            </p>
            <div
              className="h-px flex-1 max-w-20"
              style={{ backgroundColor: "rgba(196,113,74,0.3)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
