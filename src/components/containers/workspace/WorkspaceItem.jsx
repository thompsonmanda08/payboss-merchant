'use client'

import React from 'react'
import { ArrowRightIcon, BriefcaseIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import SoftBoxIcon from '@/components/base/SoftBoxIcon'
import { Button } from '@/components/ui/Button'

function WorkspaceItem({ name, description, href, isVisible, onClick }) {
  return (
    <Button
      as={Link}
      href={href}
      onPress={onClick}
      className={cn(
        'flex h-auto w-full justify-start gap-4 border-[1px] border-primary-100 bg-transparent p-2 opacity-100 hover:border-primary-200 hover:bg-primary-100',
        {
          'opacity-50 hover:opacity-90': !isVisible,
        },
      )}
      startContent={
        <SoftBoxIcon className={'w-18 h-20'}>
          <BriefcaseIcon />
        </SoftBoxIcon>
      }
      endContent={
        <ArrowRightIcon className="ml-auto mr-4 h-6 w-6 self-center text-primary-600" />
      }
    >
      <div className="flex flex-col items-start gap-2">
        <h3 className="heading-4 mb-1 capitalize text-primary-600">{name}</h3>
        {description && (
          <div className="flex max-w-[260px] justify-between gap-2">
            <p className=" truncate text-sm font-medium text-slate-600">
              {description}
            </p>
            {/* <AvatarGroup
            className={'-translate-x-3 scale-80'}
            max={3}
            isBordered
            total={7}
            renderCount={(count) => (
              <p className="ml-2 font-semibold text-foreground">
                +{count} Members
              </p>
            )}
          >
            <Avatar
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            />
            <Avatar
              size="sm"
              src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
            />
            <Avatar
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </AvatarGroup> */}
          </div>
        )}
      </div>
    </Button>
  )
}

export default WorkspaceItem
