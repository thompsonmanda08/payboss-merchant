'use client'
import React from 'react'
import { Button } from '../ui/Button'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'

function SingleSelectionDropdown({
  dropdownItems,
  selectedKeys,
  setSelectedKeys,
}) {
  return (
    <Dropdown className="relative">
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        items={dropdownItems}
      >
        {(item) => (
          <DropdownItem
            key={item.key}
            color={item.key === 'delete' ? 'danger' : 'default'}
            className={item.key === 'delete' ? 'text-danger' : ''}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}

export default SingleSelectionDropdown
