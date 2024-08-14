import { Header } from '@/components/base'
import {
  CallToAction,
  Faqs,
  Features,
  Footer,
  Hero,
  PrimaryFeatures,
} from '@/components/containers'
import { getAuthSession } from './_actions/config-actions'
import LoadingPage from './loading'
import { Suspense } from 'react'

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
