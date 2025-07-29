"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input-field";
import useAccountProfile from "@/hooks/use-profile-info";
import Card from "@/components/base/custom-card";

function ProfileDetails() {
  const { user, isLoading, isFetching } = useAccountProfile();

  const [newUserDetails, setNewUserDetails] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);

  function handleToggleModal() {
    setOpenEditModal(!openEditModal);
  }

  function editUserField(fields) {
    setNewUserDetails((prev) => {
      return { ...prev, ...fields };
    });
  }

  function handleConfirm() {
    handleToggleModal();
  }

  function handleProfileUpdate() {
    handleToggleModal();
  }

  return isFetching || isLoading ? (
    <Card className={"rounded-2xl backdrop-blur-md"}>
      <div className="flex w-full animate-pulse flex-col rounded-md p-5">
        <div>
          <div className="flex w-full items-end justify-between gap-2">
            <div className="flex flex-col gap-2">
              <div className="h-6 w-[150px] rounded-lg bg-foreground-200" />
              <div className="h-6 min-w-[300px] rounded-lg bg-foreground-200" />
            </div>
            <div className="h-6 min-w-[100px] rounded-lg bg-foreground-200" />
          </div>

          <div className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            {/*  */}
            <div className="items-center gap-4 pt-6 sm:flex">
              <div className="h-6 min-w-[100px] flex-[0.5] rounded-lg bg-foreground-200" />
              <div className="mt-1 flex h-6 min-w-[100px] flex-auto justify-between gap-x-6 rounded-lg bg-foreground-200 sm:mt-0" />
            </div>
            {/*  */}
            <div className="items-center gap-4 pt-6 sm:flex">
              <div className="h-6 min-w-[100px] flex-[0.5] rounded-lg bg-foreground-200" />
              <div className=" mt-1 flex h-6 min-w-[100px] flex-1 justify-between gap-x-6 rounded-lg bg-foreground-200 sm:mt-0" />
            </div>
            {/*  */}
            <div className="items-center gap-4 pt-6 sm:flex">
              <div className="h-6 flex-[0.5] rounded-lg bg-foreground-200" />
              <div className="mt-1 flex h-6 min-w-[100px] flex-1 justify-between gap-x-6 rounded-lg bg-foreground-200 sm:mt-0" />
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </Card>
  ) : (
    <Card className={"rounded-2xl bg-background/70 backdrop-blur-md"}>
      <div className="flex w-full flex-col rounded-md p-5">
        <div>
          <div className="flex w-full items-end justify-between">
            <div>
              <h2 className="text-base font-semibold leading-7 text-foreground-900">
                Profile
              </h2>
              <p className="mt-1 text-sm leading-6 text-foreground-500">
                Personal information and account details
              </p>
            </div>
            {/* <Button
              type="button"
              variant="light"
              onClick={handleToggleModal}
              className="font-semibold text-primary hover:text-primary/85"
            >
              {openEditModal ? 'Save Changes' : 'Update'}
            </Button> */}
          </div>

          <div className="mt-4 space-y-4 divide-y divide-foreground-100 border-t border-foreground-200 text-sm leading-6">
            <div className="items-center pt-6 sm:flex">
              <span className="font-medium text-foreground-900 sm:w-64 sm:flex-none sm:pr-6">
                First Name
              </span>
              <span className="mt-1 flex justify-between gap-x-4 sm:mt-0 sm:flex-auto">
                {openEditModal ? (
                  <Input
                    autoFocus
                    className="mt-px"
                    defaultValue={user?.first_name}
                    value={newUserDetails.first_name}
                    onChange={(e) => {
                      editUserField({ first_name: e.target.value });
                    }}
                  />
                ) : (
                  <p className="text-foreground-900">{`${user?.first_name} `}</p>
                )}
              </span>
            </div>
            <div className="items-center pt-6 sm:flex">
              <span className="font-medium text-foreground-900 sm:w-64 sm:flex-none sm:pr-6">
                Last Name
              </span>
              <span className="mt-1 flex justify-between gap-x-4 sm:mt-0 sm:flex-auto">
                {openEditModal ? (
                  <Input
                    className="mt-px"
                    defaultValue={user?.last_name}
                    value={newUserDetails.last_name}
                    onChange={(e) => {
                      editUserField({ last_name: e.target.value });
                    }}
                  />
                ) : (
                  <p className="text-foreground-900">{`${user?.last_name}`}</p>
                )}
              </span>
            </div>
            {/* ************************************************* */}
            <div className="items-center pt-4 sm:flex">
              <span className="font-medium text-foreground-900 sm:w-64 sm:flex-none sm:pr-6">
                Username
              </span>
              <span className="mt-1 flex justify-between gap-x-4 sm:mt-0 sm:flex-auto">
                {user?.username}
              </span>
            </div>
            {/* ************************************************* */}
            <div className="items-center pt-4 sm:flex">
              <span className="font-medium text-foreground-900 sm:w-64 sm:flex-none sm:pr-6">
                Email address
              </span>
              <span className="mt-1 flex justify-between gap-x-4 sm:mt-0 sm:flex-auto">
                {user?.email}
              </span>
            </div>
            {/* ************************************************* */}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProfileDetails;
