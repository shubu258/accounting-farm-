import { Logo } from "@/components/ui/Logo";
import { contact, footerLinks } from "@/lib/content";

export function Footer() {
  return (
    <footer data-theme="dark" className="relative overflow-hidden bg-forest-950 text-paper">
      <div className="shell pb-8 pt-[clamp(70px,8vw,120px)]">
        <div className="grid gap-12 border-t border-paper/15 pt-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          <div className="lg:col-span-3">
            <Logo />
            <p className="mt-6 max-w-[30ch] text-[15px] leading-relaxed text-paper/60">
              Accounting capacity for CPA, accounting and bookkeeping firms in the USA, Canada, UK and Australia.
            </p>
            <div className="mt-8 space-y-1.5 text-[15px]">
              <a href={contact.phoneNAHref} className="link-line block w-fit tabular-nums">
                {contact.phoneNA} <span className="text-paper/45">· USA &amp; Canada</span>
              </a>
              <a href={contact.phoneINHref} className="link-line block w-fit tabular-nums">
                {contact.phoneIN} <span className="text-paper/45">· India</span>
              </a>
            </div>
          </div>

          <nav aria-label="Services" className="lg:col-span-2">
            <h2 className="t-label mb-5 text-paper/45">Services</h2>
            <ul className="space-y-2 text-[15px]">
              {footerLinks.services.map((s) => (
                <li key={s}>
                  <a href="#services" className="link-line">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="lg:col-span-2">
            <h2 className="t-label mb-5 text-paper/45">Company</h2>
            <ul className="space-y-2 text-[15px]">
              {footerLinks.company.map((s) => (
                <li key={s}>
                  <a href="#" className="link-line">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sm:col-span-2 lg:col-span-5">
            <h2 className="t-label mb-5 text-paper/45">Offices</h2>
            <ul className="grid gap-6 text-[14px] sm:grid-cols-3">
              {contact.offices.map((o) => (
                <li key={o.label}>
                  <p className="text-paper/45">{o.label}</p>
                  <address className="mt-1 not-italic leading-relaxed">
                    {o.lines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                    <span className="block">{o.country}</span>
                  </address>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="mt-[clamp(60px,8vw,120px)] select-none whitespace-nowrap text-[clamp(56px,13.4vw,232px)] leading-[0.8] tracking-[-0.065em] text-forest-800"
        >
          Accounting Farm
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-paper/15 pt-6 text-[13px] text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {2026} Accounting Farm. All rights reserved.</p>
          <ul className="flex flex-wrap gap-5">
            {contact.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="link-line hover:text-paper" rel="noopener noreferrer" target="_blank">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
