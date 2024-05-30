
import { useState } from 'react';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Tab({ tabs, onTabChange }) {
  const [currentTab, setCurrentTab] = useState(tabs.find(tab => tab.current).name);

  const handleTabClick = (tabName) => {
    setCurrentTab(tabName);
    if (onTabChange) {
      onTabChange(tabName);
    }
  };

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          value={currentTab}
          onChange={(e) => handleTabClick(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-1 space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                onClick={() => handleTabClick(tab.name)}
                className={classNames(
                  tab.name === currentTab
                    ? 'border-primary/90 text-primary'
                    : 'border-transparent  text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'cursor-pointer w-full text-center whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                )}
                aria-current={tab.name === currentTab ? 'page' : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
