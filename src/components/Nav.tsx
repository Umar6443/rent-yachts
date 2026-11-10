"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { BRAND } from "@/data/site";
import { scrollToTarget } from "@/lib/scroll";

const LINKS = [
  { label: "Fleet", href: "#fleet" },
  { label: "Experiences", href: "#experiences" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  const navigate = useCallback((href: string) => {
    setOpen(false);
    requestAnimationFrame(() => scrollToTarget(href));
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="pointer-events-none absolute left-0 top-0 h-px w-full" aria-hidden />
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500 ${
          scrolled ? "bg-[#0a0a0f]/90 backdrop-blur-md" : "bg-transparent"
        }`}
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-10 md:px-[6vw]">
          <button
            onClick={() => scrollToTarget("#top")}
            className="font-serif text-xl tracking-[0.12em] text-[var(--accent)] transition-opacity hover:opacity-80 md:text-2xl"
          >
            {BRAND.name}
          </button>

          {/* desktop links */}
          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => navigate(l.href)}
                  className="font-mono text-[10px] tracking-[0.3em] text-white/70 uppercase transition-colors duration-300 hover:text-[var(--accent)]"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="grid h-10 w-10 place-items-center text-white/80 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* mobile panel */}
        <div
          className={`fixed inset-0 top-0 z-40 flex flex-col bg-[#0a0a0f]/98 backdrop-blur-lg transition-[opacity,visibility] duration-400 md:hidden ${
            open ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-10">
            <span className="font-serif text-xl tracking-[0.12em] text-[var(--accent)]">{BRAND.name}</span>
            <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center text-white/80" aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <ul className="flex flex-1 flex-col items-center justify-center gap-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => navigate(l.href)}
                  className="font-serif text-3xl tracking-[0.06em] text-white/90 transition-colors hover:text-[var(--accent)]"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
          <p className="pb-8 text-center font-mono text-[9px] tracking-[0.3em] text-white/30">
            {BRAND.tag.toUpperCase()}
          </p>
        </div>
      </nav>
    </>
  );
}
