"use client";

import OverlayLoader from "@/components/ui/overlay-loader";

export default function LoadingWorkspaceSettings({}) {
  return (
    <OverlayLoader
      description="Getting your workspace settings..."
      show={true}
      title="Please wait"
    />
  );
}
