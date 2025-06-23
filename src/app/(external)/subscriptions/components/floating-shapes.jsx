import React from "react";
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
  DollarSign,
  FileText,
  Shield,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

export const FloatingCircle = ({ className = "", delay = 0 }) => (
  <div
    className={`absolute animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-lg">
      <defs>
        <linearGradient
          id="circleGradient1"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="35" fill="url(#circleGradient1)" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <BookOpen className="w-8 h-8 text-white animate-pulse" />
    </div>
  </div>
);

export const FloatingRectangle = ({ className = "", delay = 0 }) => (
  <div
    className={`absolute animate-float-delayed ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <svg
      width="120"
      height="60"
      viewBox="0 0 120 60"
      className="drop-shadow-lg"
    >
      <defs>
        <linearGradient id="rectGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <rect
        x="5"
        y="5"
        width="110"
        height="50"
        rx="25"
        fill="url(#rectGradient1)"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <GraduationCap className="w-8 h-8 text-white" />
    </div>
  </div>
);

export const ConnectingLine = ({ className = "" }) => (
  <div className={`absolute ${className}`}>
    <svg width="200" height="100" viewBox="0 0 200 100" className="opacity-60">
      <defs>
        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <path
        d="M 10 50 Q 100 10 190 50"
        stroke="url(#lineGradient1)"
        strokeWidth="3"
        fill="none"
        strokeDasharray="10,5"
        className="animate-pulse"
      />
      <circle cx="10" cy="50" r="4" fill="#8B5CF6" />
      <circle cx="190" cy="50" r="4" fill="#10B981" />
    </svg>
  </div>
);

export const GradientOrb = ({ className = "", delay = 0 }) => (
  <div
    className={`absolute animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      className="drop-shadow-xl"
    >
      <defs>
        <radialGradient id="orbGradient1" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#EC4899" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#orbGradient1)" opacity="0.9" />
      <circle cx="35" cy="35" r="8" fill="white" opacity="0.6" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <School className="w-10 h-10 text-white" />
    </div>
  </div>
);

export const DecorativeStar = ({ className = "", size = 20 }) => (
  <div className={`absolute animate-pulse ${className}`}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="text-yellow-400"
    >
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor"
      />
    </svg>
  </div>
);

// Educational floating elements
export const FloatingBook = ({ className = "", delay = 0 }) => (
  <div
    className={`absolute animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg flex items-center justify-center">
      <Book className="w-8 h-8 text-white" />
    </div>
  </div>
);

export const FloatingUniversity = ({ className = "", delay = 0 }) => (
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
export const FloatingOffice = ({ className = "", delay = 0 }) => (
  <div
    className={`absolute animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-18 h-18 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg shadow-lg flex items-center justify-center">
      <Building className="w-9 h-9 text-white" />
    </div>
  </div>
);

export const FloatingCorporate = ({ className = "", delay = 0 }) => (
  <div
    className={`absolute animate-float-delayed ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full shadow-lg flex items-center justify-center">
      <Building2 className="w-8 h-8 text-white" />
    </div>
  </div>
);

export const FloatingBusiness = ({ className = "", delay = 0 }) => (
  <div
    className={`absolute animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg shadow-lg flex items-center justify-center">
      <Briefcase className="w-7 h-7 text-white" />
    </div>
  </div>
);

export const FloatingFinance = ({ className = "", delay = 0 }) => (
  <div
    className={`absolute animate-float-delayed ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full shadow-lg flex items-center justify-center">
      <CircleDollarSign className="w-10 h-10 text-white" />
    </div>
  </div>
);

export const FloatingDocuments = ({ className = "", delay = 0 }) => (
  <div
    className={`absolute animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg flex items-center justify-center">
      <FileText className="w-8 h-8 text-white" />
    </div>
  </div>
);

export const FloatingSecurity = ({ className = "", delay = 0 }) => (
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
export const SubscriptionBackgroundSVG = ({ className = "" }) => (
  <div
    className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
  >
    <svg width="800" height="600" viewBox="0 0 800 600" className="opacity-5">
      <defs>
        <linearGradient
          id="subscriptionGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>

      {/* Main subscription card outline */}
      <rect
        x="200"
        y="150"
        width="400"
        height="300"
        rx="20"
        fill="none"
        stroke="url(#subscriptionGradient)"
        strokeWidth="3"
        strokeDasharray="15,10"
      />

      {/* Header section */}
      <rect
        x="220"
        y="170"
        width="360"
        height="60"
        rx="10"
        fill="none"
        stroke="url(#subscriptionGradient)"
        strokeWidth="2"
        strokeDasharray="8,5"
      />

      {/* Title placeholder */}
      <rect
        x="240"
        y="185"
        width="120"
        height="12"
        rx="6"
        fill="none"
        stroke="url(#subscriptionGradient)"
        strokeWidth="1.5"
      />
      <rect
        x="240"
        y="205"
        width="80"
        height="8"
        rx="4"
        fill="none"
        stroke="url(#subscriptionGradient)"
        strokeWidth="1"
      />

      {/* Price circle */}
      <circle
        cx="520"
        cy="200"
        r="25"
        fill="none"
        stroke="url(#subscriptionGradient)"
        strokeWidth="2"
        strokeDasharray="5,3"
      />
      <text
        x="520"
        y="205"
        textAnchor="middle"
        className="text-xs"
        fill="url(#subscriptionGradient)"
      >
        $
      </text>

      {/* Feature list */}
      <g>
        <circle
          cx="250"
          cy="270"
          r="4"
          fill="none"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1.5"
        />
        <rect
          x="265"
          y="265"
          width="200"
          height="8"
          rx="4"
          fill="none"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1"
        />

        <circle
          cx="250"
          cy="295"
          r="4"
          fill="none"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1.5"
        />
        <rect
          x="265"
          y="290"
          width="150"
          height="8"
          rx="4"
          fill="none"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1"
        />

        <circle
          cx="250"
          cy="320"
          r="4"
          fill="none"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1.5"
        />
        <rect
          x="265"
          y="315"
          width="180"
          height="8"
          rx="4"
          fill="none"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1"
        />

        <circle
          cx="250"
          cy="345"
          r="4"
          fill="none"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1.5"
        />
        <rect
          x="265"
          y="340"
          width="120"
          height="8"
          rx="4"
          fill="none"
          stroke="url(#subscriptionGradient)"
          strokeWidth="1"
        />
      </g>

      {/* Action button */}
      <rect
        x="250"
        y="380"
        width="300"
        height="40"
        rx="20"
        fill="none"
        stroke="url(#subscriptionGradient)"
        strokeWidth="2"
        strokeDasharray="10,5"
      />

      {/* Decorative elements around the card */}
      <circle
        cx="150"
        cy="120"
        r="15"
        fill="none"
        stroke="url(#subscriptionGradient)"
        strokeWidth="2"
        strokeDasharray="3,2"
      />
      <circle
        cx="680"
        cy="180"
        r="20"
        fill="none"
        stroke="url(#subscriptionGradient)"
        strokeWidth="2"
        strokeDasharray="4,3"
      />
      <circle
        cx="120"
        cy="400"
        r="12"
        fill="none"
        stroke="url(#subscriptionGradient)"
        strokeWidth="1.5"
        strokeDasharray="2,1"
      />
      <circle
        cx="720"
        cy="450"
        r="18"
        fill="none"
        stroke="url(#subscriptionGradient)"
        strokeWidth="2"
        strokeDasharray="5,3"
      />

      {/* Connecting lines */}
      <path
        d="M 100 300 Q 150 250 200 280"
        stroke="url(#subscriptionGradient)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="6,4"
      />
      <path
        d="M 600 150 Q 650 100 700 130"
        stroke="url(#subscriptionGradient)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="6,4"
      />
      <path
        d="M 150 500 Q 200 480 250 500"
        stroke="url(#subscriptionGradient)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="6,4"
      />
    </svg>
  </div>
);
