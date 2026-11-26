"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { gsap, SplitText, useGSAP, MOTION_OK, DESKTOP_MOTION } from "@/lib/gsap";
import { markets } from "@/lib/content";

const LedgerScene = dynamic(() => import("./LedgerScene"), { ssr: false });

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [sceneReady, setSceneReady] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set("[data-hero]", { visibility: "visible" });
        const split = SplitText.create("[data-hero-title]", { type: "lines", mask: "lines", linesClass: "line-mask" });
        const tl = gsap.timeline({ delay: 0.15 });
        tl.from(split.lines, { yPercent: 108, duration: 1.4, stagger: 0.09, ease: "expo.out" })
          .from("[data-hero-fade]", { y: 18, autoAlpha: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, "-=0.95")
          .from("[data-hero-rule]", { scaleX: 0, transformOrigin: "left center", duration: 1.4, ease: "expo.inOut" }, "<");

      });

      // Scroll-away (desktop only): headline drifts up and the model recedes.
      mm.add(DESKTOP_MOTION, () => {
        gsap.to("[data-hero-copy]", {
          yPercent: -18,
          autoAlpha: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-scene]", {
          yPercent: 12,
          scale: 0.96,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => gsap.set("[data-hero]", { visibility: "visible" }));
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      data-theme="dark"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-forest-950 text-paper"
    >
      {/* 3D ledger model */}
      <div
        data-hero-scene
        aria-hidden="true"
        className={`absolute inset-0 -z-10 transition-opacity duration-[2000ms] ease-out ${sceneReady ? "opacity-100" : "opacity-0"}`}
      >
        <LedgerScene onReady={() => setSceneReady(true)} />
      </div>
      {/* Legibility wash behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,32,26,.92)_0%,rgba(8,32,26,.55)_38%,rgba(8,32,26,0)_62%)] max-lg:bg-[linear-gradient(180deg,rgba(8,32,26,.9)_0%,rgba(8,32,26,.55)_45%,rgba(8,32,26,0)_70%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[40%] bg-gradient-to-t from-forest-950 from-45% to-transparent lg:h-40 lg:from-0%" />

      <div data-hero-copy className="shell flex flex-1 flex-col pt-[calc(var(--header-h)+clamp(28px,7vh,110px))]">
        <p data-hero data-hero-fade className="t-label mb-8 flex items-center gap-3 text-sprout lg:mb-10">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-sprout" />
          Outsourcing partner for CPA, accounting &amp; bookkeeping firms
        </p>

        <h1
          id="hero-title"
          data-hero
          data-hero-title
          className="text-balance text-[clamp(42px,min(7.2vw,11.5vh),136px)] leading-[0.95] tracking-[-0.05em] lg:text-wrap"
        >
          Accounting capacity <br className="hidden lg:block" />
          for growing firms, <br className="hidden lg:block" />
          <span className="text-sage">without another hire.</span>
        </h1>

        <div className="mt-auto pb-8 pt-[min(52vh,440px)] sm:pt-[min(48vh,460px)] lg:pb-10 lg:pt-14">
          <div data-hero data-hero-rule className="mb-7 h-px w-full bg-paper/15" />
          <div className="grid items-end gap-8 lg:grid-cols-12">
            <p data-hero data-hero-fade className="t-lead max-w-[40ch] text-paper/70 lg:col-span-5">
              A dedicated team handles your bookkeeping, payables, payroll and tax preparation — so your
              people can focus on clients.
            </p>
            <div data-hero data-hero-fade className="flex flex-wrap gap-3 lg:col-span-4">
              <Button href="#contact" variant="sprout" magnetic>
                Book a discovery call
              </Button>
              <Button href="#services" variant="ghost">
                Explore services
              </Button>
            </div>
            <ul
              data-hero
              data-hero-fade
              aria-label="Markets served"
              className="flex gap-4 text-[13px] text-paper/55 lg:col-span-3 lg:justify-end"
            >
              {markets.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
