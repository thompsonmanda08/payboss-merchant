import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/base/Container";
import Link from "next/link";

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-blue-600 py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 opacity-50"
        src={"/images/background-call-to-action.jpg"}
        alt="background image"
        width={2347}
        height={1244}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display heading-1  text-3xl tracking-tight text-white sm:text-4xl">
            Get Started Today
          </h2>
          <p className="mt-4 text-center text-lg tracking-tight text-white">
            Ready to take control of your business finances? Sign up for PayBoss
            and experience the future of financial management.
          </p>
          <Button
            as={Link}
            href="/register"
            size={"lg"}
            className="mt-10 bg-white text-primary"
          >
            Get Started Now
          </Button>
        </div>
      </Container>
    </section>
  );
}
