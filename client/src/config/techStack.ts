/**
 * Tech stack shown in the "Toolkit" card (About section).
 *
 * ✏️  This is the ONLY place to edit your technologies, skill levels and percentages.
 *     Change a number, add or remove an entry, save, and the cards update automatically.
 *
 * Fields:
 *  - name         Display name.
 *  - description  Short line under the name.
 *  - icon         simple-icons slug for the official logo (https://simpleicons.org), e.g. "nextdotjs".
 *  - abbr         Fallback monogram if no logo exists for the slug.
 *  - level        Optional. Shown only if set (e.g. "Advanced").
 *  - percentage   Optional, 0–100. Shown with a segmented progress bar only if set.
 *                 Leave it out and the card shows no percentage and no bar.
 */
export interface TechItem {
  name: string;
  description: string;
  icon: string;
  abbr: string;
  level?: string;
  percentage?: number;
}

export const techStack: TechItem[] = [
  { name: 'React', description: 'Component-based UI', icon: 'react', abbr: 'Re', level: 'Advanced', percentage: 80 },
  { name: 'Next.js', description: 'Full-stack React apps', icon: 'nextdotjs', abbr: 'Nx', level: 'Intermediate', percentage: 55 },
  { name: 'TypeScript', description: 'Typed, safer code', icon: 'typescript', abbr: 'Ts', percentage: 70 },
  { name: 'Node.js', description: 'Server-side JavaScript', icon: 'nodedotjs', abbr: 'No', percentage: 70 },
  { name: 'Express.js', description: 'REST APIs', icon: 'express', abbr: 'Ex' },
  { name: 'PostgreSQL', description: 'Relational database', icon: 'postgresql', abbr: 'Pg', percentage: 65 },
  { name: 'JavaScript', description: 'Core language of the web', icon: 'javascript', abbr: 'Js', percentage: 85 },
  { name: 'Tailwind CSS', description: 'Utility-first styling', icon: 'tailwindcss', abbr: 'Tw', percentage: 85 },
];
