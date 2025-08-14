'use client';

import { Card, CardBody, Link } from '@heroui/react';
import { ArrowLeft, Home, RefreshCw, MessageCircle, Zap } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Footer } from '@/components/landing-sections/footer';
import { Button } from '@/components/ui/button';
import { DefaultCover } from '@/lib/constants';

import type React from 'react';

const errorMessages = {
  404: {
    title: 'Page Not Found',
    subtitle:
      "The page you're looking for seems to have wandered off into the digital wilderness.",
    emoji: '🔍',
  },
  500: {
    title: 'Server Error',
    subtitle: "Our servers are having a moment. We're on it!",
    emoji: '⚡',
  },
  403: {
    title: 'Access Denied',
    subtitle: "You don't have permission to access this resource.",
    emoji: '🔒',
  },
  default: {
    title: 'Something Went Wrong',
    subtitle:
      "Don't worry, even the best explorers sometimes take a wrong turn.",
    emoji: '🚀',
  },
};

const quickLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: Zap },
  { name: 'Support', href: '/support', icon: MessageCircle },
];

export default function ErrorPage() {
  const params = useParams();
  const code = params.code || '404';
  const [errorCode, setErrorCode] = useState<keyof typeof errorMessages>(
    code as keyof typeof errorMessages,
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const currentError = errorMessages[errorCode] || errorMessages.default;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 bg-purple-200/30 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x / 10,
            top: mousePosition.y / 10,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-200/30 dark:bg-blue-500/20 rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-indigo-200/30 dark:bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />
      </div>
      <div className="flex h-full flex-col items-center bg-center last:bg-cover md:px-5 md:pt-2">
        <div className="relative h-[300px] w-full overflow-clip bg-gray-900 md:h-[520px] md:rounded-4xl">
          <Image
            unoptimized
            alt="Cover"
            className="z-0 h-full w-full object-cover"
            height={500}
            loading="lazy"
            src={DefaultCover}
            width={1024}
          />
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/30 via-black/5 to-transparent" />
        </div>
        <div className="md:flex-0 absolute top-12 md:top-0 z-10 mx-auto flex w-full shrink-0 flex-col px-4">
          {/* Main Error Content */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
            <div className="text-center mb-12 max-w-2xl">
              <div className="text-8xl mb-6 animate-bounce">
                {currentError.emoji}
              </div>

              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-tr from-white via-primary-50 to-primary-300 bg-clip-text text-transparent mb-4 animate-pulse">
                {errorCode}
              </h1>

              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                {currentError.title}
              </h2>

              <p className="text-base text-muted-foreground md:text-white dark:text-gray-400 mb-8 leading-relaxed">
                {currentError.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <Button
                  className="h-12 px-6 md:border-white md:text-white"
                  size="lg"
                  startContent={<ArrowLeft className="w-4 h-4 mr-2" />}
                  variant="bordered"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>

                <Button
                  className="h-12 px-6 bg-transparent md:border-white md:text-white"
                  disabled={isRefreshing}
                  size="lg"
                  startContent={
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                    />
                  }
                  variant="bordered"
                  onClick={handleRefresh}
                >
                  Refresh
                </Button>

                <Button
                  as={Link}
                  className="h-12 px-6 bg-gradient-to-tr from-secondary to-primary-500 hover:from-purple-700 hover:to-blue-700"
                  href={'/'}
                  size="lg"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <Card className="w-full max-w-4xl  bg-card/60 dark:bg-card/80 backdrop-blur-sm border-0 shadow-lg shadow-primary-50/10">
              <CardBody className="p-8">
                <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
                  Quick Navigation
                </h3>
                <div className="flex flex-col sm:flex-wrap sm:flex-row md:flex-nowrap gap-4">
                  {quickLinks.map((link) => (
                    <Button
                      key={link.name}
                      as={Link}
                      className="h-20 flex-1 flex-col gap-2 bg-transparent hover:bg-primary/5 dark:hover:bg-secondary/10 transition-all duration-300 hover:scale-105"
                      href={link.href}
                      variant="faded"
                    >
                      <link.icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{link.name}</span>
                    </Button>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Still need help?{' '}
                <Link
                  className="text-secondary dark:text-secondary hover:underline text-sm font-medium"
                  href="mailto:fintech@bgsgroup.co.zm"
                  onClick={() => (window.location.href = '/support')}
                >
                  Contact our support team
                </Link>
              </p>
            </div>

            <Footer
              classNames={{ wrapper: 'w-full' }}
              showLinks={false}
              showLogo={false}
            />
          </div>
          {/* End Main Error Content */}
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-300/50 dark:bg-purple-500/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
