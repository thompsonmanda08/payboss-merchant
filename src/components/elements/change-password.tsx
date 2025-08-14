"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { addToast } from "@heroui/react";
import { PASSWORD_PATTERN, slideDownInView } from "@/lib/constants";

import { Input } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/types";

type ChangePasswordProps = {
  updatePassword: boolean;
  setUpdatePassword: React.Dispatch<React.SetStateAction<boolean>>;
};

type PasswordFields = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function ChangePasswordField({
  updatePassword,
  setUpdatePassword,
}: ChangePasswordProps) {
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState>({
    status: false,
    message: "",
  });
  const [passwordFields, setPasswordField] = useState<PasswordFields>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function updatePasswordField(fields: Partial<PasswordFields>) {
    setPasswordField({ ...passwordFields, ...fields });
  }

  function resetPasswordFields() {
    setPasswordField({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  async function handleChangePassword() {
    setLoading(true);

    if (!passwordFields.currentPassword) {
      setError({
        noPassword: true,
        message: "Provide your current password!",
      });
      setLoading(false);

      return;
    }

    if (PASSWORD_PATTERN.test(passwordFields.newPassword)) {
      setError({
        status: true,
        message: "Passwords should match the policy on the left",
      });
      setLoading(false);

      return;
    }

    if (passwordFields.confirmPassword != passwordFields.newPassword) {
      setError({
        status: true,
        noMatch: true,
        message: "Passwords do not match",
      });
      setLoading(false);

      return;
    }

    setTimeout(() => {
      addToast({
        color: "success",
        title: "Success",
        description: "Password Changed Successfully!",
      });
      setLoading(false);
      setUpdatePassword(false);
      resetPasswordFields();
    }, 3000);
  }

  useEffect(() => {
    setError({});
  }, [passwordFields]);

  return (
    updatePassword && (
      <AnimatePresence mode="wait">
        <motion.div
          animate={"visible"}
          className="flex w-full gap-4 py-4"
          exit={"hidden"}
          initial={"hidden"}
          variants={slideDownInView as any}
        >
          <div className="flex w-full flex-col gap-3">
            <Input
              errorText={error.message}
              id="old_password"
              label="Current Password"
              placeholder="Enter current password"
              type="password"
              value={passwordFields.currentPassword}
              onChange={(e) =>
                updatePasswordField({ currentPassword: e.target.value })
              }
              is={error?.noPassword}
            />
            {/* ERROR MESSAGE */}
            {passwordFields.currentPassword && passwordFields.newPassword && (
              <AnimatePresence>
                <motion.div
                  animate="visible"
                  className="flex justify-start"
                  exit="exit"
                  initial="hidden"
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 100 },
                  }}
                >
                  <ul className="-mt-1 flex list-disc flex-col pl-8 text-[10px] tracking-tight text-foreground/70 sm:text-xs xl:text-sm">
                    <li>Your New Password must have at least 8 characters</li>
                    <li>Must contain at least 8 characters</li>
                    <li>Must include uppercase letters</li>
                    <li>Must include lowercase letters</li>
                    <li>Must include a number & symbols</li>
                  </ul>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          <div className="flex w-full flex-col gap-2">
            <Input
              id="new_password"
              label="New Password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              placeholder="Enter new password"
              title="Your password must include letters numbers and symbols!"
              type="password"
              value={passwordFields.newPassword}
              onChange={(e) =>
                updatePasswordField({ newPassword: e.target.value })
              }
              isInvalid={error.status}
            />
            <Input
              errorText={error.message}
              id="confirm_password"
              label="Confirm Password"
              placeholder="Confirm new password"
              type="password"
              value={passwordFields.confirmPassword}
              onChange={(e) =>
                updatePasswordField({ confirmPassword: e.target.value })
              }
              isInvalid={
                passwordFields.confirmPassword.length > 6 &&
                error.status &&
                error?.noMatch
              }
            />

            <div className="mt-2 flex justify-end gap-2">
              <Button
                className="h-10 px-6 text-sm"
                color="danger"
                disabled={loading}
                size="sm"
                onClick={async () => setUpdatePassword(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-10 px-8 text-sm"
                disabled={loading || isValidPassword}
                isLoading={loading}
                size="sm"
                onClick={async () => await handleChangePassword()}
              >
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  );
}

export default ChangePasswordField;
