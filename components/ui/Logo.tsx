import { MARCA } from '@/lib/config';

/** Isotipo: techo a un agua (como el modelo Ranco) sobre la línea del horizonte del sur. */
export function Isotipo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="currentColor" />
      <path d="M9 19.5 27.5 12l3.5 1.6" fill="none" stroke="#F7F3EC" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 18.4V29h16V13.8" fill="none" stroke="#F7F3EC" strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="18.2" y="21.5" width="3.6" height="7.5" rx=".6" fill="#CE5A3F" />
    </svg>
  );
}

export function Logo({ claro = false, className = '' }: { claro?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Isotipo className={`h-9 w-9 ${claro ? 'text-white/15' : 'text-bosque'}`} />
      <span className={`font-display text-[1.6rem] leading-none tracking-tight ${claro ? 'text-white' : 'text-bosque-900'}`}>
        {MARCA}
      </span>
    </span>
  );
}
