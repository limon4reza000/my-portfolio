import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { About } from '@/components/sections/About';
import { Approach } from '@/components/sections/Approach';
import { Contact } from '@/components/sections/Contact';
import { Faq } from '@/components/sections/Faq';
import { Hero } from '@/components/sections/Hero';
import { Highlights } from '@/components/sections/Highlights';
import { Process } from '@/components/sections/Process';
import { ProjectHighlights } from '@/components/sections/ProjectHighlights';
import { ProjectWalkthroughs } from '@/components/sections/ProjectWalkthroughs';
import { Services } from '@/components/sections/Services';
import { Showcase } from '@/components/sections/Showcase';
import { api } from '@/lib/api';
import { withAssets } from '@/lib/assets';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const p = await api.profile();
    return { title: `${p.name} — ${p.title} & Full-Stack Developer`, description: p.subheadline };
  } catch {
    return {};
  }
}

/**
 * Section order follows the reference site. Project-related sections render only
 * when enabled in the database (see `sections` in GET /api/portfolio).
 */
export default async function HomePage() {
  // Uploaded files in public/assets override the matching images (see lib/assets.ts).
  const data = withAssets(await api.portfolio());
  const { profile, sections } = data;

  return (
    <>
      <Navbar profile={profile} />
      <main>
        <Hero profile={profile} stats={data.stats.hero} technologies={data.technologies} showProjects={sections.projects} />
        <About profile={profile} stats={data.stats.about} experiences={data.experiences} skills={data.skills} />
        <Services services={data.services} />
        {sections.projects && <Showcase vertical={data.projects.vertical} horizontal={data.projects.horizontal} />}
        <Highlights highlights={data.highlights} visuals={data.visuals} />
        <Process steps={data.process} />
        <Approach profile={profile} pillars={data.stats.approach} comparisons={data.comparisons} />
        {sections.projectHighlights && <ProjectHighlights projects={data.projects.highlights} />}
        {sections.projectWalkthroughs && <ProjectWalkthroughs projects={data.projects.walkthroughs} />}
        <Faq faqs={data.faqs} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
