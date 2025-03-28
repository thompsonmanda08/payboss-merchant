"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { capitalize, cn, formatCurrency } from "@/lib/utils";
import Avatar from "./ui/avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
  Switch,
} from "@heroui/react";
import useAuthStore from "@/context/auth-store";
import { Skeleton } from "./ui/skeleton";
import useNavigation from "@/hooks/useNavigation";
import useWorkspaces from "@/hooks/useWorkspaces";
import {
  ChatBubbleLeftRightIcon,
  MoonIcon,
  PowerIcon,
  SunIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import useDashboard from "@/hooks/useDashboard";
import BreadCrumbLinks from "./base/BreadCrumbLinks";
import { useWorkspaceInit } from "@/hooks/useQueryHooks";
import { useQueryClient } from "@tanstack/react-query";
import NavIconButton from "./ui/nav-icon-button";
import { useTheme } from "next-themes";
import EnvironmentMode from "./environment-mode";

export default function TopNavBar({ user }) {
  const queryClient = useQueryClient();
  const { isProfile, currentPath, dashboardRoute, workspaceID } =
    useNavigation();
  const { isLoading } = useWorkspaceInit(workspaceID);
  const { workspaceWalletBalance } = useWorkspaces();

  const dataNotReady = !workspaceWalletBalance || isLoading;

  // IF WORKSPACE CHANGES ==> INVALIDATE EVERYTHING IN THE CACHE
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [workspaceID]);

  if (dataNotReady) {
    return <NavbarLoader isProfile />;
  }

  return (
    <nav
      className={cn(
        `__TOPBAR rounded-blur top-navigation fixed left-0 right-0 top-5 z-50 flex w-full -translate-y-5 items-center rounded-xl bg-background/80 py-3 pr-5 shadow-sm backdrop-blur-md transition-all md:pl-2 lg:sticky lg:top-0 lg:justify-start lg:shadow-none`,
        {
          "bg-transparent lg:static px-10 pl-20 pr-10 text-white backdrop-blur-none":
            isProfile,
        }
        // { 'bg-red-600 ': isFloating },
      )}
    >
      <div className="flex w-full items-center">
        {/* LEFT SIDE */}
        <div
          className={cn(
            "relative left-16 hidden transition-all duration-300 ease-in-out lg:left-0 lg:block",
            { "pl-5": isProfile }
          )}
        >
          <BreadCrumbLinks isProfile={isProfile} />
          <h2
            className={cn(
              "pl-2 text-lg font-bold uppercase leading-8 text-foreground/80",
              { "text-white": isProfile }
            )}
          >
            {currentPath}
          </h2>
        </div>

        {/* FAR RIGHT SIDE */}
        <div
          className={cn(
            "relative z-50 ml-auto flex  items-center justify-center rounded-full",
            {
              "bg-card/5 pl-4 pr-1 py-0.5": isProfile,
            }
          )}
        >
          <div
            className={cn("flex items-center gap-4 text-foreground-400", {
              "text-white": isProfile,
            })}
          >
            <Link
              href={dashboardRoute + "/workspace-settings?wallet=true"}
              className={cn(
                "mr-4 flex group cursor-pointer items-start gap-3 text-foreground-600",
                {
                  "text-white": isProfile,
                }
              )}
            >
              <NavIconButton className={"bg-primary"}>
                <WalletIcon className="h-5 w-5 text-white" />
              </NavIconButton>

              <div className="flex flex-col items-start">
                <span
                  className={cn("text-sm leading-4 tracking-wide", {
                    "text-white group-hover:text-white": isProfile,
                  })}
                >
                  Wallet Balance
                </span>
                <span
                  className={cn("-mt-1 text-sm font-bold text-primary", {
                    "text-white": isProfile,
                  })}
                >
                  {formatCurrency(workspaceWalletBalance || "0.00")}
                </span>
              </div>
            </Link>
            {/* TODO: ENABLE NOTIFICATIONS IN THE FUTURE */}
            {/* <div className="relative flex cursor-pointer items-center gap-2 text-sm after:absolute after:-right-1 after:-top-1 after:aspect-square after:h-3 after:w-3 after:rounded-full after:bg-secondary after:content-['']">
              <NavIconButton className={"bg-primary"}>
                <BellIcon className="h-5 w-5 text-white" />
              </NavIconButton>
            </div> */}
            <AvatarDropdown user={user} isProfile={isProfile} />
          </div>
        </div>
      </div>
    </nav>
  );
}

export function AvatarDropdown({ user, isProfile }) {
  const queryClient = useQueryClient();
  const { handleUserLogOut } = useAuthStore((state) => state);
  const { dashboardRoute, pathname } = useNavigation();
  const { workspaceUserRole: role } = useDashboard();
  const { theme, setTheme } = useTheme();
  const [isSelected, setIsSelected] = React.useState(
    theme == "dark" ? true : false
  );

  return (
    <Dropdown
      // showArrow
      radius="sm"
      classNames={{
        base: "before:bg-default-200 mr-5 min-w-60 dark:shadow-foreground ", // change arrow background
        content: cn(
          "p-0 border-sm border-divider bg-card border-[1px] border-border",
          {
            "bg-card/80 backdrop-blur-md": isProfile,
          }
        ),
      }}
    >
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          disableRipple
          className="rounded-full"
        >
          <Avatar
            isProfile
            firstName={user?.first_name}
            lastName={user?.last_name}
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Custom item styles"
        // disabledKeys={['profile']}
        className="p-3"
        itemClasses={{
          base: [
            "rounded-md",
            "text-foreground/70",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "data-[hover=true]:bg-primary-100",
            "dark:data-[hover=true]:bg-default-50",
            "data-[selectable=true]:focus:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[focus-visible=true]:ring-default-500",
          ],
        }}
      >
        <DropdownSection aria-label="Profile & Actions" showDivider>
          <DropdownItem
            isReadOnly
            key="profile"
            href={dashboardRoute + "/profile"}
            className="h-12 gap-2 px-1"
          >
            <Avatar
              firstName={user?.first_name}
              lastName={user?.last_name}
              email={capitalize(role?.role || user?.role)}
              showUserInfo
            />
          </DropdownItem>
          {/* <DropdownItem key="Home" href="/workspaces">
            Exit to Workspaces
          </DropdownItem>
          <DropdownItem key="settings" href={settingsPathname + '/workspaces'}>
            Profile Settings
          </DropdownItem> */}
        </DropdownSection>

        <DropdownSection aria-label="Preferences" showDivider>
          {/* <DropdownItem key="quick_search" shortcut="⌘K">
            Quick search
          </DropdownItem> */}

          <DropdownItem
            isReadOnly
            key="theme"
            className="flex cursor-default justify-between"
          >
            <div className="flex w-full cursor-default items-center justify-between">
              <span>Dark Mode</span>
              {/* <ThemeSwitcher /> */}
              <Switch
                defaultSelected
                isSelected={isSelected}
                onValueChange={(value) => {
                  setIsSelected(value);
                  setTheme(value ? "dark" : "light");
                }}
                size="md"
                color="primary"
                startContent={<SunIcon />}
                endContent={<MoonIcon />}
              >
                {/* Dark mode */}
              </Switch>
            </div>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Help & Feedback">
          <DropdownItem key="Home" href="/workspaces" shortcut="⌘K">
            Go to Workspaces
          </DropdownItem>
          <DropdownItem key="help_and_feedback" href="/support">
            <div className="flex items-center justify-between">
              <span> Help & Support</span>{" "}
              <NavIconButton className={"scale-90"}>
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
              </NavIconButton>
            </div>
          </DropdownItem>
          <DropdownItem
            key="logout"
            onPress={() => {
              queryClient.invalidateQueries();
              handleUserLogOut();
            }}
          >
            <div className="flex items-center justify-between">
              <span>Log Out</span>{" "}
              <NavIconButton
                onClick={() => {
                  queryClient.invalidateQueries();
                  handleUserLogOut();
                }}
                className={"scale-80 bg-primary"}
              >
                <PowerIcon className="h-5 w-5 text-white" />
              </NavIconButton>
            </div>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}

export function NavbarLoader({ isProfile }) {
  return (
    <div className="relative -top-5 flex w-full justify-between">
      <div className="w-full">
        <Skeleton
          className={cn(
            "mb-2 aspect-square h-[8px] w-full max-w-xl rounded-lg",
            {
              "bg-foreground-200 p-4 backdrop-blur-md": isProfile,
            }
          )}
        />
        <Skeleton
          className={cn("aspect-square h-5 w-full max-w-xs rounded-lg", {
            "bg-foreground-200 p-4 backdrop-blur-md": isProfile,
          })}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex space-x-2">
          <Skeleton
            className={cn("aspect-square h-8 rounded-full", {
              "bg-foreground-200 p-4 backdrop-blur-md": isProfile,
            })}
          />
          <Skeleton
            className={cn("aspect-square h-8 rounded-full", {
              "bg-foreground-200 p-4 backdrop-blur-md": isProfile,
            })}
          />
        </div>
        <Skeleton
          className={cn("aspect-square h-12 rounded-full", {
            "bg-foreground-200 p-4 backdrop-blur-md": isProfile,
          })}
        />
      </div>
    </div>
  );
}
