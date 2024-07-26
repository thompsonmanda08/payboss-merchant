'use client'
import React from 'react'
import DropdownButton from '../ui/DropdownButton'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { Button } from '../ui/Button'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'

function AddToWorkSpace({ onAdd, placeholder, onChange, value }) {
  const ROLES = [
    {
      key: 'admin',
      label: 'Admin',
      description:
        'Manage people, payments, billing and other workspace settings.',
    },
    {
      key: 'member',
      label: 'Member',
      description: 'Access to workspaces, documents and dashboards',
    },
    {
      key: 'guest',
      label: 'Guest',
      description:
        'Can not be added to other workspaces by admin. View-only access is granted',
    },
  ]

  const [selectedKeys, setSelectedKeys] = React.useState(
    new Set([ROLES.map((role) => role.label)[0]]),
  )

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys],
  )
  console.log(selectedKeys)
  console.log(selectedValue)

  function resolveAddToWorkspace(e) {
    e.preventDefault()
    if (onAdd) return onAdd()
  }
  return (
    <form
      onSubmit={resolveAddToWorkspace}
      className={'group relative flex h-fit w-full max-w-lg flex-grow-0 gap-2'}
    >
      <Input
        className={
          'h h-12 w-full max-w-lg text-base placeholder:font-normal placeholder:text-slate-400'
        }
        placeholder={placeholder || 'Invite by name or email to workspace...'}
        value={value}
        onChange={onChange}
      />
      <SingleSelectionDropdown
        dropdownItems={ROLES}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
      />

      <Button type="submit" className={'px-8'}>
        Add to Workspace
      </Button>
    </form>
  )
}

export default AddToWorkSpace
