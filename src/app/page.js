import { getAuthSession } from "./_actions/config-actions";
import LoadingPage from "./loading";
import { Suspense } from "react";
import { Header } from "@/components/containers/landing-page/header";
import { PrimaryFeatures } from "@/components/containers/landing-page/primary-features";
import { Features } from "@/components/containers/landing-page/features";
import { CallToAction } from "@/components/containers/landing-page/call-to-action";
import { Faqs } from "@/components/containers/landing-page/faqs";
import { Footer } from "@/components/containers/landing-page/footer";
import { HeroLikeABoss } from "@/components/containers/landing-page/hero-like-a-boss";

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
