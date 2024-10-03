'use client'
import React from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  Button,
} from '@nextui-org/react'
import { capitalize, cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const buttonClasses =
  'items-center justify-between gap-2 rounded-lg font-medium capitalize text-primary shadow-sm'

export default function DropdownButton({
  className,
  classNames,
  dropDownItems,
  isIconOnly,
  backdropBlur,
  selectedValue,
  variant,
  children,
  ...props
}) {
  const { trigger, wrapper, innerWrapper, dropdownItem } = classNames || ''

  const iconClasses =
    'text-slate-500 pointer-events-none hover:text-primary data-[hover=true]:text-primary data-[focus=true]:text-primary flex-shrink-0 w-5 aspect-square'

  return (
    <Dropdown
      className={cn('z-10', wrapper, className)}
      backdrop={backdropBlur ? 'blur' : ''}
    >
      <DropdownTrigger>
        <Button
          variant="bordered"
          isIconOnly={isIconOnly}
          className={cn(
            'border-px focus: mb-1 h-auto max-h-[60px] w-full items-center justify-start border border-primary-100 bg-transparent  p-2 capitalize',
            trigger,
          )}
        >
          {children || selectedValue || (
            <EllipsisHorizontalIcon className="h-6 w-6 text-slate-500" />
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dynamic Actions"
        variant={variant || 'faded'}
        items={dropDownItems || items}
        className={innerWrapper}
        onClose
        {...props}
      >
        {(item, onClose) => (
          <DropdownItem
            key={item?.key}
            color={item?.key === 'new' ? 'primary' : 'default'}
            className={cn(
              'group w-[260px] text-medium hover:bg-primary-100 focus:bg-primary-100 data-[hover=true]:border-primary-200 data-[hover=true]:bg-primary-100 data-[hover=true]:text-primary',
              {
                'text-danger': item?.key === 'delete',
              },
              dropdownItem,
            )}
            href={item?.href}
            shortcut={item.shortcut}
            showDivider={item?.showDivider}
            description={item?.description}
            startContent={
              item?.Icon ? <item.Icon className={cn(iconClasses)} /> : undefined
            }
            endContent={
              item?.subMenuItems?.length > 0 ? (
                <ChevronRightIcon className="aspect-square h-5 w-5" />
              ) : (
                item?.endContent || undefined
              )
            }
          >
            {item?.label || item?.name || ''}

            {item?.subMenuItems && (
              <motion.div
                animate={{
                  opacity: [0, 1],
                  // x: [-100, 0],
                  // transition: {
                  //   duration: 0.3,
                  // },
                }}
                className="absolute -top-1 left-[100%] z-0 hidden w-full min-w-[200px] p-2 transition-all duration-300 ease-in-out group-hover:flex"
              >
                <Card className="w-full p-2">
                  <motion.ul className=" flex  w-full flex-col text-sm font-semibold transition-all duration-300 ease-in-out">
                    {item.subMenuItems.map((subItem) => (
                      <Button
                        key={subItem.key}
                        // as={Link}
                        // href={subItem?.href}
                        onPress={(e) => {
                          subItem?.onSelect()
                          e.continuePropagation()
                        }}
                        startContent={
                          subItem?.Icon ? (
                            <subItem.Icon className={cn(iconClasses, 'mt-1')} />
                          ) : undefined
                        }
                        className="group my-auto h-14 items-start justify-start gap-2 rounded-md bg-transparent p-2 text-medium text-slate-700 hover:bg-primary-100 hover:text-primary"
                      >
                        <div className="flex flex-col items-start justify-start font-medium">
                          {subItem.label}
                          {subItem?.description && (
                            <p className="mr-auto max-w-[170px] truncate text-[11px] font-normal">
                              {subItem.description}
                            </p>
                          )}
                        </div>
                      </Button>
                    ))}
                  </motion.ul>
                </Card>
              </motion.div>
            )}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}

export function SingleSelectionDropdown({
  dropdownItems,
  selectedKeys,
  setSelectedKeys,
  selectedValue,
  name,
  selectionMode = 'single',
  disallowEmptySelection = false,
  className,
  classNames,
  buttonVariant = 'bordered',
  listItemName,
  ...props
}) {
  const { trigger, innerWrapper, dropdownItem, chevronIcon } = classNames || ''
  return (
    <Dropdown className={cn('min-w-max', className)}>
      <DropdownTrigger>
        <Button
          variant={buttonVariant}
          className={cn(buttonClasses, trigger)}
          endContent={
            <ChevronDownIcon
              className={cn(
                'h-4 w-4  focus-within:rotate-180 focus:rotate-180 ',
                chevronIcon,
              )}
            />
          }
        >
          {`${name || selectedValue}`}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection={disallowEmptySelection}
        selectionMode={selectionMode}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        items={dropdownItems}
        className={innerWrapper}
        {...props}
      >
        {dropdownItems.map((item, index) => {
          let ItemLabel = capitalize(
            item.name || item.label || item?.[listItemName] || item,
          )
          let itemValue =
            item.value || item?.uid || item?.ID || item?.id || item?.key || item
          return (
            <DropdownItem
              key={itemValue}
              description={item?.description}
              className={cn(
                '!focus-within:bg-primary-100 !hover:bg-primary-100 !focus:bg-primary-100 !data-[hover=true]:border-primary-200 !data-[selectable=true]:focus:bg-primary-100 !data-[focus=true]:bg-primary-100 !data-[hover=true]:bg-primary-100 !data-[hover=true]:text-primary !data-[selected=true]:text-primary group min-w-max capitalize',

                dropdownItem,
              )}
            >
              {ItemLabel}
            </DropdownItem>
          )
        })}
      </DropdownMenu>
    </Dropdown>
  )
}

export function SimpleDropdown({
  dropdownItems,
  selectedKeys,
  setSelectedKeys,
  name,
  selectionMode = 'single',
  disallowEmptySelection = false,
  closeOnSelect = true,
  className,
  classNames,
  variant = 'flat',
  color = 'primary',
  isIconOnly,

  listItemName,
  ...props
}) {
  const { trigger, innerWrapper, dropdownItem, chevronIcon } = classNames || ''
  return (
    <Dropdown className={cn('relative min-w-max', className)}>
      <DropdownTrigger className="hidden sm:flex">
        <Button
          color={color}
          variant={variant}
          isIconOnly={isIconOnly}
          endContent={
            <ChevronDownIcon
              className={cn(
                'h-4 w-4 focus-within:rotate-180 focus:rotate-180 ',
                chevronIcon,
              )}
            />
          }
          className={cn(buttonClasses, trigger)}
        >
          {name}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection={disallowEmptySelection}
        aria-label={'Simple Dropdown - ' + name}
        closeOnSelect={closeOnSelect}
        selectedKeys={selectedKeys}
        selectionMode={selectionMode}
        onSelectionChange={setSelectedKeys}
        className={innerWrapper}
        {...props}
      >
        {dropdownItems.map((item) => (
          <DropdownItem
            key={item?.uid || item?.ID || item?.id || item?.key || item}
            href={item?.href || ''}
            className={cn(
              '!focus-within:bg-primary-100 !hover:bg-primary-100 !focus:bg-primary-100 !data-[hover=true]:border-primary-200 !data-[selectable=true]:focus:bg-primary-100 !data-[focus=true]:bg-primary-100 !data-[hover=true]:bg-primary-100 !data-[hover=true]:text-primary !data-[selected=true]:text-primary group min-w-max capitalize',

              dropdownItem,
            )}
          >
            {capitalize(
              item.name || item.label || item?.[listItemName] || item,
            )}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
