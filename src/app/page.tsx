import { CallToAction } from '@/components/landing-sections/call-to-action';
import { Faqs } from '@/components/landing-sections/faqs';
import { Features } from '@/components/landing-sections/features';
import { Footer } from '@/components/landing-sections/footer';
import { Header } from '@/components/landing-sections/header';
import { HeroLikeABoss } from '@/components/landing-sections/hero-section';
import { PrimaryFeatures } from '@/components/landing-sections/primary-features';

import { getAuthSession } from './_actions/config-actions';

export default async function LandingPage() {
  const session = await getAuthSession();

  return (
    <>
      <Header session={session} />
      <main>
        <HeroLikeABoss />
        <PrimaryFeatures />
        <Features />
        <CallToAction />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
