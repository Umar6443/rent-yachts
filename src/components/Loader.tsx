"use client";

import { useEffect, useState } from "react";
import { useLoadState } from "@/lib/loadstate";
import { BRAND } from "@/data/site";

export default function Loader() {
  const { progress, ready } = useLoadState();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setHidden(true), 800);
    return () => clearTimeout(t);
  }, [ready]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0f] transition-opacity duration-700 ${
        ready ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-live="polite"
      role="status"
    >
      <p className="font-serif text-3xl tracking-[0.18em] text-[var(--accent)] md:text-4xl">
        {BRAND.name}
      </p>
      <p className="mt-3 font-mono text-[9px] tracking-[0.4em] text-white/40">
        {BRAND.tag.toUpperCase()}
      </p>

      {/* progress bar */}
      <div className="mt-10 h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-[var(--accent)] transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* percentage */}
      <p className="mt-4 font-mono text-[10px] tracking-[0.3em] text-white/50">
        {progress < 100 ? `${progress}%` : ""}
      </p>
    </div>
  );
}
