import { useQuery } from "@tanstack/react-query";

import { getTransactionStatus } from "@/app/_actions/checkout-actions";

export const useCheckoutTransactionStatus = (transactionID, enable) => {
  const { data, isLoading, isPending, isError } = useQuery({
    queryKey: ["transaction-status", transactionID],
    queryFn: async () => {
      if (!enable) {
        return {
          success: false,
          message: "Transaction ID is required",
          data: {
            status: "NOT STARTED",
          },
          status: 400,
          statusText: "BAD_REQUEST",
        };
      }

      if (!transactionID) {
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

  const status = String(data?.status);

  const isSuccess = status?.toUpperCase() == "SUCCESSFUL";
  const isFailed = status?.toUpperCase() == "FAILED";
  const isProcessing = status?.toUpperCase() == "PENDING";

  // return data or any other state of the query
  return {
    isError,
    data,

    // TRANSACTION RESPONSES
    isProcessing,
    isSuccess,
    isFailed,
  };
};
