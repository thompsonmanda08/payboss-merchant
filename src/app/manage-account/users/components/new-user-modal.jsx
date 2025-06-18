"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  addToast,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

import { Input } from "@/components/ui/input-field";
import SelectField from "@/components/ui/select-field";
import { generateRandomString, isValidZambianMobileNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import StatusMessage from "@/components/base/status-message";
import {
  createNewUser,
  updateSystemUserData,
} from "@/app/_actions/user-actions";
import useWorkspaceStore from "@/context/workspaces-store";
import { changeUserRoleInWorkspace } from "@/app/_actions/workspace-actions";

const USER_INIT = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  phone_number: "",
  roleID: "",
  role: "",
  changePassword: true,
  password: "P4y-B055_*848#=@B/G/S&zm",
};

function CreateNewUserModal({ isOpen, onClose, workspaceID, roles }) {
  const { isEditingUser, selectedUser, setSelectedUser, setIsEditingUser } =
    useWorkspaceStore();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const isUsersRoute = pathname.split("/manage-account/users");

  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState(USER_INIT);
  const [error, setError] = useState({ status: false, message: "" });

  const phoneNoError =
    !isValidZambianMobileNumber(newUser?.phone_number) &&
    newUser?.phone_number?.length > 3;

  function updateDetails(fields) {
    setNewUser((prev) => ({ ...prev, ...fields }));
  }

  function handleClose() {
    setError({});
    setSelectedUser(null);
    setIsEditingUser(false);
    setNewUser(USER_INIT);
    onClose();
  }

  async function handleCreateUser() {
    setLoading(true);
    if (!isValidData()) {
      addToast({
        title: "Error",
        color: "danger",
        description: "Invalid user details.",
      });
      setLoading(false);

      return;
    }

    const userData = {
      ...newUser,
      changePassword: true,
      password: generateRandomString(16), // Generates unique user password
    };

    let response = await createNewUser(userData);

    if (response?.success) {
      addToast({
        title: "Success",
        color: "success",
        description: "User created successfully!",
      });
      setError({ status: false, message: "" });
      onClose();
      queryClient.invalidateQueries();
      setNewUser(USER_INIT);
      setLoading(false);

      return;
    }

    addToast({
      title: "Error",
      color: "danger",
      description: "Problem occurred while creating user.",
    });
    setError({ status: true, message: response?.message });
    setLoading(false);
  }

  async function handleUpdateSystemUser() {
    setLoading(true);

    const recordID = selectedUser?.ID;

    const userMapping = {
      ...newUser,
      userID: newUser?.userID,
      roleID: newUser?.role,
      recordID,
    };

    let response = await updateSystemUserData(recordID, userMapping);

    if (response?.success) {
      queryClient.invalidateQueries();
      addToast({
        title: "Success",
        color: "success",
        description: "User updated successfully!",
      });
      setError({ status: false, message: "" });
      setLoading(false);
      handleClose();

      return;
    }

    addToast({
      title: "Error updating user",
      color: "danger",
      description: response?.message || "Invalid user details.",
    });
    setError({ status: true, message: response?.message });
    setLoading(false);
  }

  async function handleUpdateWorkspaceUserRole() {
    setLoading(true);

    const recordID = selectedUser?.ID;

    const userMapping = {
      userID: newUser?.userID,
      roleID: newUser?.role,
      recordID,
    };

    let response = await changeUserRoleInWorkspace(
      userMapping,
      recordID,
      workspaceID
    );

    if (response?.success) {
      queryClient.invalidateQueries();
      addToast({
        title: "Success",
        color: "success",
        description: "User updated successfully!",
      });
      setError({ status: false, message: "" });
      setLoading(false);
      handleClose();

      return;
    }

    addToast({
      title: "Error updating user",
      color: "danger",
      description: response?.message || "Failed to update user details.",
    });
    setError({ status: true, message: response?.message });
    setLoading(false);
  }

  function isValidData() {
    let valid = true;

    if (!isValidZambianMobileNumber(newUser?.phone_number)) {
      valid = false;
      setError((prev) => ({
        ...prev,
        onMobileNo: true,
        message: "Invalid Mobile Number",
      }));
    }

    if (!newUser?.first_name || newUser?.first_name?.length < 3) {
      valid = false;
      setError((prev) => ({
        ...prev,
        onFName: true,
        message: "Invalid First Name",
      }));
    }

    if (!newUser?.last_name || newUser?.last_name?.length < 3) {
      valid = false;
      setError((prev) => ({
        ...prev,
        onLName: true,
        message: "Invalid Last Name",
      }));
    }

    if (!newUser?.role) {
      valid = false;
      setError((prev) => ({
        ...prev,
        onRole: true,
        message: "User must have a system a role",
      }));
    }

    if (!newUser?.username) {
      valid = false;
      setError((prev) => ({
        ...prev,
        onUsername: true,
        message: "User must have a username",
      }));
    }

    if (
      !newUser?.email ||
      !newUser?.email?.includes("@") ||
      !newUser?.email?.includes(".")
    ) {
      valid = false;
      setError((prev) => ({
        ...prev,
        onEmail: true,
        message: "Invalid Email",
      }));
    }

    return valid;
  }

  function onConfirmAction() {
    if (isEditingUser && isUsersRoute) {
      handleUpdateSystemUser();

      return;
    }

    if (isEditingUser && !isUsersRoute) {
      handleUpdateWorkspaceUserRole();

      return;
    }

    handleCreateUser();
  }

  // CLEAR OUT ALL ERRORS WHEN THE INPUT FIELDS CHANGE
  useEffect(() => {
    setError({});
    setLoading(false);
  }, [newUser]);

  useEffect(() => {
    // If a user has already provided, prefill the fields
    if (isEditingUser && Object.keys(selectedUser)?.length > 0) {
      setNewUser(selectedUser);
    }
  }, [selectedUser]);

  return (
    <Modal
      isOpen={isOpen || isEditingUser}
      placement="center"
      onClose={handleClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isEditingUser && !isUsersRoute
                ? "Update Workspace User"
                : isEditingUser && isUsersRoute
                  ? "Update System User"
                  : "Create New User"}
            </ModalHeader>
            <ModalBody>
              <SelectField
                required
                className="mt-px"
                label={
                  isEditingUser && !isUsersRoute
                    ? "Workspace Role"
                    : "System Role"
                }
                listItemName={"role"}
                options={roles?.filter((role) => role?.role !== "owner")}
                placeholder={isEditingUser ? newUser?.role : "Choose a role"}
                value={newUser?.role || "Choose a role"}
                onChange={(e) => {
                  updateDetails({
                    role: e.target.value,
                    roleID: e.target.value,
                  });
                }}
                onError={error?.onRole}
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  autoFocus
                  errorText="Invalid First Name"
                  isDisabled={isEditingUser}
                  label="First Name"
                  required={!isEditingUser}
                  value={newUser?.first_name}
                  onChange={(e) => {
                    updateDetails({ first_name: e.target.value });
                  }}
                  onError={error?.onFName}
                />
                <Input
                  errorText="Invalid Last Name"
                  isDisabled={isEditingUser}
                  label="Last Name"
                  required={!isEditingUser}
                  value={newUser?.last_name}
                  onChange={(e) => {
                    updateDetails({ last_name: e.target.value });
                  }}
                  onError={error?.onLName}
                />
              </div>
              <Input
                errorText="Username is required"
                isDisabled={isEditingUser}
                label="Username"
                required={!isEditingUser}
                value={newUser?.username}
                onChange={(e) => {
                  updateDetails({ username: e.target.value });
                }}
                onError={error?.onUsername}
              />
              <Input
                errorText="Invalid Mobile Number"
                isDisabled={isEditingUser}
                label="Mobile Number"
                maxLength={12}
                pattern="[0-9]{12}"
                required={!isEditingUser}
                type="number"
                value={newUser?.phone_number}
                onChange={(e) => {
                  updateDetails({ phone_number: e.target.value });
                }}
                onError={phoneNoError || error?.onMobileNo}
              />
              <Input
                errorText="Invalid Email Address"
                isDisabled={isEditingUser}
                label="Email Address"
                required={!isEditingUser}
                type="email"
                value={newUser?.email}
                onChange={(e) => {
                  updateDetails({ email: e.target.value });
                }}
                onError={error?.onEmail}
              />

              {isEditingUser ? (
                <p className="mx-auto max-w-[88%] text-center text-xs font-medium italic text-foreground/50">
                  The user will be notified of the changes made to their account
                  on PayBoss. If an action is required, the user will also
                  receive an email with instructions.
                </p>
              ) : (
                <p className="mx-auto max-w-[88%] text-center text-xs font-medium italic text-foreground/50">
                  The password will be sent to the provided email. The new user
                  must change it on first login.
                </p>
              )}

              {error && error.status && (
                <div className="mx-auto mt-2 flex w-full flex-col items-center justify-center gap-4">
                  <StatusMessage error={error.status} message={error.message} />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" isDisabled={loading} onPress={handleClose}>
                Cancel
              </Button>
              {
                <Button
                  color="primary"
                  isDisabled={loading}
                  isLoading={loading}
                  onPress={onConfirmAction}
                >
                  {isEditingUser ? "Save" : "Create User"}
                </Button>
              }
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CreateNewUserModal;
