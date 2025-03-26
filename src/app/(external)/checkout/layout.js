import Logo from "@/components/base/logo";
import ThemeSwitcher from "@/components/base/theme-switcher";
import { Footer } from "@/components/landing-sections/footer";
import React from "react";

function CheckoutLayout({ children }) {
  return (
    <>
      <div className="no-scrollbar relative flex min-h-[100vh] w-screen flex-col items-center md:max-h-screen md:overflow-clip">
        <section className="container mx-auto flex max-h-screen w-full flex-1 flex-col overflow-y-auto p-4">
          {children}
        </section>
      </div>
      <Footer showLinks={false} showLogo={false} />
    </>
  );
}

export default CheckoutLayout;
