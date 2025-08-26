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

        <div className="bg-white dark:bg-border rounded-xl p-8 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 justify-start animate-pulse">
          <WalletLHistoryLoader limit={3} />
          <WalletLHistoryLoader limit={3} />
        </div>
      </>
    </div>
  );
}
