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

  function navigateForward() {
    setCurrentTabIndex((i) => {
      if (i >= tabs.length - 1) return i;

      return i + 1;
    });
  }

  function navigateBackwards() {
    setCurrentTabIndex((i) => {
      if (i <= 0) return 0;

      return i - 1;
    });
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
    navigateForward,
    navigateBackwards,
  };
}
