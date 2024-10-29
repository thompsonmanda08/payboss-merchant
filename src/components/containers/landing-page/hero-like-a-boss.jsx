"use client";
import BackgroundSVG from "@/components/base/BackgroundSVG";
import { Container } from "@/components/base/Container";
import FrameContainer from "@/components/base/FrameContainer";
import { Button } from "@/components/ui/button";
import { DefaultCover } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export function HeroLikeABoss() {
  return (
    <>
      <BackgroundSVG className={"top-0  bg-secondary/30 z-10"} />
      <section role="hero-section" className="pt-16 lg:pt-24 relative">
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
                <Button size="lg" color="primary" className="">
                  Book a demo
                  <ChatBubbleLeftRightIcon className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href={`/register`}>
                <Button
                  size="lg"
                  variant="bordered"
                  color="primary"
                  className={"dark:text-white/80"}
                >
                  Register for free
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:flex flex-col flex-grow w-full flex-1 h-full hidden  relative">
            <LadyBoss />
          </div>
          <LadyBoss className={"max-w-[380px] aspect-[3/5]  lg:hidden"} />
          <Image
            className="w-full h-full absolute opacity-80 md:opacity-90 lg:opacity-100 lg:right-[-300px] xl:right-0 hidden lg:block max-w-[900px] -bottom-24 rounded-l-[300px] object-cover z-0"
            src={DefaultCover}
            alt="Official LadyBoss"
            width={800}
            height={800}
          />
        </div>
      </section>
    </>
  );
}

function LadyBoss({ className }) {
  return (
    <Image
      className={cn("w-full h-full block object-cover z-10", className)}
      src={"/images/like-a-boss.png"}
      alt="Official LadyBoss"
      width={800}
      height={800}
    />
  );
}
