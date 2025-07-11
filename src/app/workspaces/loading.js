"use client";

import OverlayLoader from "@/components/ui/overlay-loader";

export default function LoadingPage({}) {
  return (
    <OverlayLoader
      description="Please be patient while we configure your session"
      show={true}
      title="Please wait"
    />
  );
}
