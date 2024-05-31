import { Header } from '@/components/base'
import {
  CallToAction,
  Faqs,
  Features,
  Footer,
  Hero,
  PrimaryFeatures,
} from '@/components/containers'

export default function Home() {
  return (
    <>
      <Header />
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
