import { XMarkIcon } from '@heroicons/react/24/outline'
import { SideNavItems } from './SideNavBar'
import Logo from './Logo'

export default function MobileNavBar({
  isMobileMenuOpen,
  toggleMobileMenu,
  pathname,
  expandedSection,
  handleExpand,
  handleMainLinkClick,
  logUserOut,
}) {
  function handleLinkClick() {
    if (isMobileMenuOpen) {
      toggleMobileMenu()
    }
  }
  return (
    <>
      {isMobileMenuOpen && (
        <div
          onClick={toggleMobileMenu}
          className={`absolute ${
            isMobileMenuOpen ? 'inset-0 block' : 'left-[-100%] hidden'
          }  z-[99] bg-slate-900/80`}
        />
      )}
      <nav
        className={`${
          isMobileMenuOpen ? 'left-0 flex' : 'left-[-100%]'
        } fixed top-0 z-[999] h-full w-[70%] min-w-[300px] max-w-[412px] flex-col bg-white p-5 transition-all duration-300 ease-in-out`}
      >
        <button
          className="absolute right-0 mr-2 mt-1 max-w-fit p-2"
          onClick={toggleMobileMenu}
        >
          <XMarkIcon className="h-5 w-5 text-slate-600 transition-all duration-200 ease-in hover:text-primary/80" />
        </button>
        <div className="flex h-full w-full flex-col">
          <div className="-ml-2 scale-[0.9] md:ml-0">
            <Logo />
          </div>
          {/* MENU ITEMS CONTAINER */}
          <SideNavItems
            pathname={pathname}
            expandedSection={expandedSection}
            toggleMobileMenu={toggleMobileMenu}
            handleExpand={handleExpand}
            handleMainLinkClick={handleMainLinkClick}
            handleLinkClick={handleLinkClick}
            logUserOut={logUserOut}
          />
        </div>
      </nav>
    </>
  )
}
