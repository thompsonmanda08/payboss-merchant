"use client";
import {
  BusinessSettings,
  GeneralSettings,
  SecuritySettings,
  SettingsListItem,
  Tabs,
} from "@/components/containers";
import useCustomTabsHook from "@/hooks/CustomTabsHook";
import React, { Suspense } from "react";

const tabs = [
  { name: "General", href: "#", current: 0 },
  { name: "Security", href: "#", current: 1 },
  { name: "Business", href: "#", current: 2 },
];

function AccountSettings() {
  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    <GeneralSettings key="general" />,
    <SecuritySettings key={"security"} />,
    <BusinessSettings key={"business"} />,
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center px-8 md:px-16 lg:px-24 pt-28 md:pt-32 bg-background text-foreground w-full gap-6 sm:gap-8 md:gap-10 overflow-clip">
      <div className="bg-white flex flex-col w-full p-5 md:p-8 lg:p-10 rounded-xl">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
          Account Settings
        </h2>
        <Tabs
          tabs={tabs}
          navigateTo={navigateTo}
          currentTab={currentTabIndex}
        />
        {activeTab}
      </div>
    </main>
  );
}

export default AccountSettings;
