'use client'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Logo from './Logo'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import SideNavItems from './SideNavItems'

function MobileNavBar({
  isMobileMenuOpen,
  toggleMobileMenu,
  pathname,
  expandedSection,
  handleExpand,
  handleMainLinkClick,
  navBarItems,
}) {
  function handleLinkClick() {
    if (isMobileMenuOpen) {
      toggleMobileMenu()
    }
  }
  return (
    <>
      {isMobileMenuOpen && (
        <motion.div
          whileInView={{ opacity: [0, 1], transition: { duration: 0.3 } }}
          onClick={toggleMobileMenu}
          className={cn(`absolute left-[-100%] z-[99] hidden bg-slate-900/80`, {
            'inset-0 block': isMobileMenuOpen,
          })}
        />
      )}
      <nav
        className={cn(
          `fixed left-[-100%] top-0 z-[999] h-full w-[70%] min-w-[300px] max-w-[412px] flex-col bg-white p-5 transition-all duration-300 ease-in-out`,
          { 'left-0 flex': isMobileMenuOpen },
        )}
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
            navBarItems={navBarItems}
          />
        </div>
      </nav>
    </>
  )
}

export default MobileNavBar
