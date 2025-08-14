import {
  BookOpen,
  GraduationCap,
  School,
  University,
  Book,
  Building,
  Building2,
  Briefcase,
  CircleDollarSign,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import React from 'react';

export const FloatingCircle = ({ className = '', delay = 0 }) => (
  <div
    className={`absolute animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <svg className="drop-shadow-lg" height="80" viewBox="0 0 80 80" width="80">
      <defs>
        <linearGradient
          id="circleGradient1"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" fill="url(#circleGradient1)" r="35" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <BookOpen className="w-8 h-8 text-white animate-pulse" />
    </div>
  </div>
);

export const FloatingRectangle = ({ className = '', delay = 0 }) => (
  <div
    className={`absolute animate-float-delayed ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <svg
      className="drop-shadow-lg"
      height="60"
      viewBox="0 0 120 60"
      width="120"
    >
      <defs>
        <linearGradient id="rectGradient1" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <rect
        fill="url(#rectGradient1)"
        height="50"
        rx="25"
        width="110"
        x="5"
        y="5"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <GraduationCap className="w-8 h-8 text-white" />
    </div>
  </div>
);

export const ConnectingLine = ({ className = '' }) => (
  <div className={`absolute ${className}`}>
    <svg className="opacity-60" height="100" viewBox="0 0 200 100" width="200">
      <defs>
        <linearGradient id="lineGradient1" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <path
        className="animate-pulse"
        d="M 10 50 Q 100 10 190 50"
        fill="none"
        stroke="url(#lineGradient1)"
        strokeDasharray="10,5"
        strokeWidth="3"
      />
      <circle cx="10" cy="50" fill="#8B5CF6" r="4" />
      <circle cx="190" cy="50" fill="#10B981" r="4" />
    </svg>
  </div>
);

export const GradientOrb = ({ className = '', delay = 0 }) => (
  <div
    className={`absolute animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <svg
      className="drop-shadow-xl"
      height="100"
      viewBox="0 0 100 100"
      width="100"
    >
      <defs>
        <radialGradient cx="30%" cy="30%" id="orbGradient1">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#EC4899" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" fill="url(#orbGradient1)" opacity="0.9" r="45" />
      <circle cx="35" cy="35" fill="white" opacity="0.6" r="8" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <School className="w-10 h-10 text-white" />
    </div>
  </div>
);

export const DecorativeStar = ({ className = '', size = 20 }) => (
  <div className={`absolute animate-pulse ${className}`}>
    <svg
      className="text-yellow-400"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor"
      />
    </svg>
  </div>
);

// Educational floating elements
export const FloatingBook = ({ className = '', delay = 0 }) => (
  <div
    className={`absolute animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg flex items-center justify-center">
      <Book className="w-8 h-8 text-white" />
    </div>
  </div>
);

export const FloatingUniversity = ({ className = '', delay = 0 }) => (
  <div
    className={`absolute animate-float-delayed ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center">
      <University className="w-10 h-10 text-white" />
    </div>
  </div>
);

// Corporate floating elements
export const FloatingOffice = ({ className = '', delay = 0 }) => (
  <div
    className={`absolute animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-18 h-18 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg shadow-lg flex items-center justify-center">
      <Building className="w-9 h-9 text-white" />
    </div>
  </div>
);

export const FloatingCorporate = ({ className = '', delay = 0 }) => (
  <div
    className={`absolute animate-float-delayed ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full shadow-lg flex items-center justify-center">
      <Building2 className="w-8 h-8 text-white" />
    </div>
  </div>
);

export const FloatingBusiness = ({ className = '', delay = 0 }) => (
  <div
    className={`absolute animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg shadow-lg flex items-center justify-center">
      <Briefcase className="w-7 h-7 text-white" />
    </div>
  </div>
);

export const FloatingFinance = ({ className = '', delay = 0 }) => (
  <div
    className={`absolute animate-float-delayed ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full shadow-lg flex items-center justify-center">
      <CircleDollarSign className="w-10 h-10 text-white" />
    </div>
  </div>
);

export const FloatingDocuments = ({ className = '', delay = 0 }) => (
  <div
    className={`absolute animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg flex items-center justify-center">
      <FileText className="w-8 h-8 text-white" />
    </div>
  </div>
);

export const FloatingSecurity = ({ className = '', delay = 0 }) => (
  <div
    className={`absolute animate-float-delayed ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-18 h-18 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-lg flex items-center justify-center">
      <ShieldCheck className="w-9 h-9 text-white" />
    </div>
  </div>
);

// Large static subscription illustration background
export const SubscriptionBackgroundSVG = ({ className = '' }) => (
  <div
    className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
  >
    <svg className="opacity-5" height="600" viewBox="0 0 800 600" width="800">
      <defs>
        <linearGradient
          id="subscriptionGradient"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>

      {/* Main subscription card outline */}
      <rect
        fill="none"
        height="300"
        rx="20"
        stroke="url(#subscriptionGradient)"
        strokeDasharray="15,10"
        strokeWidth="3"
        width="400"
        x="200"
        y="150"
      />

      {/* Header section */}
      <rect
        fill="none"
        height="60"
        rx="10"
        stroke="url(#subscriptionGradient)"
        strokeDasharray="8,5"
        strokeWidth="2"
        width="360"
        x="220"
        y="170"
      />

      {/* Title placeholder */}
      <rect
        fill="none"
        height="12"
        rx="6"
        stroke="url(#subscriptionGradient)"
        strokeWidth="1.5"
        width="120"
        x="240"
        y="185"
      />
      <rect
        fill="none"
        height="8"
        rx="4"
        stroke="url(#subscriptionGradient)"
        strokeWidth="1"
        width="80"
        x="240"
        y="205"
      />

      {/* Price circle */}
      <circle
        cx="520"
        cy="200"
        fill="none"
        r="25"
        stroke="url(#subscriptionGradient)"
        strokeDasharray="5,3"
        strokeWidth="2"
      />
      <text
        className="text-xs"
        fill="url(#subscriptionGradient)"
        textAnchor="middle"
        x="520"
        y="205"
      >
        $
      </text>

      {/* Feature list */}
      <g>
        <circle
          cx="250"
          cy="270"
          fill="none"
          r="4"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1.5"
        />
        <rect
          fill="none"
          height="8"
          rx="4"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1"
          width="200"
          x="265"
          y="265"
        />

        <circle
          cx="250"
          cy="295"
          fill="none"
          r="4"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1.5"
        />
        <rect
          fill="none"
          height="8"
          rx="4"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1"
          width="150"
          x="265"
          y="290"
        />

        <circle
          cx="250"
          cy="320"
          fill="none"
          r="4"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1.5"
        />
        <rect
          fill="none"
          height="8"
          rx="4"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1"
          width="180"
          x="265"
          y="315"
        />

        <circle
          cx="250"
          cy="345"
          fill="none"
          r="4"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1.5"
        />
        <rect
          fill="none"
          height="8"
          rx="4"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1"
          width="120"
          x="265"
          y="340"
        />
      </g>

      {/* Action button */}
      <rect
        fill="none"
        height="40"
        rx="20"
        stroke="url(#subscriptionGradient)"
        strokeDasharray="10,5"
        strokeWidth="2"
        width="300"
        x="250"
        y="380"
      />

      {/* Decorative elements around the card */}
      <circle
        cx="150"
        cy="120"
        fill="none"
        r="15"
        stroke="url(#subscriptionGradient)"
        strokeDasharray="3,2"
        strokeWidth="2"
      />
      <circle
        cx="680"
        cy="180"
        fill="none"
        r="20"
        stroke="url(#subscriptionGradient)"
        strokeDasharray="4,3"
        strokeWidth="2"
      />
      <circle
        cx="120"
        cy="400"
        fill="none"
        r="12"
        stroke="url(#subscriptionGradient)"
        strokeDasharray="2,1"
        strokeWidth="1.5"
      />
      <circle
        cx="720"
        cy="450"
        fill="none"
        r="18"
        stroke="url(#subscriptionGradient)"
        strokeDasharray="5,3"
        strokeWidth="2"
      />

      {/* Connecting lines */}
      <path
        d="M 100 300 Q 150 250 200 280"
        fill="none"
        stroke="url(#subscriptionGradient)"
        strokeDasharray="6,4"
        strokeWidth="1.5"
      />
      <path
        d="M 600 150 Q 650 100 700 130"
        fill="none"
        stroke="url(#subscriptionGradient)"
        strokeDasharray="6,4"
        strokeWidth="1.5"
      />
      <path
        d="M 150 500 Q 200 480 250 500"
        fill="none"
        stroke="url(#subscriptionGradient)"
        strokeDasharray="6,4"
        strokeWidth="1.5"
      />
    </svg>
  </div>
);
