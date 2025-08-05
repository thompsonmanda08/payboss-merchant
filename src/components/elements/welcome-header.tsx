"use client";
import { Cog6ToothIcon, PowerIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import Logo from "@/components/base/payboss-logo";
import ThemeSwitcher from "@/components/base/theme-switcher";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/context/auth-store";

import EnvironmentMode from "./environment-mode";

function WorkspaceHeader({
  permissions,
  accountState,
}: {
  permissions: any;
  accountState: string;
}) {
  const { handleUserLogOut } = useAuthStore((state) => state);

  return (
    <>
      <Logo isWhite className="absolute left-5 top-5 z-30 md:left-10 " />
      <div className="absolute right-5 top-5 flex gap-2 md:right-10 items-center">
        {accountState && <EnvironmentMode mode={accountState} />}
        {(permissions?.role?.toLowerCase() == "admin" ||
          permissions?.role?.toLowerCase() == "owner") && (
          <Button
            as={Link}
            className="data[hover=true]:bg-foreground-900/30 z-30 aspect-square min-w-[120px] rounded-full bg-foreground-900/50 text-white"
            href={"/manage-account"}
            startContent={<Cog6ToothIcon className=" h-5 w-5" />}
            variant="light"
          >
            Manage
          </Button>
        )}
        <Button
          className="data[hover=true]:bg-foreground-900/30 z-30 aspect-square min-w-[120px] rounded-full bg-foreground-900/50 text-white"
          startContent={<PowerIcon className=" h-5 w-5" />}
          variant="light"
          onClick={() => {
            handleUserLogOut();
          }}
        >
          Sign out
        </Button>
        <ThemeSwitcher
          className={
            "dark:bg-foreground/30 bg-foreground-900 text-white hover:text-white dark:hover:opacity-80 hover:bg-primary/50 z-50"
          }
        />
      </div>
    </>
  );
}

export default WorkspaceHeader;
