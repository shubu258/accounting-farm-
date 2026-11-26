"use client";

import type { RefObject } from "react";
import { gsap, SplitText, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * Reveals every [data-reveal] element inside `scope` when it scrolls into view.
 *   data-reveal="lines"  → masked line-by-line rise (headings)
 *   data-reveal="fade"   → soft rise + fade (copy, small blocks)
 *   data-reveal="image"  → clip-path wipe upwards (framed images)
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope.current);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        els.forEach((el) => {
          const kind = el.dataset.reveal;
          const delay = Number(el.dataset.delay ?? 0);
          gsap.set(el, { visibility: "visible" });
          const st = { trigger: el, start: "top 88%", once: true } as ScrollTrigger.Vars;

          if (kind === "lines") {
            const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "line-mask" });
            gsap.from(split.lines, {
              yPercent: 105,
              duration: 1.15,
              stagger: 0.08,
              delay,
              ease: "expo.out",
              scrollTrigger: st,
            });
          } else if (kind === "image") {
            gsap.fromTo(
              el,
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, delay, ease: "expo.inOut", scrollTrigger: st },
            );
          } else {
            gsap.from(el, { y: 28, autoAlpha: 0, duration: 1.1, delay, ease: "expo.out", scrollTrigger: st });
          }
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(els, { visibility: "visible" });
      });
    },
    { scope },
  );
}
