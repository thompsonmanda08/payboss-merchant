import React from "react";
import Logo from "@/components/base/logo";
import { Checkout } from "./checkout-cards";

async function CheckoutPage(props) {
  const searchParams = await props.searchParams;
  return (
    <>
      <div className="flex w-full container items-center justify-between px-8 mb-6 max-h-[100px]">
        <div>
          <h2
            className={
              "w-full text-[clamp(18px,18px+1vw,1.5rem)] text-foreground font-bold"
            }
          >
            Checkout
          </h2>
          <p className="text-foreground">Complete the checkout process here</p>
        </div>
        <Logo />
      </div>
      <hr className="mb-4 bg-transparent border-slate-200" />

      <Checkout />
    </>
  );
}

export default CheckoutPage;
