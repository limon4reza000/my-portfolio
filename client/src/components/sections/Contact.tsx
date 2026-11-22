import type { Profile } from '@/lib/types';
import { cn } from '@/lib/utils';
import { BandMarquee } from '../ui/BandMarquee';
import { Reveal } from '../ui/Reveal';
import { Text } from '../ui/Text';
import { ContactForm } from './ContactForm';

const STEPS = [
  { title: 'Send a message', text: 'Your idea, opportunity or question.' },
  { title: 'Talk it through', text: 'A short call or a few messages to align.' },
  { title: 'Start building', text: 'We agree on next steps and get going.' },
];

export function Contact({ profile }: { profile: Profile }) {
  return (
    <section id="contact" className="pt-4 md:pt-6">
      <BandMarquee text="Let’s build something great together" reverse duration={52} />

      <div className="container-x section grid gap-10 pt-12 md:pt-16 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <h2 className="h-section-lg">Let’s build something great together.</h2>
            <p className="lede mt-5 max-w-[440px]">
              Have a project, a role or an idea to discuss? Send me a message. I read every one myself and reply with next steps.
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10">
            <p className="font-mono text-[11px] uppercase tracking-label text-muted">What happens next</p>
            <ol className="mt-5 flex flex-col gap-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative flex gap-4">
                  {/* Connector: from the bottom of this circle down to the next one */}
                  {i < STEPS.length - 1 && (
                    <span aria-hidden className="absolute -bottom-5 left-[17.5px] top-9 w-px bg-gradient-to-b from-lime/70 to-lime/25" />
                  )}
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-ink font-mono text-[12px] text-lime">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block font-display text-[17px] font-medium">{s.title}</span>
                    <span className="block text-[14px] text-muted">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={160} className="mt-10 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
            <span className={cn('dot', profile.available ? 'animate-pulse-dot bg-lime' : 'bg-danger')} />
            <span className="text-fg">{profile.statusText}</span>
            <span>
              · <Text>{profile.location}</Text>
            </span>
          </Reveal>
          {profile.email && (
            <Reveal delay={200} className="mt-4">
              <a href={`mailto:${profile.email}`} className="font-mono text-[13px] text-lime hover:underline">
                {profile.email}
              </a>
            </Reveal>
          )}
        </div>

        <Reveal delay={80} className="card relative p-6 md:p-8">
          <div className="mb-6 flex items-baseline justify-between border-b border-hairline pb-5">
            <p className="font-display text-[20px] font-medium">Send a message</p>
          </div>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
