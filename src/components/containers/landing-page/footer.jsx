import Link from "next/link";
import { NavLink } from "@/components/base/NavLink";
import Logo from "@/components/base/Logo";
import { Container } from "@/components/base/Container";

export function Footer({ showLogo = true, showLinks = true }) {
  return (
    <footer className="bg-background">
      <Container>
        {(showLogo || showLinks) && (
          <div className="py-16">
            {showLogo && (
              <div className="flex items-center justify-center ">
                <Logo href="/" aria-label="Home" className="" />
              </div>
            )}
            {showLinks && (
              <nav className="mt-10 text-sm" aria-label="quick links">
                <div className="-my-1 flex justify-center gap-x-6">
                  <NavLink href="#features">Features</NavLink>
                  <NavLink href="#why-payboss">Why PayBoss</NavLink>
                  <NavLink href="#faqs">FAQs</NavLink>
                </div>
              </nav>
            )}
          </div>
        )}
        <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6">
            <Link href="#" className="group" aria-label="PayBoss on X">
              <svg
                className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path d="M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1122 12.8955L4 20H5.38119L10.7254 13.7878L14.994 20H19.656L13.3171 10.7749H13.3174ZM11.4257 12.9738L10.8064 12.0881L5.87886 5.03974H8.00029L11.9769 10.728L12.5962 11.6137L17.7652 19.0075H15.6438L11.4257 12.9742V12.9738Z" />
              </svg>
            </Link>
            <Link href="#" className="group" aria-label="PayBoss on LinkedIn">
              <svg
                className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9 V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977 C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z"></path>
              </svg>
            </Link>
          </div>
          <p className="mt-6 text-sm text-foreground/50 sm:mt-0">
            Copyright &copy; {new Date().getFullYear()} PayBoss. All rights
            reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
