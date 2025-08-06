import Logo from "@/components/base/payboss-logo";
import { Footer } from "@/components/landing-sections/footer";
import { PropsWithChildren } from "react";

async function CheckoutLayout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="flex w-full container items-center justify-between px-8 my-4 max-h-[100px]">
        <div>
          <h2
            className={
              "w-full text-[clamp(18px,18px+1vw,1.25rem)] text-foreground font-bold"
            }
          >
            Checkout
          </h2>
          <p className="text-foreground text-xs xl:text-sm text-nowrap">
            Complete the checkout process here
          </p>
        </div>
        <span className="font-medium italic text-xs sm:text-sm  text-nowrap flex gap-2 items-center scale-80 sm:scale-100">
          Powered by <Logo href={"#"} />
        </span>
      </div>
      <hr className="mb-4 bg-transparent border-slate-200" />
      <section className="flex min-h-[calc(100svh-220px)] w-full flex-1 flex-col h-full p-4">
        {children}
      </section>
      <Footer showLinks={false} showLogo={false} />
    </>
  );
}

export default CheckoutLayout;
