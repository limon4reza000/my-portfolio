import Link from 'next/link';
import type { Service } from '@/lib/types';
import { Reveal } from '../ui/Reveal';

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="section border-t border-hairline">
      <div className="container-x">
        <Reveal className="mb-10 flex items-end justify-between gap-6 md:mb-14">
          <div>
            <p className="eyebrow mb-4">Services</p>
            <h2 className="h-section">What I Build</h2>
          </div>
          <Link href="/#contact" className="hidden font-mono text-[12px] uppercase tracking-[0.06em] text-muted hover:text-lime sm:inline">
            Get in Touch →
          </Link>
        </Reveal>

        <ul className="border-t border-line">
          {services.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 60}>
              <Link
                href="/#contact"
                className="group grid grid-cols-[40px_1fr] items-baseline gap-x-4 gap-y-2 border-b border-line py-7 transition-colors hover:bg-white/[0.02] md:grid-cols-[80px_1fr_1fr_32px] md:items-center md:py-9"
              >
                <span className="font-mono text-[12px] text-lime">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-[26px] font-medium leading-tight tracking-tight2 transition-transform duration-300 group-hover:translate-x-2 md:text-[32px] lg:text-[36px]">
                  {s.title}
                </span>
                <span className="col-start-2 text-[16px] text-muted md:col-start-auto">{s.description}</span>
                <span
                  aria-hidden
                  className="hidden h-8 w-8 items-center justify-center rounded-full border border-line text-lime opacity-0 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100 md:flex"
                >
                  ↑
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
