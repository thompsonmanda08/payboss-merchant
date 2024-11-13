"use client";
import React, { useEffect, useState } from "react";
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
} from "@nextui-org/react";

import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  getRefreshToken,
  lockScrenOnUserIdle,
} from "@/app/_actions/auth-actions";
import useAuthStore from "@/context/auth-store";
import { useIdleTimer } from "react-idle-timer/legacy";
import { usePathname } from "next/navigation";

function ScreenLock({ open, session }) {
  const queryClient = useQueryClient();
  const { handleUserLogOut } = useAuthStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [seconds, setSeconds] = useState(90);
  const pathname = usePathname();

  async function handleRefreshAuthToken() {
    setIsLoading(true);
    onClose();
    await lockScrenOnUserIdle(false); // User is no longer idle
    setIsLoading(false);

    // TODO: IMPLEMENT REFRESH TOKEN IN THE ACTIVE FUNCTION WITH SET INTERVAL
    // const res = await getRefreshToken();
    // queryClient.invalidateQueries();

    // if (res.success) {
    //   onClose()
    //   setIsLoading(false)
    //   queryClient.invalidateQueries()
    //   return
    // }

    // setIsLoading(false)
  }

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((x) => x - 1);
    }, 1000);

    if (seconds == 0) {
      handleUserLogOut(pathname);
    }

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <Modal
      backdrop="blur"
      isOpen={open || isOpen}
      onClose={onClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="flex flex-col gap-y-2">
              <Card className=" mt-4 border-none bg-gradient-to-br from-primary-300 to-primary-500">
                <CardBody className="items-center justify-center pb-0 ">
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
                    value={seconds}
                    strokeWidth={4}
                    showValueLabel={true}
                    formatOptions={
                      {
                        // style: 'unit',
                        // unit: 'second',
                        // unitDisplay: 'short',
                      }
                    }
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

                  <p className="text-center text-sm font-medium  leading-6 tracking-tight text-slate-200">
                    You have been idle for some time now, verify that your
                    session is still active otherwise you will be logged out.
                  </p>
                </CardFooter>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                isDisabled={isLoading}
                onPress={() => handleUserLogOut(pathname)}
              >
                Log out
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                isDisabled={isLoading}
                onPress={handleRefreshAuthToken}
              >
                Am still here
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export function IdleTimerContainer({ authSession }) {
  const [state, setState] = useState("Active");
  const [count, setCount] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const loggedIn = authSession?.accessToken;

  const onIdle = async () => {
    setState("Idle");
    await lockScrenOnUserIdle(true);
  };

  const onActive = () => {
    setState("Active");

    // REFRESH TOKEN IF THE USER IS ACTIVE WITHIN THE IDLE TIMEOUT
    // IN INTERVALS
    setInterval(async () => {
      await getRefreshToken();
    }, 1000 * 60 * 4);
  };

  const onAction = () => {
    setCount(count + 1);
  };

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

  return (
    <>
      {/* <h1>React Idle Timer</h1>
      <p>Current State: {state}</p>
      <p>{remaining} seconds remaining</p> */}
    </>
  );
}

export default ScreenLock;
