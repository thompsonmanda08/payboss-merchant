'use client';

import OverlayLoader from '@/components/ui/overlay-loader';

export default function LoadingPage({}) {
  return (
    <OverlayLoader
      description="Please be patient while we load your profile"
      show={true}
      title="Please wait"
    />
  );
}
