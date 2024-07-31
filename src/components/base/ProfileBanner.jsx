'use client'
import { useSetupConfig } from '@/hooks/useQueryHooks'
import { DefaultCover } from '@/lib/constants'
import { Skeleton } from '@nextui-org/react'
import Image from 'next/image'

export default function ProfileBanner() {
  const { data: response, isLoading, isFetching } = useSetupConfig()
  const user = response?.data?.userDetails

  return isLoading || isFetching ? (
    <ProfileBannerLoader />
  ) : (
    <div className="absolute left-0 right-0 top-[24%] z-20 m-7 rounded-2xl border border-input/40 bg-background/10 p-4 backdrop-blur-md">
      <div className="flex w-full items-center gap-4">
        <div className="mr-auto flex items-center gap-4">
          <div className="h-20 w-20 overflow-clip rounded-lg">
            <Image
              className="z-0 h-full w-full object-cover"
              src={DefaultCover}
              width={1024}
              height={300}
            />
          </div>
          <div className="flex flex-col gap-0">
            <h2 className="heading-4  !font-bold capitalize text-background lg:text-xl">
              {`${user?.first_name} ${user?.last_name}`}
            </h2>
            <p className="heading-5 font-semibold capitalize text-slate-200">
              {user?.merchant + ' ' + user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'

function ProfileBannerLoader() {
  return (
    <div className="absolute left-0 right-0 top-[24%] z-20 m-7 animate-pulse rounded-2xl border border-input/40 bg-background/10 p-4 backdrop-blur-md">
      <div className="flex w-full items-center gap-4">
        <div className="mr-auto flex items-center gap-4">
          <div className="h-20 w-20 overflow-clip rounded-lg bg-slate-500/30"></div>
          <div className="flex flex-col gap-1">
            <div className="h-8 w-[200px] rounded-lg bg-slate-500/30"></div>
            <div className="h-8 w-[100px] rounded-lg bg-slate-500/30"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
