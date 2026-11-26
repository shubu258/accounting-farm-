"use client";

import Image from "next/image";
import { useRef } from "react";
import { useReveal } from "@/components/ui/useReveal";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { images, security, testimonials } from "@/lib/content";

export function Trust() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-trust-bg]",
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: { trigger: "[data-trust-hero]", start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        // Rules draw across as each practice arrives.
        gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.3,
            ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="security" data-theme="dark" aria-labelledby="security-title" className="relative bg-forest-950 text-paper">
      {/* Atmospheric band */}
      <div data-trust-hero className="relative h-[62svh] min-h-[420px] overflow-hidden">
        <div data-trust-bg className="absolute inset-x-0 -inset-y-[12%]">
          <Image src={images.security.src} alt={images.security.alt} fill sizes="100vw" className="object-cover brightness-[.62] saturate-[.8]" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-forest-950/30 via-transparent to-forest-950" />
        <div className="shell relative flex h-full flex-col justify-end pb-12 lg:pb-16">
          <p data-reveal="fade" className="t-label mb-6 flex gap-2 text-sprout">
            Trust &amp; security <span aria-hidden="true">↓</span>
          </p>
          <h2 id="security-title" data-reveal="lines" className="t-display max-w-[15ch]">
            Client confidentiality is our highest priority.
          </h2>
        </div>
      </div>

      <div className="shell grid gap-14 py-[clamp(70px,9vw,140px)] lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
            <p data-reveal="fade" className="t-lead max-w-[34ch] text-paper/70">
              Your clients&apos; files are protected from the first day — contractually, digitally and physically,
              at both of our delivery centres.
            </p>
          </div>
        </div>

        <ol className="lg:col-span-7 lg:col-start-6">
          {security.map((s, i) => (
            <li key={s.title} className="relative">
              <span data-rule aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-paper/20" />
              <div data-reveal="fade" className="grid grid-cols-[44px_1fr] gap-x-4 py-7 sm:grid-cols-[64px_1fr_1fr] sm:items-baseline sm:py-8">
                <span className="text-[13px] tabular-nums text-sprout">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-[clamp(24px,2.2vw,34px)] leading-[1.05] tracking-[-0.035em]">{s.title}</h3>
                <p className="col-start-2 mt-2 max-w-[38ch] text-[15px] leading-relaxed text-paper/60 sm:col-start-3 sm:mt-0">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Client words — verbatim from the current site */}
      <div className="border-t border-paper/10 py-10 lg:py-14" aria-label="What clients say">
        <div className="overflow-hidden">
          <ul className="marquee">
            {[...testimonials, ...testimonials].map((t, i) => (
              <li key={i} aria-hidden={i >= testimonials.length} className="flex shrink-0 items-baseline gap-6 pr-[8vw]">
                <blockquote className="text-[clamp(24px,2.6vw,42px)] leading-none tracking-[-0.035em]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <span className="whitespace-nowrap text-[13px] text-paper/50">
                  {t.name} · {t.meta}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
