import { Logo, WorkspaceItem } from '@/components/base'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Cog6ToothIcon, PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React from 'react'

import {
  Avatar,
  AvatarGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@nextui-org/react'

function WorkSpaces() {
  return (
    <main className="flex h-full min-h-screen items-start justify-start overflow-hidden bg-background text-foreground">
      <div className="relative flex h-full max-h-screen w-full flex-col overflow-y-auto p-8 pt-20 lg:static lg:pt-8">
        <nav
          className={cn(
            `rounded-blur fixed left-0 right-0 top-5 z-30 flex w-full -translate-y-5 items-center bg-white py-2 pr-5 shadow-sm transition-all lg:sticky lg:top-auto lg:flex-nowrap lg:justify-start lg:bg-transparent lg:shadow-none`,
          )}
        >
          <div className="flex w-full items-center rounded-3xl">
            <div className="relative left-16 transition-all duration-300 ease-in-out lg:left-0">
              <Logo className="mr-auto" />
            </div>
            <div className="relative z-50 ml-auto flex  items-center justify-center rounded-full">
              <div className={cn('flex items-center gap-4 text-slate-500', {})}>
                <Button
                  startContent={<PlusIcon className=" h-6 w-6" />}
                  className=""
                >
                  Create Workspace
                </Button>
                <Button
                  isIconOnly
                  href={'/settings'}
                  className="aspect-square h-10 w-10 rounded-full"
                >
                  <Cog6ToothIcon className=" h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex h-full min-h-[80svh] w-full flex-col items-center justify-center ">
          <Card className="flex w-full max-w-lg flex-col">
            <CardHeader className="flex-col">
              <div className="flex w-full flex-col px-4">
                <h3 className="heading-3 font-semibold">Welcome back👋</h3>
                <p className="font-medium text-slate-500">Choose a workspace</p>
              </div>
            </CardHeader>

            <CardBody className="flex w-full flex-col rounded-lg">
              <div>
                <WorkspaceItem />
                <WorkspaceItem />
                <WorkspaceItem />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default WorkSpaces
