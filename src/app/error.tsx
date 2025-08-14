// "use client";
// import Link from "next/link";
// import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
// import { useRouter } from "next/navigation";

// import Logo from "@/components/base/payboss-logo";
// import { Button } from "@/components/ui/button";

// import AuthLayout from "./(auth)/layout";

// export default function NotFound({ title, message, goBack }) {
//   const router = useRouter();

//   return (
//     <AuthLayout>
//       <Card className="mx-auto -mt-40 aspect-square w-full max-w-sm flex-auto p-6 font-inter">
//         <CardHeader>
//           <Logo
//             className="mx-auto"
//             classNames={{ wrapper: "mx-auto" }}
//             href="/"
//           />
//         </CardHeader>
//         <CardBody className="flex cursor-pointer select-none flex-col items-center justify-center p-0">
//           <p className="text-[clamp(32px,5vw,60px)] font-bold leading-normal  text-primary-700">
//             404
//           </p>
//           <h1 className="text-lg font-semibold capitalize text-gray-900">
//             {title || "Page not found"}
//           </h1>
//           <p className="text-center text-sm font-medium text-foreground/70">
//             {message || `Sorry, we couldn’t find the page you’re looking for.`}
//           </p>
//         </CardBody>

//         <CardFooter>
//           {goBack ? (
//             <Button className="w-full" onPress={() => router.back()}>
//               Go back
//             </Button>
//           ) : (
//             <Button as={Link} className="w-full" href="/">
//               Go back home
//             </Button>
//           )}
//         </CardFooter>
//       </Card>
//     </AuthLayout>
//   );
// }

'use client';

import { Card, CardBody } from '@heroui/react';
import {
  ArrowLeft,
  Home,
  RefreshCw,
  Mail,
  MessageCircle,
  Zap,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

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
  { name: 'Contact', href: '/contact', icon: Mail },
];

export default function ErrorPage() {
  const params = useParams();
  const code = params.code || '404';
  const [errorCode, setErrorCode] = useState<keyof typeof errorMessages>(
    code as keyof typeof errorMessages,
  );
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Error Code Selector */}
        <div className="mb-8 flex gap-2 flex-wrap justify-center">
          {Object.keys(errorMessages)
            .filter((key) => key !== 'default')
            .map((code) => (
              <Button
                key={code}
                className="text-xs"
                size="sm"
                variant={errorCode === code ? 'solid' : 'bordered'}
                onClick={() => setErrorCode(code as keyof typeof errorMessages)}
              >
                {code}
              </Button>
            ))}
        </div>

        {/* Main Error Content */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="text-8xl mb-6 animate-bounce">
            {currentError.emoji}
          </div>

          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-pulse">
            {errorCode}
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {currentError.title}
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {currentError.subtitle}
          </p>

          {/* Search Bar */}
          <form className="mb-8" onSubmit={handleSearch}>
            <div className="flex max-w-md mx-auto gap-2">
              {/* <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search for what you need..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div> */}
              <Button className="h-12 px-6" size="lg" type="submit">
                Go
              </Button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button
              className="h-12 px-6"
              size="lg"
              startContent={<ArrowLeft className="w-4 h-4 mr-2" />}
              variant="bordered"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>

            <Button
              className="h-12 px-6 bg-transparent"
              disabled={isRefreshing}
              isLoading={isRefreshing}
              loadingText="Refreshing..."
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
              className="h-12 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
              onClick={() => (window.location.href = '/')}
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <Card className="w-full max-w-4xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardBody className="p-8">
            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickLinks.map((link) => (
                <Button
                  key={link.name}
                  className="h-20 flex-col gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-300 hover:scale-105"
                  variant="ghost"
                  onClick={() => (window.location.href = link.href)}
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
            <button
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
              onClick={() => (window.location.href = '/support')}
            >
              Contact our support team
            </button>
          </p>
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
