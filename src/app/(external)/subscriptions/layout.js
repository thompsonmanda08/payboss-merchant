import { CreditCard } from "lucide-react";

import Logo from "@/components/base/payboss-logo";
import { Footer } from "@/components/landing-sections/footer";

async function EduAppLayout({ children }) {
  return (
    <>
      <nav className="bg-red-500 mb-4 fixed inset-x-0 bg-white/40 backdrop-blur-md z-50">
        <div className="flex w-full py-2 pt-3 container items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Subscriptions
            </span>
          </div>
          <span className="font-medium italic text-xs sm:text-sm  text-nowrap flex gap-2 items-center scale-80 sm:scale-100">
            Powered by <Logo href={"/"} />
          </span>
        </div>
      </nav>

      <section className="flex min-h-[calc(100svh-120px)] w-full flex-1 pt-20 bg-white  dark:bg-background flex-col h-full p-4">
        {children}
      </section>
      <Footer
        classNames={{ wrapper: "bg-white  dark:bg-background" }}
        showLinks={false}
        showLogo={false}
      />
    </>
  );
}

export default EduAppLayout;
