"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-field";
import Spinner from "@/components/ui/custom-spinner";
import useCustomTabsHook from "@/hooks/use-custom-tabs";

export default function PasswordReset() {
  0;
  const [passwordReset, setPasswordReset] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  function updatePasswordResetFields(fields) {
    setPasswordReset({ ...passwordReset, ...fields });
  }

  const {
    currentTabIndex,
    activeTab,
    navigateForward,
    navigateBackwards,
    isLoading,
    setIsLoading,
  } = useCustomTabsHook([
    <ResetMyPassword
      key={"reset-password"}
      handleRequest6DigitCode={handleRequest6DigitCode}
      passwordReset={passwordReset}
      updatePasswordResetFields={updatePasswordResetFields}
    />,
    <ValidatePassCode
      key={"validate-code"}
      handleValidatePassCode={handleValidatePassCode}
      passwordReset={passwordReset}
      updatePasswordResetFields={updatePasswordResetFields}
    />,
    <CreateNewPassword
      key={"new-password"}
      handleCreateNewPassword={handleCreateNewPassword}
      passwordReset={passwordReset}
      updatePasswordResetFields={updatePasswordResetFields}
    />,
    <Success key={"success"} />,
  ]);

  async function handleRequest6DigitCode() {
    setIsLoading(true);
    navigateForward();
    setIsLoading(false);
  }

  async function handleValidatePassCode() {
    setIsLoading(true);
    navigateForward();
    setIsLoading(false);
  }

  async function handleCreateNewPassword() {
    setIsLoading(true);
    navigateBackwards();
    setIsLoading(false);
  }

  return (
    <div className="my-12 flex h-full flex-col items-center gap-4 p-12 lg:justify-center">
      <div className="md:w-3/4 lg:w-4/5">
        <div className="">
          <span
            className={
              "flex font-inter text-[15px] font-medium leading-6 text-primary"
            }
          >
            LOST ACCESS TO YOUR ACCOUNT?
          </span>
          <h2
            className={`my-1 font-inter text-2xl font-bold leading-8 text-foreground/80 md:text-3xl`}
          >
            Account Password Reset
          </h2>
        </div>
        <AnimatePresence mode="sync">
          <motion.div
            key={currentTabIndex}
            animate={{ opacity: 1, x: 0 }}
            className="mt-8 flex max-w-sm flex-col gap-4"
            exit={{ opacity: 0, x: -200 }}
            initial={{ opacity: 0, x: 200 }}
            transition={{ duration: 0.5 }}
          >
            {isLoading ? (
              <div className="my-10 flex items-center justify-center">
                <Spinner size={48} />
              </div>
            ) : (
              activeTab
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResetMyPassword({
  handleRequest6DigitCode,
  updatePasswordResetFields,
  passwordReset,
}) {
  return (
    <>
      <p className="-mt-5 text-sm leading-6 tracking-tight text-foreground/50 xl:text-base">
        An email with a 6-Digit pass code will sent to the email address.
        Provide the code in the next step for verification.
      </p>

      <Input
        required
        label={"Email Address"}
        name={"email"}
        type={"email"}
        onChange={(e) =>
          updatePasswordResetFields({
            email: e.target.value,
          })
        }
      />
      <Button
        className={"w-full"}
        color="primary"
        disabled={!passwordReset?.email.includes("@")}
        size="lg"
        onClick={handleRequest6DigitCode}
      >
        Request Code
      </Button>
    </>
  );
}

function ValidatePassCode({
  handleValidatePassCode,
  updatePasswordResetFields,
  passwordReset,
}) {
  return (
    <>
      <p className="-mt-5 text-sm leading-5 tracking-tight text-foreground/50 xl:text-base">
        An email with a 6-Digit pass code was sent to the email address you
        provided to verify that the account belongs to you.
      </p>
      {/* OTP FIELD */}
      <Input
        label={"OTP"}
        name={"Pass-code"}
        type="text"
        value={passwordReset?.otp}
        onChange={(e) =>
          updatePasswordResetFields({
            otp: e.target.value,
          })
        }
      />
      <Button
        className={"w-full"}
        color="primary"
        disabled={passwordReset?.otp.length < 6}
        size="lg"
        onClick={() => {
          if (passwordReset?.otp.length < 6) {
            return;
          } else {
            handleValidatePassCode();
          }
        }}
      >
        Verify Code
      </Button>
    </>
  );
}

function CreateNewPassword({
  handleCreateNewPassword,
  updatePasswordResetFields,
  passwordReset,
}) {
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <>
      <p className="-mt-5 text-sm leading-5 tracking-tight text-foreground/50 xl:text-base">
        Create a new password that you don&apos;t use on any other accounts.
        Make sure its secure and safe.
      </p>
      {/* Create Password */}
      <Input
        label={"New Password"}
        name={"password"}
        type={"password"}
        value={passwordReset.password}
        onChange={(e) =>
          updatePasswordResetFields({
            password: e.target.value,
            otp: "",
          })
        }
      />
      {/* Confirm Password */}

      <Input
        label={"Confirm Password"}
        name={"confirmPassword"}
        type={"password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {/* ERROR MESSAGE */}
      {passwordReset.password !== confirmPassword &&
        passwordReset?.password &&
        passwordReset?.password.length > 4 && (
          <span className="text-xs text-red-600">Passwords do not match</span>
        )}
      {/* Previous and Next Page Buttons */}
      <Button
        className={"w-full"}
        color="primary"
        disabled={
          passwordReset.password !== confirmPassword ||
          passwordReset.password.length <= 4
        }
        size="lg"
        onClick={() => {
          if (passwordReset.password !== confirmPassword) {
            return;
          } else {
            handleCreateNewPassword();
          }
        }}
      >
        Reset Password
      </Button>
    </>
  );
}

function Success({}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center ">
        <p className="-mt-5 mb-5 text-sm leading-5 tracking-tight text-foreground/50 xl:text-base">
          Your password has been successfully reset. You can now login with the
          new password you just created!
        </p>

        <div className="grid w-full gap-4">
          <Button as={Link} className={"w-full flex-1"} href={"/login"}>
            Login
          </Button>
        </div>
      </div>
    </>
  );
}
