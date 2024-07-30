import Image from 'next/image'
import { Suspense } from 'react'
import LoadingPage from '@/app/loading'
import { DefaultCover } from '@/lib/constants'
import {
  AccountPreferences,
  ProfileDetails,
  ProfileSecuritySettings,
} from '@/components/containers'

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <section role="profile-header">
        <div className="relative flex flex-col">
          <div className="relative -top-[90px] h-[300px] w-full overflow-clip rounded-2xl bg-gray-900">
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

function ProfileBanner() {
  return (
    <div className="absolute left-0 right-0 top-[24%] z-20 m-7 rounded-2xl border border-white bg-background/50 p-4 backdrop-blur-md">
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
          {/* <div className="text-gray-900 transition-all duration-500 ease-in">
                    <Link
                      href={'/settings'}
                      className="du flex items-center gap-2 rounded-lg bg-white from-primary to-blue-500 p-2 px-4 text-sm shadow-xl shadow-slate-700/10 transition-all duration-500 ease-in-out hover:bg-gradient-to-tr hover:text-white"
                    >
                      <BR className="h-5 w-5" /> Workspace
                    </Link>
                  </div> */}
        </div>
      </div>
    </div>
  )
}
