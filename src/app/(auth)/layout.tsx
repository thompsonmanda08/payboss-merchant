'use client';
import BackgroundSVG from '@/components/base/background-svg';
import Logo from '@/components/base/payboss-logo';
import { LadyBoss } from '@/components/landing-sections/hero-like-a-boss';
import { backgroundAuthImage, DefaultCover } from '@/lib/constants';
import { Mail, UserCheck2 } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // return
  return (
    <div className="h-screen w-screen bg-background flex flex-row">
      {/* Left Panel - Auth Forms */}
      <div className="fixed bg-white p-4 rounded-full left-16 md:left-12 top-8  z-50">
        <Logo isBlack className=" " />
      </div>
      <div className="hidden lg:flex flex-1 items-end justify-end relative">
        <div className="absolute bottom-0 right-0"></div>
        <LadyBoss className="z-50 fixed left-1/4  bottom-0" />

        <div
          className="w-full h-full relative overflow-clip z-10 "
          style={{
            borderTopRightRadius: '80px',
            borderBottomRightRadius: '80px',
            background:
              'linear-gradient(135deg, #111827 0%, #374151 50%, #000000 100%)',
          }}
        >
          <BackgroundSVG className={'-top-1 bg-secondary/30 z-10'} />

          <Image
            priority
            unoptimized
            alt="Official Cover Image"
            className="w-full h-full object-cover z-0"
            height={800}
            src={backgroundAuthImage}
            width={1000}
          />
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
