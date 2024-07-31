import Image from 'next/image'
import { Suspense } from 'react'
import LoadingPage from '@/app/loading'
import {
  AccountPreferences,
  ProfileDetails,
  ProfileSecuritySettings,
} from '@/components/containers'
import ProfileBanner from '@/components/base/ProfileBanner'
import { DefaultCover } from '@/lib/constants'

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <section role="profile-header">
        <div className="relative flex flex-col lg:px-2">
          <div className="relative -top-[90px] h-[300px] w-full overflow-clip rounded-t-none bg-gray-900 sm:rounded-2xl">
            <ProfileBanner />
            <Image
              className="z-0 h-full w-full object-cover"
              src={DefaultCover}
              width={1024}
              height={300}
            />
            <div className="absolute inset-0 z-10 bg-black/50"></div>
          </div>
        </div>
      </section>
      <section
        role="profile-content"
        className="z-10 -mt-[180px] grid w-full grid-cols-[repeat(auto-fill,minmax(580px,1fr))] place-items-center gap-4 p-5"
      >
        <ProfileDetails />
        <ProfileSecuritySettings />
        <AccountPreferences />
      </section>
    </Suspense>
  )
}
