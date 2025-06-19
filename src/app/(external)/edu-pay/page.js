"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import useCustomTabsHook from "@/hooks/use-custom-tabs";
import { Button } from "@/components/ui/button";

import EduLandingSection from "./components/edu-landing-section";
import EduPaymentForm from "./components/edu-form";

export default function EduPayMiniApp() {
  const router = useRouter();

  const { activeTab, currentTabIndex, navigateForward, navigateBackwards } =
    useCustomTabsHook([
      <EduLandingSection
        key={"landing"}
        handleStartPayment={startPaymentProcess}
      />,
      <EduPaymentForm key={"payment"} />,
    ]);

  function startPaymentProcess() {
    navigateForward();
  }

  return (
    <div className="container mx-auto px-4">
      {" "}
      {currentTabIndex > 0 && (
        <Button
          className="border-none outline-none shadow-none"
          // color="default"
          size="lg"
          startContent={<ArrowLeft className="w-4 h-4" />}
          variant="light"
          onClick={navigateBackwards}
        >
          Back to Home
        </Button>
      )}
      {activeTab}
    </div>
  );
}
