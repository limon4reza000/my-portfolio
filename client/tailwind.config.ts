import type { Config } from 'tailwindcss';

// Design tokens taken from the reference site.
const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '810px', // tablet (reference breakpoint)
      laptop: '1024px', // full hero layout on laptops
      lg: '1200px', // desktop (reference breakpoint)
    },
    extend: {
      colors: {
        ink: '#090d0f', // page background
        panel: '#101619', // deep surface
        card: '#151d21', // card surface
        raised: '#202a31', // raised surface / hover
        line: '#283238', // borders
        hairline: 'rgba(244,245,242,0.07)',
        fg: '#f4f5f2', // primary text
        muted: '#929b9f', // secondary text
        lime: '#b7f36b', // accent
        ghost: '#313f48', // giant footer type
        danger: '#f05252',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      maxWidth: { container: '1120px' },
      letterSpacing: {
        tightest: '-0.05em',
        tighter2: '-0.045em',
        tight3: '-0.035em',
        tight2: '-0.025em',
        label: '0.08em',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        pulseDot: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(183,243,107,0.45)' },
          '50%': { boxShadow: '0 0 0 6px rgba(183,243,107,0)' },
        },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'fade-in': 'fadeIn .2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
