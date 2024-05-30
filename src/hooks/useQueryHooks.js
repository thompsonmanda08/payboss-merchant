import { getUserProfile } from "@/app/actions";
import { USER_DATA_KEY } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export const useProfileData = () =>
  useQuery({
    queryKey: [USER_DATA_KEY],
    queryFn: async () => await getUserProfile(),
    refetchOnMount: true,
    staleTime: Infinity,
  });
