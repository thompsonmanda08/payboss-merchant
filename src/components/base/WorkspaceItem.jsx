'use client'
import { Avatar, AvatarGroup } from '@nextui-org/react'
import React from 'react'
import { Button } from '../ui/Button'
import { SoftBoxIcon } from '.'
import { ArrowRightIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

function WorkspaceItem() {
  return (
    <div className="flex w-full justify-between p-4">
      <Button
        className="flex h-auto w-full justify-start gap-4 border-[1px] border-primary-50 bg-transparent p-2 hover:border-primary-100 hover:bg-primary-50"
        startContent={
          <SoftBoxIcon className={'w-18 h-20'}>
            <BriefcaseIcon />
          </SoftBoxIcon>
        }
        endContent={
          <ArrowRightIcon className="ml-auto mr-4 h-6 w-6 self-center text-primary-600" />
        }
      >
        <div className="flex flex-col gap-2">
          <h3 className="heading-5 mb-1 capitalize text-primary-600">
            Workspace Name
          </h3>
          <div className="flex justify-between gap-2">
            <AvatarGroup
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
            </AvatarGroup>
          </div>
        </div>
      </Button>
    </div>
  )
}

export default WorkspaceItem
