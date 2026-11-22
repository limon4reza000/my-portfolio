import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Reveal } from '@/components/ui/Reveal';
import { api } from '@/lib/api';
import { withProfileAssets, withProjectAssets } from '@/lib/assets';
import { WorkGallery } from './WorkGallery';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Selected Work' };

/** Full project gallery. Returns 404 until projects are enabled (profile.showProjects) and exist. */
export default async function WorkPage() {
  const [rawProfile, rawProjects, categories] = await Promise.all([api.profile(), api.projects(), api.categories()]);
  const profile = withProfileAssets(rawProfile);
  const projects = withProjectAssets(rawProjects);
  if (!profile.showProjects || projects.length === 0) notFound();

  return (
    <>
      <Navbar profile={profile} />
      <main className="pt-12 md:pt-16">
        <div className="container-x">
          <Reveal>
            <h1 className="font-display text-[44px] font-semibold leading-none tracking-tighter2 md:text-[56px]">Selected Work</h1>
          </Reveal>
        </div>

        <WorkGallery initialProjects={projects} categories={categories} />

        <div className="container-x pb-24">
          <Reveal className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-hairline bg-panel p-8 md:flex-row md:items-center md:p-10">
            <h2 className="font-display text-[28px] font-semibold tracking-tight3 md:text-[32px]">Have a project in mind?</h2>
            <Link href="/#contact" className="btn-primary">
              Get in Touch
            </Link>
          </Reveal>
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
