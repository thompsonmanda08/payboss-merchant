"use client";

import OverlayLoader from "@/components/ui/overlay-loader";

export default function PaymentsLoading({}) {
  return (
    <OverlayLoader
      description="Initializing your payments page..."
      show={true}
      title="Please wait"
    />
  );
}
