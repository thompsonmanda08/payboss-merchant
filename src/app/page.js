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
import DashboardHome from './dashboard/page'
import { redirect } from 'next/navigation'

export default async function App() {
  const session = await getServerSession()

  if (session) {
    return redirect('/dashboard')
  }

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
