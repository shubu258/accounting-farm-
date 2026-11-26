"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "dark" | "light" | "sprout" | "ghost";
  magnetic?: boolean;
  className?: string;
};

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 7h11.5M8 2.5 12.5 7 8 11.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Pill button with a rolling label and an arrow chip. Optional magnetic pull on fine pointers. */
export function Button({ href, children, variant = "dark", magnetic = false, className = "" }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!magnetic || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.3;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform .7s cubic-bezier(.16,1,.3,1)";
    el.style.transform = "";
    window.setTimeout(() => el && (el.style.transition = ""), 700);
  };

  const v = variant === "dark" ? "" : `btn--${variant}`;
  const label = typeof children === "string" ? children : undefined;

  return (
    <a
      ref={ref}
      href={href}
      className={`btn ${v} ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={label}
    >
      <span className="btn-roll" aria-hidden={label ? true : undefined}>
        <span>{children}</span>
        <span>{children}</span>
      </span>
      {variant !== "ghost" && (
        <span className="btn-chip" aria-hidden="true">
          <Arrow />
        </span>
      )}
    </a>
  );
}
