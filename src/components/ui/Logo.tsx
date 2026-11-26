/** Wordmark: a ledger mark — three rising columns on a ruled baseline. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <rect x="0.75" y="0.75" width="24.5" height="24.5" rx="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6.5 19.5h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8.5 19.5v-4M13 19.5v-7.5M17.5 19.5V7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span className="text-[17px] font-medium tracking-[-0.03em]">Accounting Farm</span>
    </span>
  );
}
