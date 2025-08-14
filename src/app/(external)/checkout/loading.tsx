'use client';

import OverlayLoader from '@/components/ui/overlay-loader';

export default function LoadingPage({}) {
  return (
    <OverlayLoader
      description="Please be patient while your checkout is being initialized"
      show={true}
      title="Please wait"
    />
  );
}
