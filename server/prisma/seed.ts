/**
 * Portfolio content for Limon Reza.
 *
 * ✏️  EDIT THIS FILE, then run `npm run db:seed` (from /server).
 *     Re-seeding replaces all portfolio content; contact messages are kept.
 *
 * PLACEHOLDERS: anything written as [Like This] is information that hasn't been
 * provided yet. On the site these are underlined with a dashed line so they're
 * easy to spot. Replace or delete them before publishing.
 *
 * LINKS: a url of "" hides that link everywhere on the site.
 *
 * PROJECTS: the Selected Projects, Project Highlights and Project Walkthroughs
 * sections are hidden. To enable them:
 *   1. add real projects to the `projects` array below (see the template),
 *   2. set the matching `show*` flag on `profile` to true,
 *   3. run `npm run db:seed`.
 */
import { PrismaClient, ProjectFormat } from '@prisma/client';

const prisma = new PrismaClient();

const profile = {
  id: 1,
  name: 'Limon Reza',
  shortName: 'LIMON REZA',
  title: 'Software Engineer',
  role: 'Software Engineer · Full-Stack Developer',
  headline: 'I build modern web apps that are fast, scalable and easy to use.',
  subheadline: 'Software Engineer & Full-Stack Developer building modern, scalable and user-friendly web applications.',
  available: true,
  availabilityText: 'Open to opportunities',
  statusText: 'Open to opportunities',
  location: 'Dhaka, Bangladesh · Remote friendly',
  email: '', // e.g. 'you@example.com' — empty hides the email link
  heroImage: '/assets/hero.png', // your transparent cut-out (client/public/assets/hero.png)
  aboutImage: '/assets/about.png', // client/public/assets/about.png
  aboutHeadline: 'Interfaces, APIs and databases: building complete products, end to end.',
  nowText: 'Now: Currently learning and practising full-stack development with Next.js, TypeScript, Node.js, Express.js and PostgreSQL.',
  aboutIntro:
    "I'm a Software Engineering student passionate about building modern, scalable and user-friendly web applications. I enjoy the whole journey, from shaping a clean interface to designing the API and database behind it.",
  aboutBody:
    "My focus is full-stack web development with Next.js, React, TypeScript, Node.js, Express and PostgreSQL. I'm a Software Engineering student passionate about technology and problem-solving. I enjoy building modern web applications and exploring how frontend interfaces, backend APIs and databases work together to create complete products.",
  focusLabel: 'Focus areas',
  focusAreas: ['Frontend', 'Backend', 'Databases', 'REST APIs'],
  platforms: [
    { mark: 'G', icon: 'github', name: 'GitHub', badge: 'Code & projects', url: 'https://github.com/limon4reza000?tab=repositories' },
    { mark: 'in', icon: 'linkedin', name: 'LinkedIn', badge: "Let's connect", url: 'https://www.linkedin.com/in/limon4reza000/' },
  ],
  socials: [
    { label: 'Facebook', url: 'https://www.facebook.com/limon4reza000' },
    { label: 'Instagram', url: 'https://www.instagram.com/limon4reza000/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/limon4reza000/' },
    { label: 'X', url: 'https://x.com/limon4reza' },
    { label: 'GitHub', url: 'https://github.com/limon4reza000?tab=repositories' },
    { label: 'Email', url: '' }, // e.g. 'mailto:you@example.com'
  ],
  showProjects: false,
  showProjectHighlights: false,
  showProjectWalkthroughs: false,
};

// Short facts — no invented numbers.
const stats = [
  // Hero cards are small: keep values to roughly 5 characters.
  { group: 'hero', value: 'Web', label: 'Focus', highlight: false },
  { group: 'hero', value: 'SWE', label: 'Software Engineer', highlight: true },
  { group: 'about', value: 'Full-Stack', label: 'Web development focus', highlight: false },
  { group: 'about', value: 'TypeScript', label: 'Frontend & backend', highlight: false },
  { group: 'about', value: '3+', label: 'Years coding', highlight: false },
  { group: 'about', value: 'Always', label: 'Learning · Building · Improving', highlight: true },
  { group: 'approach', value: 'Problem-solving', label: 'Understand, then build', highlight: true },
  { group: 'approach', value: 'Clean code', label: 'Readable & typed', highlight: false },
  { group: 'approach', value: 'Responsive', label: 'Every screen size', highlight: false },
  { group: 'approach', value: 'Always learning', label: 'Always improving', highlight: false },
];

const technologies = [
  { name: 'Next.js', category: 'Framework', icon: 'nextdotjs' },
  { name: 'React', category: 'UI library', icon: 'react' },
  { name: 'TypeScript', category: 'Language', icon: 'typescript' },
  { name: 'JavaScript', category: 'Language', icon: 'javascript' },
  { name: 'Tailwind CSS', category: 'Styling', icon: 'tailwindcss' },
  { name: 'Node.js', category: 'Runtime', icon: 'nodedotjs' },
  { name: 'Express.js', category: 'Backend', icon: 'express' },
  { name: 'PostgreSQL', category: 'Database', icon: 'postgresql' },
  { name: 'Prisma', category: 'ORM', icon: 'prisma' },
  { name: 'Git', category: 'Version control', icon: 'git' },
];

// Education & experience — placeholders until real details are provided.
const experiences = [
  {
    kind: 'education',
    year: '2023',
    title: 'B.Sc. in Software Engineering',
    company: 'Daffodil International University',
    description:
      'Undergraduate student focused on software engineering, programming, web development and modern software technologies.',
    period: '2023 — Present',
  },
  {
    kind: 'learning',
    year: null,
    title: 'Full-Stack Web Development',
    company: '', // shown in the bottom line instead
    // Blank line = new paragraph
    description:
      'Currently learning web development through Programming Hero, following a structured learning path and gaining practical experience through coding exercises and hands-on projects.\n\nFocusing on frontend development, backend fundamentals, database management and problem-solving.',
    period: 'Programming Hero · Ongoing',
  },
  {
    kind: 'project',
    year: null,
    title: 'MedGo – B2B Pharmaceutical Marketplace',
    company: 'Academic Team Project',
    // Lines starting with "- " become a bullet list
    description:
      'Worked on a B2B pharmaceutical marketplace concept designed to connect pharmacies with pharmaceutical companies.\n\nKey areas of the project:\n- Medicine search and ordering.\n- Inventory management.\n- Multi-company shopping cart.\n- Pharmacy dashboard and order management.\n- Database-driven application features.',
    period: 'Academic Project',
  },
];

// Toolkit — no proficiency levels until confirmed (set `level` / `percent` to show them).
const tools = [
  { abbr: 'Re', icon: 'react', name: 'React', purpose: 'Component-based UIs', category: 'Frontend' },
  { abbr: 'Nx', icon: 'nextdotjs', name: 'Next.js', purpose: 'Full-stack React apps', category: 'Frontend' },
  { abbr: 'Ts', icon: 'typescript', name: 'TypeScript', purpose: 'Typed, safer code', category: 'Language' },
  { abbr: 'No', icon: 'nodedotjs', name: 'Node.js', purpose: 'Server-side JavaScript', category: 'Backend' },
  { abbr: 'Ex', icon: 'express', name: 'Express.js', purpose: 'REST APIs', category: 'Backend' },
  { abbr: 'Pg', icon: 'postgresql', name: 'PostgreSQL', purpose: 'Relational data', category: 'Database' },
  { abbr: 'Pr', icon: 'prisma', name: 'Prisma ORM', purpose: 'Type-safe database access', category: 'Database' },
  { abbr: 'Tw', icon: 'tailwindcss', name: 'Tailwind CSS', purpose: 'Utility-first styling', category: 'Frontend' },
];

const skills: Record<string, string[]> = {
  Frontend: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Responsive design'],
  Backend: ['Node.js', 'Express.js', 'REST APIs', 'Validation & error handling'],
  Database: ['PostgreSQL', 'Prisma ORM', 'Data modelling'],
  'Problem-solving': ['Debugging', 'Breaking down problems', 'Clean code', 'Git & version control'],
};

const services = [
  { title: 'Web Applications', description: 'Complete, production-ready apps from idea to deploy.' },
  { title: 'Frontend Development', description: 'Responsive, accessible interfaces with React and Next.js.' },
  { title: 'Backend Systems', description: 'REST APIs with Node.js, Express and TypeScript.' },
  { title: 'Database-Driven Apps', description: 'PostgreSQL and Prisma, modelled for real data.' },
];

/**
 * PROJECTS — intentionally empty. Template for when you're ready:
 *
 *  {
 *    title: 'Project name',
 *    description: 'One or two sentences about what it does and why.',
 *    format: ProjectFormat.HORIZONTAL,          // VERTICAL for a mobile screenshot
 *    category: 'Web App',                       // used by the /work filter chips
 *    thumbnail: '/images/projects/my-project.png',
 *    techStack: ['Next.js', 'PostgreSQL'],
 *    liveUrl: 'https://my-project.vercel.app',
 *    githubUrl: 'https://github.com/limon4reza000/my-project',
 *    videoUrl: null,                            // YouTube link → Project Walkthroughs
 *    highlight: null,                           // short story → Project Highlights
 *    beforeImage: null, afterImage: null,       // optional redesign slider
 *    featured: true,                            // shown on the home page
 *  },
 */
type ProjectSeed = {
  title: string;
  description: string;
  format?: ProjectFormat;
  category: string;
  thumbnail: string;
  techStack: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  videoUrl?: string | null;
  highlight?: string | null;
  beforeImage?: string | null;
  afterImage?: string | null;
  featured?: boolean;
};
const projects: ProjectSeed[] = [];

// Development Highlights — capabilities, not statistics.
const highlights = [
  {
    slot: 'primary',
    label: 'End-to-end development',
    tag: 'Full stack',
    value: 'Full-Stack',
    description: 'From the interface people use to the API and database behind it, built as one coherent product.',
    chips: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma'],
  },
  { slot: 'side1', label: 'API design', tag: null, value: 'REST', description: 'Structured, validated REST APIs with Express and TypeScript.', chips: [] },
  { slot: 'side2', label: 'Type safety', tag: null, value: 'Typed', description: 'TypeScript across frontend and backend for fewer runtime surprises.', chips: [] },
  { slot: 'row1', label: 'Data layer', tag: null, value: 'SQL', description: 'Relational data modelling with PostgreSQL and Prisma ORM.', chips: [] },
  { slot: 'row2', label: 'Every screen', tag: null, value: 'Responsive', description: 'Mobile-first layouts for phone, tablet and desktop.', chips: [] },
  { slot: 'row3', label: 'Best practices', tag: null, value: 'Secure', description: 'Input validation, rate limiting and safe defaults on every endpoint.', chips: [] },
];

const visuals = [
  { title: 'Code editor', image: '/images/env/code-editor.svg' },
  { title: 'Terminal & tooling', image: '/images/env/terminal.svg' },
  { title: 'Database schema', image: '/images/env/schema.svg' },
];

const processSteps = [
  {
    title: 'Planning',
    duration: 4, // seconds on the animated timeline
    description: 'Clarify the goal, the users and the requirements before writing code.',
    tags: ['Requirements', 'Scope', 'Tech choices'],
    deliverable: 'A clear plan and feature list.',
  },
  {
    title: 'Designing',
    duration: 4, // seconds on the animated timeline
    description: 'Shape the user flows, layouts, data model and API structure.',
    tags: ['UI layout', 'Data model', 'API design'],
    deliverable: 'Wireframes, schema and endpoints mapped out.',
  },
  {
    title: 'Developing',
    duration: 6, // seconds on the animated timeline
    description: 'Build the frontend, backend and database in small, working steps.',
    tags: ['Frontend', 'Backend', 'Database'],
    deliverable: 'A working app, updated as it grows.',
  },
  {
    title: 'Testing',
    duration: 4, // seconds on the animated timeline
    description: 'Check features, edge cases and responsiveness across devices.',
    tags: ['Functionality', 'Edge cases', 'Devices'],
    deliverable: 'Bugs found and fixed before launch.',
  },
  {
    title: 'Deployment',
    duration: 3, // seconds on the animated timeline
    description: 'Ship to production, configure the environment and hand over.',
    tags: ['Build', 'Hosting', 'Monitoring'],
    deliverable: 'A live app, ready for real users.',
  },
];

const comparisons = [
  { label: 'Problem-solving', typical: 'Jumps straight into code', mine: 'Understands the problem, then picks the simplest solid solution' },
  { label: 'Clean code', typical: 'Works today, painful tomorrow', mine: 'Typed, readable and organised for future changes' },
  { label: 'Responsive', typical: 'Desktop first, mobile as an afterthought', mine: 'Designed and tested for every screen size' },
  { label: 'Full stack', typical: 'Stops at the frontend', mine: 'Connects UI, API and database into one product' },
  { label: 'Learning', typical: 'Sticks with what it already knows', mine: 'Keeps learning better tools and practices' },
];

const faqs = [
  {
    question: 'What are your main technical skills?',
    answer:
      'Full-stack web development: React, Next.js, TypeScript and Tailwind CSS on the frontend, and Node.js, Express and REST APIs on the backend, with PostgreSQL and Prisma for data.',
  },
  {
    question: 'What is your educational background?',
    answer:
      "I'm studying for a B.Sc. in Software Engineering at Daffodil International University (2023 – present). Alongside my studies, I'm learning full-stack web development through Programming Hero and building projects.",
  },
  {
    question: 'Where can I see your projects?',
    answer:
      "I'm currently polishing my projects and will add them here soon, with live demos and source code. In the meantime, you can find my work on GitHub.",
  },
  {
    question: 'Are you open to collaboration or new opportunities?',
    answer:
      "Yes. I'm open to collaborating on interesting projects and to software engineering opportunities. Send me a message below and I'll get back to you.",
  },
  {
    question: 'How can I contact you?',
    answer: 'Use the contact form below. Messages go straight to me and I reply as soon as I can.',
  },
];

const ordered = <T extends object>(rows: T[]) => rows.map((r, i) => ({ ...r, order: i }));

async function main() {
  await prisma.$transaction([
    prisma.stat.deleteMany(),
    prisma.technology.deleteMany(),
    prisma.experience.deleteMany(),
    prisma.tool.deleteMany(),
    prisma.skill.deleteMany(),
    prisma.service.deleteMany(),
    prisma.project.deleteMany(),
    prisma.highlight.deleteMany(),
    prisma.visual.deleteMany(),
    prisma.processStep.deleteMany(),
    prisma.comparison.deleteMany(),
    prisma.faq.deleteMany(),
    prisma.profile.upsert({ where: { id: 1 }, update: profile, create: profile }),
    prisma.stat.createMany({ data: ordered(stats) }),
    prisma.technology.createMany({ data: ordered(technologies) }),
    prisma.experience.createMany({ data: ordered(experiences) }),
    prisma.tool.createMany({ data: ordered(tools) }),
    prisma.skill.createMany({
      data: ordered(Object.entries(skills).flatMap(([group, names]) => names.map((name) => ({ group, name })))),
    }),
    prisma.service.createMany({ data: ordered(services) }),
    prisma.project.createMany({ data: ordered(projects) }),
    prisma.highlight.createMany({ data: ordered(highlights) }),
    prisma.visual.createMany({ data: ordered(visuals) }),
    prisma.processStep.createMany({ data: ordered(processSteps) }),
    prisma.comparison.createMany({ data: ordered(comparisons) }),
    prisma.faq.createMany({ data: ordered(faqs) }),
  ]);
  console.log(`Seeded portfolio for ${profile.name} (${projects.length} projects).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
