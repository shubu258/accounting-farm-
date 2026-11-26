"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useReveal } from "@/components/ui/useReveal";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { contact, images, onboarding } from "@/lib/content";

export function FinalCTA() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The image opens from an inset frame to full bleed as you arrive.
        gsap.fromTo(
          "[data-cta-frame]",
          { clipPath: "inset(10% 6% 10% 6% round 4px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 15%", scrub: true },
          },
        );
        gsap.fromTo(
          "[data-cta-img]",
          { scale: 1.2 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" data-theme="dark" aria-labelledby="cta-title" className="relative bg-forest-950 text-paper">
      <div data-cta-frame className="relative min-h-[100svh] overflow-hidden">
        <div data-cta-img className="absolute inset-0">
          <Image src={images.cta.src} alt={images.cta.alt} fill sizes="100vw" className="object-cover" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,32,26,.55)_0%,rgba(8,32,26,.35)_40%,rgba(8,32,26,.92)_100%)]" />

        <div className="shell relative flex min-h-[100svh] flex-col justify-between pb-10 pt-[calc(var(--header-h)+48px)] lg:pb-14">
          <p data-reveal="fade" className="t-label flex gap-2 text-sprout">
            Start here <span aria-hidden="true">↓</span>
          </p>

          <div>
            <h2 id="cta-title" data-reveal="lines" className="t-mega max-w-[12ch]">
              Talk to us about your busy season.
            </h2>
            <div className="mt-10 grid items-end gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
              <div data-reveal="fade" className="flex flex-wrap items-center gap-3 lg:col-span-5">
                <Button href={contact.page} variant="sprout" magnetic>
                  Book a discovery call
                </Button>
                <Button href={contact.phoneNAHref} variant="ghost">
                  {contact.phoneNA}
                </Button>
              </div>
              <ol data-reveal="fade" className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-paper/25 pt-6 sm:grid-cols-4 lg:col-span-7">
                {onboarding.map((s, i) => (
                  <li key={s.what}>
                    <p className="text-[13px] tabular-nums text-paper/55">
                      {String(i + 1).padStart(2, "0")} · {s.when}
                    </p>
                    <p className="mt-1.5 text-[18px] tracking-[-0.02em]">{s.what}</p>
                  </li>
                ))}
              </ol>
            </div>
            <p data-reveal="fade" className="mt-8 text-[14px] text-paper/60">
              Most firms are up and running within two weeks. {contact.reply}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
