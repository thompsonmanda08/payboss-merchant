import Image from 'next/image'
import { Suspense } from 'react'
import LoadingPage from '@/app/loading'
import { DefaultCover } from '@/lib/constants'
import {
  AccountPreferences,
  ProfileDetails,
  ProfileSecuritySettings,
} from '@/components/containers'
import ProfileBanner from '@/components/base/ProfileBanner'

function AccountSettings() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <section role="profile-header">
        <div className="relative flex flex-col">
          <div className="relative h-[300px] w-full overflow-clip rounded-2xl bg-gray-900 lg:-top-5">
            {/* <div className="absolute z-50 w-full bg-red-500 py-2">
              <BreadCrumbLinks isProfile />
            </div> */}
            <ProfileBanner className={'top-[0%]'} />
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
        className="z-50 -mt-[160px] flex flex-col gap-4 p-5 md:-mt-[180px] lg:place-items-center"
      >
        <div className="flex w-full flex-col items-start gap-4 xl:flex-row">
          <ProfileDetails />
          <AccountPreferences />
        </div>
        {/* <div className="flex w-full flex-col gap-4 xl:flex-row">
          <ProfileSecuritySettings />
        </div> */}
      </section>
    </Suspense>
  )
}

export default AccountSettings
