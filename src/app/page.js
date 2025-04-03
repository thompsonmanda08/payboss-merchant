import { Suspense } from "react";

import { Header } from "@/components/landing-sections/header";
import { PrimaryFeatures } from "@/components/landing-sections/primary-features";
import { Features } from "@/components/landing-sections/features";
import { CallToAction } from "@/components/landing-sections/call-to-action";
import { Faqs } from "@/components/landing-sections/faqs";
import { Footer } from "@/components/landing-sections/footer";
import { HeroLikeABoss } from "@/components/landing-sections/hero-like-a-boss";

import LoadingPage from "./loading";
import { getAuthSession } from "./_actions/config-actions";

export default async function LandingPage() {
  const session = await getAuthSession();

  return (
    <Suspense fallback={<LoadingPage />}>
      <Header session={session} />
      <main>
        <HeroLikeABoss />
        <PrimaryFeatures />
        <Features />
        <CallToAction />
        <Faqs />
      </main>
      <Footer />
    </Suspense>
  );
}
