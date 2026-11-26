/**
 * All copy and facts below are sourced from the current Accounting Farm website
 * (accountingfarm.info — homepage, /cpa-accounting-firms/, /about/, /services/, /contact/).
 * Do not add statistics, testimonials or certifications that are not on the live site.
 */

const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const nav = [
  { label: "Services", href: "#services" },
  { label: "How we work", href: "#process" },
  { label: "Human + AI", href: "#approach" },
  { label: "Technology", href: "#technology" },
  { label: "Security", href: "#security" },
];

export const contact = {
  phoneNA: "+1 437-232-5222",
  phoneNAHref: "tel:+14372325222",
  phoneIN: "+91 94290 68636",
  phoneINHref: "tel:+919429068636",
  reply: "We reply within 1 business day.",
  page: "https://accountingfarm.info/contact/",
  offices: [
    {
      label: "Head office",
      country: "Canada",
      lines: ["52 Teal Crest Circle", "Brampton, ON L6X 2Z5"],
    },
    {
      label: "Branch office",
      country: "United States",
      lines: ["4498 Main St, Suite 4 #1549", "Buffalo, NY 14226"],
    },
    {
      label: "Delivery centre",
      country: "India",
      lines: ["A/1338-39 Sunwest Bank, Ashram Road", "Ahmedabad 380009"],
    },
  ],
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/accounting-farm" },
    { label: "Instagram", href: "https://www.instagram.com/accounting__farm" },
    { label: "Facebook", href: "https://www.facebook.com/outsourcingaccountingfirm" },
    { label: "YouTube", href: "https://www.youtube.com/channel/UC-h5JMNsL7zTE_PELy2abFA" },
  ],
};

export const markets = ["USA", "Canada", "UK", "Australia"];

export const stats = [
  { value: 10, prefix: "", suffix: "+", label: "Years of industry experience" },
  { value: 50, prefix: "", suffix: "+", label: "Accounting professionals" },
  { value: 100, prefix: "", suffix: "+", label: "Firms supported" },
  { value: 15, prefix: "$", suffix: "", label: "Hourly rates starting from (USD)" },
];

export const images = {
  introWide: { src: u("1497215728101-856f4ea42174"), alt: "A bright, quiet office with a laptop set up by the window" },
  introDetail: { src: u("1434030216411-0b793f4b4173"), alt: "An accountant making notes by hand beside a cup of coffee" },
  security: { src: u("1497366412874-3415097a27e7"), alt: "A glass-walled office corridor with controlled access" },
  cta: { src: u("1486406146926-c627a92ad1ab"), alt: "Looking up between glass office towers" },
};

export const services = [
  {
    name: "Bookkeeping",
    line: "Dedicated bookkeepers who extend your firm's team.",
    image: { src: u("1554224155-6726b3ff858f"), alt: "Receipts, a calculator and tax forms being sorted by hand" },
  },
  {
    name: "Accounts payable",
    line: "Invoice processing, approvals, vendor management and compliance.",
    image: { src: u("1450101499163-c8848c66ca85"), alt: "A hand signing a document at a desk" },
  },
  {
    name: "Accounts receivable",
    line: "From invoicing through to follow-up on outstanding balances.",
    image: { src: u("1563013544-824ae1b704d3"), alt: "A card payment being entered on a laptop" },
  },
  {
    name: "Tax preparation",
    line: "Returns prepared by staff who track tax law in the markets you serve.",
    image: { src: u("1586486855514-8c633cc6fd38"), alt: "A printed tax statement beside a notebook and pen" },
  },
  {
    name: "Payroll processing",
    line: "Compliant runs across four countries, with regulatory changes tracked.",
    image: { src: u("1517245386807-bb43f82c33c4"), alt: "Colleagues discussing work around a laptop" },
  },
  {
    name: "Bank reconciliation",
    line: "Discrepancies resolved until every transaction is accounted for.",
    image: { src: u("1554224154-26032ffc0d07"), alt: "Bank statements, a calculator and coffee on a dark desk" },
  },
  {
    name: "Financial reporting",
    line: "KPIs, profitability analysis and cash flow projections.",
    image: { src: u("1460925895917-afdab827c52f"), alt: "A laptop showing a financial dashboard" },
  },
  {
    name: "Software migration",
    line: "Off legacy software and spreadsheets, with training for your team.",
    image: { src: u("1504868584819-f8e8b4b6d7e3"), alt: "A laptop displaying reports and charts" },
  },
];

export const process = [
  {
    name: "Understand",
    body: "We learn your software, client mix, review standards and how you like work returned.",
    image: { src: u("1551836022-d5d88e9218df"), alt: "Two colleagues talking through requirements at a laptop" },
  },
  {
    name: "Organise",
    body: "Scope, schedule and conventions are agreed in writing. A dedicated team is assigned.",
    image: { src: u("1454165804606-c3d57bc86b40"), alt: "Scope notes and laptops laid out during a planning session" },
  },
  {
    name: "Manage",
    body: "Work runs on the agreed schedule, with regular updates through your preferred channel.",
    image: { src: u("1517048676732-d65bc937f952"), alt: "A team working through files together at a long table" },
  },
  {
    name: "Grow",
    body: "As your client base grows, we scale the team with it. No recruitment on your side.",
    image: { src: u("1531973576160-7125cd663d86"), alt: "A large open-plan office with teams at work" },
  },
];

export type StageKind = "person" | "automation" | "stack";

export const approach = {
  title: "Automation where it helps, accountants where it matters.",
  intro:
    "You decide how much automation is used on your clients' files, and every file is reviewed by a qualified accountant.",
  badge: { title: "CAIRA Certified · Level 3", sub: "Certified AI Ready Accountants" },
  stages: ["Data capture", "Categorisation", "Reconciliation & prep", "Accountant review"],
  modes: [
    {
      key: "human",
      label: "Human-led",
      title: "Your dedicated accountants",
      body: "Work is prepared by hand by your dedicated team. No new tools to learn.",
      kinds: ["person", "person", "person", "person"] as StageKind[],
    },
    {
      key: "ai",
      label: "AI-assisted",
      title: "Automation, checked by people",
      body: "Our AI-certified accountants use approved tools for repetitive steps like data capture and categorisation.",
      kinds: ["automation", "automation", "person", "person"] as StageKind[],
    },
    {
      key: "stack",
      label: "Your stack",
      title: "Inside the tools you already use",
      body: "We work within your setup, such as Hubdoc, Xero or QuickBooks rules.",
      kinds: ["stack", "stack", "person", "person"] as StageKind[],
    },
  ],
};

export const technology = [
  {
    group: "Accounting",
    items: ["QuickBooks", "Xero", "Sage", "Zoho Books", "MYOB", "NetSuite", "Reckon", "Wave"],
  },
  { group: "Documents & bank feeds", items: ["Hubdoc", "BankLink"] },
  {
    group: "Payroll & HR",
    items: ["RUN by ADP", "ADP", "Paychex", "Sage Payroll", "Workday", "UltiPro", "Kronos", "BambooHR"],
  },
  { group: "Tax", items: ["Intuit ProConnect", "TurboTax", "TaxAct", "TaxSlayer"] },
  { group: "SMSF", items: ["Simple Fund 360", "BGL 360"] },
];

export const certified = ["QuickBooks", "Xero"];

export const security = [
  { title: "NDA signed day one", body: "Confidentiality is agreed before any client file changes hands." },
  { title: "Encrypted transfers", body: "Files move through encrypted, access-controlled channels." },
  { title: "Restricted access", body: "Your files are visible only to the team assigned to your firm." },
  { title: "24/7 CCTV", body: "Monitored facilities at both delivery centres, around the clock." },
  { title: "Biometric entry", body: "Entry to our facilities is controlled biometrically." },
  { title: "No personal devices", body: "Personal devices stay out of the workspace." },
  { title: "Removable media disabled", body: "USB ports and removable devices are disabled on all workstations." },
];

export const testimonials = [
  { quote: "Always delivered promptly, communication was excellent.", name: "Matthew", meta: "SMSF · Australia" },
  { quote: "Consistently responsive, dedicated, and easy to work with.", name: "Ramana Atmakuru", meta: "Client" },
  { quote: "She gets the job done.", name: "Rachael", meta: "Queensland · Australia" },
];

export const onboarding = [
  { when: "30 mins", what: "Discovery call" },
  { when: "2–3 days", what: "Manager assigned" },
  { when: "3 days", what: "Free trial" },
  { when: "1 week", what: "Onboarding" },
];

export const footerLinks = {
  services: services.map((s) => s.name),
  company: ["About us", "Our team", "CPA & accounting firms", "Events", "Blog", "FAQ", "Contact"],
};
