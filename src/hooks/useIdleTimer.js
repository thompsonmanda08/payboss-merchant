"use client";
import { usePathname } from "next/navigation";
import useRefreshToken from "./useRefreshToken";
import { useIdleTimer } from "react-idle-timer";
import useAuthStore from "@/context/auth-store";

const useIdleTimerModal = (session) => {
  // const { data: session, status, update } = useSession(); // TODO: REMOVE

  const refresh = useRefreshToken();
  const pathname = usePathname();

  const { handleUserLogOut } = useAuthStore();
  const CHECK_SESSION_EXP_TIME = 180000; // 3 mins
  const SESSION_IDLE_TIME = 180000; // 3 mins
  // const origin = useOrigin() // TODO: REMOVE
  const screenlock = localStorage.getItem("screenlock"); // boolean;
  const [isIdleModalOpen, setIsIdleModalOpen] =
    useState < boolean > (screenlock === null ? true : screenlock);

  const onUserIdle = () => {
    localStorage.setItem("screenlock", true);
    setIsIdleModalOpen(true);
  };

  const onUserActive = () => {
    //setIsIdleModalOpen(false)
  };

  const { isIdle } = useIdleTimer({
    onIdle: onUserIdle,
    onActive: onUserActive,
    timeout: SESSION_IDLE_TIME, //milliseconds
    throttle: 500,
  });

  useEffect(() => {
    const checkUserSession = setInterval(async () => {
      const expiresTimeTimestamp = Math.floor(
        new Date(session?.expires || "").getTime()
      );
      const currentTimestamp = Date.now();
      const timeRemaining = expiresTimeTimestamp - currentTimestamp;
      // If the user session will expire before the next session check
      // and the user is not idle, then we want to refresh the session
      // on the client and request a token refresh on the backend
      if (!isIdle() && timeRemaining < CHECK_SESSION_EXP_TIME) {
        // update(); // extend the client session  // TODO: REMOVE
        refresh(); // RefreshToken - extend the client session

        // request refresh of backend token here
      } else if (timeRemaining < 0) {
        // session has expired, logout the user and display session expiration message
        // signOut({ callbackUrl: origin }); // TODO: REMOVE
        await handleUserLogOut(pathname);
      }
    }, CHECK_SESSION_EXP_TIME);

    return () => {
      clearInterval(checkUserSession);
    };
  }, [refresh]);

  return {
    pathname,
  };
};

export default useIdleTimerModal;
