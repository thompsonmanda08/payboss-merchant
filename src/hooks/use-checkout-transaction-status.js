import { useQuery } from "@tanstack/react-query";

import { getTransactionStatus } from "@/app/_actions/checkout-actions";

export const useCheckoutTransactionStatus = (transactionID, enable) => {
  const {
    data: transactionStatusResponse,
    isLoading,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["transaction-status", transactionID],
    queryFn: async () => {
      if (!enable) {
        setIsPending(false);

        return {
          success: false,
          message: "Transaction ID is required",
          data: [],
          status: 400,
          statusText: "BAD_REQUEST",
        };
      }

      if (!transactionID) {
        setIsPending(false);

        return {
          success: false,
          message: "Transaction ID is required",
          data: [],
          status: 400,
          statusText: "BAD_REQUEST",
        };
      }

      const response = await getTransactionStatus(transactionID);

      return response.data;
    },
    // add any other options to handle query behavior
    refetchInterval: 15000, // every 15 seconds
  });

  // return data or any other state of the query
  return {
    isError,
    data: transactionStatusResponse,

    // TRANSACTION RESPONSES
    isProcessing:
      isLoading ||
      isPending ||
      transactionStatusResponse?.status?.toUpperCase() == "PENDING",
    isSuccess: transactionStatusResponse?.status?.toUpperCase() == "SUCCESSFUL",
    isFailed: transactionStatusResponse?.status?.toUpperCase() == "FAILED",
  };
};
