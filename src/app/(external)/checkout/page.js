import Logo from "@/components/base/logo";
import { getCheckoutInfo } from "@/app/_actions/vas-actions";

import { Checkout } from "./checkout-cards";

async function CheckoutPage(props) {
  const searchParams = await props.searchParams;

  let checkoutData = {
    workspaceID: searchParams?.workspace_id || "",
    checkoutID: searchParams?.checkout_id || "",
    checkoutSecret: searchParams?.checkout_secret || "",
    amount: searchParams?.amount || "",
    transactionID: searchParams?.transaction_id || "",
    serviceID: searchParams?.service_id || "",
  };

  const response = await getCheckoutInfo(checkoutData?.checkoutID);

  // if (!response?.success) {
  //   return (
  //     <>
  //       <ErrorCard
  //         className={"max-h-fit m-auto"}
  //         title={"Checkout not found"}
  //         message={"The checkout you are looking for does not exist"}
  //         goBack={true}
  //       ></ErrorCard>
  //     </>
  //   );
  // }

  checkoutData = {
    ...checkoutData,
    ...response.data,
  };

  return (
    <>
      <div className="flex w-full container items-center justify-between px-8 mb-4 max-h-[100px]">
        <div>
          <h2
            className={
              "w-full text-[clamp(18px,18px+1vw,1.25rem)] text-foreground font-bold"
            }
          >
            Checkout
          </h2>
          <p className="text-foreground text-xs xl:text-sm">
            Complete the checkout process here
          </p>
        </div>
        <span className="font-medium italic flex gap-2 items-center">
          Powered by <Logo />
        </span>
      </div>
      <hr className="mb-4 bg-transparent border-slate-200" />

      <Checkout checkoutData={checkoutData} />
    </>
  );
}

export default CheckoutPage;
