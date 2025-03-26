import React from "react";
import Logo from "@/components/base/logo";
import { Footer } from "@/components/landing-sections/footer";

async function CheckoutPage(props) {
  const searchParams = await props.searchParams;
  return (
    <>
      <Logo />
      <div className="my-2 flex w-full flex-col px-2">
        <h2
          className={
            "w-full text-[clamp(18px,18px+1vw,1.5rem)] text-foreground font-bold"
          }
        >
          Checkout
        </h2>
        <p className="text-foreground">Complete the checkout process here</p>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <iframe
          src={"https://payboss-merchants.bgsgroup.co.zm/"}
          title={"PayBoss Checkout"}
          className="flex w-full flex-1"
          style={{ border: "none" }}
        />
      </div>
    </>
  );
}

export default CheckoutPage;
