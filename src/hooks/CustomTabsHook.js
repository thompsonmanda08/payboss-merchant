"use client";
import { useState } from "react";

export default function useCustomTabsHook(tabs) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  function navigateTo(tabIndex) {
    setIsLoading(true);
    try {
      setCurrentTabIndex(tabIndex);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const lastTab = tabs.length - 1;
  const firstTab = 0;
  return {
    lastTab,
    firstTab,
    currentTabIndex,
    activeTab: tabs[currentTabIndex],
    tabs,
    navigateTo,
    isLoading,
    setIsLoading,
  };
}
