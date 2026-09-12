import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Venue {
  type: "Ceremonia" | "Recepción";
  name: string;
  address: string;
  city: string;
  time: string;
  mapUrl: string;
  icon: string;
}

// Reemplaza mapUrl con el enlace real de Google Maps cuando lo tengas
const venues: Venue[] = [
  {
    type: "Ceremonia",
    name: "Parroquia de Santiago Apóstol",
    address: "Ometepec, Guerrero",
    city: "Ometepec, Gro., México",
    time: "4:00 PM",
    mapUrl:
      "https://maps.google.com/?q=Iglesia+Santiago+Apostol+Ometepec+Guerrero+Mexico",
    icon: "⛪",
  },
  {
    type: "Recepción",
    name: "Campery Club",
    address: "Ometepec, Guerrero",
    city: "Ometepec, Gro., México",
    time: "6:00 PM",
    mapUrl: "https://maps.google.com/?q=Campery+Club+Ometepec+Guerrero+Mexico",
    icon: "✦",
  },
];

export default function LocationSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(".location-heading");
      if (heading)
        gsap.from(heading, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: heading, start: "top 82%", once: true },
        });

      const cards = sectionRef.current?.querySelectorAll(".venue-card");
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
      style={{ backgroundColor: "#EDE0D0" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="location-heading text-center mb-16">
          <p
            className="font-sans text-xs tracking-[0.42em] uppercase mb-3"
            style={{ color: "#C4714A" }}
          >
            ¿Dónde nos encontramos?
          </p>
          <h2
            className="font-serif font-light"
            style={{ color: "#2C2416", fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
          >
            Ubicaciones
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {venues.map((venue) => (
            <div
              key={venue.type}
              className="venue-card flex flex-col"
              style={{ border: "1px solid rgba(196,113,74,0.22)" }}
            >
              {/* Header band */}
              <div
                className="px-8 py-4 flex items-center gap-3"
                style={{
                  backgroundColor: "rgba(196,113,74,0.08)",
                  borderBottom: "1px solid rgba(196,113,74,0.15)",
                }}
              >
                <span className="text-lg">{venue.icon}</span>
                <span
                  className="font-sans text-xs tracking-[0.3em] uppercase"
                  style={{ color: "#C4714A" }}
                >
                  {venue.type}
                </span>
                <span
                  className="ml-auto font-sans text-xs tracking-wider"
                  style={{ color: "rgba(44,36,22,0.45)" }}
                >
                  {venue.time}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 px-8 py-8 space-y-4">
                <h3
                  className="font-serif font-light leading-snug"
                  style={{ color: "#2C2416", fontSize: "1.55rem" }}
                >
                  {venue.name}
                </h3>

                <div className="space-y-1">
                  <p
                    className="font-sans text-sm"
                    style={{ color: "rgba(44,36,22,0.65)" }}
                  >
                    {venue.address}
                  </p>
                  <p
                    className="font-sans text-sm"
                    style={{ color: "rgba(44,36,22,0.45)" }}
                  >
                    {venue.city}
                  </p>
                </div>
              </div>

              {/* Map placeholder + CTA */}
              <div className="px-8 pb-8">
                {/* Decorative map placeholder */}
                <div
                  className="w-full mb-5 overflow-hidden relative"
                  style={{
                    height: "140px",
                    backgroundColor: "rgba(44,36,22,0.04)",
                    border: "1px solid rgba(196,113,74,0.15)",
                  }}
                >
                  {/* Stylized map lines (decorative) */}
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 300 140"
                    preserveAspectRatio="xMidYMid slice"
                    style={{ opacity: 0.25 }}
                  >
                    <line
                      x1="0"
                      y1="70"
                      x2="300"
                      y2="70"
                      stroke="#C4714A"
                      strokeWidth="1"
                    />
                    <line
                      x1="150"
                      y1="0"
                      x2="150"
                      y2="140"
                      stroke="#C4714A"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="35"
                      x2="300"
                      y2="35"
                      stroke="#6B7645"
                      strokeWidth="0.5"
                      strokeDasharray="4,6"
                    />
                    <line
                      x1="0"
                      y1="105"
                      x2="300"
                      y2="105"
                      stroke="#6B7645"
                      strokeWidth="0.5"
                      strokeDasharray="4,6"
                    />
                    <line
                      x1="75"
                      y1="0"
                      x2="75"
                      y2="140"
                      stroke="#6B7645"
                      strokeWidth="0.5"
                      strokeDasharray="4,6"
                    />
                    <line
                      x1="225"
                      y1="0"
                      x2="225"
                      y2="140"
                      stroke="#6B7645"
                      strokeWidth="0.5"
                      strokeDasharray="4,6"
                    />
                    <circle
                      cx="150"
                      cy="70"
                      r="8"
                      fill="#C4714A"
                      opacity="0.8"
                    />
                    <circle
                      cx="150"
                      cy="70"
                      r="16"
                      fill="none"
                      stroke="#C4714A"
                      strokeWidth="1"
                      opacity="0.4"
                    />
                    <circle
                      cx="150"
                      cy="70"
                      r="26"
                      fill="none"
                      stroke="#C4714A"
                      strokeWidth="0.5"
                      opacity="0.2"
                    />
                  </svg>
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ pointerEvents: "none" }}
                  >
                    <span
                      className="font-sans text-xs tracking-[0.2em] uppercase"
                      style={{ color: "rgba(44,36,22,0.35)" }}
                    >
                      Ver en mapa
                    </span>
                  </div>
                </div>

                <a
                  href={venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 text-center font-sans text-xs tracking-[0.25em] uppercase transition-all duration-300"
                  style={{
                    border: "1px solid #C4714A",
                    color: "#C4714A",
                  }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLAnchorElement
                    ).style.backgroundColor = "#C4714A";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#F5EDE3";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLAnchorElement
                    ).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#C4714A";
                  }}
                >
                  Cómo llegar →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Separator note */}
        <p
          className="text-center font-sans text-xs mt-10 tracking-wider leading-loose"
          style={{ color: "rgba(44,36,22,0.38)" }}
        >
          La ceremonia religiosa iniciará puntualmente.
          <br />
          Te esperamos en ambas celebraciones.
        </p>
      </div>
    </section>
  );
}
