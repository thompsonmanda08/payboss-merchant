import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import PhoneFrame from '../base/PhoneFrame'
import BackgroundSVG from '../BackgroundSVG'
import Image from 'next/image'

function Hero() {
  return (
    <div className="relative isolate max-h-[100svh] w-full  pt-14 lg:overflow-x-clip">
      <BackgroundSVG />
      <div className="mx-auto w-full max-w-[1640px] px-6 py-24 sm:py-32 lg:flex lg:items-center lg:py-20 lg:pl-8">
        <div className="mx-auto w-full max-w-3xl lg:mx-0 lg:max-w-full lg:flex-grow">
          <h1 className="mt-10 w-full text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:max-w-xl lg:text-left lg:text-7xl xl:max-w-3xl 2xl:text-7xl ">
            Its just as simple as that Scan and Pay
          </h1>
          <p className="mt-6 w-full break-words text-center text-lg leading-8 text-gray-600 lg:max-w-xl lg:text-left xl:max-w-3xl">
            Complete your payments in seconds without the need to handle cash or
            swipe cards. Its as simple as scan and pay.
          </p>
          <div className="mt-5 flex items-center justify-center gap-x-6 lg:mt-10 lg:justify-start ">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="h-12 text-base font-medium leading-6 md:h-14"
              >
                Sign up for free{' '}
                <span aria-hidden="true" className="pl-2">
                  {' '}
                  →
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative mt-16 hidden sm:mt-24 lg:ml-16 lg:mt-0 lg:block lg:flex-shrink-0 xl:min-w-[600px]  xl:scale-125 2xl:min-w-[710px]">
          <Image
            className="absolute -right-40 -top-[310px] lg:scale-[1.125] xl:-top-[285px]  2xl:scale-100 "
            src={'/images/hero-img.png'}
            alt="Scan-Pay Web App"
            layout="fixed"
            width={800}
            height={720}
            objectFit="contain"
            objectPosition="center"
          />
        </div>
        {/* WORK IN PROGRESS */}
        <div className="relative mt-16 sm:mt-24 lg:ml-16 lg:mt-0 lg:hidden lg:flex-shrink-0 lg:flex-grow">
          <PhoneFrame />
          {/* <div className="hidden lg:block absolute top-0 -right-40 w-full h-screen lg:min-w-[30vw] xl:min-w-[55vw] xl:-right-[75%]">
            <Image
              src={"/images/web-app.png"}
              alt="Scan-Pay Web App"
              width={800}
              height={720}
            />
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Hero
