"use client";

import OverlayLoader from "@/components/ui/overlay-loader";

export default function LoadWorkspaceDetails({}) {
  return (
    <OverlayLoader
      description="Your workspace is being prepared. Please wait..."
      show={true}
      title="Initializing Workspace"
    />
  );
}
