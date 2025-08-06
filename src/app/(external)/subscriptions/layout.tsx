import { CreditCard } from "lucide-react";

import Logo from "@/components/base/payboss-logo";
import { Footer } from "@/components/landing-sections/footer";
import { Props } from "next/script";
import { PropsWithChildren } from "react";

async function SubscriptionsAppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <nav className="bg-red-500 mb-4 fixed inset-x-0 bg-white/40 backdrop-blur-md z-50">
        <div className="flex w-full py-2 pt-3 container items-center justify-between">
          <div className="flex items-center justify-center w-max space-x-2">
            <Logo href={"/"} />
            <span className="text-xl mb-1 font-bold text-gray-900">
              Subscriptions
            </span>
          </div>
          {/* <span className="font-medium italic text-xs sm:text-sm  text-nowrap flex gap-2 items-center scale-80 sm:scale-100">
            Powered by <Logo href={"/"} />
          </span> */}
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

export default SubscriptionsAppLayout;
