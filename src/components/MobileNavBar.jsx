import Link from "next/link";
import { SIDE_BAR_OPTIONS } from "./SideNavBar";
import Logo from "./Logo";
import { CloseIcon, LogOutIcon } from "@/lib/icons";

export default function MobileNavBar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleUserLogOut,
  pathname,
  currentPage,
  setCurrentPage,
  setPage,
}) {
  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      {isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className={`absolute ${
            isMobileMenuOpen ? "block inset-0" : "hidden left-[-100%]"
          }  bg-slate-900/80 z-[10]`}
        />
      )}
      <nav
        className={`${
          isMobileMenuOpen ? "flex left-0" : "left-[-100%]"
        } flex-col w-[70%] max-w-[412px] min-w-[300px] h-full fixed top-0 bg-white transition-all duration-300 ease-in-out z-[999] p-5`}
      >
        <button
          className="p-2 max-w-fit absolute right-0 mr-2 mt-1"
          onClick={closeMobileMenu}
        >
          <CloseIcon className="w-6 h-6 text-slate-600 hover:text-primary/80 transition-all duration-200 ease-in" />
        </button>
        <div className="flex flex-col w-full h-full">
          <div className="scale-[0.9] -ml-2 md:ml-0">
            <Logo />
          </div>
          {/* MENU ITEMS CONTAINER */}
          <div className="flex flex-col w-full h-full gap-4 mt-8">
            {SIDE_BAR_OPTIONS.map(({ name, href, Icon }, index) => (
              <div
                key={index}
                // href={href}
                // shallow={true}
                onClick={() => {
                  setCurrentPage(index);
                  setPage(href);
                  closeMobileMenu();
                }}
                className={`group ${
                  // pathname.split("/")[1] == name.toLowerCase() ||
                  // pathname == href
                  currentPage === index
                    ? "bg-primary/20 text-primary rounded-sm"
                    : "bg-transparent hover:bg-accent/5 text-slate-800"
                } 
                  flex items-center cursor-pointer p-3 rounded-lg text-sm font-medium max-h-14 flex-grow-0`}
              >
                <Icon className="w-6 h-6" />
                <span className="ml-3"> {name}</span>
              </div>
            ))}
          </div>

          <button
            className="mt-auto flex gap-3 cursor-pointer mb-4 p-3 rounded-lg items-center text-sm font-medium hover:bg-primary/10 text-slate-600"
            onClick={async () => {
              await handleUserLogOut();
              closeMobileMenu();
            }}
          >
            <LogOutIcon className="w-6 h-6" />
            Log out
          </button>
        </div>
      </nav>
    </>
  );
}
