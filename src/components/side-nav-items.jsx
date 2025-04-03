"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { PowerIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import useAuthStore from "@/context/auth-store";
import useNavigation from "@/hooks/useNavigation";

import NavItemIcon from "./base/nav-item-icon";

export default function SideNavItems({
  // pathname,
  expandedSection,
  handleExpand,
  handleMainLinkClick,
  handleLinkClick,
  navBarItems,
}) {
  const queryClient = useQueryClient();
  const { handleUserLogOut } = useAuthStore((state) => state);
  const { pathname, pathArr } = useNavigation((state) => state);

  return (
    <div className="flex h-[88%] flex-1 flex-grow flex-col  p-1">
      <ul className="mb-auto flex  w-full flex-col divide-y dark:divide-foreground-50 divide-slate-100/50 ">
        {navBarItems.map(({ ID, name, href, Icon, subMenuItems }, index) => {
          const isExpanded = expandedSection === index;

          const currentPage =
            subMenuItems && subMenuItems.length > 0 ? subMenuItems.href : href;
          const isSelected = pathname === currentPage;
          const activeLayer = pathArr.includes(ID?.toLowerCase());

          return (
            <li key={href || index} className="flex flex-col">
              {subMenuItems ? (
                <div
                  className={cn(
                    `group flex cursor-pointer items-center gap-3 rounded-sm 
                        p-3 text-sm font-medium text-foreground-600 transition-all duration-200 ease-in-out`,
                    {
                      "text-primary shadow-none shadow-slate-700/10":
                        isExpanded,

                      "font-bold text-primary": activeLayer,
                    },
                  )}
                  onClick={() => handleExpand(index)}
                >
                  <NavItemIcon
                    Icon={Icon}
                    activeLayer={activeLayer}
                    isExpanded={isExpanded}
                    isSelected={isSelected}
                  />

                  <span
                    className={cn({
                      "font-bold text-primary": isSelected,
                    })}
                  >
                    {name}
                  </span>
                  <ChevronDownIcon
                    className={cn(
                      "ml-auto h-4 w-4 transition-all duration-300 ease-in-out",
                      {
                        "rotate-180": isExpanded,
                      },
                    )}
                  />
                </div>
              ) : (
                <Link
                  className={cn(
                    `group flex cursor-pointer items-center gap-3 rounded-sm bg-transparent p-3 text-sm font-medium text-foreground-600 transition-all duration-200 ease-in-out `,
                    {
                      "rounded-lg bg-primary/10 font-medium text-primary shadow-none shadow-slate-400/10":
                        isSelected,
                    },
                  )}
                  href={href}
                  onClick={handleMainLinkClick}
                >
                  <NavItemIcon
                    Icon={Icon}
                    isExpanded={isExpanded}
                    isSelected={isSelected}
                  />

                  {name}
                </Link>
              )}
              {subMenuItems && (
                <motion.div
                  animate={{
                    height: isExpanded ? "auto" : 0,
                    opacity: isExpanded ? 1 : 0,
                  }}
                  className="overflow-hidden rounded-lg rounded-t-none pl-6 shadow-none shadow-slate-700/5"
                  initial={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {subMenuItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      className={cn(
                        `group relative ml-4 flex items-center gap-3 rounded-sm bg-transparent p-3 text-sm font-medium  transition-all duration-200 ease-in-out before:absolute before:-left-5 before:-top-10 before:h-16 before:w-6 before:rounded-lg before:border-b before:border-l-[2px] before:border-r-8 before:border-t-8 before:border-[#e4ebf6] before:dark:border-l-border before:dark:border-b-border  before:border-r-transparent before:border-t-transparent hover:bg-primary/10 before:content-[""] text-foreground-600 md:ml-6 hover:text-primary`,
                        {
                          "bg-primary/5 text-primary font-medium":
                            pathname === subItem.href,
                        },
                      )}
                      href={subItem.href}
                      onClick={handleLinkClick}
                    >
                      <subItem.Icon
                        className={cn("h-5 w-5 ", {
                          "font-bold text-primary": pathname === subItem.href,
                        })}
                      />
                      <span
                        className={cn("", {
                          "font-bold ": pathname === subItem.href,
                        })}
                      >
                        {subItem.name}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </li>
          );
        })}
      </ul>
      <hr className="mt-auto" />
      <div
        className={cn(
          `group flex cursor-pointer items-center gap-3 rounded-lg bg-transparent p-3 text-sm font-bold text-slate-600 shadow-none transition-all duration-200 ease-in-out hover:text-primary`,
        )}
        onClick={() => {
          queryClient.invalidateQueries();
          handleUserLogOut();
        }}
      >
        <NavItemIcon
          Icon={PowerIcon}
          activeLayer={false}
          isSelected={true}
          onIconPress={() => {
            queryClient.invalidateQueries();
            handleUserLogOut();
          }}
        />
        Log out
      </div>
    </div>
  );
}
