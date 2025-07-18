import {
  getCheckoutInfo,
  validateCheckoutData,
} from "@/app/_actions/checkout-actions";
import { ErrorCard } from "@/components/base/error-card";
import { capitalize } from "@/lib/utils";

import Checkout from "../_components/checkout";

async function CheckoutPage(props) {
  const queryParams = await props.searchParams;

  let checkoutData = {
    workspaceID: queryParams?.workspace_id || "",
    checkoutID: queryParams?.checkout_id || "",
    amount: queryParams?.amount || "",
    transactionID: queryParams?.transaction_id || "",
    serviceID: queryParams?.service_id || "",
  };

  // FIRST POST CHECKOUT DATA TO LOG CHECKOUT INFO FOR VALIDATION
  const validation = await validateCheckoutData({
    workspaceID: queryParams?.workspace_id || "",
    checkoutID: queryParams?.checkout_id || "",
    amount: queryParams?.amount || "",
    transactionID: queryParams?.transaction_id || "",
    serviceID: queryParams?.service_id || "",
  });

  if (!validation?.success) {
    return (
      <>
        <ErrorCard
          className={"max-h-fit m-auto"}
          goBack={true}
          message={capitalize(validation?.message)}
          status={validation?.status}
          title={"Checkout"}
        />
      </>
    );
  }

  const [checkout] = await Promise.all([
    getCheckoutInfo(checkoutData?.checkoutID, checkoutData?.serviceID),
  ]);

  checkoutData = {
    ...checkoutData,
    ...(checkout?.data || {}),
  };

  return (
    <>
      <Checkout checkoutData={checkoutData} />
    </>
  );
}

export default CheckoutPage;
