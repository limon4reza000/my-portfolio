'use client';

import { useState } from 'react';
import type { Faq as FaqItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Reveal } from '../ui/Reveal';
import { Text } from '../ui/Text';

export function Faq({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="section border-t border-hairline pb-10 md:pb-14">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <h2 className="h-section">Frequently Asked Questions</h2>
          <p className="lede mt-4">Answers to common questions about working together.</p>
        </Reveal>

        <ul className="border-t border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const id = `faq-${f.id}`;
            return (
              <Reveal as="li" key={f.id} delay={i * 60} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className={cn('font-display text-[18px] font-medium tracking-tight2 transition-colors md:text-[22px]', isOpen ? 'text-lime' : 'group-hover:text-lime')}>
                      {f.question}
                    </span>
                    <span
                      aria-hidden
                      className={cn('font-mono text-[26px] leading-none text-lime transition-transform duration-300', isOpen && 'rotate-45')}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={id}
                  role="region"
                  className={cn('grid transition-[grid-template-rows] duration-300 ease-out', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[560px] pb-6 text-[16px] leading-relaxed text-muted"><Text>{f.answer}</Text>
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
