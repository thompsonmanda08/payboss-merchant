import {
  getCheckoutInfo,
  validateCheckoutData,
} from "@/app/_actions/checkout-actions";
import { ErrorCard } from "@/components/base/error-card";
import { capitalize } from "@/lib/utils";

import Checkout from "../components/checkout";

async function CheckoutPage(props) {
  const searchParams = await props.searchParams;

  let checkoutData = {
    workspaceID: searchParams?.workspace_id || "",
    checkoutID: searchParams?.checkout_id || "",
    amount: searchParams?.amount || "",
    transactionID: searchParams?.transaction_id || "",
    serviceID: searchParams?.service_id || "",
  };

  // FIRST POST CHECKOUT DATA TO LOG CHECKOUT INFO FOR VALIDATION
  const validation = await validateCheckoutData({
    workspaceID: searchParams?.workspace_id || "",
    checkout_id: searchParams?.checkout_id || "",
    amount: searchParams?.amount || "",
    transactionID: searchParams?.transaction_id || "",
    serviceID: searchParams?.service_id || "",
  });

  if (!validation?.success) {
    return (
      <>
        <ErrorCard
          className={"max-h-fit m-auto"}
          goBack={true}
          message={capitalize(validation?.message)}
          status={validation?.status}
          title={"Checkout Error"}
        />
      </>
    );
  }

  const [response] = await Promise.all([
    getCheckoutInfo(checkoutData?.checkoutID),
  ]);

  checkoutData = {
    ...checkoutData,
    ...(response?.data || {}),
  };

  console.log("LOG: [ CHECKOUT-DATA ]: ", checkoutData);
  // console.log("LOG: [ VALIDATION ]: ", validation);
  console.log("LOG: [CHECKOUT-INFO]", response);

  return (
    <>
      <Checkout checkoutData={checkoutData} />
    </>
  );
}

export default CheckoutPage;
