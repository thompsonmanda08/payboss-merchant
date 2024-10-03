import { cn } from '@/lib/utils'
import { Button } from '../ui/Button'
import SelectField from '../ui/SelectField'
import { WalletIcon } from '@heroicons/react/24/outline'

export default function Tabs({
  tabs,
  navigateTo,
  currentTab,
  className,
  classNames,
  Icon,
}) {
  const { innerWrapper, button, nav, icon } = classNames || ''
  return (
    <div className={cn('w-full sm:w-auto', className)}>
      <div className="w-full sm:hidden sm:w-auto">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>

        <SelectField
          id="tabs"
          name="tabs"
          options={tabs}
          className=" h-auto w-full"
          placeholder={'Select a tab'}
          value={tabs.find((tab) => tab?.index == currentTab)?.index.toString()}
          defaultValue={tabs
            .find((tab) => tab?.index == currentTab)
            ?.index.toString()}
          onChange={(e) => {
            let tab = tabs.find((tab) => tab?.index == parseInt(e.target.value))
            navigateTo(tab?.index)
          }}
        />
      </div>
      <div className={cn('hidden sm:block', innerWrapper)}>
        <nav
          className={cn(
            'min-w-md -mb-px flex gap-x-4 rounded-lg bg-slate-500/5  p-1',
            nav,
          )}
          aria-label="Tabs"
        >
          {tabs.map((tab, index) => (
            <Button
              key={tab?.name}
              // href={tab.href}
              variant={'light'}
              onClick={() => navigateTo(index)}
              startContent={
                tab?.icon && (
                  <tab.icon
                    className={cn(
                      'h-5 w-5 text-slate-600',
                      {
                        'bg-white text-primary': tab?.index == currentTab,
                      },
                      icon,
                    )}
                  />
                )
              }
              className={cn(
                'whitespace-nowrap border-b-1 border-transparent px-4 text-sm  text-gray-500 hover:border-gray-300 hover:bg-white hover:text-primary data-[hover=true]:bg-white',
                {
                  'border-primary bg-white text-primary shadow-sm':
                    tab?.index == currentTab,
                },
                button,
              )}
              aria-current={tab?.index == currentTab ? 'active' : undefined}
            >
              {tab?.name || tab?.title || tab?.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
