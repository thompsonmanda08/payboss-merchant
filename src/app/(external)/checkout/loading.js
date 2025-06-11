"use client";

import { cn } from "@/lib/utils";

export default function CheckoutLoading({}) {
  return (
    <div className="w-full mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="bg-gray-200 h-8 w-32 rounded-md animate-pulse" />
          <div className="bg-gray-200 h-5 w-64 rounded-md animate-pulse" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-gray-200 h-5 w-24 rounded-md animate-pulse" />
          <div className="bg-gray-200 h-8 w-8 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "container px-0 sm:px-4 md:px-8 lg:px-12 max-w-5xl",
          "grid md:grid-cols-2 gap-6 ",
        )}
      >
        {/* Payment Method Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
          <div className="space-y-6">
            {/* Card Header */}
            <div className="space-y-2">
              <div className="bg-gray-200 h-7 w-48 rounded-md" />
              <div className="bg-gray-200 h-5 w-64 rounded-md" />
            </div>

            {/* Payment Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-100 h-12 rounded-md border-2 border-blue-500" />
              <div className="bg-gray-100 h-12 rounded-md border" />
            </div>

            {/* Phone Number Input */}
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="bg-gray-200 h-5 w-32 rounded-md" />
                <div className="bg-gray-200 h-4 w-4 rounded-full ml-1" />
              </div>
              <div className="bg-gray-100 h-12 w-full rounded-md border" />
              <div className="bg-gray-200 h-4 w-56 rounded-md" />
            </div>

            {/* Pay Button */}
            <div className="bg-blue-200 h-12 w-full rounded-md" />
          </div>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
          <div className="space-y-6">
            {/* Card Header */}
            <div className="space-y-2">
              <div className="bg-gray-200 h-7 w-48 rounded-md" />
              <div className="bg-gray-200 h-5 w-56 rounded-md" />
            </div>

            {/* Logo and Payment Details */}
            <div className="flex justify-between items-start">
              <div className="space-y-4 w-1/2">
                {/* Payment To */}
                <div className="flex justify-between">
                  <div className="bg-gray-200 h-5 w-24 rounded-md" />
                  <div className="bg-gray-200 h-5 w-24 rounded-md" />
                </div>

                {/* Physical Address */}
                <div className="flex justify-between">
                  <div className="bg-gray-200 h-5 w-32 rounded-md" />
                  <div className="bg-gray-200 h-5 w-32 rounded-md" />
                </div>

                {/* City/Country */}
                <div className="flex justify-between">
                  <div className="bg-gray-200 h-5 w-24 rounded-md" />
                  <div className="bg-gray-200 h-5 w-32 rounded-md" />
                </div>
              </div>

              {/* Logo */}
              <div className="bg-gray-200 h-20 w-20 rounded-md" />
            </div>

            {/* Total Amount */}
            <div className="bg-blue-50 p-3 rounded-md flex justify-between">
              <div className="bg-gray-200 h-6 w-28 rounded-md" />
              <div className="bg-gray-200 h-6 w-24 rounded-md" />
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <div className="bg-gray-200 h-6 w-40 rounded-md" />

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-200 h-5 w-5 rounded-md" />
                  <div className="bg-gray-200 h-5 w-48 rounded-md" />
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-200 h-5 w-5 rounded-md" />
                  <div className="bg-gray-200 h-5 w-64 rounded-md" />
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-200 h-5 w-5 rounded-full" />
                <div className="bg-gray-200 h-5 w-48 rounded-md" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-gray-200 h-5 w-5 rounded-full" />
                <div className="bg-gray-200 h-5 w-40 rounded-md" />
              </div>
            </div>

            {/* Terms */}
            <div className="bg-gray-200 h-12 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
