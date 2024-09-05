'use client'

import Image from 'next/image'
import { cn, getUserInitials } from '@/lib/utils'
import { Avatar as NextAvatar } from '@nextui-org/react'

function Avatar({ firstName, lastName, src, email, showUserInfo, isProfile }) {
  return (
    <div
      className="flex cursor-pointer items-center justify-start gap-2
							transition-all duration-200 ease-in-out"
    >
      <span className="sr-only">Open user menu</span>
      {src ? (
        <NextAvatar
          className="h-9 w-9 flex-none rounded-xl bg-gray-50"
          src={src}
          alt={`Image - ${firstName} ${lastName}`}
          width={200}
          height={200}
        />
      ) : (
        <div className="text-md ml-px grid h-9 w-9 flex-none scale-90 place-items-center items-center justify-center rounded-full bg-primary-800 font-medium uppercase text-white ring-2  ring-primary ring-offset-1">
          {getUserInitials(`${firstName} ${lastName}`)}
        </div>
      )}

      {showUserInfo && (
        <span className="hidden lg:items-center xl:flex">
          <div className="flex min-w-[120px] flex-col items-start">
            <p
              className={cn('text-sm font-semibold text-gray-700', {
                'text-white': isProfile,
              })}
            >{`${firstName} ${lastName}`}</p>
            <p
              className={cn('text-xs font-medium text-gray-500', {
                'text-white': isProfile,
              })}
            >
              {email}
            </p>
          </div>
        </span>
      )}
    </div>
  )
}

export default Avatar
