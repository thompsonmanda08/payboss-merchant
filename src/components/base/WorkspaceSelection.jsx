import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Avatar,
} from '@nextui-org/react'

import { cn } from '@/lib/utils'
import { Button } from '../ui/Button'
import { useMemo, useState } from 'react'
import {
  ArrowPathIcon,
  Cog8ToothIcon,
  PlusIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import SoftBoxIcon from './SoftBoxIcon'

export default function WorkspaceSelection({ isSelected }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(['text']))

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys],
  )

  const iconClasses =
    'text-slate-500 pointer-events-none hover:text-primary data-[hover=true]:text-primary data-[focus=true]:text-primary flex-shrink-0 w-5 aspect-square'

  const workspaceOptions = [
    {
      key: 'change-workspace',
      name: 'Change Workspace',
      href: '/workspaces',
      shortcut: '⌘C',
      description: 'Change your workspace',
      Icon: ArrowPathIcon,
    },
    {
      key: 'settings',
      name: 'Workspace Settings',
      href: '/settings/workspaces',
      shortcut: '⌘S',
      description: 'Workspace preferences',
      Icon: Cog8ToothIcon,
    },
    {
      key: 'people',
      name: 'Workspace Members',
      href: '/settings/members',
      shortcut: '⌘M',
      description: 'Manage workspace members',
      Icon: UserGroupIcon,
      showDivider: true,
    },
    {
      key: 'new',
      name: 'New Workspace',
      onClick: '/workspaces/new',
      shortcut: '⌘N',
      description: 'Create a new workspaces',
      Icon: PlusIcon,
    },
  ]

  return (
    <Dropdown className="ww-full ml-[110%] mt-[25%]" backdrop="blur">
      <DropdownTrigger>
        <Button className="border-px focus: mb-1 h-auto max-h-[60px] w-full items-center justify-start border border-primary-100 bg-transparent  p-2 capitalize">
          <SoftBoxIcon className={'aspect-square h-9 w-10 p-2'}>
            <BriefcaseIcon />
          </SoftBoxIcon>
          <div className="flex w-full items-center justify-between text-primary">
            <p className="text-base font-semibold uppercase">Workspace#1</p>
            <ChevronRightIcon className={cn('h-4 w-4 ease-in-out')} />
          </div>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="faded"
        aria-label="Dynamic Actions"
        items={workspaceOptions}
      >
        {(item) => (
          <DropdownItem
            key={item.key}
            color={item.key === 'new' ? 'primary' : 'default'}
            className={cn(
              'bg-red-5000 w-[260px] text-medium hover:bg-primary-100 focus:bg-primary-100 data-[hover=true]:border-primary-200 data-[hover=true]:bg-primary-100 data-[hover=true]:text-primary',
              {
                'text-danger': item.key === 'delete',
              },
            )}
            href={item.href}
            // shortcut={item.shortcut}
            showDivider={item.showDivider}
            description={item.description}
            startContent={<item.Icon className={cn(iconClasses)} />}
          >
            {item.name}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}
