import Logo from "@/components/base/payboss-logo";
import {
  getCheckoutInfo,
  validateCheckoutData,
} from "@/app/_actions/checkout-actions";

import Checkout from "../components/checkout";

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

  // FIRST POST CHECKOUT DATA TO LOG CHECKOUT INFO FOR VALIDATION
  const validation = validateCheckoutData(checkoutData);

  // if (!validation?.success) {
  //   return (
  //     <>
  //       <ErrorCard
  //         className={"max-h-fit m-auto"}
  //         goBack={true}
  //         message={validation?.message}
  //         title={"Checkout Error"}
  //       />
  //     </>
  //   );
  // }

  const [response] = await Promise.all([
    getCheckoutInfo(checkoutData?.checkoutID),
  ]);

  checkoutData = {
    ...checkoutData,
    ...(response?.data || {}),
  };

  console.log("LOG: [ CHECKOUT-DATA ]: ", checkoutData);
  console.log("LOG: [ VALIDATION ]: ", validation);
  console.log("LOG: [CHECKOUT-INFO]", response);

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
          Powered by <Logo href={"#"} />
        </span>
      </div>
      <hr className="mb-4 bg-transparent border-slate-200" />

      <Checkout checkoutData={checkoutData} />
    </>
  );
}

export default CheckoutPage;
