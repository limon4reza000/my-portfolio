import type { Profile } from '@/lib/types';

type FooterProfile = Pick<Profile, 'name' | 'shortName' | 'role' | 'socials' | 'email'>;

export function Footer({ profile }: { profile: FooterProfile }) {
  // Links with an empty url are placeholders and stay hidden.
  const links = profile.socials.filter((l) => l.url);
  if (profile.email && !links.some((l) => l.url.startsWith('mailto:'))) {
    links.push({ label: 'Email', url: `mailto:${profile.email}` });
  }

  return (
    <footer className="relative overflow-hidden border-t border-hairline pt-16">
      <div className="container-x">
        <p
          aria-hidden
          className="select-none whitespace-nowrap text-center font-display font-semibold leading-[0.85] tracking-tightest text-ghost"
          style={{ fontSize: 'clamp(44px, 10.5vw, 120px)' }}
        >
          {profile.shortName}
        </p>

        <div className="mt-12 flex flex-col gap-8 border-t border-hairline py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-[16px] font-semibold">{profile.name}</p>
            <p className="mt-1 font-mono text-[12px] text-muted">{profile.role}</p>
          </div>

          {links.length > 0 && (
            <ul className="flex flex-wrap gap-x-5 gap-y-3">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.url}
                    target={l.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.06em] text-fg/80 transition-colors hover:text-lime"
                  >
                    {l.label}
                    <span className="text-lime transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <p className="font-mono text-[12px] text-muted">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
