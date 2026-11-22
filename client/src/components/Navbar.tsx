'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Profile } from '@/lib/types';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/#services' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

type NavProfile = Pick<Profile, 'name' | 'showProjects'>;

/** Sticky nav: logo + links in one centred row on every screen size, like the reference. */
export function Navbar({ profile }: { profile: NavProfile }) {
  const pathname = usePathname();

  // "Work" only appears once the Selected Projects section is enabled.
  const links = LINKS.filter((l) => l.href !== '/work' || profile.showProjects);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-[rgba(9,13,15,0.85)] backdrop-blur-xl">
      <nav className="relative mx-auto flex h-[54px] max-w-container items-center justify-center gap-4 px-4 sm:gap-6 md:gap-7 md:px-5">
        {/*
          Monogram logo: "LR" traced from DejaVu Sans Bold (free font, Bitstream Vera licence)
          and laid out with the reference logo's geometry (512 canvas: letter cap-height
          y 109–377, R box 238px wide, 36px gap, same scale for both letters). Stored as a
          vector path, so it renders identically everywhere without loading a font.
          Shown at 34×34 like the reference. Change the initials? Regenerate the path.
        */}
        <Link
          href="/"
          aria-label={`${profile.name} — home`}
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
        >
          <svg viewBox="0 0 512 512" width="34" height="34" aria-hidden className="block">
            <path fill="#8FFF00" d="M25.34 377L25.34 109L93.31 109L93.31 324.76L212.66 324.76L212.66 377L25.34 377ZM316.64 227.83L345.24 227.83Q366.6 227.83 375.87 219.75Q385.14 211.68 385.14 193.19L385.14 193.19Q385.14 174.88 375.87 166.98Q366.6 159.08 345.24 159.08L345.24 159.08L316.64 159.08L316.64 227.83ZM335.88 275.58L316.64 275.58L316.64 377L248.66 377L248.66 109L352.48 109Q404.56 109 428.84 126.77Q453.12 144.54 453.12 182.96L453.12 182.96Q453.12 209.52 440.49 226.58Q427.87 243.63 402.45 251.71L402.45 251.71Q416.39 254.94 427.43 266.34Q438.46 277.73 449.76 300.89L449.76 300.89L486.66 377L414.28 377L382.14 310.4Q372.43 290.3 362.46 282.94Q352.48 275.58 335.88 275.58L335.88 275.58Z" />
          </svg>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6 md:gap-7">
          {links.map((l) => {
            const active = l.href === '/work' && pathname.startsWith('/work');
            return (
              <Link
                key={l.label}
                href={l.href}
                className={cn('text-[13px] font-medium transition-colors md:text-[14px]', active ? 'text-fg' : 'text-fg/75 hover:text-fg')}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

      </nav>

    </header>
  );
}
