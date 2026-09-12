import { useEffect, useRef } from "react";
import gsap from "gsap";
import ThreeBackground from "./ThreeBackground";

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reveals = sectionRef.current?.querySelectorAll(".footer-reveal");
      if (reveals) {
        gsap.from(reveals, {
          opacity: 0,
          y: 28,
          duration: 0.9,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative py-20 px-6 text-center"
    >
      <div className="absolute inset-0" style={{ backgroundColor: "#2C2416" }} />
      <ThreeBackground variant="pile" />
      <div className="relative z-10 max-w-xl mx-auto space-y-7">
        {/* Top ornament */}
        <div className="footer-reveal flex items-center justify-center gap-5">
          <div
            className="h-px w-14"
            style={{ backgroundColor: "rgba(196,113,74,0.45)" }}
          />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 0 L9.4 6.6 L16 8 L9.4 9.4 L8 16 L6.6 9.4 L0 8 L6.6 6.6 Z"
              fill="#C4714A"
              opacity="0.75"
            />
          </svg>
          <div
            className="h-px w-14"
            style={{ backgroundColor: "rgba(196,113,74,0.45)" }}
          />
        </div>

        {/* Main closing message */}
        <h2
          className="footer-reveal font-serif italic font-light leading-snug"
          style={{ color: "#F5EDE3", fontSize: "clamp(2rem, 5vw, 3rem)" }}
        >
          Con amor y gratitud
        </h2>

        <p
          className="footer-reveal font-sans text-sm leading-loose tracking-wider"
          style={{ color: "rgba(232,213,192,0.55)" }}
        >
          Gracias por ser parte de este momento tan especial.
          <br />
          Su presencia llena nuestros corazones de alegría.
        </p>

        {/* Names */}
        <p
          className="footer-reveal font-serif italic"
          style={{ color: "rgba(196,113,74,0.85)", fontSize: "1.35rem" }}
        >
          Martha & Alex
        </p>

        {/* Bottom divider */}
        <div className="footer-reveal flex items-center justify-center gap-4 pt-4">
          <div
            className="h-px w-8"
            style={{ backgroundColor: "rgba(196,113,74,0.2)" }}
          />
          <p
            className="font-sans text-xs tracking-[0.35em] uppercase"
            style={{ color: "rgba(232,213,192,0.25)" }}
          >
            14 · 11 · 2026
          </p>
          <div
            className="h-px w-8"
            style={{ backgroundColor: "rgba(196,113,74,0.2)" }}
          />
        </div>
      </div>
    </footer>
  );
}
