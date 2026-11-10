"use client";

import { memo, useCallback, useEffect, useState } from "react";
import type { YachtId } from "@/data/site";
import { destroyScroll, initScroll, stopScroll } from "@/lib/scroll";
import Loader from "./Loader";
import Nav from "./Nav";
import Hero from "./Hero";
import YachtViewer from "./YachtViewer";
import { About, Contact, Experiences, Fleet } from "./Sections";

const FleetM = memo(Fleet);
const ExperiencesM = memo(Experiences);
const AboutM = memo(About);
const ContactM = memo(Contact);

export default function App() {
  const [open, setOpen] = useState<YachtId | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    initScroll(reduced);
    stopScroll();
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return destroyScroll;
  }, []);

  useEffect(() => {
    document.body.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
    );
    document.querySelectorAll("[data-reveal]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const close = useCallback(() => setOpen(null), []);
  const show = useCallback((id: YachtId) => setOpen(id), []);

  return (
    <>
      <Loader />
      <Nav />
      <main>
        <Hero onOpenYacht={show} />
        <FleetM onOpen={show} />
        <ExperiencesM />
        <AboutM />
      </main>
      <ContactM />
      {open && <YachtViewer id={open} onClose={close} onSwitch={show} />}
    </>
  );
}
