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

export function HeroLikeABoss() {
  return (
    <>
      <BackgroundSVG className={"top-0  bg-secondary/30 z-10"} />
      <section className="pt-16 lg:pt-24 relative" role="hero-section">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 container w-full z-20">
          <div className="flex flex-col items-start flex-1 flex-grow gap-8 h-full justify-center z-20 my-24">
            <h2 className="text-[clamp(1.5rem,1rem+3vw,6rem)] sm:leading-[4rem] md:leading-[5rem] xl:leading-[6rem] font-bold">
              Pay like a boss, <br /> with PayBoss
            </h2>
            <p className="text-[clamp(11px,3vw,1.25rem)] leading-6 sm:leading-7 md:leading-8 max-w-[600px] text-foreground/80">
              PayBoss offers advanced tools to help businesses manage their
              financial inflows and outflows efficiently, streamlining
              operations for all businesses.
            </p>

            <div className="flex gap-6">
              <Link href="/support">
                <Button className="" color="primary" size="lg">
                  Book a demo
                  <ChatBubbleLeftRightIcon className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href={`/register`}>
                <Button
                  className={"dark:text-white/80"}
                  color="primary"
                  size="lg"
                  variant="bordered"
                >
                  Register for free
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:flex flex-col flex-grow w-full flex-1 h-full hidden relative">
            <LadyBoss />
          </div>
          <LadyBoss className={"max-w-[380px] aspect-[3/5] lg:hidden"} />
          <Image
            priority
            unoptimized
            alt="Official LadyBoss"
            className="w-full h-full absolute opacity-80 md:opacity-90 lg:opacity-100 lg:right-[-25%] xl:right-[-3%] hidden lg:block max-w-[900px] -bottom-24 rounded-l-[300px] object-cover z-0"
            height={800}
            src={DefaultCover}
            width={800}
          />
        </div>
      </section>
    </>
  );
}

export function LadyBoss({ className }) {
  return (
    <Image
      priority
      unoptimized
      alt="Official LadyBoss"
      className={cn("w-full h-full block object-cover z-10", className)}
      height={800}
      src={"/images/like-a-boss.png"}
      width={800}
    />
  );
}
