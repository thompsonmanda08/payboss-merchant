import React from 'react'
import Image from 'next/image'
import { Footer } from '@/components/containers'

import DefaultCover from '@/images/profile-cover.jpg'

async function AuthLayout({ children }) {
  return (
    <main className="ease-soft-in-out relative flex h-full min-h-screen flex-grow flex-col justify-between transition-all duration-200">
      <section>
        <div className="relative flex h-full flex-col items-center bg-center px-5 pt-2 last:bg-cover">
          <div className="relative h-[500px] w-full overflow-clip rounded-2xl bg-gray-900">
            <Image
              className="z-0 h-full w-full object-cover"
              src={DefaultCover}
              alt=""
              width={1024}
              height={300}
            />
            <div className="absolute inset-0 z-10 bg-black/30"></div>
          </div>
          <div className="container z-10">
            <div className="md:flex-0 mx-auto flex w-full shrink-0 flex-col px-3">
              {children}
            </div>
          </div>
        </div>
      </section>
      <Footer showLinks={false} showLogo={false} />
    </main>
  )
}

export default AuthLayout
