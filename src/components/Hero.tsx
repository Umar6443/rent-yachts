"use client";

import { memo, useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { BRAND } from "@/data/site";
import { loadState } from "@/lib/loadstate";
import { onScroll, scrollToTarget, startScroll } from "@/lib/scroll";

const VIDEOS = [
  "video/hero-01.mp4",
  "video/hero-02.mp4",
  "video/hero-03.mp4",
  "video/hero-04.mp4",
  "video/hero-05.mp4",
  "video/hero-06.mp4",
];

const TOTAL_UNITS = 6;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function Hero() {
  const wrapRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const overlayRefs = useRef<{
    brand: HTMLDivElement | null;
    headline: HTMLDivElement | null;
    intro: HTMLDivElement | null;
    cta: HTMLDivElement | null;
    arrow: HTMLDivElement | null;
  }>({ brand: null, headline: null, intro: null, cta: null, arrow: null });
  const prevVideo = useRef(0);

  useEffect(() => {
    let loaded = 0;
    const total = VIDEOS.length;
    let started = false;

    const kick = () => {
      if (started) return;
      started = true;
      loadState.set({ progress: 100, ready: true });
      startScroll();
    };

    const onCanPlay = () => {
      loaded++;
      loadState.set({
        progress: Math.round((loaded / total) * 90),
        note: `Loading video ${loaded}/${total}`,
      });
      if (loaded >= 1) kick();
    };

    videoRefs.current.forEach((v) => {
      if (!v) return;
      if (v.readyState >= 3) onCanPlay();
      else v.addEventListener("canplaythrough", onCanPlay, { once: true });
    });

    const fallback = setTimeout(kick, 4000);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let vh = window.innerHeight;
    let top = el.offsetTop;

    const onResize = () => {
      vh = window.innerHeight;
      top = el.offsetTop;
    };
    window.addEventListener("resize", onResize);

    const render = (scrollPx: number) => {
      const progress = (scrollPx - top) / vh;
      const u = Math.max(0, Math.min(TOTAL_UNITS, progress));

      const activeIdx = Math.min(VIDEOS.length - 1, Math.floor(u));
      if (activeIdx !== prevVideo.current) {
        videoRefs.current.forEach((v, i) => {
          if (!v) return;
          if (i === activeIdx) {
            v.style.opacity = "1";
            v.play().catch(() => {});
          } else {
            v.style.opacity = "0";
          }
        });
        prevVideo.current = activeIdx;
      }

      const { brand, headline, intro, cta, arrow } = overlayRefs.current;

      if (brand) {
        const opacity = 1 - smooth(0.6, 1.2, u);
        brand.style.opacity = String(opacity);
        brand.style.transform = `translate3d(0,${(1 - opacity) * -20}px,0)`;
      }

      if (arrow) {
        arrow.style.opacity = String(1 - smooth(0.4, 0.8, u));
      }

      if (headline) {
        const fadeIn = smooth(0.8, 1.4, u);
        const fadeOut = 1 - smooth(3.0, 3.6, u);
        const opacity = Math.min(fadeIn, fadeOut);
        headline.style.opacity = String(opacity);
        headline.style.transform = `translate3d(0,${(1 - fadeIn) * 28}px,0)`;
      }

      if (intro) {
        const fadeIn = smooth(3.2, 3.8, u);
        const fadeOut = 1 - smooth(4.8, 5.2, u);
        const opacity = Math.min(fadeIn, fadeOut);
        intro.style.opacity = String(opacity);
        intro.style.transform = `translate3d(0,${(1 - fadeIn) * 28}px,0)`;
      }

      if (cta) {
        const opacity = smooth(5.0, 5.4, u);
        cta.style.opacity = String(opacity);
        cta.style.transform = `translate3d(0,${(1 - opacity) * 20}px,0)`;
      }
    };

    render(0);
    const unsub = onScroll(render);

    return () => {
      unsub();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="hero-video-section relative"
      style={{ height: `${TOTAL_UNITS * 100}svh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* video layers */}
        {VIDEOS.map((src, i) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={src}
            autoPlay={i === 0}
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === 0 ? 1 : 0 }}
          />
        ))}

        {/* dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-[#0a0a0f]/20" />

        {/* brand name overlay — visible at top */}
        <div
          ref={(el) => {
            overlayRefs.current.brand = el;
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <p className="font-serif text-[14vw] leading-[0.88] tracking-[0.06em] text-[var(--accent)] sm:text-[10vw] md:text-[8vw]">
            {BRAND.name}
          </p>
          <p className="mt-4 font-mono text-[10px] tracking-[0.45em] text-white/60 sm:text-[11px]">
            {BRAND.tag.toUpperCase()}
          </p>
        </div>

        {/* scroll arrow */}
        <div
          ref={(el) => {
            overlayRefs.current.arrow = el;
          }}
          className="absolute inset-x-0 bottom-8 flex justify-center"
        >
          <button
            onClick={() => scrollToTarget("#fleet")}
            className="animate-bounce text-white/50 transition-colors hover:text-[var(--accent)]"
            aria-label="Scroll down"
          >
            <ArrowDown size={28} />
          </button>
        </div>

        {/* headline overlay — fades in during scroll */}
        <div
          ref={(el) => {
            overlayRefs.current.headline = el;
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-0"
        >
          <h1 className="font-serif text-[14vw] leading-[0.92] tracking-[-0.02em] sm:text-[9vw] md:text-[7vw]">
            {BRAND.headline[0]}
            <br />
            <em className="italic text-[var(--accent)]">{BRAND.headline[1]}</em>
          </h1>
        </div>

        {/* intro text overlay */}
        <div
          ref={(el) => {
            overlayRefs.current.intro = el;
          }}
          className="absolute inset-0 flex items-center justify-center px-6 text-center opacity-0"
        >
          <p className="max-w-2xl font-serif text-xl leading-relaxed text-white/90 sm:text-2xl md:text-3xl">
            {BRAND.intro}
          </p>
        </div>

        {/* CTA overlay */}
        <div
          ref={(el) => {
            overlayRefs.current.cta = el;
          }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center opacity-0"
        >
          <p className="font-mono text-[10px] tracking-[0.4em] text-[var(--accent)]">
            FOUR YACHTS &middot; DUBAI MARINA
          </p>
          <button onClick={() => scrollToTarget("#fleet")} className="btn">
            Explore the fleet
          </button>
        </div>
      </div>
    </section>
  );
}

export default memo(Hero);
