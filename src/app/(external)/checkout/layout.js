import Logo from "@/components/base/Logo";
import ThemeSwitcher from "@/components/base/ThemeSwitcher";
import React from "react";

function CheckoutLayout({ children }) {
  return (
    <div className="no-scrollbar relative flex min-h-[100vh] w-screen flex-col items-center md:max-h-screen md:overflow-clip">
      <section className="no-scrollbar mx-auto flex w-full max-w-[1920px] flex-1 flex-col lg:flex-row">
        <div className="no-scrollbar flex max-h-screen flex-1 flex-col overflow-y-auto md:flex-[0.75]">
          {children}
        </div>
        <div className="no-scrollbar relative bottom-0 top-0 hidden flex-1 flex-col items-center justify-center bg-primary md:max-h-screen md:min-h-[100vh] lg:flex">
          <div className="absolute inset-0 inset-x-0 z-40 mb-12 flex gap-3 bg-gradient-to-b from-black/80 via-secondary/30 to-transparent">
            <div className="mx-auto flex flex-col pb-8 pt-16">
              <span className="sr-only">PayBoss Logo</span>
              <Logo href="/" className="" src="/images/logo/logo-light.svg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CheckoutLayout;
