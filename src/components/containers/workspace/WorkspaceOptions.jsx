"use client";

import { cn } from "@/lib/utils";
import {
  BriefcaseIcon,
  ChevronRightIcon,
  HomeIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import DropdownButton from "@/components/ui/dropdown-button";
import Spinner from "@/components/ui/Spinner";
import SoftBoxIcon from "@/components/base/SoftBoxIcon";

export default function WorkspaceSelection({
  isSelected,
  dashboardRoute,
  activeWorkspace,
  workspaces,
}) {
  const workspaceOptions = [
    {
      key: "home",
      name: "Home",
      href: "/workspaces",
      shortcut: "⌘H",
      description: "Go back Home",
      Icon: HomeIcon,
    },

    {
      key: "workspaces",
      name: "Workspaces",
      // shortcut: '>',
      description: "Change your workspace",
      Icon: BriefcaseIcon,
      subMenuItems: workspaces.map((item) => {
        return {
          key: item.ID,
          label: item.workspace,
          description: item?.description,
          // href: `/dashboard/${item?.ID}`,
          onSelect: () => {
            // setActiveWorkspace(item)
            // push(`/dashboard/${item?.ID}`)
            // refresh()
            window.location.href = `/dashboard/${item?.ID}`;
          },
          Icon: BriefcaseIcon,
        };
      }),
    },
    {
      key: "settings",
      name: "Workspace Settings",
      href: dashboardRoute + "/workspace-settings",
      shortcut: "⌘S",
      description: "Workspace preferences",
      Icon: WrenchScrewdriverIcon,
    },
    // {
    //   key: 'users',
    //   name: 'Manage Members',
    //   href: '/dashboard/settings/users',
    //   shortcut: '⌘M',
    //   description: 'Manage workspace members',
    //   Icon: UserGroupIcon,
    //   showDivider: true,
    // },

    // {
    //   key: 'new',
    //   name: 'New Workspace',
    //   onClick: '/workspaces/new',
    //   shortcut: '⌘N',
    //   description: 'Create a new workspaces',
    //   Icon: PlusIcon,
    // },
  ];

  return (
    <>
      <DropdownButton dropDownItems={workspaceOptions} backdropBlur={true}>
        <SoftBoxIcon className={"aspect-square h-9 w-10 p-2"}>
          <BriefcaseIcon />
        </SoftBoxIcon>
        <div className="flex w-full items-center justify-between text-primary">
          <div className="flex flex-col items-start justify-start gap-0">
            <div className="text-base font-semibold uppercase">
              {!activeWorkspace || !activeWorkspace?.workspace ? (
                <div className="flex gap-2 text-sm font-bold capitalize">
                  <Spinner size={18} /> Loading workspace...
                </div>
              ) : (
                activeWorkspace?.workspace
              )}
            </div>
            <span className="-mt-1 text-xs font-medium capitalize text-foreground-600 tracking-wide">
              {`${activeWorkspace?.workspaceType}'s Workspace`}
            </span>
          </div>
          <ChevronRightIcon className={cn("h-4 w-4 ease-in-out")} />
        </div>
      </DropdownButton>
    </>
  );
}
