'use client'
import { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Table from './Table'
import data from '@/app/dashboard/[workspaceID]/data/tableData'
import { Card, CardHeader } from '../../base'
import { CheckIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import CustomTable from './Table'
import { ArrowUpOnSquareStackIcon } from '@heroicons/react/24/outline'
import { SimpleDropdown } from '@/components/ui/DropdownButton'

function Batches() {
  const { columns, rows } = data()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Card>
      <div className="mb-8 flex items-center justify-between">
        <CardHeader
          title={'Bulk Transactions'}
          infoText={
            <span className="flex items-center">
              <ArrowUpOnSquareStackIcon className="mr-1 h-6 w-6 rotate-90 text-primary" />
              <div className="ml-1 text-sm font-normal">
                &nbsp;<strong>0 Proccessed</strong> this month
              </div>
            </span>
          }
        />

        <SimpleDropdown
          isIconOnly
          classNames={{
            trigger:
              'bg-transparent-500 w-auto max-w-max shadow-none items-center justify-center',
            // innerWrapper,
            dropdownItem: 'py-2',
            chevronIcon: 'hidden',
          }}
          name={
            <EllipsisVerticalIcon className="h-5 w-5 cursor-pointer hover:text-primary" />
          }
          dropdownItems={[
            '  View All Transactions',
            '  View Bulk Collections',
            'View Bulk Payments',
          ]}
        />
      </div>
      <CustomTable removeWrapper columns={columns} rows={[]} />
    </Card>
  )
}

export default Batches
