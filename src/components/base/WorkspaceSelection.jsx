'use client'
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
          label: 'New file',
        },
        {
          key: 'copy',
          label: 'Copy link',
        },
        {
          key: 'edit',
          label: 'Edit file',
        },
        {
          key: 'delete',
          label: 'Delete file',
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
    <>
      <DropdownButton dropDownItems={workspaceOptions} backdropBlur={true}>
        <SoftBoxIcon className={'aspect-square h-9 w-10 p-2'}>
          <BriefcaseIcon />
        </SoftBoxIcon>
        <div className="flex w-full items-center justify-between text-primary">
          <p className="text-base font-semibold uppercase">Workspace#1</p>
          <ChevronRightIcon className={cn('h-4 w-4 ease-in-out')} />
        </div>
      </DropdownButton>
    </>
  )
}
