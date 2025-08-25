'use client';

import { Skeleton } from '@heroui/react';

import { WalletLHistoryLoader } from './workspace-settings/_components/wallet';

export default function DashboardLoading() {
  return (
    <div className="px-5 space-y-6">
      <>
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-primary-400 to-primary-300 rounded-xl p-4 animate-pulse">
            <div className="bg-border/30 w-48 h-6 rounded-full mb-4" />
            <div className="bg-border/40 w-36 h-10 rounded-lg" />
          </div>

          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-border rounded-xl p-4 animate-pulse"
            >
              <Skeleton className="bg-gray-200 w-40 h-5 rounded-lg mb-4" />
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="bg-gray-200 w-8 h-8 rounded-lg" />
                  <Skeleton className="bg-gray-200 w-24 h-5 rounded-lg" />
                </div>
                <Skeleton className="bg-primary-200 w-10 h-10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Transactions Summary */}
        <div className="space-y-2 bg-white dark:bg-border rounded-xl p-6 flex flex-col justify-start animate-pulse">
          <Skeleton className=" w-56 h-6 rounded-lg " />
          <Skeleton className=" w-72 h-4 rounded-lg " />

          {/* Chart Placeholder */}
          <div className="bg-primary-800/50 rounded-xl h-48 w-full mt-4 animate-pulse">
            <div className="flex justify-between p-4">
              <div className="bg-border/10 w-8 h-4 rounded-lg" />
              <div className="bg-border/10 w-8 h-4 rounded-lg" />
              <div className="bg-border/10 w-8 h-4 rounded-lg" />
            </div>
          </div>

          {/* Transactions List */}
          <div className="flex items-center space-x-4 p-2 mt-2 animate-pulse">
            <Skeleton className="bg-primary-300 w-10 h-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="bg-gray-200 w-8 h-5 rounded-lg" />
              <Skeleton className="bg-gray-200 w-32 h-4 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-border rounded-xl p-8 mt-6 flex flex-col justify-start animate-pulse">
          <WalletLHistoryLoader limit={3} />
        </div>
      </>
    </div>
  );
}
