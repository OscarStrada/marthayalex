import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Couple {
  role: string;
  names: [string, string];
}

const parents: Couple[] = [
  {
    role: "Padres de la Novia",
    names: ["Dr. Gabriel Flores Cruz", "L.C. Martha Rico López"],
  },
  {
    role: "Padres del Novio",
    names: ["Sr. Artemio López Toledo", "Sra. Rosalía De Paz Nataren"],
  },
];

const padrinos: Couple[] = [
  {
    role: "Velación",
    names: ["Ing. Alberto de la O Andraca", "Sra. Alicia Rico López"],
  },
  {
    role: "Anillos",
    names: ["C.P. David Nájera Gutiérrez", "Sra. Artemia Rico López"],
  },
  {
    role: "Arras",
    names: [
      "C.P. Luis Arturo Mejía Aguilar",
      "M. Ed. María Guadalupe Rico López",
    ],
  },
  {
    role: "Lazo",
    names: ["Ing. Cesareo Murillo Santana", "Profa. Olga Rico López"],
  },
  {
    role: "Libro y Rosario",
    names: [
      "Prof. José Carlos De Paz Nataren",
      "Profa. Viridiana Hernández Trinidad",
    ],
  },
];

export default function ParentsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(".parents-heading");
      if (heading)
        gsap.from(heading, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: heading, start: "top 82%", once: true },
        });

      const parentCols = sectionRef.current?.querySelectorAll(".parent-col");
      if (parentCols) {
        gsap.from(parentCols, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        });
      }

      const padrinoItems =
        sectionRef.current?.querySelectorAll(".padrino-item");
      if (padrinoItems) {
        gsap.from(padrinoItems, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
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
        <div className="parents-heading text-center mb-16">
          <p
            className="font-sans text-xs tracking-[0.42em] uppercase mb-3"
            style={{ color: "#C4714A" }}
          >
            Con su bendición
          </p>
          <h2
            className="font-serif font-light"
            style={{ color: "#2C2416", fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
          >
            Padres y Padrinos
          </h2>
        </div>

        {/* Parents — editorial two-column layout with a vertical divider */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 mb-24">
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ backgroundColor: "rgba(196,113,74,0.25)" }}
          />
          {parents.map((p, i) => (
            <div
              key={p.role}
              className={`parent-col text-center px-6 md:px-14 ${
                i === 0
                  ? "md:pr-16"
                  : "md:pl-16 pt-14 md:pt-0 border-t md:border-t-0"
              }`}
              style={{ borderColor: "rgba(196,113,74,0.25)" }}
            >
              <p
                className="font-sans text-xs tracking-[0.3em] uppercase mb-4"
                style={{ color: "#C4714A" }}
              >
                {p.role}
              </p>
              <p
                className="font-serif"
                style={{ color: "#2C2416", fontSize: "1.25rem" }}
              >
                {p.names[0]}
              </p>
              <p
                className="font-serif"
                style={{ color: "#2C2416", fontSize: "1.25rem" }}
              >
                {p.names[1]}
              </p>
            </div>
          ))}
        </div>

        {/* Padrinos */}
        <div className="text-center mb-12">
          <p
            className="font-sans text-xs tracking-[0.3em] uppercase"
            style={{ color: "rgba(44,36,22,0.45)" }}
          >
            Padrinos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {padrinos.map((p) => (
            <div key={p.role} className="padrino-item text-center">
              <p
                className="font-sans text-xs tracking-[0.25em] uppercase mb-3"
                style={{ color: "#C4714A" }}
              >
                {p.role}
              </p>
              <p
                className="font-serif text-sm leading-relaxed"
                style={{ color: "rgba(44,36,22,0.75)" }}
              >
                {p.names[0]}
                <br />
                {p.names[1]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
