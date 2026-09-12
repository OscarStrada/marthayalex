import { useEffect, useRef } from "react";
import gsap from "gsap";

interface GalleryPhoto {
  id: number;
  alt: string;
  src: string;
  span?: "tall" | "normal";
}

const CLOUD_BASE = "https://res.cloudinary.com/dzm7v2njj/image/upload";

// Ajusta los `alt` con descripciones reales de cada foto
const photos: GalleryPhoto[] = [
  {
    id: 1,
    alt: "Nuestra historia",
    src: `${CLOUD_BASE}/f_auto,q_auto,w_800/v1789050914/martha-alex/betxxethybyib5odzd6x.jpg`,
    span: "tall",
  },
  {
    id: 2,
    alt: "Un abrazo eterno",
    src: `${CLOUD_BASE}/f_auto,q_auto,w_600/v1789050913/martha-alex/zxnbdfgorsgohdduapbd.jpg`,
  },
  {
    id: 3,
    alt: "Miradas cómplices",
    src: `${CLOUD_BASE}/f_auto,q_auto,w_600/v1789050914/martha-alex/vsssyhqznirtmkgtnqo2.jpg`,
  },
  {
    id: 4,
    alt: "Caminando juntos",
    src: `${CLOUD_BASE}/f_auto,q_auto,w_800/v1789050913/martha-alex/bkeegjjiagkhvlg6yexm.jpg`,
    span: "tall",
  },
  {
    id: 5,
    alt: "Risas compartidas",
    src: `${CLOUD_BASE}/f_auto,q_auto,w_600/v1789050914/martha-alex/ndvaxxe4dsl6syxgbbzy.jpg`,
  },
  {
    id: 6,
    alt: "Momentos de complicidad",
    src: `${CLOUD_BASE}/f_auto,q_auto,w_600/v1789050913/martha-alex/xfvt3rfxtgselgyqgysm.jpg`,
  },
  {
    id: 7,
    alt: "El amor en cada detalle",
    src: `${CLOUD_BASE}/f_auto,q_auto,w_800/v1789050913/martha-alex/ifn817jaqgrh6op412se.jpg`,
    span: "tall",
  },
  {
    id: 8,
    alt: "Aventuras juntos",
    src: `${CLOUD_BASE}/f_auto,q_auto,w_600/v1789050913/martha-alex/bd8axkqljeex09ankaxy.jpg`,
  },
  {
    id: 9,
    alt: "Sonrisas sinceras",
    src: `${CLOUD_BASE}/f_auto,q_auto,w_600/v1789050913/martha-alex/hxd8q6o2f81res1qajmp.jpg`,
  },
  {
    id: 10,
    alt: "Un sí para siempre",
    src: `${CLOUD_BASE}/f_auto,q_auto,w_800/v1789050912/martha-alex/rdhrfysm7kbs4vxanm5a.jpg`,
    span: "tall",
  },
  {
    id: 11,
    alt: "Instantes felices",
    src: `${CLOUD_BASE}/f_auto,q_auto,w_600/v1789050912/martha-alex/gitob4glayaemododi8p.jpg`,
  },
  {
    id: 12,
    alt: "Nuestro camino",
    src: `${CLOUD_BASE}/f_auto,q_auto,w_600/v1789050912/martha-alex/ugsi2maj6iqu48vtju0d.jpg`,
  },
  {
    id: 13,
    alt: "El día que todo cambió",
    src: `${CLOUD_BASE}/f_auto,q_auto,w_800/v1789050912/martha-alex/jqftugkw2p1mffjjnnsk.jpg`,
    span: "tall",
  },
  {
    id: 14,
    alt: "Para siempre juntos",
    src: `${CLOUD_BASE}/f_auto,q_auto,w_600/v1789050912/martha-alex/m7kmptdqwr27xe7tzfdk.jpg`,
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
