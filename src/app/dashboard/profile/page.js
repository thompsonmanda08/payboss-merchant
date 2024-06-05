import Image from 'next/image'
import React, { Suspense } from 'react'
import DefaultCover from '@/images/profile-cover.jpg'
import { cn } from '@/lib/utils'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import LoadingPage from '@/app/loading'
import ProfileDetails from '@/components/containers/Settings/Profile/ProfileDetails'
import ProfileSecuritySettings from '@/components/containers/Settings/Profile/SecuritySettings'
import AccountPreferences from '@/components/containers/Settings/Profile/AccountPreferences'

function ProfilePage() {
  return (
    <div>
      <ProfileCover />
    </div>
  )
}

function ProfileCover() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <section role="profile-header">
        <div className="relative flex">
          <div className="relative -top-24 h-[300px] w-full -translate-x-3 overflow-clip rounded-2xl bg-gray-900">
            <Image
              className="z-0 h-full w-full object-cover"
              src={DefaultCover}
              width={1024}
              height={300}
            />
            <div className="absolute inset-0 z-10 bg-black/50"></div>
          </div>
          <div
            className={cn(
              'md:-translate--3 absolute top-1/2 z-20 mx-auto w-[95%] rounded-2xl border border-white bg-background/50 p-4 backdrop-blur-md md:left-8',
            )}
          >
            <div className="flex items-center gap-4">
              <div className="mr-auto flex items-center gap-4">
                <div className="h-20 w-20 overflow-clip rounded-lg">
                  <Image
                    className="z-0 h-full w-full object-cover"
                    src={DefaultCover}
                    width={1024}
                    height={300}
                  />
                </div>
                <div className="flex flex-col ">
                  <h2 className="text-lg font-semibold leading-8 text-gray-800 lg:text-xl">
                    Black Cruz
                  </h2>
                  <p className="font-medium leading-6 text-gray-600">
                    Software Engineer
                  </p>
                </div>
              </div>
              <div>
                <div className="text-gray-900 transition-all duration-500 ease-in">
                  <Link
                    href={'/dashboard/settings'}
                    className="du flex items-center gap-2 rounded-lg bg-white from-primary to-blue-500 p-2 px-4 text-sm shadow-xl shadow-slate-700/10 transition-all duration-500 ease-in-out hover:bg-gradient-to-tr hover:text-white"
                  >
                    <Cog6ToothIcon className="h-5 w-5" /> Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        role="profile-content"
        className="grid w-full grid-cols-[repeat(auto-fill,minmax(580px,1fr))] place-items-center gap-4 "
      >
        <ProfileDetails />
        <ProfileSecuritySettings />
        <AccountPreferences />
        {/* <ProfileSecuritySettings /> */}
      </section>
    </Suspense>
  )
}

export default ProfilePage
