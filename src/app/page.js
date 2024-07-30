import { Header } from '@/components/base'
import {
  CallToAction,
  Faqs,
  Features,
  Footer,
  Hero,
  PrimaryFeatures,
} from '@/components/containers'
import { getServerSession } from '@/lib/session'
import DashboardHome from './dashboard/[workspaceID]/Dashboard'
import { redirect } from 'next/navigation'
import { getAuthSession } from './_actions/config-actions'

export default async function LandingPage() {
  const session = await getAuthSession()

  return (
    <>
      <Header session={session} />
      <main>
        <Hero />
        <PrimaryFeatures />
        <Features />
        <CallToAction />
        <Faqs />
      </main>
      <Footer />
    </>
  )
}
