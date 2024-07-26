import { cn } from '@/lib/utils'
import { Button } from '../ui/Button'

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
      <div className="my-2 hidden sm:block">
        <nav
          className="-mb-px flex gap-x-4 rounded-lg bg-slate-100 p-1 "
          aria-label="Tabs"
        >
          {tabs.map((tab, index) => (
            <Button
              key={tab.name}
              // href={tab.href}
              variant={'light'}
              onClick={() => navigateTo(index)}
              className={cn(
                'whitespace-nowrap border-b-1 border-transparent px-4 text-sm  text-gray-500 hover:border-gray-300 hover:bg-white hover:text-primary data-[hover=true]:bg-white',
                {
                  'border-primary bg-white text-primary shadow-sm':
                    tab.index == currentTab,
                },
              )}
              aria-current={tab.index == currentTab ? 'active' : undefined}
            >
              {tab.name}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
