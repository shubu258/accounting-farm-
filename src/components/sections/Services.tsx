"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useReveal } from "@/components/ui/useReveal";
import { Arrow } from "@/components/ui/Button";
import { services } from "@/lib/content";

export function Services() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(0);
  useReveal(root);

  const select = (i: number) => {
    if (i === active) return;
    setPrev(active);
    setActive(i);
  };

  return (
    <section
      ref={root}
      id="services"
      data-theme="light"
      aria-labelledby="services-title"
      className="relative bg-paper py-[clamp(90px,11vw,180px)]"
    >
      <div className="shell">
        <header className="mb-[clamp(48px,7vw,110px)] grid gap-8 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          <p data-reveal="fade" className="t-label flex gap-2 text-moss lg:col-span-3 lg:pt-4">
            Services <span aria-hidden="true">↓</span>
          </p>
          <h2 id="services-title" data-reveal="lines" className="t-display max-w-[14ch] lg:col-span-6">
            Eight services. One dedicated team.
          </h2>
          <p data-reveal="fade" className="max-w-[34ch] self-end text-[16px] leading-relaxed text-ink/65 lg:col-span-3">
            Pick one service or the whole back office. Your team works in your software and to your review
            standards.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          {/* Index */}
          <ol className="border-t border-ink lg:col-span-7" aria-label="Services">
            {services.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.name} className="border-b border-ink/15">
                  <button
                    type="button"
                    onPointerEnter={(e) => e.pointerType === "mouse" && select(i)}
                    onFocus={() => select(i)}
                    onClick={() => select(i)}
                    aria-expanded={on}
                    aria-controls={`svc-${i}`}
                    className="group grid w-full grid-cols-[44px_1fr_auto] items-baseline gap-x-3 py-5 text-left sm:grid-cols-[64px_1fr_auto] sm:py-6 lg:py-7"
                  >
                    <span className={`text-[13px] tabular-nums transition-colors duration-500 ${on ? "text-clay" : "text-mute"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-[clamp(30px,3.5vw,60px)] leading-[1] tracking-[-0.04em] transition-[color,transform] duration-700 ease-[var(--ease-out-expo)] ${
                        on ? "translate-x-0 text-ink lg:translate-x-3" : "text-mute group-hover:text-ink/70"
                      }`}
                    >
                      {s.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid h-10 w-10 place-items-center self-center rounded-full transition duration-700 ease-[var(--ease-out-expo)] ${
                        on ? "rotate-0 bg-forest-800 text-sprout" : "-rotate-45 text-mute"
                      }`}
                    >
                      <Arrow />
                    </span>
                  </button>
                  <div
                    id={`svc-${i}`}
                    className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)] lg:hidden ${
                      on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="grid gap-5 pb-7 pl-[47px] sm:pl-[67px] lg:pl-[79px]">
                        <p className="max-w-[44ch] text-[16px] leading-relaxed text-ink/70 sm:text-[17px]">{s.line}</p>
                        {/* Image inline on small screens */}
                        <div className="relative aspect-[4/3] overflow-hidden lg:hidden">
                          <Image
                            src={s.image.src}
                            alt={s.image.alt}
                            fill
                            sizes="90vw"
                            className="grade object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Sticky viewer */}
          <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <div className="sticky top-[calc(var(--header-h)+24px)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-stone/50">
                {services.map((s, i) => {
                  const state = i === active ? "on" : i === prev ? "prev" : "off";
                  return (
                    <div
                      key={s.name}
                      className="absolute inset-0"
                      style={{
                        zIndex: state === "on" ? 2 : state === "prev" ? 1 : 0,
                        clipPath: state === "off" ? "inset(100% 0 0 0)" : "inset(0% 0 0 0)",
                        transition: state === "on" ? "clip-path 1.1s cubic-bezier(.76,0,.24,1)" : "none",
                      }}
                    >
                      <Image
                        src={s.image.src}
                        alt=""
                        fill
                        sizes="30vw"
                        className="grade object-cover"
                        style={{
                          transform: state === "on" ? "scale(1)" : "scale(1.12)",
                          transition: state === "on" ? "transform 1.6s cubic-bezier(.16,1,.3,1)" : "none",
                        }}
                      />
                    </div>
                  );
                })}
                <span className="absolute left-4 top-4 z-10 rounded-full bg-paper/90 px-3 py-1.5 text-[12px] tabular-nums text-ink backdrop-blur">
                  {String(active + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-6 grid gap-4" aria-live="polite">
                <p key={active} className="min-h-[3em] max-w-[36ch] text-[17px] leading-snug tracking-[-0.01em] [animation:fade-up_.7s_var(--ease-out-expo)_both]">
                  {services[active].line}
                </p>
                <a href="#contact" className="link-line w-fit text-[15px] text-ink/70 hover:text-ink">
                  Discuss your scope →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
