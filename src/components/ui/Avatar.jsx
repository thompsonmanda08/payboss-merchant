'use client'

import Image from 'next/image'
import { cn, getUserInitials } from '@/lib/utils'

import { useEffect } from 'react'
import Spinner from '../ui/Spinner'

function Avatar({ userData, isProfile }) {
  useEffect(() => {
    console.log('AVATAR RERENDERED: ')
  }, [userData])
  // RETURN IF NO USER DATA
  if (!userData) return <></>
  return (
    <div
      className="flex cursor-pointer items-center justify-start gap-2
							transition-all duration-200 ease-in-out"
    >
      <span className="sr-only">Open user menu</span>
      {userData?.avatar != null && userData?.avatar.length > 0 ? (
        <Image
          className="h-9 w-9 flex-none rounded-xl bg-gray-50"
          src={userData.avatar}
          alt={`Image - ${userData?.firstName} ${userData?.lastName}`}
          width={200}
          height={200}
        />
      ) : (
        <div className="text-md grid h-10 w-10 flex-none scale-90 place-items-center items-center justify-center rounded-full bg-gray-500 font-medium uppercase text-white ring-2 ring-primary/30  ring-offset-1">
          {getUserInitials(
            `${userData?.firstName || 'P'} ${userData?.lastName || 'B'}`,
          ) || <Spinner size={18} />}
        </div>
      )}

      {userData && (
        <span className="hidden lg:items-center xl:flex">
          <div className="flex min-w-[120px] flex-col items-start">
            <p
              className={cn('text-sm font-semibold text-gray-700', {
                'text-white': isProfile,
              })}
            >{`${userData?.firstName || 'PayBoss'} ${userData?.lastName || 'Admin'}`}</p>
            <p
              className={cn('text-xs font-medium text-gray-500', {
                'text-white': isProfile,
              })}
            >
              {userData?.email || 'admin@payboss'}
            </p>
          </div>
          {/* <ChevronDownIcon
            className="ml-2 h-4 w-4 text-gray-400 text-base"
            aria-hidden="true"
          /> */}
        </span>
      )}
    </div>
  )
}

export default Avatar
