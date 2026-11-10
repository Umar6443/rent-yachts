"use client";

import { memo, useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { BRAND, type YachtId } from "@/data/site";
import { loadState } from "@/lib/loadstate";
import { onScroll, scrollToTarget, startScroll } from "@/lib/scroll";

const FRAMES = 202;
const UNITS = 7;
// the sticky viewport is pinned for UNITS - 1 viewport heights of scroll
const SCRUB = UNITS - 1;
const PRIORITY_STEP = 8;

const frameSrc = (i: number) => `seq/f-${String(i + 1).padStart(3, "0")}.webp`;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// First ~88 frames are the slow aerial; give them 32% of the scroll so the
// approach, orbit and interior entry play out over the remaining 68%.
function frameAt(t: number) {
  const ST = 0.32;
  const SF = 88;
  const f = t <= ST ? (t / ST) * SF : SF + ((t - ST) / (1 - ST)) * (FRAMES - 1 - SF);
  return Math.min(FRAMES - 1, Math.max(0, f));
}

function Hero({ onOpenYacht: _onOpenYacht }: { onOpenYacht: (id: YachtId) => void }) {
  const wrapRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRefs = useRef<{
    brand: HTMLDivElement | null;
    headline: HTMLDivElement | null;
    intro: HTMLDivElement | null;
    cta: HTMLDivElement | null;
    arrow: HTMLDivElement | null;
  }>({ brand: null, headline: null, intro: null, cta: null, arrow: null });

  useEffect(() => {
    const el = wrapRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const images: (HTMLImageElement | null)[] = new Array(FRAMES).fill(null);
    const loaded = new Array<boolean>(FRAMES).fill(false);

    let vh = window.innerHeight;
    let top = el.offsetTop;
    let targetFrame = 0;
    let currentFrame = -1;
    let drawnFrame = -1;
    let raf = 0;
    let disposed = false;
    let started = false;

    const priority: number[] = [];
    for (let i = 0; i < FRAMES; i += PRIORITY_STEP) priority.push(i);
    if (priority[priority.length - 1] !== FRAMES - 1) priority.push(FRAMES - 1);

    const kick = () => {
      if (started) return;
      started = true;
      loadState.set({ progress: 100, ready: true });
      startScroll();
    };

    let priorityLoaded = 0;
    const load = (i: number, onDone?: () => void) => {
      if (images[i]) return;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        loaded[i] = true;
        drawnFrame = -1; // allow redraw with better frame
        onDone?.();
      };
      img.onerror = () => onDone?.();
      img.src = frameSrc(i);
      images[i] = img;
    };

    priority.forEach((i) =>
      load(i, () => {
        priorityLoaded++;
        loadState.set({
          progress: Math.round((priorityLoaded / priority.length) * 95),
          note: "Preparing the voyage",
        });
        if (priorityLoaded >= priority.length) kick();
      }),
    );

    // fill remaining frames with a small worker pool
    let fillIdx = 0;
    const fillNext = () => {
      if (disposed) return;
      while (fillIdx < FRAMES && images[fillIdx]) fillIdx++;
      if (fillIdx >= FRAMES) return;
      load(fillIdx++, fillNext);
    };
    for (let w = 0; w < 6; w++) fillNext();

    const fallback = setTimeout(kick, 4500);

    const nearestLoaded = (i: number) => {
      if (loaded[i]) return i;
      for (let d = 1; d < FRAMES; d++) {
        if (i - d >= 0 && loaded[i - d]) return i - d;
        if (i + d < FRAMES && loaded[i + d]) return i + d;
      }
      return -1;
    };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      drawnFrame = -1;
    };

    const drawCover = (img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    // draws the fractional frame f by crossfading the two adjacent frames,
    // so scrubbing interpolates instead of stepping
    const draw = (f: number) => {
      const i0 = Math.max(0, Math.min(FRAMES - 1, Math.floor(f)));
      const i1 = Math.min(FRAMES - 1, i0 + 1);
      const frac = f - i0;
      const base = loaded[i0] ? i0 : nearestLoaded(i0);
      if (base < 0) return;
      const blend = base === i0 && i1 !== i0 && loaded[i1] ? frac : 0;
      const key = base + blend;
      if (Math.abs(key - drawnFrame) < 0.003) return;
      ctx.globalAlpha = 1;
      drawCover(images[base]!);
      if (blend > 0.01) {
        ctx.globalAlpha = blend;
        drawCover(images[i1]!);
        ctx.globalAlpha = 1;
      }
      drawnFrame = key;
    };

    const overlays = (u: number) => {
      const { brand, headline, intro, cta, arrow } = overlayRefs.current;
      if (brand) {
        const o = 1 - smooth(0.45, 1.0, u);
        brand.style.opacity = String(o);
        brand.style.transform = `translate3d(0,${(1 - o) * -24}px,0)`;
      }
      if (arrow) arrow.style.opacity = String(1 - smooth(0.3, 0.65, u));
      if (headline) {
        const fi = smooth(1.0, 1.6, u);
        const fo = 1 - smooth(2.5, 3.0, u);
        headline.style.opacity = String(Math.min(fi, fo));
        headline.style.transform = `translate3d(0,${(1 - fi) * 30}px,0)`;
      }
      if (intro) {
        const fi = smooth(3.2, 3.7, u);
        const fo = 1 - smooth(4.4, 4.9, u);
        intro.style.opacity = String(Math.min(fi, fo));
        intro.style.transform = `translate3d(0,${(1 - fi) * 30}px,0)`;
      }
      if (cta) {
        const o = smooth(5.3, 5.7, u);
        cta.style.opacity = String(o);
        cta.style.pointerEvents = o > 0.5 ? "auto" : "none";
        cta.style.transform = `translate3d(0,${(1 - o) * 24}px,0)`;
      }
    };

    const onScrollPx = (scrollPx: number) => {
      const u = Math.max(0, Math.min(SCRUB, (scrollPx - top) / vh));
      targetFrame = frameAt(u / SCRUB);
      overlays(u);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const k = reduced ? 1 : 0.18;
      currentFrame += (targetFrame - currentFrame) * k;
      if (Math.abs(targetFrame - currentFrame) < 0.002) currentFrame = targetFrame;
      draw(currentFrame);
    };

    const onResize = () => {
      vh = window.innerHeight;
      top = el.offsetTop;
      sizeCanvas();
    };
    window.addEventListener("resize", onResize);

    sizeCanvas();
    currentFrame = 0;
    onScrollPx(window.scrollY || 0);
    const unsub = onScroll(onScrollPx);
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      clearTimeout(fallback);
      cancelAnimationFrame(raf);
      unsub();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="hero-video-section relative"
      style={{ height: `${UNITS * 100}svh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[var(--bg)]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

        {/* dark overlay for text legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/25" />

        {/* brand name overlay — visible at top */}
        <div
          ref={(el) => {
            overlayRefs.current.brand = el;
          }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <p className="font-serif text-[14vw] leading-[0.88] tracking-[0.06em] text-[var(--accent)] sm:text-[10vw] md:text-[8vw]">
            {BRAND.name}
          </p>
          <p className="mt-4 font-mono text-[10px] tracking-[0.45em] text-white/60 sm:text-[11px]">
            {BRAND.tag.toUpperCase()}
          </p>
          <p className="mt-10 font-mono text-[10px] tracking-[0.3em] text-white/40">
            SCROLL TO BEGIN THE VOYAGE
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

        {/* headline overlay — during the descent */}
        <div
          ref={(el) => {
            overlayRefs.current.headline = el;
          }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center opacity-0"
        >
          <h1 className="font-serif text-[14vw] leading-[0.92] tracking-[-0.02em] [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] sm:text-[9vw] md:text-[7vw]">
            {BRAND.headline[0]}
            <br />
            <em className="italic text-[var(--accent)]">{BRAND.headline[1]}</em>
          </h1>
        </div>

        {/* intro text overlay — alongside the hull */}
        <div
          ref={(el) => {
            overlayRefs.current.intro = el;
          }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center opacity-0"
        >
          <p className="max-w-2xl rounded-2xl bg-black/25 px-7 py-6 font-serif text-xl leading-relaxed text-white backdrop-blur-[3px] [text-shadow:0_1px_10px_rgba(0,0,0,0.8)] sm:text-2xl md:text-3xl">
            {BRAND.intro}
          </p>
        </div>

        {/* CTA overlay — inside the salon */}
        <div
          ref={(el) => {
            overlayRefs.current.cta = el;
          }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 text-center opacity-0"
        >
          <p className="font-mono text-[10px] tracking-[0.4em] text-[var(--accent)] drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
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
