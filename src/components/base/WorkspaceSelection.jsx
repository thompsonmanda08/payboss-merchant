'use client'

import { cn } from '@/lib/utils'
import {
  ArrowPathIcon,
  Cog8ToothIcon,
  PlusIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import SoftBoxIcon from './SoftBoxIcon'
import DropdownButton from '../ui/DropdownButton'

export default function WorkspaceSelection({ isSelected }) {
  const workspaceOptions = [
    {
      key: 'home',
      name: 'Home',
      href: '/workspaces',
      shortcut: '⌘H',
      description: 'Go back Home',
      Icon: ArrowPathIcon,
    },

    {
      key: 'workspaces',
      name: 'Workspaces',
      // shortcut: '>',
      description: 'Change your workspace',
      Icon: BriefcaseIcon,
      subMenuItems: [
        {
          key: 'new',
          label: 'Commercial',
        },
        {
          key: 'copy',
          label: 'Field Deployments',
        },
        {
          key: 'edit',
          label: 'Sales Team',
        },
      ],
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
      key: 'users',
      name: 'Manage Members',
      href: '/settings/users',
      shortcut: '⌘M',
      description: 'Manage workspace members',
      Icon: UserGroupIcon,
      showDivider: true,
    },
    // TODO: => ONLY THE OWNER CAN SEE THIS OPTION
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
    <>
      <DropdownButton dropDownItems={workspaceOptions} backdropBlur={true}>
        <SoftBoxIcon className={'aspect-square h-9 w-10 p-2'}>
          <BriefcaseIcon />
        </SoftBoxIcon>
        <div className="flex w-full items-center justify-between text-primary">
          <div className="flex flex-col items-start justify-start gap-0">
            <p className="text-base font-semibold uppercase">Workspace#1</p>
            <span className="-mt-1 text-xs font-medium italic text-slate-500">
              Team: 6 Members
            </span>
          </div>
          <ChevronRightIcon className={cn('h-4 w-4 ease-in-out')} />
        </div>
      </DropdownButton>
    </>
  )
}
