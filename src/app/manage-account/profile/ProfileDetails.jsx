"use client";

import useSettingsStore from "@/context/settingsStore";
import { useState } from "react";
import CardLoader from "@/components/base/CardLoader";
import { Input } from "@/components/ui/input-field";
import useWorkspaces from "@/hooks/useWorkspaces";
import useAccountProfile from "@/hooks/useProfileDetails";
import Card from "@/components/base/Card";

function ProfileDetails() {
  const { user } = useAccountProfile();
  const { workspaces, isFetching, isLoading } = useWorkspaces();
  const { openEditModal, setOpenEditModal } = useSettingsStore();
  const [newUserDetails, setNewUserDetails] = useState({});

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
    <CardLoader />
  ) : (
    <Card className={"rounded-2xl bg-background/70 backdrop-blur-md"}>
      <div className="flex w-full flex-col rounded-md p-5">
        <div>
          <div className="flex w-full items-end justify-between">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Profile
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
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

          <div className="mt-4 space-y-4 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <div className="items-center pt-6 sm:flex">
              <span className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                First Name
              </span>
              <span className="mt-1 flex justify-between gap-x-4 sm:mt-0 sm:flex-auto">
                {openEditModal ? (
                  <Input
                    autoFocus
                    defaultValue={user?.first_name}
                    value={newUserDetails.first_name}
                    className="mt-px"
                    onChange={(e) => {
                      editUserField({ first_name: e.target.value });
                    }}
                  />
                ) : (
                  <p className="text-gray-900">{`${user?.first_name} `}</p>
                )}
              </span>
            </div>
            <div className="items-center pt-6 sm:flex">
              <span className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Last Name
              </span>
              <span className="mt-1 flex justify-between gap-x-4 sm:mt-0 sm:flex-auto">
                {openEditModal ? (
                  <Input
                    defaultValue={user?.last_name}
                    value={newUserDetails.last_name}
                    className="mt-px"
                    onChange={(e) => {
                      editUserField({ last_name: e.target.value });
                    }}
                  />
                ) : (
                  <p className="text-gray-900">{`${user?.last_name}`}</p>
                )}
              </span>
            </div>
            {/* ************************************************* */}
            <div className="items-center pt-4 sm:flex">
              <span className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Username
              </span>
              <span className="mt-1 flex justify-between gap-x-4 sm:mt-0 sm:flex-auto">
                {user?.username}
              </span>
            </div>
            {/* ************************************************* */}
            <div className="items-center pt-4 sm:flex">
              <span className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
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
