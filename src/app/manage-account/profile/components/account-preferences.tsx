'use client';
import { Switch } from '@heroui/react';

import Card from '@/components/base/custom-card';

function AccountPreferences() {
  const APPLICATION_CONFIG = [
    {
      title: 'Receive Email Notifications',
      active: true,
    },
    {
      title: 'Receive SMS Notifications',
      active: false,
    },
    {
      title: 'Subscribe to newsletters',
      active: false,
    },
  ];

  return (
    <Card className={'rounded-2xl bg-background/70 backdrop-blur-md'}>
      <div className="flex w-full flex-col rounded-md p-4">
        <div>
          <div className="flex w-full items-end justify-between">
            <div>
              <h2 className="text-base font-semibold leading-7 text-foreground-900">
                Platform Preferences
              </h2>
              <p className="mt-1 text-sm leading-6 text-foreground-500">
                Manage your preferences and other platform options
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-4 divide-y divide-foreground-100 border-t border-foreground-200 text-sm leading-6">
            {/*  TODO: Add a switch for each of the application config */}
            {APPLICATION_CONFIG.map((config) => (
              <div key={config.title} className="mt-4 pt-4 sm:flex">
                <div className="mt-1 flex items-center gap-x-4 sm:mt-0 sm:flex-auto">
                  <Switch />
                  <p className="font-medium text-foreground-900">
                    {config.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AccountPreferences;
