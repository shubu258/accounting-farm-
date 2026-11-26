"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import { useReveal } from "@/components/ui/useReveal";
import { images, stats } from "@/lib/content";

export function Intro() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Statement inks in word by word as it's read.
        const split = SplitText.create("[data-ink]", { type: "words" });
        gsap.fromTo(
          split.words,
          { color: "rgba(20,29,24,0.16)" },
          {
            color: "rgba(20,29,24,1)",
            stagger: 0.04,
            ease: "none",
            scrollTrigger: { trigger: "[data-ink]", start: "top 78%", end: "bottom 52%", scrub: 0.6 },
          },
        );

        // Parallax inside framed images.
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amt = Number(el.dataset.parallax);
          gsap.fromTo(
            el,
            { yPercent: -amt },
            {
              yPercent: amt,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // Count-up stats.
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: end,
            duration: 1.8,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => (el.textContent = Math.round(obj.v).toString()),
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-theme="light"
      aria-labelledby="intro-title"
      className="relative bg-cream pb-[clamp(80px,10vw,160px)] pt-[clamp(90px,12vw,190px)]"
    >
      <div className="shell">
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          <p data-reveal="fade" className="t-label flex items-start gap-2 text-moss lg:col-span-3 lg:pt-4">
            Why firms partner with us <span aria-hidden="true">↓</span>
          </p>
          <div className="lg:col-span-9">
            <h2 id="intro-title" className="sr-only">
              Capacity without headcount
            </h2>
            <p data-ink className="t-statement max-w-[24ch] text-ink">
              We are the outsourcing partner behind CPAs, accounting firms and bookkeeping firms — a dedicated
              team working inside your software, to your review standards, as an extension of your own.
            </p>
          </div>
        </div>

        {/* Asymmetric image composition */}
        <div className="mt-[clamp(64px,9vw,140px)] grid grid-cols-12 items-end gap-x-[var(--gutter)] gap-y-10">
          <figure className="col-span-8 col-start-1 sm:col-span-5 md:col-span-4 lg:col-span-3 lg:col-start-2">
            <div className="bg-stone/60 p-2.5 sm:p-3">
              <div data-reveal="image" className="relative aspect-[4/5] overflow-hidden">
                <div data-parallax="6" className="absolute -inset-y-[8%] inset-x-0">
                  <Image
                    src={images.introDetail.src}
                    alt={images.introDetail.alt}
                    fill
                    sizes="(min-width:1024px) 22vw, (min-width:640px) 40vw, 66vw"
                    className="grade object-cover"
                  />
                </div>
              </div>
            </div>
            <figcaption data-reveal="fade" className="mt-4 max-w-[30ch] text-[14px] leading-snug text-ink/60">
              Work returned the way you like it — in your software, to your review standards.
            </figcaption>
          </figure>

          <figure className="col-span-12 sm:col-span-7 md:col-span-8 lg:col-span-7 lg:col-start-6 lg:-mb-6">
            <div data-reveal="image" className="relative aspect-[16/11] overflow-hidden">
              <div data-parallax="7" className="absolute -inset-y-[9%] inset-x-0">
                <Image
                  src={images.introWide.src}
                  alt={images.introWide.alt}
                  fill
                  sizes="(min-width:1024px) 58vw, (min-width:640px) 60vw, 100vw"
                  className="grade object-cover"
                />
              </div>
            </div>
          </figure>
        </div>

        {/* Facts */}
        <dl className="mt-[clamp(80px,10vw,150px)] grid grid-cols-2 border-t border-ink/15 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-reveal="fade"
              data-delay={i * 0.08}
              className={`flex flex-col justify-between gap-10 border-ink/15 py-7 pr-4 sm:py-9 ${
                i % 2 === 1 ? "pl-4 sm:pl-6" : ""
              } ${i > 0 ? "lg:border-l lg:pl-6" : ""} ${i % 2 === 1 ? "border-l" : ""} ${i > 1 ? "max-lg:border-t" : ""}`}
            >
              <dt className="order-2 max-w-[18ch] text-[14px] leading-snug text-ink/60">{s.label}</dt>
              <dd className="order-1 text-[clamp(52px,6.4vw,112px)] leading-[0.85] tracking-[-0.06em] tabular-nums">
                {s.prefix}
                <span data-count={s.value}>{s.value}</span>
                <span className="text-moss">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
