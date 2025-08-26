'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import Spinner from './custom-spinner';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

function OverlayLoader({
  show,
  className,
  classNames,
  title = 'Please wait',
  description = 'Please wait while we prepare everything for you',
}: {
  show: boolean;
  className?: string;
  classNames?: {
    wrapper?: string;
    title?: string;
    spinner?: string;
    description?: string;
  };
  title?: string;
  description?: string;
}) {
  const [isOpen, setIsOpen] = useState(show || false);

  useEffect(() => {
    setIsOpen(show);

    return () => {
      setIsOpen(false);
    };
  }, [show]);

  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';

        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    isOpen && (
      <AnimatePresence>
        <motion.div
          animate="visible"
          className={cn(
            'absolute inset-0 z-[9999999] flex h-screen w-full items-center justify-center bg-gradient-to-br from-transparent via-card/80 to-secondary/20 backdrop-blur-sm',
            className,
            classNames?.wrapper,
          )}
          exit="exit"
          initial="hidden"
          transition={{ duration: 0.25 }}
          variants={overlayVariants}
        >
          <motion.div
            animate="visible"
            className="w-full max-w-md space-y-8 text-center"
            exit="exit"
            initial="hidden"
            transition={{ duration: 0.3 }}
            variants={modalVariants}
          >
            {/* Main Loading Spinner */}
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl" />
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border-border bg-card p-8 shadow-2xl shadow-primary/10">
                {/* <Loader2 className="h-10 w-10 animate-spin text-primary" /> */}
                <Spinner
                  className={classNames?.spinner}
                  // color="#ffffff"
                  size={60}
                />
              </div>
            </div>

            {/* Title and Subtitle */}
            <div className="space-y-3">
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                {title}
                <span className="inline-block w-8 text-left">{dots}</span>
              </h1>
              <p className="text-sm font-medium text-foreground/80">
                {description}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/50">
                <div className="h-1.5 animate-pulse rounded-full bg-gradient-to-r from-primary to-primary/80" />
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="flex justify-center space-x-3 opacity-60">
              <div className="h-4 w-4 animate-bounce rounded-full bg-secondary/80" />
              <div
                className="h-4 w-4 animate-bounce rounded-full bg-secondary/80"
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className="h-4 w-4 animate-bounce rounded-full bg-secondary/80"
                style={{ animationDelay: '0.2s' }}
              />
            </div>
          </motion.div>

          {/* Background Pattern */}
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -right-4 -top-4 h-72 w-72 animate-pulse rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 blur-3xl" />
            <div
              className="absolute -bottom-4 -left-4 h-72 w-72 animate-pulse rounded-full bg-gradient-to-tr from-secondary/5 to-primary/5 blur-3xl"
              style={{ animationDelay: '1s' }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    )
  );
}

export default OverlayLoader;
