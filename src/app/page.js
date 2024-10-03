import { getAuthSession } from './_actions/config-actions'
import LoadingPage from './loading'
import { Suspense } from 'react'
import { Header } from '@/components/containers/landing-page/Header'
import { Hero } from '@/components/containers/landing-page/Hero'
import { PrimaryFeatures } from '@/components/containers/landing-page/PrimaryFeatures'
import { Features } from '@/components/containers/landing-page/Features'
import { CallToAction } from '@/components/containers/landing-page/CallToAction'
import { Faqs } from '@/components/containers/landing-page/Faqs'
import { Footer } from '@/components/containers/landing-page/Footer'

export default async function LandingPage() {
  const session = await getAuthSession()

  return (
    <Suspense fallback={<LoadingPage />}>
      <Header session={session} />
      <main>
        <Hero />
        <PrimaryFeatures />
        <Features />
        <CallToAction />
        <Faqs />
      </main>
      <Footer />
    </Suspense>
  )
}
