"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { nav, contact } from "@/lib/content";

/**
 * Sections declare data-theme="dark" | "light". The header samples whichever section
 * sits under it and switches ink accordingly; it tucks away on scroll-down, returns on scroll-up.
 */
export function Header() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-theme]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setTheme((en.target as HTMLElement).dataset.theme as "dark" | "light");
        });
      },
      { rootMargin: "-38px 0px -96% 0px" },
    );
    sections.forEach((s) => io.observe(s));

    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(y > lastY.current && y > window.innerHeight * 0.6);
        lastY.current = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const dark = theme === "dark" && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,color] duration-700 ease-[var(--ease-out-expo)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${dark ? "text-paper" : "text-ink"}`}
      >
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-500 ${
            solid && !open ? "opacity-100" : "opacity-0"
          } ${dark ? "bg-forest-950/70" : "bg-cream/80"} backdrop-blur-md`}
        />
        <div className="shell relative flex h-[var(--header-h)] items-center justify-between gap-6">
          <a href="#top" aria-label="Accounting Farm — home" className="relative z-10">
            <Logo />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 text-[14px] tracking-[-0.01em]">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group relative block rounded-full px-4 py-2 transition-colors duration-300"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 scale-90 rounded-full opacity-0 transition duration-500 ease-[var(--ease-out-expo)] group-hover:scale-100 group-hover:opacity-100 ${
                        dark ? "bg-paper/10" : "bg-ink/[0.06]"
                      }`}
                    />
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-3">
            <a
              href={contact.phoneNAHref}
              className="link-line hidden text-[14px] tabular-nums xl:inline"
            >
              {contact.phoneNA}
            </a>
            <div className="hidden sm:block">
              <Button href="#contact" variant={dark ? "sprout" : "dark"} className="!h-11 !text-[14px]">
                Book a call
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative grid h-11 w-11 place-items-center rounded-full lg:hidden"
              style={{ boxShadow: "inset 0 0 0 1px color-mix(in oklab, currentColor 30%, transparent)" }}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span
                aria-hidden="true"
                className={`absolute h-px w-4 bg-current transition duration-500 ${open ? "rotate-45" : "-translate-y-[3px]"}`}
              />
              <span
                aria-hidden="true"
                className={`absolute h-px w-4 bg-current transition duration-500 ${open ? "-rotate-45" : "translate-y-[3px]"}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-cream text-ink transition-[clip-path] duration-700 ease-[var(--ease-in-out-quart)] lg:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="shell flex h-full flex-col justify-between pb-10 pt-[calc(var(--header-h)+32px)]">
          <ul className="space-y-1">
            {nav.map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block py-1 text-[44px] leading-[1.05] tracking-[-0.045em] transition duration-700 ease-[var(--ease-out-expo)] ${
                    open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="space-y-6">
            <Button href="#contact" variant="dark">
              Book a discovery call
            </Button>
            <div className="flex flex-col gap-1 text-[15px] text-ink/70">
              <a href={contact.phoneNAHref}>{contact.phoneNA} · USA &amp; Canada</a>
              <a href={contact.phoneINHref}>{contact.phoneIN} · India</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
