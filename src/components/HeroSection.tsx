import { useEffect, useRef } from "react";
import gsap from "gsap";

function wrapWords(text: string): string {
  return text
    .split(" ")
    .map(
      (word) =>
        `<span class="inline-block overflow-hidden leading-none"><span class="word-inner inline-block">${word}</span></span>`,
    )
    .join("&nbsp; ");
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wordInners = contentRef.current?.querySelectorAll(".word-inner");
      const preTitle = contentRef.current?.querySelector(".hero-pretitle");
      const divider = contentRef.current?.querySelector(".hero-divider");
      const date = contentRef.current?.querySelector(".hero-date");
      const scroll = contentRef.current?.querySelector(".hero-scroll");

      gsap.set(wordInners ?? [], { y: "110%" });
      const fadeEls = [preTitle, divider, date, scroll].filter(
        (el): el is Element => !!el,
      );
      gsap.set(fadeEls, { opacity: 0, y: 18 });

      const tl = gsap.timeline({ delay: 0.5 });

      if (preTitle)
        tl.to(preTitle, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      tl.to(
        wordInners ?? [],
        { y: "0%", duration: 1.2, stagger: 0.07, ease: "power4.out" },
        "-=0.3",
      );
      if (divider)
        tl.to(
          divider,
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.4",
        );
      if (date)
        tl.to(
          date,
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.3",
        );
      if (scroll)
        tl.to(
          scroll,
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.1",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "rgba(44,36,22,0.85)" }}
    >
      {/* Radial overlay for text legibility */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(44,36,22,0.55) 100%)",
        }}
      />

      <div
        ref={contentRef}
        className="relative z-20 text-center px-6 select-none"
      >
        {/* Pre-title */}
        <p
          className="hero-pretitle font-sans text-xs tracking-[0.45em] uppercase mb-8"
          style={{ color: "rgba(232,213,192,0.65)" }}
        >
          Nos complace invitarte a nuestra boda
        </p>

        {/* Couple names */}
        <h1
          className="font-serif font-light leading-none tracking-tight"
          style={{ color: "#F5EDE3", fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
          dangerouslySetInnerHTML={{ __html: wrapWords("Martha & Alex") }}
        />

        {/* Decorative divider */}
        <div className="hero-divider flex items-center justify-center gap-4 my-10">
          <div
            className="h-px w-20"
            style={{ backgroundColor: "rgba(196,113,74,0.55)" }}
          />
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 0 L8.2 5.8 L14 7 L8.2 8.2 L7 14 L5.8 8.2 L0 7 L5.8 5.8 Z"
              fill="#C4714A"
              opacity="0.8"
            />
          </svg>
          <div
            className="h-px w-20"
            style={{ backgroundColor: "rgba(196,113,74,0.55)" }}
          />
        </div>

        {/* Date */}
        <p
          className="hero-date font-serif italic font-light tracking-wide"
          style={{ color: "#E8D5C0", fontSize: "clamp(1.25rem, 3vw, 2rem)" }}
        >
          14 de Noviembre, 2026
        </p>

        {/* Scroll indicator */}
        <div className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span
            className="font-sans text-[10px] tracking-[0.4em] uppercase"
            style={{ color: "rgba(232,213,192,0.4)" }}
          >
            Desplazar
          </span>
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-px h-6 animate-pulse"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(232,213,192,0.4), transparent)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
