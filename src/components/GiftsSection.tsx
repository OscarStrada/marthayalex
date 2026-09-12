import { useEffect, useRef } from "react";
import gsap from "gsap";

interface GiftOption {
  icon: string;
  title: string;
  description: string;
  detail?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const options: GiftOption[] = [
  {
    icon: "✉",
    title: "Sobres con Dinero",
    description:
      "Si deseas obsequiarnos algo, un sobre es una opción sencilla y práctica. Habrá un buzón especial disponible el día del evento.",
  },
  {
    icon: "🎁",
    title: "Mesa de Regalos",
    description: "También nos puedes encontrar en Liverpool con el número de evento:",
    detail: "51969898",
    ctaLabel: "Ir a Mesa de Regalos",
    ctaHref: "https://mesaderegalos.liverpool.com.mx/milistaderegalos/51969898",
  },
];

export default function GiftsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(".gifts-heading");
      if (heading)
        gsap.from(heading, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: heading, start: "top 82%", once: true },
        });

      const cards = sectionRef.current?.querySelectorAll(".gift-card");
      if (cards) {
        gsap.from(cards, {
          opacity: 0,
          y: 50,
          duration: 0.85,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
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
      className="py-24 px-6"
      style={{ backgroundColor: "#F5EDE3" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="gifts-heading text-center mb-16">
          <p
            className="font-sans text-xs tracking-[0.42em] uppercase mb-3"
            style={{ color: "#C4714A" }}
          >
            Con cariño
          </p>
          <h2
            className="font-serif font-light"
            style={{ color: "#2C2416", fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
          >
            Mesa de Regalos
          </h2>
          <p
            className="font-sans text-sm mt-4 max-w-md mx-auto leading-relaxed"
            style={{ color: "rgba(44,36,22,0.55)" }}
          >
            Tu presencia es el mejor regalo, pero si deseas obsequiarnos algo, estas son las
            opciones:
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2">
          {/* Vertical divider between the two options, desktop only */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ backgroundColor: "rgba(196,113,74,0.25)" }}
          />

          {options.map((opt, i) => (
            <div
              key={opt.title}
              className={`gift-card text-center px-6 md:px-14 ${
                i === 0
                  ? "md:pr-16"
                  : "md:pl-16 pt-14 md:pt-0 border-t md:border-t-0"
              }`}
              style={{ borderColor: "rgba(196,113,74,0.25)" }}
            >
              <span className="text-3xl block mb-5">{opt.icon}</span>
              <h3
                className="font-serif font-light mb-4"
                style={{ color: "#2C2416", fontSize: "1.4rem" }}
              >
                {opt.title}
              </h3>
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: "rgba(44,36,22,0.6)" }}
              >
                {opt.description}
              </p>
              {opt.detail && (
                <p
                  className="font-serif mt-5"
                  style={{ color: "#2C2416", fontSize: "1.6rem", letterSpacing: "0.04em" }}
                >
                  {opt.detail}
                </p>
              )}
              {opt.ctaHref && (
                <a
                  href={opt.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 font-sans text-xs tracking-[0.25em] uppercase underline underline-offset-4"
                  style={{ color: "#C4714A" }}
                >
                  {opt.ctaLabel} →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
