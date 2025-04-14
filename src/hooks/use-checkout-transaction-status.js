import { useQuery } from "@tanstack/react-query";

import { getTransactionStatus } from "@/app/_actions/checkout-actions";

export const useCheckoutTransactionStatus = (transactionID, enable) => {
  const {
    data: transactionStatusResponse,
    isLoading,
    isPending,
    isSuccess,
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
    data: transactionStatusResponse?.data,

    // TRANSACTION RESPONSES
    isProcessing:
      isLoading ||
      isPending ||
      transactionStatusResponse?.data?.status?.toUpperCase() == "PENDING",
    isSuccess:
      isSuccess &&
      (transactionStatusResponse?.data?.status?.toUpperCase() == "COMPLETED" ||
        transactionStatusResponse?.data?.status?.toUpperCase() ==
          "SUCCESSFUL" ||
        transactionStatusResponse?.data?.status?.toUpperCase() == "SUCCESS"),
    isFailed:
      transactionStatusResponse?.data?.status?.toUpperCase() == "FAILED" ||
      transactionStatusResponse?.data?.status?.toUpperCase() == "DECLINED" ||
      transactionStatusResponse?.data?.status?.toUpperCase() == "CANCELLED",
  };
};
