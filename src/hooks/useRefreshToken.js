"use client";
import useAuthStore from "@/context/auth-store";
import { getRefreshToken } from "@/app/_actions/auth-actions";

const useRefreshToken = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const refresh = async () => {
    const response = await getRefreshToken();

    if (response.success) {
      let accessToken = response?.data?.accessToken;

      setAuth((prev) => {
        return { ...prev, accessToken };
      });

      return accessToken;
    }

    return null;
  };

  return refresh;
};

export default useRefreshToken;
