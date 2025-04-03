"use client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section
      className="relative overflow-hidden bg-blue-600 py-32"
      id="get-started-today"
    >
      <Image
        unoptimized
        alt="background image"
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 opacity-50"
        height={1244}
        src={"/images/background-call-to-action.jpg"}
        width={2347}
      />
      <div className="relative container">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display heading-1 text-3xl tracking-tight text-white sm:text-4xl">
            Get Started Today
          </h2>
          <p className="mt-4 text-center text-lg tracking-tight text-white">
            Ready to take control of your business finances? Sign up for PayBoss
            and experience the future of financial management.
          </p>
          <Button
            as={Link}
            className="mt-10 bg-white text-primary"
            href="/register"
            size={"lg"}
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </section>
  );
}
