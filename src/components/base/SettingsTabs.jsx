import { cn } from '@/lib/utils'

export default function Tabs({ tabs, navigateTo, currentTab }) {
  return (
    <div className="mb-2 w-full">
      {/* <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>

        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          defaultValue={tabs.find((tab) => tab.current).name}
        >
          {tabs.map((tab, index) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div> */}
      <div className="hidden sm:block ">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab, index) => (
              <button
                key={tab.name}
                // href={tab.href}
                onClick={() => navigateTo(index)}
                className={cn(
                  tab.current == currentTab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
                )}
                aria-current={tab.current == currentTab ? 'active' : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
