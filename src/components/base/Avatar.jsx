'use client'

import Image from 'next/image'
import { getUserInitials } from '@/lib/utils'

import { useEffect } from 'react'
import Spinner from './Spinner'

function Avatar({ userData }) {
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
          className="h-9 w-9 flex-none rounded-xl bg-slate-50"
          src={userData.avatar}
          alt={`Image - ${userData?.firstName} ${userData?.lastName}`}
          width={200}
          height={200}
        />
      ) : (
        <div className="text-md grid h-11 w-11 flex-none place-items-center items-center justify-center rounded-full bg-slate-800 font-medium uppercase  text-white">
          {getUserInitials(
            `${userData?.firstName || 'P'} ${userData?.lastName || 'B'}`,
          ) || <Spinner size={18} />}
        </div>
      )}

      {userData && (
        <span className="hidden lg:items-center xl:flex">
          <div className="flex min-w-[120px] flex-col items-start">
            <p className="text-sm font-semibold text-slate-700">{`${userData?.firstName || 'PayBoss'} ${userData?.lastName || 'Admin'}`}</p>
            <p className="text-[13px] font-medium text-slate-500">
              {userData?.email?.split('@')[0] || 'admin@payboss'}
            </p>
          </div>
          {/* <ChevronDownIcon
            className="ml-2 h-4 w-4 text-slate-400 text-base"
            aria-hidden="true"
          /> */}
        </span>
      )}
    </div>
  )
}

export default Avatar
