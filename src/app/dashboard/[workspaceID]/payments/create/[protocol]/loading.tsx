"use client";

import OverlayLoader from "@/components/ui/overlay-loader";

export default function PaymentActionLoading({}) {
  return (
    <OverlayLoader
      description="Preparing your payment action..."
      show={true}
      title="Please wait"
    />
  );
}
