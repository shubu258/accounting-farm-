"use client";

import { useRef } from "react";
import { gsap, useGSAP, DESKTOP_MOTION } from "@/lib/gsap";
import { technology, certified } from "@/lib/content";

const total = technology.reduce((n, g) => n + g.items.length, 0);

export function Technology() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo("[data-tech-progress]", { scaleX: 0 }, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
        // Names in each panel lift slightly as their panel arrives.
        gsap.utils.toArray<HTMLElement>("[data-tech-panel]").forEach((panel) => {
          if (panel.offsetLeft < window.innerWidth * 0.8) return; // already on screen when pinned
          gsap.from(panel.querySelectorAll("li"), {
            yPercent: 40,
            autoAlpha: 0,
            stagger: 0.05,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 85%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="technology"
      data-theme="light"
      aria-labelledby="tech-title"
      className="relative overflow-hidden bg-paper lg:h-[100svh] lg:motion-reduce:h-auto"
    >
      <div
        ref={track}
        className="flex h-full snap-x snap-mandatory items-stretch overflow-x-auto pb-6 pt-[clamp(90px,11vw,140px)] [scrollbar-width:none] lg:snap-none lg:overflow-visible lg:pb-0 lg:pt-[calc(var(--header-h)+40px)] lg:motion-reduce:overflow-x-auto"
      >
        {/* Intro panel */}
        <div className="flex w-[86vw] shrink-0 snap-start flex-col justify-between gap-10 pb-10 pl-[var(--gutter)] pr-8 sm:w-[60vw] lg:w-[44vw] lg:pb-14 lg:pr-[6vw]">
          <div>
            <p className="t-label mb-8 flex gap-2 text-moss">
              Technology <span aria-hidden="true">→</span>
            </p>
            <h2 id="tech-title" className="t-display max-w-[11ch]">
              Fluent in the software you already run.
            </h2>
          </div>
          <div className="max-w-[36ch] space-y-5">
            <p className="t-lead text-ink/70">
              Certified experts in QuickBooks and Xero, and at home across {total} platforms for accounting,
              payroll, tax and SMSF work.
            </p>
            <p className="hidden text-[13px] text-ink/45 lg:block">Scroll to move through the stack →</p>
          </div>
        </div>

        {technology.map((g, gi) => (
          <div
            key={g.group}
            data-tech-panel
            className="flex w-[78vw] shrink-0 snap-start flex-col border-l border-ink/15 px-6 pb-10 sm:w-[46vw] sm:px-8 lg:w-[max(30vw,400px)] lg:px-10 lg:pb-14"
          >
            <div className="flex items-baseline justify-between border-b border-ink pb-4">
              <h3 className="text-[15px] font-medium tracking-[-0.01em]">{g.group}</h3>
              <span className="text-[13px] tabular-nums text-ink/45">
                {String(gi + 1).padStart(2, "0")} — {String(g.items.length).padStart(2, "0")}
              </span>
            </div>
            <ul className="mt-2">
              {g.items.map((name) => {
                const cert = certified.includes(name);
                return (
                  <li
                    key={name}
                    className="group flex items-center justify-between gap-4 border-b border-ink/10 py-3 lg:py-[clamp(8px,1.4vh,16px)]"
                  >
                    <span className="text-[clamp(24px,2.4vw,42px)] leading-[1.05] tracking-[-0.04em] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                      {name}
                    </span>
                    {cert && (
                      <span className="shrink-0 rounded-full bg-forest-800 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-sprout">
                        Certified expert
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Closing panel */}
        <div className="flex w-[78vw] shrink-0 snap-start flex-col justify-end border-l border-ink/15 bg-forest-800 px-6 pb-10 text-paper sm:w-[46vw] sm:px-8 lg:w-[max(30vw,400px)] lg:px-10 lg:pb-14">
          <p className="t-label mb-6 text-sprout">Software migration</p>
          <p className="t-title max-w-[12ch]">Still on spreadsheets or legacy software?</p>
          <p className="mt-5 max-w-[34ch] text-[16px] leading-relaxed text-paper/70">
            We move your firm onto modern cloud platforms and train your team along the way.
          </p>
          <a href="#contact" className="link-line mt-8 self-start text-[15px]">
            Plan a migration
          </a>
        </div>
        <div className="w-[var(--gutter)] shrink-0 lg:hidden" aria-hidden="true" />
      </div>

      <div className="pointer-events-none absolute inset-x-[var(--gutter)] bottom-5 hidden h-px bg-ink/10 lg:block lg:motion-reduce:hidden">
        <div data-tech-progress className="h-px origin-left bg-forest-800" />
      </div>
    </section>
  );
}
