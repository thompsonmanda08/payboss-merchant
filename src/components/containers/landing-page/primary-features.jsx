"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";

import { Container } from "@/components/base/Container";
import { AnimatePresence, motion } from "framer-motion";

const features = [
  {
    title: "Comprehensive Financial Management",
    description:
      " From invoicing to expense tracking, PayBoss covers all aspects of your financial needs.",
    image: "/images/screenshots/home.png",
  },
  {
    title: "User-Friendly Interface",
    description:
      "Our platform is designed to be intuitive and easy to use, even for those with limited technical expertise.",
    image: "/images/screenshots/payments-empty.png",
  },
  {
    title: "Secure and Reliable",
    description:
      "We prioritize the security of your financial data with robust encryption and security protocols.",
    image: "/images/screenshots/payments-validation.png",
  },
  {
    title: "Customizable Solutions",
    description:
      "Tailor PayBoss features to fit your daily unique business requirements.",
    image: "/images/screenshots/api.png",
  },
];

export function PrimaryFeatures() {
  let [tabOrientation, setTabOrientation] = useState("horizontal");

  useEffect(() => {
    let lgMediaQuery = window.matchMedia("(min-width: 1024px)");

    function onMediaQueryChange({ matches }) {
      setTabOrientation(matches ? "vertical" : "horizontal");
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener("change", onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener("change", onMediaQueryChange);
    };
  }, []);

  return (
    <section
      id="why-payboss"
      aria-label="why payboss for running your business"
      className="relative overflow-hidden bg-blue-600 w-screen pb-28 pt-20 sm:py-32 "
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none object-cover translate-x-[-44%] translate-y-[-42%]"
        src={"/images/background-features.jpg"}
        alt="feature image"
        width={2245}
        height={1636}
        unoptimized
      />
      <Container className="relative">
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
        <TabGroup
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === "vertical"}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <TabList className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        "group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6",
                        selectedIndex === featureIndex
                          ? "bg-background lg:bg-background/10 lg:ring-1 lg:ring-inset lg:ring-white/10"
                          : "hover:bg-background/10 lg:hover:bg-background/5"
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            "font-display text-lg ui-not-focus-visible:outline-none",
                            selectedIndex === featureIndex
                              ? "text-blue-600 lg:text-white"
                              : "text-blue-100 hover:text-white lg:text-white"
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          "mt-2 hidden text-sm lg:block",
                          selectedIndex === featureIndex
                            ? "text-white"
                            : "text-blue-100 group-hover:text-white"
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </TabList>
              </div>
              <AnimatePresence>
                <TabPanels className="lg:col-span-7">
                  {features.map((feature, index) => (
                    <TabPanel key={feature.title} unmount={false}>
                      <div className="relative sm:px-6 lg:hidden">
                        <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-background/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
                        <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                          {feature.description}
                        </p>
                      </div>
                      <motion.div
                        key={selectedIndex + index}
                        variants={{
                          hidden: { opacity: 1 },
                          show: {
                            opacity: 1,
                            transition: {
                              // staggerChildren: 0.25,
                              duration: 1,
                            },
                          },
                          exit: { opacity: 0 },
                        }}
                        initial={"hidden"}
                        animate={"show"}
                        exit={"exit"}
                        className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 dark:bg-foreground/5 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]"
                      >
                        <motion.div
                          variants={{
                            hidden: { opacity: 0 },
                            show: { opacity: 1 },
                            exit: { opacity: 0 },
                          }}
                          transition={{
                            duration: 0.8,
                          }}
                          className="flex flex-1 w-full h-full"
                        >
                          <Image
                            className="w-full"
                            src={feature.image}
                            width={1024}
                            height={768}
                            unoptimized
                            loading="lazy"
                            alt="feature image"
                            sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                          />
                        </motion.div>
                      </motion.div>
                    </TabPanel>
                  ))}
                </TabPanels>
              </AnimatePresence>
            </>
          )}
        </TabGroup>
      </Container>
    </section>
  );
}
