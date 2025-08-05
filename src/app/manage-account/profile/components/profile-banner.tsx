"use client";
import { Chip } from "@heroui/react";
import Image from "next/image";

import useAccountProfile from "@/hooks/use-profile-info";
import { DefaultCover } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function ProfileBanner({ className }: { className?: string }) {
  const { user } = useAccountProfile();

  return !user ? (
    <ProfileBannerLoader className={className} />
  ) : (
    <div
      className={cn(
        "absolute left-0 right-0 top-[24%] z-20 m-7 rounded-2xl border border-input/40 bg-background/10 p-4 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex w-full items-center gap-4">
        <div className="mr-auto flex items-center gap-4">
          <div className="h-20 w-20 overflow-clip rounded-lg">
            <Image
              alt="banner"
              className="z-0 h-full w-full object-cover"
              height={300}
              src={DefaultCover}
              width={1024}
            />
          </div>
          <div className="flex flex-col gap-0">
            <h2 className="heading-4  !font-bold capitalize text-white lg:text-xl">
              {`${user?.first_name} ${user?.last_name}`}
            </h2>
            <div className="heading-5 font-semibold capitalize text-slate-200">
              {/* {merchant}{" "} */}
              <Chip
                className="ml-2 text-sm text-green-500 font-bold"
                color={"success"}
                variant="flat"
              >
                <strong>{user?.role}</strong>
              </Chip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileBannerLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute left-0 right-0 top-[24%] z-20 m-7 rounded-2xl border border-input/40 bg-background/10 p-4 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex w-full items-center gap-4">
        <div className="mr-auto flex items-center gap-4">
          <div className="h-20 w-20 overflow-clip rounded-lg bg-foreground-500/30" />
          <div className="flex flex-col gap-1">
            <div className="h-8 w-[200px] rounded-lg bg-foreground-500/30" />
            <div className="h-8 w-[100px] rounded-lg bg-foreground-500/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
