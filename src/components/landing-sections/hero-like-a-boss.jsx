"use client";
import {
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

import BackgroundSVG from "@/components/base/background-svg";
import { Button } from "@/components/ui/button";
import { DefaultCover } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Image as HeroImage } from "@heroui/react";
import { BGS_SUPER_MERCHANT_ID } from "@/lib/constants";

export function HeroLikeABoss() {
  return (
    <>
      <BackgroundSVG className={"-top-1 bg-secondary/30 z-10"} />

      <section
        className="pt-16 lg:pt-20 relative w-full overflow-hidden"
        role="region"
        aria-label="hero section"
      >
        <div className="container px-8 z-20 relative">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 z-20 pt-8">
              <h1 className="text-[clamp(1.5rem,1rem+3vw,6rem)] sm:leading-[4rem] md:leading-[5rem] xl:leading-[6rem] font-bold">
                Pay like a boss, <br /> with PayBoss
              </h1>
              <p className="text-[clamp(11px,3vw,1.25rem)] leading-6 sm:leading-7 md:leading-8 max-w-[600px] text-foreground/80 mt-4">
                PayBoss offers advanced tools to help businesses manage their
                financial inflows and outflows efficiently, streamlining
                operations for all businesses.
              </p>

              <div className="flex gap-2 md:gap-4 py-8 flex-col sm:flex-row">
                <Button
                  as={Link}
                  href="/support"
                  className="w-full sm:w-auto"
                  color="primary"
                  size="lg"
                  endContent={<ChatBubbleLeftRightIcon className="w-5 h-5" />}
                >
                  Book a demo
                </Button>

                <Button
                  as={Link}
                  href={`/register/${BGS_SUPER_MERCHANT_ID}`}
                  className={"dark:text-white/80"}
                  color="primary"
                  size="lg"
                  variant="bordered"
                  endContent={<ArrowRightIcon className="w-5 h-5" />}
                >
                  Register
                </Button>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative hidden md:flex">
              <LadyBoss />
            </div>
          </div>
        </div>
        <Image
          priority
          unoptimized
          alt="Official Cover Image"
          className="w-full h-full max-h-[calc(100vh)] absolute opacity-80 md:opacity-90 lg:opacity-100 lg:right-[-30%] xl:right-[-25%] 2xl:right-[-3%]  hidden lg:block max-w-[900px] -bottom-24 rounded-l-[100px] object-cover z-0"
          height={600}
          width={800}
          src={DefaultCover}
        />
      </section>
    </>
  );
}

export function LadyBoss({ className }) {
  return (
    <HeroImage
      // priority
      // unoptimized
      alt="Official LadyBoss"
      className={cn("object-contain", className)}
      height={800}
      src={"/images/like-a-boss.png"}
      width={600}
    />
  );
}
