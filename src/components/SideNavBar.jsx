"use client";
import {
  HomeIcon,
  BurgerMenuIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogOutIcon,
  TransactionsIcon,
  AccountSettingsIcon,
} from "@/lib/icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import { useEffect, useState } from "react";
import MobileNavBar from "./MobileNavBar";
import useNavigationStore from "@/state/navigationStore";
import useCustomTabsHook from "@/hooks/CustomTabsHook";
import LandingPage from "../pages/LandingPage";
import { isAuthenticated } from "@/app/actions";
import useAuthStore from "@/state/authStore";

export const SIDE_BAR_OPTIONS = [
  {
    name: "Dashboard",
    href: "",
    Icon: HomeIcon,
  },
  {
    name: "Transactions",
    href: "transactions",
    Icon: TransactionsIcon,
  },

  {
    name: "Account Settings",
    href: "account-settings",
    Icon: AccountSettingsIcon,
  },
];

function SideNavBar({ authenticatedUser }) {
  const pathname = usePathname();
  const { logUserOut } = useAuthStore();

  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { currentPage, setCurrentPage, setPage } = useNavigationStore();

  function toggleSideNav() {
    setIsSideNavCollapsed(!isSideNavCollapsed);
  }
  function toggleMobileMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  useEffect(() => {
    console.log("SIDE NAV RERENDERED: ", currentPage);
  }, [authenticatedUser, currentPage]);

  // NO SIDE-NAV FOR AUTH PAGES
  if (!authenticatedUser || pathname.startsWith("/auth")) {
    return <></>;
  }

  return (
    <>
      <div
        className="p-2 w-fit z-30 absolute left-5 top-5 lg:hidden"
        onClick={toggleMobileMenu}
      >
        <BurgerMenuIcon className="w-6 h-6 text-slate-700" />
      </div>
      <nav
        className={`${
          isSideNavCollapsed
            ? "max-w-[96px] items-center"
            : "max-w-[320px] min-w-[220px]"
        } hidden lg:block px-4 pt-5 pb-10 transition-all w-full duration-500 ease-in-out h-screen max-h-screen bg-white shadow-md shadow-slate-800/5 z-20`}
      >
        <div className="flex flex-col w-full h-full">
          <div className="group flex justify-between items-center relative ">
            <Logo isCollapsedNavBar={isSideNavCollapsed} />

            <button onClick={toggleSideNav}>
              {isSideNavCollapsed ? (
                <ChevronRightIcon
                  className={`${
                    isSideNavCollapsed
                      ? "absolute group-hover:delay-400 group-hover:block opacity-0 group-hover:opacity-100 group-hover:bg-primary group-hover:rounded-lg text-white rounded-xl top-2 bottom-0"
                      : "hidden"
                  } text-4xl w-8 h-8 p-1 aspect-square delay-200 transition-all duration-500 ease-in-out`}
                />
              ) : (
                <ChevronLeftIcon
                  className={`text-4xl w-8 h-8 p-1 aspect-square text-slate-600 delay-200 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100`}
                />
              )}
            </button>
          </div>
          {/* MENU ITEMS CONTAINER */}
          <div className="flex flex-col w-full h-full gap-4 mt-8">
            {SIDE_BAR_OPTIONS.map(({ name, href, Icon }, index) => (
              <div
                key={index}
                // href={href}
                onClick={() => {
                  setCurrentPage(index);
                  setPage(href);
                }}
                // shallow={true}
                className={`group ${
                  // pathname.split("/")[1] == name.toLowerCase() ||
                  // pathname == href
                  currentPage === index
                    ? "bg-primary/10 text-primary font-medium rounded-sm"
                    : "bg-transparent hover:bg-primary/10 text-slate-800 font-normal "
                } 

                ${isSideNavCollapsed ? "justify-center" : "gap-3"}
                  flex items-center cursor-pointer p-3 rounded-lg text-sm font-medium max-h-14 flex-grow-0`}
              >
                <Icon className="w-6 h-6" />
                {isSideNavCollapsed ? (
                  <span
                    className={`${
                      isSideNavCollapsed
                        ? "absolute hidden group-hover:block opacity-0 group-hover:opacity-100 group-hover:bg-primary bg-primary group-hover:rounded-md text-white left-[110%] "
                        : "hidden"
                    } text-base w-fit text-nowrap group-hover:delay-500 transition-all duration-500 ease-in-out px-3 py-1`}
                  >
                    {name}
                  </span>
                ) : (
                  name
                )}
              </div>
            ))}
          </div>
          <button
            className={`group ${
              isSideNavCollapsed
                ? " mx-auto w-12 justify-center bg-primary/20 hover:bg-primary hover:rounded-md text-primary hover:text-white"
                : "text-slate-600 bg-primary/10 hover:bg-primary/20 hover:text-primary font-medium"
            } mt-auto flex gap-3 cursor-pointer mb-2 p-3 rounded-lg items-center text-sm font-medium transition-all duration-200 ease-in-out relative`}
            onClick={logUserOut}
          >
            <LogOutIcon className="w-6 h-6" />
            {isSideNavCollapsed ? (
              <span
                className={`${
                  isSideNavCollapsed
                    ? "absolute hidden group-hover:block opacity-0 group-hover:opacity-100 group-hover:bg-primary bg-primary group-hover:rounded-md text-white left-[130%] "
                    : "hidden"
                } text-base w-fit group-hover:delay-400 transition-all duration-500 ease-in-out px-3 py-1`}
              >
                {"Logout"}
              </span>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE NAVIGATION */}
      <MobileNavBar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        pathname={pathname}
        currentPage={currentPage}
        setPage={setPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}

export default SideNavBar;
