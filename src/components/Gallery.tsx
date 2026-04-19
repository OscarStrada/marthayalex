import { useEffect, useRef } from "react";
import gsap from "gsap";

interface GalleryPhoto {
  id: number;
  alt: string;
  src: string;
  span?: "tall" | "normal";
}

// Fotos de Unsplash como placeholder — reemplaza `src` con tus fotos reales
const photos: GalleryPhoto[] = [
  {
    id: 1,
    alt: "Primer encuentro",
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80",
    span: "tall",
  },
  {
    id: 2,
    alt: "Paseo de otoño",
    src: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    alt: "Nuestra primera cita",
    src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    alt: "Aventura juntos",
    src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80",
    span: "tall",
  },
  {
    id: 5,
    alt: "El compromiso",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    alt: "Celebración en familia",
    src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(".gallery-heading");
      if (heading)
        gsap.from(heading, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: heading, start: "top 82%", once: true },
        });

      const cells = gridRef.current?.querySelectorAll(".gallery-cell");
      if (cells) {
        gsap.from(cells, {
          opacity: 0,
          scale: 0.94,
          duration: 0.75,
          stagger: { amount: 0.6, from: "start" },
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
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
      className="py-24 px-6"
      style={{ backgroundColor: "#F5EDE3" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="gallery-heading text-center mb-16">
          <p
            className="font-sans text-xs tracking-[0.42em] uppercase mb-3"
            style={{ color: "#C4714A" }}
          >
            Momentos que atesoramos
          </p>
          <h2
            className="font-serif font-light"
            style={{ color: "#2C2416", fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
          >
            Nuestra Galería
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
          style={{ gridAutoRows: "220px" }}
        >
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="gallery-cell relative overflow-hidden group"
              style={{ gridRow: photo.span === "tall" ? "span 2" : "span 1" }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay on hover */}
              <div
                className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(to top, rgba(44,36,22,0.65), transparent)",
                }}
              >
                <p
                  className="font-serif italic text-sm"
                  style={{ color: "#F5EDE3" }}
                >
                  {photo.alt}
                </p>
              </div>

              {/* Corner decorations */}
              <span
                className="absolute top-2 left-2 w-3 h-3 opacity-60 pointer-events-none"
                style={{
                  borderTop: "1px solid rgba(245,237,227,0.7)",
                  borderLeft: "1px solid rgba(245,237,227,0.7)",
                }}
              />
              <span
                className="absolute bottom-2 right-2 w-3 h-3 opacity-60 pointer-events-none"
                style={{
                  borderBottom: "1px solid rgba(245,237,227,0.7)",
                  borderRight: "1px solid rgba(245,237,227,0.7)",
                }}
              />
            </div>
          ))}
        </div>

        {/*<p
          className="text-center font-sans text-xs mt-8 tracking-wider"
          style={{ color: 'rgba(44,36,22,0.35)' }}
        >
          * Fotos de referencia — serán reemplazadas con las fotos reales de la pareja
        </p>*/}
      </div>
    </section>
  );
}
