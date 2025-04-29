import { useQuery } from "@tanstack/react-query";

import { getTransactionStatus } from "@/app/_actions/checkout-actions";

export const useCheckoutTransactionStatus = (transactionID, enable) => {
  const { data, isError } = useQuery({
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
    refetchInterval: 15 * 1000, // every 15 seconds
  });

  const status = String(data?.status)?.toUpperCase();

  const isSuccess = status == "SUCCESSFUL";
  const isFailed = status == "FAILED";
  const isProcessing = status == "PENDING";

  const transactionResponse = {
    ...data,
    status: status,
  };

  // return data or any other state of the query
  return {
    isError,
    data,
    transactionResponse,

    // TRANSACTION RESPONSES
    isProcessing,
    isSuccess,
    isFailed,
  };
};
