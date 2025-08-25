'use client';

import { Button } from '@heroui/react';
import { Image as NextImage } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

import { cn } from '@/lib/utils';

const features = [
  {
    title: 'Financial Management',
    description:
      ' From invoicing to expense tracking, PayBoss covers all aspects of your financial needs.',
    image: '/images/screenshots/home.png',
    index: 0,
  },
  {
    title: 'User-Friendly Interface',
    description:
      'Our platform is designed to be intuitive and easy to use, even for those with limited technical expertise.',
    image: '/images/screenshots/payments-empty.png',
    index: 1,
  },
  {
    title: 'Secure and Reliable',
    description:
      'We prioritize the security of your financial data with robust encryption and security protocols.',
    image: '/images/screenshots/payments-validation.png',
    index: 2,
  },
  {
    title: 'Customizable Solutions',
    description:
      'Tailor PayBoss features to fit your daily unique business requirements.',
    image: '/images/screenshots/api.png',
    index: 3,
  },
];

export function PrimaryFeatures() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVertical, setIsVertical] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % features.length);
    }, 5000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Media query for responsive layout
  useEffect(() => {
    const lgMediaQuery = window.matchMedia('(min-width: 1024px)');

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setIsVertical(matches);
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener('change', onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange);
    };
  }, []);

  const goToNext = () => {
    setSelectedIndex((prev) => (prev + 1) % features.length);
  };

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToSlide = (index: number) => {
    setSelectedIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentFeature = features[selectedIndex];

  return (
    <section
      aria-label="why pay-boss"
      className="relative overflow-hidden bg-primary w-screen pb-28 pt-20 sm:py-32"
      id="why-pay-boss"
    >
      <Image
        alt="bg-features-image"
        className="absolute left-0 right-0 top-0"
        height={1080}
        loading="lazy"
        src={'/images/background-features.jpg'}
        width={2220}
      />
      <div className="relative container mx-auto w-full gap-8 flex flex-col items-center">
        {/* Header */}
        <div className="max-w-2xl mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display heading-1 tracking-tight text-white sm:text-4xl md:text-5xl">
            Why Choose PayBoss?
          </h2>
          <p className="mt-6 text-lg tracking-tight text-blue-100">
            {
              "Well everything you need if you aren't that picky about minor details like compliance."
            }
          </p>
        </div>

        {/* Carousel Container */}
        <div className="w-full max-w-7xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:flex gap-8 items-center">
            {/* Feature Info - Left Side */}
            <div className="flex-1 max-w-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.3 }}
                  className="text-left"
                >
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {currentFeature.title}
                  </h3>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    {currentFeature.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="flex items-center gap-4 mt-8">
                <Button
                  isIconOnly
                  variant="bordered"
                  className="border-white/20 text-white hover:bg-white/10"
                  onPress={goToPrevious}
                >
                  <ChevronLeft size={20} />
                </Button>

                <Button
                  isIconOnly
                  variant="bordered"
                  className="border-white/20 text-white hover:bg-white/10"
                  onPress={togglePlayPause}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>

                <Button
                  isIconOnly
                  variant="bordered"
                  className="border-white/20 text-white hover:bg-white/10"
                  onPress={goToNext}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>

            {/* Feature Image - Right Side */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  <NextImage
                    alt={`${currentFeature.title} screenshot`}
                    className="w-full h-auto object-cover rounded-lg shadow-2xl"
                    height={470}
                    src={currentFeature.image}
                    width={1280}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Image */}
                <div className="mb-6">
                  <NextImage
                    alt={`${currentFeature.title} screenshot`}
                    className="w-full h-auto object-cover rounded-lg shadow-xl"
                    height={300}
                    src={currentFeature.image}
                    width={600}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {currentFeature.title}
                </h3>
                <p className="text-blue-100 text-base leading-relaxed mb-6 px-4">
                  {currentFeature.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Mobile Navigation */}
            <div className="flex justify-center items-center gap-3">
              <Button
                isIconOnly
                size="sm"
                variant="bordered"
                className="border-white/20 text-white hover:bg-white/10"
                onPress={goToPrevious}
              >
                <ChevronLeft size={16} />
              </Button>

              <Button
                isIconOnly
                size="sm"
                variant="bordered"
                className="border-white/20 text-white hover:bg-white/10"
                onPress={togglePlayPause}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </Button>

              <Button
                isIconOnly
                size="sm"
                variant="bordered"
                className="border-white/20 text-white hover:bg-white/10"
                onPress={goToNext}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8 z-30">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-3 h-3 md:w-4 md:h-4 rounded-full z-30 transition-all duration-300',
                  selectedIndex === index
                    ? 'bg-white scale-110'
                    : 'bg-gray-300/50 hover:bg-white/50',
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mt-6 bg-white/20 rounded-full h-1 overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              key={selectedIndex}
              transition={{ duration: isPlaying ? 4 : 0, ease: 'linear' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
