"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useReveal } from "@/components/ui/useReveal";
import { approach, type StageKind } from "@/lib/content";

const kindCopy: Record<StageKind, { who: string; note: string }> = {
  person: { who: "Accountant", note: "Prepared by your dedicated team" },
  automation: { who: "Approved automation", note: "Run by AI-certified accountants, then checked" },
  stack: { who: "Your rules", note: "Hubdoc, Xero or QuickBooks rules you already use" },
};

function Marker({ kind, always }: { kind: StageKind; always?: boolean }) {
  return (
    <span className="relative grid h-12 w-12 place-items-center" aria-hidden="true">
      {/* person: solid disc */}
      <span
        className={`absolute inset-0 rounded-full bg-forest-800 transition duration-700 ease-[var(--ease-out-expo)] ${
          kind === "person" ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      />
      {/* automation: ring with lime core */}
      <span
        className={`absolute inset-0 rounded-full border border-forest-800 transition duration-700 ease-[var(--ease-out-expo)] ${
          kind === "automation" ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <span className="absolute inset-[30%] rounded-full bg-sprout ring-1 ring-forest-800" />
      </span>
      {/* stack: clay square */}
      <span
        className={`absolute inset-[18%] rounded-[3px] bg-clay transition duration-700 ease-[var(--ease-out-expo)] ${
          kind === "stack" ? "rotate-0 scale-100 opacity-100" : "rotate-45 scale-50 opacity-0"
        }`}
      />
      {always && <span className="absolute -inset-1.5 rounded-full border border-dashed border-forest-800/40" />}
    </span>
  );
}

export function HumanAI() {
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  useReveal(root);

  const current = approach.modes[mode];

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = approach.modes.length;
    const next = (mode + (e.key === "ArrowRight" ? 1 : -1) + n) % n;
    setMode(next);
    tabs.current[next]?.focus();
  };

  return (
    <section
      ref={root}
      id="approach"
      data-theme="light"
      aria-labelledby="approach-title"
      className="relative overflow-hidden bg-sage-100 py-[clamp(90px,11vw,180px)]"
    >
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          <p data-reveal="fade" className="t-label flex gap-2 text-forest-700 lg:col-span-3 lg:pt-4">
            AI + Human · Your choice <span aria-hidden="true">↓</span>
          </p>
          <h2 id="approach-title" data-reveal="lines" className="t-display max-w-[16ch] lg:col-span-9">
            {approach.title}
          </h2>
        </div>

        <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          <p data-reveal="fade" className="t-lead max-w-[44ch] text-ink/70 lg:col-span-5 lg:col-start-4">
            {approach.intro}
          </p>
          <div data-reveal="fade" className="flex items-center gap-4 lg:col-span-4 lg:justify-end">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-forest-800 text-[11px] font-medium tracking-[0.04em] text-forest-800">
              L3
            </span>
            <span className="text-[14px] leading-snug">
              <span className="block font-medium">{approach.badge.title}</span>
              <span className="text-ink/60">{approach.badge.sub}</span>
            </span>
          </div>
        </div>

        {/* Mode selector */}
        <div
          data-reveal="fade"
          role="tablist"
          aria-label="Choose a working model"
          onKeyDown={onKey}
          className="relative mt-[clamp(56px,7vw,110px)] grid grid-cols-3 border-y border-ink/20"
        >
          <span
            aria-hidden="true"
            className="absolute bottom-[-1px] left-0 h-[3px] w-1/3 bg-forest-800 transition-transform duration-700 ease-[var(--ease-out-expo)]"
            style={{ transform: `translateX(${mode * 100}%)` }}
          />
          {approach.modes.map((m, i) => (
            <button
              key={m.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`mode-tab-${m.key}`}
              aria-selected={i === mode}
              aria-controls="mode-panel"
              tabIndex={i === mode ? 0 : -1}
              onClick={() => setMode(i)}
              className={`group py-5 text-left transition-colors duration-500 sm:py-7 ${i > 0 ? "border-l border-ink/20 pl-3 sm:pl-6" : "pr-3"}`}
            >
              <span
                className={`block text-[clamp(20px,2.4vw,40px)] leading-none tracking-[-0.04em] transition-colors duration-500 ${
                  i === mode ? "text-ink" : "text-ink/35 group-hover:text-ink/60"
                }`}
              >
                {m.label}
              </span>
              <span className="mt-2 hidden text-[14px] text-ink/55 sm:block">{m.title}</span>
            </button>
          ))}
        </div>

        {/* Workflow */}
        <div
          id="mode-panel"
          role="tabpanel"
          aria-labelledby={`mode-tab-${current.key}`}
          className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-x-[var(--gutter)]"
        >
          <div className="lg:col-span-4">
            <p key={current.key} className="text-[clamp(24px,2.3vw,36px)] leading-[1.12] tracking-[-0.03em] [animation:fade-up_.8s_var(--ease-out-expo)_both]">
              {current.body}
            </p>
          </div>

          <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-4 sm:gap-0 lg:col-span-8" aria-label="How a file moves through your team">
            {/* rail */}
            <span aria-hidden="true" className="absolute left-6 top-6 hidden h-px w-[calc(100%-48px)] bg-ink/20 sm:block">
              <span className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-forest-800 [animation:travel_5.5s_linear_infinite]" />
            </span>
            <span aria-hidden="true" className="absolute bottom-6 left-6 top-6 w-px bg-ink/20 sm:hidden" />
            {approach.stages.map((stage, i) => {
              const kind = current.kinds[i];
              const isReview = i === approach.stages.length - 1;
              return (
                <li key={stage} className="relative flex gap-5 sm:block sm:pr-4">
                  <Marker kind={kind} always={isReview} />
                  <div className="sm:mt-6">
                    <p className="text-[12px] tabular-nums text-ink/45">{String(i + 1).padStart(2, "0")}</p>
                    <p className="mt-1 text-[19px] leading-tight tracking-[-0.02em]">{stage}</p>
                    <p key={`${current.key}-${i}`} className="mt-3 text-[14px] leading-snug [animation:fade-up_.7s_var(--ease-out-expo)_both]" style={{ animationDelay: `${i * 70}ms` }}>
                      <span className="block font-medium">{isReview ? "Qualified accountant" : kindCopy[kind].who}</span>
                      <span className="text-ink/55">{isReview ? "Every file, in every model" : kindCopy[kind].note}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/15 pt-6 text-[13px] text-ink/55">
          {(["person", "automation", "stack"] as StageKind[]).map((k) => (
            <li key={k} className="flex items-center gap-2.5">
              <span className="scale-[0.42] -m-3.5"><Marker kind={k} /></span>
              {kindCopy[k].who}
            </li>
          ))}
          <li className="sm:ml-auto">Illustrative workflow — scope is agreed with each firm.</li>
        </ul>
      </div>
    </section>
  );
}
