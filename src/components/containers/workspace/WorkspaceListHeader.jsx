"use client";
import Logo from "@/components/base/Logo";
import ThemeSwitcher from "@/components/base/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/context/authStore";
import { Cog6ToothIcon, PowerIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";

function WorkspaceHeader({ user }) {
  const { handleUserLogOut } = useAuthStore((state) => state);

  return (
    <>
      <Logo isWhite className="absolute left-5 top-5 z-30 md:left-10 " />
      <div className="absolute right-5 top-5 flex gap-4 md:right-10 items-center">
        {(user?.role?.toLowerCase() == "admin" ||
          user?.role?.toLowerCase() == "owner") && (
          <Button
            as={Link}
            href={"/manage-account"}
            variant="light"
            className="data[hover=true]:bg-foreground-900/30  z-30 aspect-square min-w-[120px] rounded-full bg-foreground-900/20 text-white"
            startContent={<Cog6ToothIcon className=" h-6 w-6" />}
          >
            Manage
          </Button>
        )}
        <Button
          onClick={() => handleUserLogOut("/workspaces")}
          variant="light"
          className="data[hover=true]:bg-foreground-900/30 z-30 aspect-square min-w-[120px] rounded-full bg-foreground-900/20 text-white"
          startContent={<PowerIcon className=" h-6 w-6" />}
        >
          Sign out
        </Button>
        <ThemeSwitcher
          className={
            "dark:bg-foreground/30 text-white hover:text-white hover:opacity-80 z-50"
          }
        />
      </div>
    </>
  );
}

export default WorkspaceHeader;
