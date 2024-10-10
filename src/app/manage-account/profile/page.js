import Image from 'next/image'
import { Suspense } from 'react'
import LoadingPage from '@/app/loading'
import { DefaultCover } from '@/lib/constants'
import ProfileBanner from '@/components/base/ProfileBanner'
import ProfileDetails from './ProfileDetails'
import AccountPreferences from './AccountPreferences'
import ProfileSecuritySettings from '@/components/containers/settings/ProfileSecuritySettings'

function AccountSettings() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <section role="profile-header">
        <div className="relative flex flex-col lg:px-2">
          <div className="relative -top-[90px] h-[300px] w-full overflow-clip rounded-t-none bg-gray-900 sm:rounded-2xl">
            <ProfileBanner />
            <Image
              className="z-0 h-full w-full object-cover"
              src={DefaultCover}
              alt="Profile Banner"
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
        <div className="7xl:grid-cols-3 grid w-full  gap-4 md:grid-cols-2 xl:flex-row">
          <ProfileDetails />
          <ProfileSecuritySettings />
          <AccountPreferences />
        </div>
      </section>
    </Suspense>
  )
}

export default AccountSettings
