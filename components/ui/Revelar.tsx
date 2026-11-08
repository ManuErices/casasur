'use client';
import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/** Aparición suave al entrar en pantalla. Respeta "reducir movimiento" (ver globals.css). */
export function Revelar({ children, como: Etiqueta = 'div', retraso = 0, className = '', ...resto }: {
  children: ReactNode; como?: ElementType; retraso?: number; className?: string; id?: string; 'aria-labelledby'?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); io.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Etiqueta ref={ref} className={`revelar ${className}`} style={retraso ? { transitionDelay: `${retraso}ms` } : undefined} {...resto}>
      {children}
    </Etiqueta>
  );
}
