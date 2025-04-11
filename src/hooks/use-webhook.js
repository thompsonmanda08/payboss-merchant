import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { apiClient } from "@/lib/utils";

export const useWebhook = (transactionID, enable) => {
  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["webhook", transactionID],
    queryFn: async () => {
      if (!enable) {
        return {
          success: false,
          message: "Transaction ID is required",
          data: [],
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

      const response = await apiClient.get(
        `/transaction/collection/webhook/${transactionID}`
      );

      return response.data;
    },
    // add any other options to handle query behavior
    refetchInterval: 2000, // every 2 seconds
  });

  useEffect(() => {
    if (isSuccess) {
      // handle success events
    }
    if (isError) {
      // handle error events
    }
  }, [data, isLoading, isSuccess, isError]);

  // return data or any other state of the query
  return { data, isLoading, isSuccess, isError };
};
