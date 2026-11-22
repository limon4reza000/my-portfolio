// Shapes returned by the Express API (mirror of server/prisma/schema.prisma).

export interface Platform {
  mark: string;
  icon?: string;
  name: string;
  badge: string;
  url: string;
}

export interface Social {
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  shortName: string;
  title: string;
  role: string;
  headline: string;
  subheadline: string;
  available: boolean;
  availabilityText: string;
  statusText: string;
  location: string;
  email: string;
  heroImage: string;
  aboutImage: string;
  aboutHeadline: string;
  nowText: string;
  aboutIntro: string;
  aboutBody: string;
  focusLabel: string;
  focusAreas: string[];
  platforms: Platform[];
  socials: Social[];
  showProjects: boolean;
  showProjectHighlights: boolean;
  showProjectWalkthroughs: boolean;
}

export interface Stat {
  id: number;
  group: 'hero' | 'about' | 'approach';
  value: string;
  label: string;
  highlight: boolean;
}

export interface Technology {
  id: number;
  name: string;
  category: string;
  icon: string;
}

export interface Experience {
  id: number;
  kind: 'education' | 'learning' | 'experience' | string;
  year: string | null;
  title: string;
  company: string;
  description: string;
  period: string;
}

export interface Tool {
  id: number;
  abbr: string;
  icon: string | null;
  name: string;
  purpose: string;
  category: string;
  level: string | null;
  percent: number | null;
}

export interface Skill {
  id: number;
  group: string;
  name: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
}

export type ProjectFormat = 'VERTICAL' | 'HORIZONTAL';

export interface Project {
  id: number;
  title: string;
  description: string;
  format: ProjectFormat;
  category: string;
  thumbnail: string;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  videoUrl: string | null;
  highlight: string | null;
  beforeImage: string | null;
  afterImage: string | null;
  featured: boolean;
}

export interface Highlight {
  id: number;
  slot: 'primary' | 'side1' | 'side2' | 'row1' | 'row2' | 'row3' | string;
  label: string;
  tag: string | null;
  value: string;
  description: string;
  chips: string[];
}

export interface Visual {
  id: number;
  title: string;
  image: string;
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  tags: string[];
  deliverable: string;
  /** Seconds this stage plays on the animated timeline. */
  duration: number;
}

export interface Comparison {
  id: number;
  label: string;
  typical: string;
  mine: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

export interface PortfolioData {
  profile: Profile;
  sections: { projects: boolean; projectHighlights: boolean; projectWalkthroughs: boolean };
  stats: { hero: Stat[]; about: Stat[]; approach: Stat[] };
  technologies: Technology[];
  experiences: Experience[];
  tools: Tool[];
  skills: Skill[];
  services: Service[];
  projects: { vertical: Project[]; horizontal: Project[]; highlights: Project[]; walkthroughs: Project[] };
  highlights: Highlight[];
  visuals: Visual[];
  process: ProcessStep[];
  comparisons: Comparison[];
  faqs: Faq[];
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string; // honeypot
}
