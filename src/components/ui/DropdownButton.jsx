'use client'
import React from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Card,
} from '@nextui-org/react'
import { cn } from '@/lib/utils'
import {
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

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
  const items = [
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
  ]

  const { trigger, wrapper, innerWrapper, dropdownItem } = classNames || ''

  const iconClasses =
    'text-slate-500 pointer-events-none hover:text-primary data-[hover=true]:text-primary data-[focus=true]:text-primary flex-shrink-0 w-5 aspect-square'

  return (
    <Dropdown className={cn('z-10', wrapper, className)}>
      <DropdownTrigger>
        <Button
          variant="bordered"
          backdrop={backdropBlur ? 'blur' : ''}
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
        {...props}
      >
        {(item) => (
          <DropdownItem
            key={item?.key}
            color={item?.key === 'new' ? 'primary' : 'default'}
            className={cn(
              'bg-red-5000 relativex group w-[260px] text-medium hover:bg-primary-100 focus:bg-primary-100 data-[hover=true]:border-primary-200 data-[hover=true]:bg-primary-100 data-[hover=true]:text-primary',
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
                  <motion.ul className=" flex w-full flex-col text-sm font-semibold transition-all duration-300 ease-in-out">
                    {item.subMenuItems.map((subItem) => (
                      <Button
                        key={subItem.key}
                        endContent={
                          subItem?.endContent ||
                          (subItem?.Icon ? (
                            <subItem.Icon className={cn(iconClasses)} />
                          ) : undefined)
                        }
                        className="my-auto justify-start rounded-md bg-transparent p-2  text-slate-700 hover:bg-primary-100 hover:text-primary"
                      >
                        {subItem.label}
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
