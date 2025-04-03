"use client";
import {
  Bars3BottomLeftIcon,
  BriefcaseIcon,
  CheckBadgeIcon,
  PowerIcon,
  UserCircleIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

import useAuthStore from "@/context/auth-store";
import useNavigation from "@/hooks/useNavigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import NavIconButton from "./ui/nav-icon-button";
import Logo from "./base/payboss-logo";

function SettingsSideBar({ title, backButtonText, session }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [openSettingsSideBar, setOpenSettingsSideBar] = useState(false);
  const { handleUserLogOut } = useAuthStore();
  const { settingsPathname, isProfile, isAccountLevelSettingsRoute } =
    useNavigation();

  function toggleSideBar() {
    setOpenSettingsSideBar(!openSettingsSideBar);
  }

  const dashboardHome = settingsPathname?.split("/")?.slice(0, 3)?.join("/");
  const homeRoute = dashboardHome || "/workspaces";
  const systemState = session?.kyc?.state;

  // SETTINGS OPTIONS
  const SETTINGS_LINKS = [
    {
      name: "Workspaces",
      Icon: BriefcaseIcon,
      href: "/manage-account",
    },
    {
      name: "Users",
      Icon: UserGroupIcon,
      href: "/manage-account/users",
    },
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
          startContent={<Bars3BottomLeftIcon className="h-7 w-7" />}
          onClick={toggleSideBar}
        >
          <Logo href={"#"} />
        </Button>
      </div>

      {openSettingsSideBar && (
        <motion.div
          className={cn(`absolute left-[-100%] z-[99] hidden bg-black/60`, {
            "inset-0 block": openSettingsSideBar,
          })}
          whileInView={{ opacity: [0, 1], transition: { duration: 0.3 } }}
          onClick={toggleSideBar}
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
            className="absolute -right-16 -top-2 aspect-square rounded-full p-2 data-[hover=true]:bg-primary-900/10 lg:hidden"
            variant="light"
            onClick={() => setOpenSettingsSideBar(false)}
          >
            <XMarkIcon className="h-5 w-5 text-white transition-all duration-200 ease-in hover:text-primary/80 hover:text-white" />
          </Button>
          <Button
            as={Link}
            className="h-12 w-full justify-start p-2 text-foreground-500 hover:text-primary data-[hover=true]:bg-primary/10 dark:data-[hover=true]:text-primary-50"
            href={homeRoute}
            startContent={<ArrowLeftIcon className="h-5 w-5" />}
            variant="light"
          >
            {backButtonText || "Back to Workspaces"}
          </Button>
          <hr className="my-2 dark:border-primary/20" />
          {/* ******************** WORKSPACE SETTINGS ******************************* */}
          <div
            className="flex flex-col justify-start"
            role="`workspace_settings`"
          >
            <p className="py-2 text-[13px] font-medium uppercase tracking-wide text-foreground-400">
              {!isAccountLevelSettingsRoute ? title : "ACCOUNT SETTINGS"}
            </p>
            <hr className="my-2 dark:border-primary/20" />
            {SETTINGS_LINKS?.map(({ href, Icon, name }, index) => {
              return (
                <Button
                  key={href + index}
                  as={Link}
                  className={cn(
                    "my-1 h-12 w-full justify-start p-2 text-foreground-500 hover:text-primary dark:data-[hover=true]:text-primary-50 data-[hover=true]:bg-primary/10",
                    {
                      "dark:bg-primary/50 bg-primary/10 dark:text-foreground text-primary-600":
                        pathname == href,
                    }
                  )}
                  href={href}
                  startContent={<Icon className="h-5 w-5" />}
                  variant="light"
                >
                  {name}
                </Button>
              );
            })}
          </div>
          {/* ************************************************************* */}
          <hr className="mt-auto mb-4 dark:border-primary/20" />

          {/* ************************************************************* */}
          {/* <Chip
            radius="sm"
            color={systemState == "prod" ? "success" : "warning"}
            variant="dot"
          >
            {systemState == "prod" ? "System Live Environment" : "Staging Mode"}
          </Chip>

          <hr className="my-4 dark:border-primary/20" /> */}

          <div className="flex items-center gap-2 px-5 pt-2">
            <NavIconButton
              className={"bg-primary"}
              onClick={() => {
                queryClient.invalidateQueries();
                handleUserLogOut();
              }}
            >
              <PowerIcon className="h-5 w-5 text-white" />
            </NavIconButton>
            <Button
              onClick={() => {
                queryClient.invalidateQueries();
                handleUserLogOut();
              }}
              variant="light"
              // size="sm"
              className="my-2 h-auto w-full justify-start p-2 text-slate-600 hover:text-primary-600 data-[hover=true]:bg-primary-50"
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
