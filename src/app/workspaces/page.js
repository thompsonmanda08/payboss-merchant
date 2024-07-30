import { Card, Logo } from '@/components/base'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React from 'react'

import { Workspaces } from '@/components/containers'
import Image from 'next/image'
import { DefaultCover } from '@/lib/constants'

function WorkSpacesPage() {
  return (
    <main className="flex h-full min-h-screen items-start justify-start overflow-hidden bg-background text-foreground">
      <div className="relative flex h-full max-h-screen w-full flex-col overflow-y-auto ">
        <section role="workspace-header">
          <div className="relative h-[380px] w-full overflow-clip rounded-b-3xl bg-gray-900">
            <Logo isWhite className="absolute left-5 top-5 z-30 " />
            <Button
              as={Link}
              href={'/manage-account'}
              variant="light"
              className="data[hover=true]:bg-slate-900/30 absolute right-5 top-5 z-30 aspect-square min-w-[120px] rounded-full bg-slate-900/20 text-white"
              startContent={<Cog6ToothIcon className=" h-6 w-6" />}
            >
              Manage
            </Button>
            <Image
              className="z-0 h-full w-full object-cover"
              src={DefaultCover}
              width={1024}
              height={300}
            />

            <div className="absolute inset-0 z-10 bg-black/30"></div>
          </div>
        </section>

        <section
          role="workspace-header"
          className="z-20 mx-auto -mt-40 w-full max-w-[1440px] px-5 md:px-10"
        >
          <Card className="gap-6">
            <div className="flex justify-between bg-red-500/0">
              <div>
                <h2 className="heading-3 !font-bold tracking-tight text-gray-900 ">
                  Choose a Workspace
                </h2>
                <p className=" text-sm text-slate-600">
                  Access your account through a workspace for the convenience of
                  having all your tools and resources organized in one place.
                </p>
              </div>
            </div>

            <Workspaces />
          </Card>
        </section>
      </div>
    </main>
  )
}

export default WorkSpacesPage
