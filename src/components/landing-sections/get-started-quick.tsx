import { UserPlus, CreditCard, TrendingUp, Shield } from 'lucide-react';
import React from 'react';

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up in Minutes',
    description:
      'Create your account with just your phone number. No paperwork, no waiting – get started immediately.',
    step: '01',
  },
  {
    icon: CreditCard,
    title: 'Get Your Card',
    description:
      'Receive your virtual card instantly and physical card within 2 business days. Start spending right away.',
    step: '02',
  },
  {
    icon: TrendingUp,
    title: 'Start Investing',
    description:
      'Set up automated investments with as little as $1. Our AI helps optimize your portfolio for maximum returns.',
    step: '03',
  },
  {
    icon: Shield,
    title: 'Stay Protected',
    description:
      'Enjoy peace of mind with real-time fraud monitoring, instant notifications, and comprehensive insurance.',
    step: '04',
  },
];

export default function HowItWorks() {
  return (
    <section
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
      id="how-it-works"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Get started in 4 simple steps
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join millions of users who have transformed their financial lives
            with PayFlow. It's easier than you think.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 lg:gap-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 z-10">
                  <div className="absolute top-1/2 left-full w-8 h-0.5 bg-blue-500 transform -translate-y-1/2" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
