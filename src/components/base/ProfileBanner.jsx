'use client'
import useAccountProfile from '@/hooks/useProfileDetails'
import { useSetupConfig } from '@/hooks/useQueryHooks'
import { DefaultCover } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Chip } from '@nextui-org/react'
import Image from 'next/image'
import { roleColorMap } from '../containers/tables/UsersTable'

export default function ProfileBanner({ className }) {
  const { user, merchant } = useAccountProfile()

  return !user || !merchant ? (
    <ProfileBannerLoader className={className} />
  ) : (
    <div
      className={cn(
        'absolute left-0 right-0 top-[24%] z-20 m-7 rounded-2xl border border-input/40 bg-background/10 p-4 backdrop-blur-md',
        className,
      )}
    >
      <div className="flex w-full items-center gap-4">
        <div className="mr-auto flex items-center gap-4">
          <div className="h-20 w-20 overflow-clip rounded-lg">
            <Image
              className="z-0 h-full w-full object-cover"
              src={DefaultCover}
              alt="banner"
              width={1024}
              height={300}
            />
          </div>
          <div className="flex flex-col gap-0">
            <h2 className="heading-4  !font-bold capitalize text-background lg:text-xl">
              {`${user?.first_name} ${user?.last_name}`}
            </h2>
            <p className="heading-5 font-semibold capitalize text-slate-200">
              {merchant}{' '}
              <Chip
                color={roleColorMap[user?.role]}
                variant="flat"
                className="ml-2 text-sm font-bold"
              >
                <strong>{user?.role}</strong>
              </Chip>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileBannerLoader({ className }) {
  return (
    <div
      className={cn(
        'absolute left-0 right-0 top-[24%] z-20 m-7 rounded-2xl border border-input/40 bg-background/10 p-4 backdrop-blur-md',
        className,
      )}
    >
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
