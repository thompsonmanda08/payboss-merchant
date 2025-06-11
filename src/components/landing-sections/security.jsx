import React from "react";
import {
  Shield,
  Lock,
  Eye,
  Fingerprint,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const securityFeatures = [
  {
    icon: Shield,
    title: "FDIC Insured",
    description:
      "Your deposits are protected up to $250,000 by FDIC insurance.",
  },
  {
    icon: Lock,
    title: "256-bit Encryption",
    description:
      "Bank-level encryption protects all your data and transactions.",
  },
  {
    icon: Fingerprint,
    title: "Biometric Security",
    description: "Use fingerprint or face recognition for secure app access.",
  },
  {
    icon: Eye,
    title: "Real-time Monitoring",
    description: "24/7 fraud detection and instant suspicious activity alerts.",
  },
  {
    icon: AlertTriangle,
    title: "Instant Card Controls",
    description:
      "Freeze, unfreeze, or set spending limits on your cards instantly.",
  },
  {
    icon: CheckCircle,
    title: "Zero Liability",
    description: "You're never responsible for unauthorized transactions.",
  },
];

export default function Security() {
  return (
    <section id="security" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Your security is our
                <span className="block text-emerald-400">top priority</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                We use the same security standards as major banks, with
                additional layers of protection to keep your money and data
                safe.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">
                  Security Guarantee
                </span>
              </div>
              <p className="text-gray-300">
                If your account is ever compromised due to a security breach on
                our end, we'll refund any losses and provide $1 million identity
                theft protection at no cost to you.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl p-8 text-white">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Security Score</h3>
                  <div className="text-4xl font-bold">A+</div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Encryption Level</span>
                    <span className="font-semibold">Military Grade</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 w-full"></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Fraud Detection</span>
                    <span className="font-semibold">99.9% Accurate</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 w-full"></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Uptime Guarantee</span>
                    <span className="font-semibold">99.99%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 w-full"></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="text-sm opacity-90">Certified by:</div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="bg-white/20 px-3 py-1 rounded text-sm">
                      SOC 2
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded text-sm">
                      PCI DSS
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded text-sm">
                      ISO 27001
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
