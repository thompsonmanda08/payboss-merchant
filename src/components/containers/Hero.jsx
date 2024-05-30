import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import PhoneFrame from "../base/PhoneFrame";
import BackgroundSVG from "../base/BackgroundSVG";
import Image from "next/image";

function Hero() {
  return (
    <div className="relative isolate pt-14 lg:overflow-x-clip  w-full max-h-[100svh]">
      <BackgroundSVG />
      <div className="mx-auto max-w-[1640px] px-6 py-24 sm:py-32 lg:flex lg:items-center lg:pl-8 lg:py-20 w-full">
        <div className="mx-auto max-w-3xl lg:mx-0 lg:flex-grow lg:max-w-full w-full">
          <h1 className="mt-10 w-full lg:max-w-xl xl:max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl 2xl:text-7xl text-center lg:text-left ">
            Its just as simple as that Scan and Pay
          </h1>
          <p className="mt-6 text-lg break-words leading-8 text-gray-600 w-full lg:max-w-xl xl:max-w-3xl text-center lg:text-left">
            Complete your payments in seconds without the need to handle cash or
            swipe cards. Its as simple as scan and pay.
          </p>
          <div className="mt-5 lg:mt-10 flex justify-center lg:justify-start items-center gap-x-6 ">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="text-base font-medium leading-6 h-12 md:h-14"
              >
                Sign up for free{" "}
                <span aria-hidden="true" className="pl-2">
                  {" "}
                  →
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden lg:block mt-16 lg:ml-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 xl:min-w-[600px] xl:scale-125  2xl:min-w-[710px] relative">
          <Image
            className="absolute -top-[310px] xl:-top-[285px] -right-40 lg:scale-[1.125]  2xl:scale-100 "
            src={"/images/hero-img.png"}
            alt="Scan-Pay Web App"
            layout="fixed"
            width={800}
            height={720}
            objectFit="contain"
            objectPosition="center"
          />
        </div>
        {/* WORK IN PROGRESS */}
        <div className="lg:hidden mt-16 lg:ml-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow relative">
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
  );
}

export default Hero;
