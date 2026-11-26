import type { Metadata, Viewport } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { contact } from "@/lib/content";

const host = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Accounting Farm — Accounting capacity for growing firms",
  description:
    "Outsourced bookkeeping, payroll, tax preparation and reporting for CPA, accounting and bookkeeping firms in the USA, Canada, UK and Australia. Dedicated teams, every file reviewed by a qualified accountant.",
  openGraph: {
    title: "Accounting Farm — Accounting capacity for growing firms, without another hire",
    description:
      "A dedicated outsourced accounting team for CPA, accounting and bookkeeping firms. Rates from $15 USD per hour.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08201a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  name: "Accounting Farm",
  url: "https://accountingfarm.info/",
  foundingDate: "2021",
  telephone: contact.phoneNA,
  areaServed: ["US", "CA", "GB", "AU"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "52 Teal Crest Circle",
    addressLocality: "Brampton",
    addressRegion: "ON",
    postalCode: "L6X 2Z5",
    addressCountry: "CA",
  },
  sameAs: contact.social.map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${host.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Mark JS as available before first paint so reveal targets don't flash. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-paper focus:px-5 focus:py-3 focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
