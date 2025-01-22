import React from "react";
import Logo from "@/components/base/Logo";

async function CheckoutPage() {
  return (
    <>
      <div className="flex w-full flex-1 flex-col bg-red-500 p-4">
        <Logo />
        <div className="mt-2 flex w-full flex-col px-2">
          <h2
            className={
              "w-full text-[clamp(18px,18px+1vw,1.5rem)] text-white font-bold"
            }
          >
            Checkout
          </h2>
          <p className="text-foreground">Complete the checkout process here</p>
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-center bg-red-800">
          IFRAME HERE
        </div>
      </div>
    </>
  );
}

export default CheckoutPage;
