import React from 'react'
import paymentsImage from '@/images/product/payments.avif'
import Image from 'next/image'
import { Footer } from '@/components/containers'

function AuthLayout({ children }) {
  return (
    <main className="ease-soft-in-out relative mt-0 flex h-screen flex-col justify-between overflow-clip transition-all duration-200">
      {/* <div className="rounded-blur fixed left-0  right-0 top-4  z-50 mx-10 flex flex-wrap items-center justify-start rounded-full bg-white/60 px-32 py-4 backdrop-blur-2xl backdrop-saturate-200 transition-all lg:flex-nowrap lg:justify-start">
        <Logo />
      </div> */}
      <section>
        <div className="min-h-75-screen relative flex h-full items-center bg-cover bg-center">
          <div className="container z-10">
            <div className="-mx-3 mt-0 flex flex-wrap">
              <div className="md:flex-0 mx-auto flex w-full max-w-full shrink-0 flex-col px-3 md:w-6/12 lg:w-5/12 xl:w-4/12">
                {children}
              </div>
              <div className="lg:flex-0 w-full max-w-full shrink-0 px-3 md:w-6/12">
                <div className="absolute -right-40 top-0 -mr-32 hidden h-full w-3/5 -skew-x-12 overflow-hidden rounded-bl-[60px] md:block">
                  <div className="absolute inset-x-0 top-0 z-0 -ml-16 h-full skew-x-12 bg-slate-800 bg-cover">
                    <Image
                      src={paymentsImage}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="via-black-60 absolute inset-x-0 top-0 z-0 -ml-16 h-full skew-x-12 bg-gradient-to-bl from-black/90 to-primary/0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer showLinks={false} showLogo={false} />
    </main>
  )
}

export default AuthLayout
