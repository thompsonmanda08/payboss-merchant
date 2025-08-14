'use client';

import OverlayLoader from '@/components/ui/overlay-loader';

export default function LoadingPage({}) {
  return (
    <OverlayLoader
      description="Getting your Invoice settings..."
      show={true}
      title="Please wait"
    />
  );
}
