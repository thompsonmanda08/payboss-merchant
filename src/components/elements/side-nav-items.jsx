"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { PowerIcon } from "@heroicons/react/24/solid";

import useAuthStore from "@/context/authStore";
import useNavigation from "@/hooks/useNavigation";
import NavItemIcon from "../base/NavItemIcon";

export default function SideNavItems({
  // pathname,
  expandedSection,
  handleExpand,
  handleMainLinkClick,
  handleLinkClick,
  navBarItems,
}) {
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
          const activeLayer = pathArr.includes(ID.toLowerCase());

          return (
            <li key={href || index} className="flex flex-col">
              {subMenuItems ? (
                <div
                  onClick={() => handleExpand(index)}
                  className={cn(
                    `group flex cursor-pointer items-center gap-3 rounded-sm 
                        p-3 text-sm font-medium text-foreground-600 transition-all duration-200 ease-in-out`,
                    {
                      "text-primary shadow-none shadow-slate-700/10":
                        isExpanded,

                      "font-bold text-primary": activeLayer,
                    }
                  )}
                >
                  <NavItemIcon
                    isSelected={isSelected}
                    activeLayer={activeLayer}
                    isExpanded={isExpanded}
                    Icon={Icon}
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
                      }
                    )}
                  />
                </div>
              ) : (
                <Link
                  href={href}
                  className={cn(
                    `group flex cursor-pointer items-center gap-3 rounded-sm bg-transparent p-3 text-sm font-medium text-foreground-600 transition-all duration-200 ease-in-out `,
                    {
                      "rounded-lg bg-primary/10 font-medium text-primary shadow-none shadow-slate-400/10":
                        isSelected,
                    }
                  )}
                  onClick={handleMainLinkClick}
                >
                  <NavItemIcon
                    isSelected={isSelected}
                    isExpanded={isExpanded}
                    Icon={Icon}
                  />

                  {name}
                </Link>
              )}
              {subMenuItems && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: isExpanded ? "auto" : 0,
                    opacity: isExpanded ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-lg rounded-t-none pl-6 shadow-none shadow-slate-700/5"
                >
                  {subMenuItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      onClick={handleLinkClick}
                      className={cn(
                        `group relative ml-4 flex items-center gap-3 rounded-sm bg-transparent p-3 text-sm font-medium  transition-all duration-200 ease-in-out before:absolute before:-left-5 before:-top-10 before:h-16 before:w-6 before:rounded-lg before:border-b before:border-l-[2px] before:border-r-8 before:border-t-8 before:border-[#e4ebf6] before:dark:border-l-border before:dark:border-b-border  before:border-r-transparent before:border-t-transparent hover:bg-primary/10 before:content-[""] text-foreground-600 md:ml-6 hover:text-primary`,
                        {
                          "bg-primary/5 text-primary font-medium":
                            pathname === subItem.href,
                        }
                      )}
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
        onClick={() => handleUserLogOut()}
        className={cn(
          `group flex cursor-pointer items-center gap-3 rounded-lg bg-transparent p-3 text-sm font-bold text-foreground-600 shadow-none transition-all duration-200 ease-in-out hover:text-primary`
        )}
      >
        <NavItemIcon
          isSelected={true}
          activeLayer={false}
          Icon={PowerIcon}
          onIconPress={handleUserLogOut}
        />
        Log out
      </div>
    </div>
  );
}
