"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP, DESKTOP_MOTION } from "@/lib/gsap";
import { useReveal } from "@/components/ui/useReveal";
import { process as steps } from "@/lib/content";

export function Process() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        const frames = gsap.utils.toArray<HTMLElement>("[data-step-frame]");
        const imgs = gsap.utils.toArray<HTMLElement>("[data-step-img]");
        gsap.set(frames.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(imgs.slice(1), { scale: 1.18 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 3}`,
            pin: true,
            scrub: 0.8,
            snap: { snapTo: 1 / 3, duration: { min: 0.3, max: 0.8 }, ease: "power2.inOut", delay: 0.05 },
            onUpdate: (self) => setActive(Math.min(3, Math.round(self.progress * 3))),
            invalidateOnRefresh: true,
          },
        });

        frames.slice(1).forEach((f, i) => {
          tl.to(f, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, i)
            .to(imgs[i + 1], { scale: 1, duration: 1 }, i)
            .to(imgs[i], { scale: 0.94, yPercent: -4, duration: 1 }, i);
        });
        tl.fromTo("[data-step-progress]", { scaleX: 0.25 }, { scaleX: 1, duration: 3 }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="process"
      data-theme="dark"
      aria-labelledby="process-title"
      className="relative bg-forest-900 text-paper"
    >
      <div className="shell pb-[clamp(56px,6vw,90px)] pt-[clamp(90px,11vw,180px)]">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          <p data-reveal="fade" className="t-label flex gap-2 text-sprout lg:col-span-3 lg:pt-4">
            How we work <span aria-hidden="true">↓</span>
          </p>
          <h2 id="process-title" data-reveal="lines" className="t-display max-w-[15ch] lg:col-span-9">
            From first call to steady work in four steps.
          </h2>
        </div>
      </div>

      {/* Desktop: pinned stage */}
      <div ref={stage} className="relative hidden h-[100svh] lg:block lg:motion-reduce:hidden">
        <div className="shell grid h-full grid-cols-12 items-center gap-x-[var(--gutter)] pb-10 pt-[calc(var(--header-h)+8px)]">
          <ol className="col-span-5 self-center" aria-label="Steps">
            {steps.map((s, i) => (
              <li key={s.name} className="flex items-baseline gap-5">
                <span
                  className={`w-8 text-[13px] tabular-nums transition-colors duration-500 ${
                    i === active ? "text-sprout" : "text-paper/25"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-current={i === active ? "step" : undefined}
                  className={`text-[clamp(56px,6.6vw,124px)] leading-[0.98] tracking-[-0.05em] transition-[color,transform] duration-700 ease-[var(--ease-out-expo)] ${
                    i === active ? "translate-x-0 text-paper" : "-translate-x-2 text-paper/20"
                  }`}
                >
                  {s.name}
                </span>
              </li>
            ))}
          </ol>

          <div className="col-span-7 flex h-full max-h-[760px] flex-col justify-center gap-7">
            <div className="relative min-h-0 flex-1 overflow-hidden">
              {steps.map((s, i) => (
                <div key={s.name} data-step-frame className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
                  <div data-step-img className="absolute inset-0 will-change-transform">
                    <Image src={s.image.src} alt={s.image.alt} fill sizes="55vw" className="grade object-cover" />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 items-start gap-x-6">
              <div className="col-span-2">
                <p className="text-[13px] tabular-nums text-paper/50">
                  Step {String(active + 1).padStart(2, "0")} / 04
                </p>
                <div className="mt-3 h-px w-full bg-paper/15">
                  <div data-step-progress className="h-px origin-left bg-sprout" />
                </div>
              </div>
              <div className="relative col-span-5 min-h-[4.5em]" aria-live="polite">
                {steps.map((s, i) => (
                  <p
                    key={s.name}
                    className={`absolute inset-0 max-w-[42ch] text-[clamp(17px,1.4vw,22px)] leading-[1.4] tracking-[-0.01em] transition duration-700 ease-[var(--ease-out-expo)] ${
                      i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                    }`}
                    aria-hidden={i !== active}
                  >
                    {s.body}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet / reduced motion fallback rendered below lg */}
      <ol className="shell grid gap-14 pb-[clamp(90px,11vw,160px)] lg:hidden lg:motion-reduce:grid">
        {steps.map((s, i) => (
          <li key={s.name} className="grid gap-5 sm:grid-cols-2 sm:items-end sm:gap-8">
            <div data-reveal="image" className="relative aspect-[4/3] overflow-hidden">
              <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width:640px) 50vw, 100vw" className="grade object-cover" />
            </div>
            <div>
              <p className="mb-3 text-[13px] tabular-nums text-sprout">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="text-[44px] leading-none tracking-[-0.045em]">{s.name}</h3>
              <p className="mt-4 max-w-[40ch] text-[17px] leading-relaxed text-paper/70">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
