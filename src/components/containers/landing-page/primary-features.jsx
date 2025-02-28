"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, Tab } from "@heroui/react";
import { Image as NextImage } from "@heroui/react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Financial Management",
    description:
      " From invoicing to expense tracking, PayBoss covers all aspects of your financial needs.",
    image: "/images/screenshots/home.png",
    index: 0,
  },
  {
    title: "User-Friendly Interface",
    description:
      "Our platform is designed to be intuitive and easy to use, even for those with limited technical expertise.",
    image: "/images/screenshots/payments-empty.png",
    index: 1,
  },
  {
    title: "Secure and Reliable",
    description:
      "We prioritize the security of your financial data with robust encryption and security protocols.",
    image: "/images/screenshots/payments-validation.png",
    index: 2,
  },
  {
    title: "Customizable Solutions",
    description:
      "Tailor PayBoss features to fit your daily unique business requirements.",
    image: "/images/screenshots/api.png",
    index: 3,
  },
];

export function PrimaryFeatures() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVertical, setIsVertical] = useState(true);

  useEffect(() => {
    let lgMediaQuery = window.matchMedia("(min-width: 1024px)");

    function onMediaQueryChange({ matches }) {
      setIsVertical(matches);
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener("change", onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener("change", onMediaQueryChange);
    };
  }, []);

  return (
    <section
      id="why-pay-boss"
      aria-label="why pay-boss"
      className="relative overflow-hidden bg-primary w-screen pb-28 pt-20 sm:py-32 "
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none object-cover translate-x-[-44%] translate-y-[-42%]"
        src={"/images/background-features.jpg"}
        alt="bg-features-image"
        width={1920}
        height={1080}
        unoptimized
        loading="lazy"
      />
      <div className="relative container w-full gap-8 flex flex-col">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display heading-1 tracking-tight text-white sm:text-4xl md:text-5xl">
            Why Choose PayBoss?
          </h2>
          <p className="mt-6 text-lg tracking-tight text-blue-100">
            {
              "Well everything you need if you aren't that picky about minor details like compliance."
            }
          </p>
        </div>

        <div className="flex flex-col gap-2 md:gap-4 md:flex-row w-full">
          <Tabs
            aria-label="PayBoss Features"
            items={features}
            isVertical={isVertical}
            variant="bordered"
            selectedKey={selectedIndex}
            onSelectionChange={setSelectedIndex}
            className="max-w-full overflow-auto md:max-w-lg lg:max-w-2xl"
            classNames={{
              wrapper: "h-full max-h-full flex-1",
              // base: "bg-red-300 p-3 h-full max-h-full border-red-500",

              cursor: "",
              tab: "h-full text-left px-0",
              tabContent: "text-white/80 w-full",
              tabList: "border-slate-100/10 max-h-full w-full",
            }}
          >
            {(feature) => (
              <Tab
                key={String(feature.index)}
                /* TAB TITLE */
                title={
                  <div className={cn("group relative rounded-full p-4 ")}>
                    <h3
                      className={cn(
                        "font-semibold text-sm lg:text-[clamp(1rem,1rem+0.25vw,1.25rem)]"
                      )}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-2 hidden text-sm lg:block w-full text-wrap"
                      )}
                    >
                      {feature.description}
                    </p>
                  </div>
                }
              >
                {/* IMAGES ON THE RIGHT SIDE */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedIndex}
                    animate={{
                      opacity: [0, 1],
                      scaleX: [0.8, 1],
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        ease: "easeInOut",
                        duration: 0.5,
                      },
                    }}
                    transition={{
                      duration: 0.8,
                    }}
                    className="flex-1 h-full w-full max-w-6xl items-center justify-center"
                  >
                    <NextImage
                      className="w-full h-full object-fill "
                      src={feature.image}
                      alt="feature image"
                    />
                  </motion.div>
                </AnimatePresence>
              </Tab>
            )}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
