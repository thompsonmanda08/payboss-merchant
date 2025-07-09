"use client";

import { useEffect } from "react";

import useCustomTabsHook from "@/hooks/use-custom-tabs";

import SubScriptionLandingSection from "./components/landing-section";
import SubscriptionPaymentForm from "./components/subscription-payment-form";
import HowItWorksSection from "./components/how-it-works";

export default function SubscriptionsMiniApp() {
  const { activeTab, navigateTo } = useCustomTabsHook([
    <HowItWorksSection key={"how-it-works"} navigateTo={goTo} />,
    // <SubScriptionLandingSection key={"landing"} navigateTo={goTo} />,
    <SubscriptionPaymentForm key={"payment"} navigateTo={goTo} />,
  ]);

  function goTo(index) {
    navigateTo(index);
  }

  // SCROLL TO TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return <div className="flex flex-1">{activeTab}</div>;
}
