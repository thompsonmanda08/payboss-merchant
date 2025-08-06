import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowRight } from "lucide-react";

const HowItWorksSection = ({
  navigateTo,
}: {
  navigateTo: (index: number) => void;
}) => {
  return (
    <div className="grid flex-1">
      <div className="container relative w-full flex flex-col lg:flex-row items-center gap-8 mx-auto px-6">
        {/* LEFT SIDE */}
        <div className="text-center mb-8 flex-1">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
              Pay
            </h1>
            <div className="w-6 h-6 bg-primary-400 rotate-45 rounded-sm"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-2">
            smarter,
          </h1>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
            faster
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Seamlessly and pay all your recurring commitments – from school fees
            and corporate memberships and more.
          </p>

          <Button
            size="lg"
            onPress={() => navigateTo(1)}
            className="bg-primary-900 hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-fll"
            endContent={<ArrowRight className="w-6 h-6" />}
          >
            Make Payment
          </Button>
        </div>

        {/* Main illustration area */}
        <div className="relative flex-1 mx-auto">
          {/* Central gradient background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-gradient-to-br from-purple-400 via-blue-400 to-green-400 rounded-full opacity-80 blur-3xl"></div>
          </div>

          {/* Workflow cards */}
          <div className="relative grid grid-cols-1 max-w-md mx-auto gap-4">
            <div className="text-center mb-4">
              <h2 className="font-bold">How it works? Easy.</h2>
              <p className="text-foreground/50 max-w-md mx-auto">
                Complete 2 simple steps and you are good to go
              </p>
            </div>
            {/* Step 1 - Design */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  #1
                </div>
                <div className="space-y-2">
                  <p className="text-foreground font-semibold">
                    Choose an institution
                  </p>
                  <div className="text-foreground/60 text-sm">
                    Select the organization/institution you can to make payments
                    to and provide your personal information.
                  </div>
                </div>
              </div>
            </Card>
            {/* Connection arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowDown className="w-8 h-8 text-white" />
            </div>
            {/* Step 2 - Collaborate */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-xl">
                  #2
                </div>
                <div className="space-y-2">
                  <p className="text-foreground font-semibold">
                    Make a payment
                  </p>
                  <div className="text-foreground/60 text-sm">
                    Identify the services your are making payments for and
                    proceed to checkout
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-8 bg-green-400 rounded animate-pulse"></div>
                  <div className="w-2 h-8 bg-green-400 rounded animate-pulse delay-150"></div>
                  <div className="w-2 h-8 bg-blue-500 rounded animate-pulse delay-300"></div>
                  <div className="w-2 h-8 bg-gray-300 rounded animate-pulse delay-450"></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Central circular flow */}
          <div className="relative flex items-center justify-center mb-12"></div>

          {/* Bottom workflow cards */}
          {/* <div className="relative grid grid-cols-1 gap-8 max-w-2xl mx-auto">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-6 bg-gray-900 rounded w-1/3"></div>
              </div>
            </Card>
      
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  <div className="w-full h-8 bg-gray-900 rounded"></div>
                  <div className="w-full h-8 bg-green-400 rounded"></div>
                  <div className="w-full h-8 bg-green-400 rounded"></div>
                  <div className="w-full h-8 bg-blue-500 rounded"></div>
                  <div className="w-full h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            </Card>
          </div> */}
        </div>
      </div>

      {/* Company logos */}
      <div className=" text-center">
        <div className="flex items-center justify-center gap-8 opacity-40">
          <span className="text-lg font-medium text-gray-600">GRZ</span>
          <span className="text-lg font-medium text-gray-600">Corporates</span>
          <span className="text-lg font-medium text-gray-600">Schools</span>
          <span className="text-lg font-medium text-gray-600">NGOs</span>
        </div>
      </div>

      {/* <div className="flex w-full items-center justify-center mt-4">
        <Button
          variant="light"
          onPress={() => navigateTo(0)}
          className="text-gray-600 hover:text-gray-900 mx-auto"
        >
          ← Back to Home
        </Button>
      </div> */}
    </div>
  );
};

export default HowItWorksSection;
