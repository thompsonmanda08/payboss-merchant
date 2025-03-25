"use client";
import Card from "@/components/base/Card";
import ChangePasswordField from "@/components/change-password";
import { Switch } from "@heroui/switch";
import { useState } from "react";

function ProfileSecuritySettings() {
  const [changePassword, setChangePassword] = useState(false);

  return (
    <Card className={"rounded-2xl bg-background/65 backdrop-blur-md"}>
      <div className="flex w-full flex-col rounded-md p-5">
        <div>
          <div className="flex w-full items-end justify-between">
            <div>
              <h2 className="text-base font-semibold leading-7 text-foreground-900">
                Security
              </h2>
              <p className="mt-1 text-sm leading-6 text-foreground-500">
                Update your security settings to protect your account and data.
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-6 divide-y divide-foreground-100 border-t border-foreground-200 text-sm leading-6">
            <div>
              <div className="items-center pt-6 sm:flex">
                <div className="flex flex-col font-medium text-foreground-900 sm:w-64 sm:flex-none sm:pr-6">
                  Password
                  <span className="text-xs font-normal text-slate-600">
                    Change your password
                  </span>
                </div>
                {!changePassword && (
                  <>
                    <span className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <p className="text-foreground-900">************</p>
                    </span>
                    <button
                      type="button"
                      onClick={() => setChangePassword(true)}
                      className="font-semibold text-primary hover:text-primary/80"
                    >
                      Change
                    </button>
                  </>
                )}
              </div>
              <ChangePasswordField
                updatePassword={changePassword}
                setUpdatePassword={setChangePassword}
              />
            </div>
            {/* *************************************** */}
            <div className="items-center pt-6 opacity-50 grayscale sm:flex">
              <p className="font-medium text-foreground-900 sm:w-64 sm:flex-none sm:pr-6">
                2F Authentication
              </p>
              <div className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="font-medium text-foreground-900">
                  [disabled] Coming Soon!
                </div>
                <Switch isDisabled />
              </div>
            </div>
            {/* *************************************** */}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProfileSecuritySettings;
