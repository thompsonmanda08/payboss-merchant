import { Cross1Icon, ExitIcon } from '@radix-ui/react-icons'
import { SIDE_BAR_OPTIONS } from './SideNavBar'
import Logo from './Logo'

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
    setIsMobileMenuOpen() // CLOSE
  }

  return (
    <>
      {isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className={`absolute ${
            isMobileMenuOpen ? 'inset-0 block' : 'left-[-100%] hidden'
          }  z-[10] bg-slate-900/80`}
        />
      )}
      <nav
        className={`${
          isMobileMenuOpen ? 'left-0 flex' : 'left-[-100%]'
        } fixed top-0 z-[999] h-full w-[70%] min-w-[300px] max-w-[412px] flex-col bg-white p-5 transition-all duration-300 ease-in-out`}
      >
        <button
          className="absolute right-0 mr-2 mt-1 max-w-fit p-2"
          onClick={closeMobileMenu}
        >
          <Cross1Icon className="h-6 w-6 text-slate-600 transition-all duration-200 ease-in hover:text-primary/80" />
        </button>
        <div className="flex h-full w-full flex-col">
          <div className="-ml-2 scale-[0.9] md:ml-0">
            <Logo />
          </div>
          {/* MENU ITEMS CONTAINER */}
          <div className="mt-8 flex h-full w-full flex-col gap-4">
            {SIDE_BAR_OPTIONS.map(({ name, href, Icon }, index) => (
              <div
                key={index}
                // href={href}
                // shallow={true}
                onClick={() => {
                  setCurrentPage(index)
                  setPage(href)
                  closeMobileMenu()
                }}
                className={`group ${
                  // pathname.split("/")[1] == name.toLowerCase() ||
                  // pathname == href
                  currentPage === index
                    ? 'rounded-sm bg-primary/20 text-primary'
                    : 'bg-transparent text-slate-800 hover:bg-accent/5'
                } 
                  flex max-h-14 flex-grow-0 cursor-pointer items-center rounded-lg p-3 text-sm font-medium`}
              >
                <Icon className="h-6 w-6" />
                <span className="ml-3"> {name}</span>
              </div>
            ))}
          </div>

          <button
            className="mb-4 mt-auto flex cursor-pointer items-center gap-3 rounded-lg p-3 text-sm font-medium text-slate-600 hover:bg-primary/10"
            onClick={async () => {
              await handleUserLogOut()
              closeMobileMenu()
            }}
          >
            <ExitIcon className="h-6 w-6" />
            Log out
          </button>
        </div>
      </nav>
    </>
  )
}
