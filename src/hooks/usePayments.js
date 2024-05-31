import useStudyPlanStore from "../store/studyPlanStore";
import { useQuery } from "@tanstack/react-query";
import { STUDY_PLAN_KEY } from "../constants/queryKeys";

export const useStudyPlanList = () =>
  useQuery({
    queryKey: [STUDY_PLAN_KEY],
    queryFn: async () => await useStudyPlanStore.getState().getStudyPlanList(),
    refetchOnReconnect: true,
    retryOnMount: true,
    refetchOnMount: true,
    cacheTime: Infinity,
  });
