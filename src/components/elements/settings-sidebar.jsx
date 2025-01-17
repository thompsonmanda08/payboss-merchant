"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bars3BottomLeftIcon,
  BriefcaseIcon,
  CheckBadgeIcon,
  LockClosedIcon,
  PowerIcon,
  UserCircleIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuthStore from "@/context/auth-store";
import useNavigation from "@/hooks/useNavigation";
import NavIconButton from "../ui/nav-icon-button";
import Logo from "../base/Logo";

function SettingsSideBar({
  title,
  backButtonText,
  // isProfile,
  session,
}) {
  const pathname = usePathname();
  const [openSettingsSideBar, setOpenSettingsSideBar] = useState(false);
  const handleUserLogOut = useAuthStore((state) => state.handleUserLogOut);
  const {
    settingsPathname,
    isProfile,
    currentPath,
    isAccountLevelSettingsRoute,
  } = useNavigation();

  function toggleSideBar() {
    setOpenSettingsSideBar(!openSettingsSideBar);
  }

  const dashboardHome = settingsPathname?.split("/")?.slice(0, 3)?.join("/");
  const homeRoute = dashboardHome || "/workspaces";

  // SETTINGS OPTIONS
  const SETTINGS_LINKS = [
    {
      name: "Workspaces",
      Icon: BriefcaseIcon,
      href: "/manage-account",
    },
    {
      name: "People",
      Icon: UserGroupIcon,
      href: "/manage-account/users",
    },

    // {
    //   name: 'Security & Permissions',
    //   Icon: LockClosedIcon,
    //   href: '/manage-account/security',
    // },
    {
      name: "Profile Settings",
      Icon: UserCircleIcon,
      href: "/manage-account/profile",
    },

    {
      name: "Account Verification",
      Icon: CheckBadgeIcon,
      href: "/manage-account/account-verification",
    },
  ];

  return (
    <>
      <div
        className={cn(
          "fixed z-[77] flex h-16 w-screen bg-card/60 dark:shadow-black/10 dark:shadow-xl backdrop-blur-md shadow-sm lg:hidden",
          {
            "bg-transparent": isProfile,
          }
        )}
      >
        <Button
          className={cn(
            "absolute left-6 top-3 z-50 h-8 min-w-5 items-center bg-transparent p-2 py-3 text-foreground/70 hover:bg-transparent lg:hidden",
            { "text-white": isProfile }
          )}
          onClick={toggleSideBar}
          startContent={<Bars3BottomLeftIcon className="h-7 w-7" />}
        >
          <Logo href={"#"} />
        </Button>
      </div>

      {openSettingsSideBar && (
        <motion.div
          whileInView={{ opacity: [0, 1], transition: { duration: 0.3 } }}
          onClick={toggleSideBar}
          className={cn(`absolute left-[-100%] z-[99] hidden bg-black/60`, {
            "inset-0 block": openSettingsSideBar,
          })}
        />
      )}
      <motion.nav
        className={cn(
          `sticky -left-[110%] z-50 hidden h-full min-h-screen w-[380px] rounded-r-3xl bg-card py-5 transition-all duration-500 ease-in-out lg:left-0 lg:block`,
          { "absolute left-0 z-[100] block": openSettingsSideBar }
        )}
      >
        <div className="relative flex h-full w-full flex-col px-5">
          <Button
            isIconOnly
            variant="light"
            className="absolute -right-16 -top-2 aspect-square rounded-full p-2 data-[hover=true]:bg-primary-900/10 lg:hidden"
            onClick={() => setOpenSettingsSideBar(false)}
          >
            <XMarkIcon className="h-5 w-5 text-white transition-all duration-200 ease-in hover:text-primary/80 hover:text-white" />
          </Button>
          <Button
            variant="light"
            as={Link}
            href={homeRoute}
            className="h-12 w-full justify-start p-2 text-foreground-500 hover:text-primary data-[hover=true]:bg-primary/10 dark:data-[hover=true]:text-primary-50"
            startContent={<ArrowLeftIcon className="h-5 w-5" />}
          >
            {backButtonText || "Back to Workspaces"}
          </Button>
          <hr className="my-2 dark:border-primary/20" />
          {/* ******************** WORKSPACE SETTINGS ******************************* */}
          <div
            role="`workspace_settings`"
            className="flex flex-col justify-start"
          >
            <p className="py-2 text-[13px] font-medium uppercase tracking-wide text-foreground-400">
              {!isAccountLevelSettingsRoute ? title : "ACCOUNT SETTINGS"}
            </p>
            <hr className="my-2 dark:border-primary/20" />
            {SETTINGS_LINKS?.map(({ href, Icon, name }, index) => {
              return (
                <Button
                  as={Link}
                  key={href + index}
                  href={href}
                  variant="light"
                  className={cn(
                    "my-1 h-12 w-full justify-start p-2 text-foreground-500 hover:text-primary dark:data-[hover=true]:text-primary-50 data-[hover=true]:bg-primary/10",
                    {
                      "dark:bg-primary/50 bg-primary/10 dark:text-foreground text-primary-600":
                        pathname == href,
                    }
                  )}
                  startContent={<Icon className="h-5 w-5" />}
                >
                  {name}
                </Button>
              );
            })}
          </div>

          {/* ************************************************************* */}
          <hr className="mt-auto dark:border-primary/20" />
          <div className="flex items-center gap-2 px-5 pt-2">
            <NavIconButton
              className={"bg-primary"}
              onClick={() => handleUserLogOut()}
            >
              <PowerIcon className="h-5 w-5 text-white" />
            </NavIconButton>
            <Button
              variant="light"
              // size="sm"
              className="my-2 h-auto w-full justify-start p-2 text-slate-600 hover:text-primary-600 data-[hover=true]:bg-primary-50"
              onClick={() => handleUserLogOut()}
            >
              Log out
            </Button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}

export default SettingsSideBar;
