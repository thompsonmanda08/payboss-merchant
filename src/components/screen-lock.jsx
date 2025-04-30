"use client";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  CircularProgress,
  Card,
  CardBody,
  CardFooter,
  Chip,
} from "@heroui/react";
import { useIdleTimer } from "react-idle-timer/legacy";
import { usePathname } from "next/navigation";

import { lockScreenOnUserIdle } from "@/app/_actions/auth-actions";

import { Button } from "./ui/button";
import { useRefreshToken } from "@/hooks/useQueryHooks";

function ScreenLock({ open }) {
  const { isOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [seconds, setSeconds] = useState(90);

  async function handleRefreshAuthToken() {
    setIsLoading(true);
    await lockScreenOnUserIdle(false);
    onClose();
    setIsLoading(false);
  }

  async function handleUserLogOut() {
    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
      const res = await fetch("/api/logout", {
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const response = await res.json();

      if (response?.redirect) {
        window.location.href = response.redirect;
        onClose();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((x) => x - 1);
    }, 1000);

    if (seconds == 0) {
      handleUserLogOut();
    }

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  return (
    <Modal
      backdrop="blur"
      hideCloseButton={true}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={open || isOpen}
      onClose={onClose}
    >
      <ModalContent>
        <ModalBody className="flex flex-col gap-y-2">
          <Card className="mt-4 border-none bg-gradient-to-br from-primary-300 to-primary-500">
            <CardBody className="items-center justify-center pb-0">
              <p className="mb-4 text-center text-xl font-bold text-white">
                Are you still there?
              </p>
              <CircularProgress
                classNames={{
                  svg: "w-36 h-36 drop-shadow-md",
                  indicator: "stroke-white",
                  track: "stroke-white/10",
                  value: "text-3xl font-semibold text-white",
                }}
                formatOptions={
                  {
                    // style: 'unit',
                    // unit: 'second',
                    // unitDisplay: 'short',
                  }
                }
                showValueLabel={true}
                strokeWidth={4}
                value={seconds}
              />
            </CardBody>
            <CardFooter className="flex-col items-center justify-center gap-4 pt-0">
              <Chip
                classNames={{
                  base: "border-1 border-white/30",
                  content: "text-white/90 text-small font-semibold",
                }}
                variant="bordered"
              >
                Seconds
              </Chip>

              <p className="text-center text-sm font-medium leading-6 tracking-tight text-slate-200">
                You have been idle for some time now, verify that your session
                is still active otherwise you will be logged out.
              </p>
            </CardFooter>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            isDisabled={isLoading}
            variant="light"
            onPress={handleUserLogOut}
          >
            Log me out
          </Button>
          <Button
            color="primary"
            isDisabled={isLoading}
            isLoading={isLoading}
            onPress={handleRefreshAuthToken}
          >
            Stay Logged In
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function IdleTimerContainer({ authSession }) {
  const pathname = usePathname();

  const [state, setState] = useState("Active");
  const [count, setCount] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const loggedIn = authSession?.accessToken;

  const {} = useRefreshToken(loggedIn);

  const onIdle = async () => {
    setState("Idle");
    await lockScreenOnUserIdle(true);
  };

  const onActive = () => {
    setState("Active");
  };

  const onAction = async () => setCount(count + 1);

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    onActive,
    onAction,
    timeout: 60 * 1000 * 5, // 5MINS
    throttle: 500,
    disabled: !loggedIn,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  /* NO TIMER ON EXTERNAL ROUTES */
  if (pathname.startsWith("/checkout")) return null;
  if (pathname.startsWith("/invoice")) return null;

  return <></>;
}

export default ScreenLock;
