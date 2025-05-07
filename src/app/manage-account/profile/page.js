import Image from "next/image";

import { DefaultCover } from "@/lib/constants";
import ProfileBanner from "@/app/manage-account/profile/components/profile-banner";
import ProfileSecuritySettings from "@/app/manage-account/profile/components/security-settings";

import ProfileDetails from "./components/profile-details";

function AccountSettings() {
  return (
    <>
      <section role="profile-header">
        <div className="relative flex flex-col lg:px-2">
          <div className="relative -top-[90px] h-[300px] w-full overflow-clip rounded-t-none bg-gray-900 sm:rounded-2xl">
            <ProfileBanner />
            <Image
              alt="Profile Banner"
              className="z-0 h-full w-full object-cover"
              height={300}
              src={DefaultCover}
              width={1024}
            />
            <div className="absolute inset-0 z-10 bg-black/50" />
          </div>
        </div>
      </section>
      <section
        className="z-50 -mt-[160px] flex flex-col gap-4 p-5 md:-mt-[180px] lg:place-items-center"
        role="profile-content"
      >
        <div className="7xl:grid-cols-3 grid w-full  gap-4 md:grid-cols-1 xl:flex-row">
          <ProfileDetails />
          <ProfileSecuritySettings />
          {/* <AccountPreferences /> */}
        </div>
      </section>
    </>
  );
}

export default AccountSettings;
