import React from 'react';

import { Button } from '@/components/ui/button';

import {
  FloatingCircle,
  FloatingRectangle,
  ConnectingLine,
  GradientOrb,
  DecorativeStar,
  FloatingBook,
  FloatingUniversity,
  FloatingCorporate,
  FloatingBusiness,
  FloatingFinance,
  FloatingSecurity,
  SubscriptionBackgroundSVG,
} from './floating-shapes';

export default function SubScriptionLandingSection({
  // startPayment,
  navigateTo,
}: {
  startPayment: () => void;
  navigateTo: (index: number) => void;
}) {
  return (
    <div className="relative container mx-auto overflow-hidden ">
      {/* Large static subscription background illustration */}
      <SubscriptionBackgroundSVG />

      {/* Background decorative elements with educational icons */}
      <FloatingCircle className="top-20 left-10" delay={0} />
      <FloatingRectangle className="top-32 right-20" delay={1} />
      <GradientOrb className="bottom-32 left-20" delay={2} />
      <ConnectingLine className="top-40 left-1/4" />

      {/* Educational floating elements */}
      <FloatingUniversity className="bottom-48 right-1/6" delay={3} />
      <FloatingBook className="bottom-24 right-12" delay={2.5} />

      {/* Corporate floating elements */}
      {/* <FloatingOffice className="top-16 right-1/4" delay={0.5} /> */}
      <FloatingCorporate className="bottom-20 left-1/4" delay={2.8} />
      <FloatingBusiness
        className="top-80 left-16 hidden lg:block"
        delay={1.8}
      />
      <FloatingFinance className="bottom-60 right-16" delay={3.5} />
      {/* <FloatingDocuments className="top-40 right-1/3" delay={1.2} /> */}
      <FloatingSecurity className="bottom-40 right-1/4 " delay={4} />

      {/* Stars */}
      <DecorativeStar className="top-16 left-1/3" size={16} />
      <DecorativeStar className="top-64 right-1/4" size={24} />
      <DecorativeStar className="bottom-40 right-10" size={20} />
      <DecorativeStar className="bottom-20 left-1/2" size={18} />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Hero text with creative layout */}
          <div className="relative mb-12">
            {/* "bring" with arrow and shapes */}
            <div className="flex items-center justify-center mb-4 flex-wrap gap-4">
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900">
                subscription
              </h1>

              {/* Arrow with gradient circle */}
              <div className="relative mx-4">
                {/* <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  className="animate-pulse"
                >
                  <defs>
                    <linearGradient
                      id="arrowCircle"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                  </defs>
                  <circle cx="40" cy="40" r="35" fill="url(#arrowCircle)" />
                  <path
                    d="M25 40 L50 40 M42 32 L50 40 L42 48"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg> */}
              </div>

              {/* Gradient capsules */}
              <div className="hidden lg:flex gap-2">
                <div className="w-24 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-float" />
                <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center animate-float-delayed">
                  <div className="w-8 h-8 rounded-full bg-blue-200" />
                </div>
                <div className="w-20 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-float flex items-center justify-center">
                  <svg
                    className="text-white"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <circle cx="12" cy="12" fill="currentColor" r="3" />
                    <circle cx="18" cy="8" fill="currentColor" r="2" />
                    <circle cx="6" cy="16" fill="currentColor" r="2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center mb-4 flex-wrap gap-4">
              <div className="relative hidden lg:block">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-float-delayed flex items-center justify-center">
                  <div className="w-3 h-8 bg-gray-900 rounded-full" />
                </div>

                <svg className="absolute -right-8 top-8" height="20" width="60">
                  <path
                    d="M0 10 L60 10"
                    stroke="#6B7280"
                    strokeDasharray="4,4"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <h2 className="text-6xl md:text-8xl font-bold text-gray-900 lg:ml-12">
                payments
              </h2>

              {/* Toggle switch design */}
              <div className="ml-6 absolute left-1/2 -top-16 hidden lg:flex">
                <div className="w-24 h-12 bg-gray-900 rounded-full flex items-center px-2">
                  <div className="w-8 h-8 bg-green-400 rounded-full animate-pulse" />
                  <div className="flex-1 h-1 bg-gray-600 mx-2 rounded" />
                  <div className="w-6 h-6 bg-blue-400 rounded-full" />
                </div>
                {/* Dashed line extending */}
                {/* <svg
                  className="absolute bg-transparent -right-16 top-6"
                  width="80"
                  height="20"
                >
                  <path
                    d="M0 10 Q40 0 80 10"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />
                </svg> */}
              </div>
            </div>

            {/* "together" with overlapping circles */}
            <div className="flex items-center justify-center flex-wrap gap-4">
              <div className="relative hidden lg:flex">
                {/* Dashed connecting line from above */}
                <svg className="absolute -top-8 left-8" height="40" width="40">
                  <path
                    d="M20 0 Q10 20 20 40"
                    fill="none"
                    stroke="#6B7280"
                    strokeDasharray="4,4"
                    strokeWidth="2"
                  />
                </svg>

                {/* Overlapping gradient circles */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-float" />
                  <div className="absolute top-4 left-8 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-float-delayed opacity-90" />
                  <div className="absolute top-8 left-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <svg
                      className="text-gray-700"
                      height="16"
                      viewBox="0 0 16 16"
                      width="16"
                    >
                      <circle cx="4" cy="4" fill="currentColor" r="1.5" />
                      <circle cx="12" cy="4" fill="currentColor" r="1.5" />
                      <circle cx="8" cy="12" fill="currentColor" r="1.5" />
                      <path
                        d="M4 4 L12 4 M8 4 L8 12"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 lg:ml-80">
                made easy
              </h1>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            from school fees and corporate memberships to utilities and more -
            <br />
            right from your device, anywhere. 🙌
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <Button
              className="bg-primary-900 hover:bg-gray-800 text-white px-8 py-6 text-lg  shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              size="lg"
              onPress={() => navigateTo(1)}
            >
              Make a Payment
            </Button>
            <Button
              className="text-gray-600 hover:text-gray-900 px-8 py-6 text-lg"
              size="lg"
              variant="light"
              onPress={() => navigateTo(2)}
            >
              See how it work →
            </Button>
          </div>

          {/* Additional floating elements for visual interest */}
          <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div className="absolute top-1/3 right-12 transform -translate-y-1/2">
            <div className="w-6 h-6 bg-yellow-400 rotate-45 animate-float" />
          </div>
        </div>
      </div>
    </div>
  );
}
