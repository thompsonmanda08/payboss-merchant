"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Switch, useDisclosure } from "@heroui/react";
import {
  ArrowRightStartOnRectangleIcon,
  PencilIcon,
  PlusIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import useWorkspaceStore from "@/context/workspaces-store";
import LoadingPage from "@/app/loading";
import { cn, formatCurrency, notify } from "@/lib/utils";
import Link from "next/link";
import { Input } from "@/components/ui/input-field";
import { useQueryClient } from "@tanstack/react-query";
import AddUserToWorkspace from "@/components/add-users-workspace-modal";
import PromptModal from "@/components/base/prompt";
import {
  changeWorkspaceVisibility,
  deleteWorkspace,
  updateWorkspace,
} from "@/app/_actions/config-actions";
import NavIconButton from "@/components/ui/nav-icon-button";

function WorkspaceSummary({
  workspaceID,
  workspaces,
  allUsers,
  workspaceRoles,
  workspaceMembers,
}) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();

  const isUserInWorkspace =
    pathname.split("/")[1] == "dashboard" && pathname.split("/").length >= 3;

  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.ID === workspaceID
  );
  const isSandbox = selectedWorkspace?.workspace?.toLowerCase() == "sandbox";

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setExistingUsers, existingUsers } = useWorkspaceStore();

  const [deleteWorkspaceName, setDeleteWorkspaceName] = useState("");
  const [isVisible, setIsVisible] = useState(selectedWorkspace?.isVisible);
  const [changeWorkspaceDetails, setChangeWorkspaceDetails] = useState(false);

  const [newWorkspace, setNewWorkspace] = useState({
    workspace: selectedWorkspace?.workspace,
    description: selectedWorkspace?.description,
  });

  const {
    isOpen: openAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();

  const [deleteError, setDeleteError] = useState({
    status: false,
    message: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  function editWorkspaceField(fields) {
    setNewWorkspace((prev) => {
      return { ...prev, ...fields };
    });
  }

  const noChangesToSave = useMemo(() => {
    return (
      !selectedWorkspace ||
      isSandbox ||
      (newWorkspace.workspace == selectedWorkspace?.workspace &&
        newWorkspace.description == selectedWorkspace?.description)
    );
  }, [
    selectedWorkspace,
    isSandbox,
    newWorkspace.workspace,
    newWorkspace.description,
  ]);

  useEffect(() => {
    // UPDATE EXISTING USERS LIST
    if (workspaceMembers && !existingUsers.length) {
      setExistingUsers(workspaceMembers);
    }
  }, []);

  // UPDATE WORKSPACE DETAIL CHANGES
  async function handleUpdateWorkspace(e) {
    e.preventDefault();
    setLoading(true);

    if (noChangesToSave) {
      setLoading(false);
      setChangeWorkspaceDetails(false);
      notify({
        color: "success",
        title: "Success",
        description: "Changes Saved!",
      });
      return;
    }

    // VALIDATE INPUTS
    if (
      newWorkspace.workspace.length <= 3 ||
      newWorkspace.description.length <= 3
    ) {
      notify({
        title: "Error",
        color: "danger",
        description: "Provide valid name and description!",
      });
      setLoading(false);
      return;
    }

    const response = await updateWorkspace({
      ...newWorkspace,
      ID: workspaceID,
    });

    if (response?.success) {
      queryClient.invalidateQueries();
      setLoading(false);
      notify({
        color: "success",
        title: "Success",
        description: "Changes Saved!",
      });
      return;
    }

    notify({
      title: "Error",
      color: "danger",
      description: "Failed to Update Workspace!",
    });
    setLoading(false);
  }

  // DEACTIVATE / DELETE WORKSPACE
  async function handleDeleteWorkspace() {
    setDeleteLoading(true);

    if (deleteWorkspaceName !== selectedWorkspace?.workspace) {
      setDeleteLoading(false);
      setDeleteError({
        status: true,
        message: "Type the workspace name to confirm delete",
      });

      return;
    }

    const response = await deleteWorkspace(workspaceID);

    if (response?.success) {
      queryClient.invalidateQueries();
      setDeleteLoading(false);

      notify({
        color: "success",
        title: "Success",
        description: "Workspaces Deactivated successfully!",
      });
      router.back();
      return;
    }

    notify({
      title: "Error",
      color: "danger",
      description: "Failed to Deactivate Workspace!",
    });
    setDeleteLoading(false);
  }

  // CHANGE WORKSPACE VISIBILITY
  async function handleWorkspaceVisibility() {
    setIsVisible(!isVisible);
    const response = await changeWorkspaceVisibility(workspaceID, !isVisible);

    if (!response?.success) {
      setIsVisible(!isVisible);

      notify({
        title: "Error",
        color: "danger",
        description: "Failed to update visibility",
      });
      return;
    }

    queryClient.invalidateQueries();

    notify({
      color: "success",
      title: "Success",
      description: "Visibility updated successfully",
    });
  }

  return !selectedWorkspace && !isUserInWorkspace ? (
    <LoadingPage />
  ) : (
    <div className={cn("px-2", { "px-3": isUserInWorkspace })}>
      <div className={cn("mb-8")}>
        <h2 className="heading-3 !font-bold uppercase tracking-tight text-foreground">
          Workspace ({selectedWorkspace?.workspace})
        </h2>
        <p className="text-sm text-foreground-600">
          Workspaces provide a structured way to group and manage services,
          users, and transactions effectively.
        </p>
      </div>

      {/* *********************** WORKSPACE DETAILS MANAGEMENT ******************************** */}
      <div className="flex flex-col gap-4 px-4 lg:p-0">
        {changeWorkspaceDetails ? (
          <div className="flex flex-col gap-6 ">
            <form
              onSubmit={handleUpdateWorkspace}
              role={"edit-workspace-details"}
              className="flex w-full flex-col gap-4 sm:items-start md:flex-row md:items-end"
            >
              <Input
                label="Workspace Name"
                defaultValue={selectedWorkspace?.workspace}
                isDisabled={loading || isSandbox}
                onChange={(e) => {
                  editWorkspaceField({ workspace: e.target.value });
                }}
              />

              <Input
                label="Description"
                isDisabled={loading || isSandbox}
                defaultValue={selectedWorkspace?.description}
                containerClasses={cn("", { "w-full max-w-[700px]": isSandbox })}
                onChange={(e) => {
                  editWorkspaceField({ description: e.target.value });
                }}
              />
              {!isSandbox && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    isDisabled={loading}
                    isLoading={loading}
                    color="danger"
                    onPress={() => {
                      setChangeWorkspaceDetails(false);
                      setNewWorkspace({
                        workspace: selectedWorkspace?.workspace,
                        description: selectedWorkspace?.description,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isDisabled={loading}
                    isLoading={loading}
                    loadingText={"Saving..."}
                  >
                    Save
                  </Button>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className={cn("my-")}>
            <div className="flex items-center ">
              <h2 className="heading-5 !font-bold uppercase tracking-tight text-foreground">
                {selectedWorkspace?.workspace}
              </h2>
              <NavIconButton
                onClick={() => setChangeWorkspaceDetails(true)}
                className="!bg-primary/10 ml-2 "
              >
                <PencilIcon className="h-4 w-4" />
              </NavIconButton>
            </div>
            <p className=" text-sm text-foreground-500">
              {selectedWorkspace?.description}
            </p>
          </div>
        )}
        <hr className="my-6 h-px border-foreground/10" />
        {/* ****************************** WALLET DETAILS *********************************** */}
        <div className="flex w-full justify-between gap-4">
          <div
            className={cn(
              "flex group select-none items-start gap-2 text-slate-600"
            )}
          >
            <WalletIcon className="h-12 w-12 dark:text-foreground text-primary" />{" "}
            <div className=" flex flex-col items-start">
              <span className={cn("font-medium text-foreground")}>
                Wallet Balance
              </span>
              <span className="-mt-1 text-base lg:text-lg font-bold text-primary dark:text-primary-500">
                {formatCurrency(selectedWorkspace?.balance || "0.00")}
              </span>
            </div>
          </div>
          <Button
            as={Link}
            href={`/dashboard/${workspaceID}`}
            className={"sm:w-auto sm:max-w-fit"}
            endContent={<ArrowRightStartOnRectangleIcon className="h-5 w-5" />}
          >
            Go to Dashboard
          </Button>
        </div>
        <hr className="my-6 h-px border-foreground/10" />
        {/* ****************************** WORKSPACE VISIBILITY *********************************** */}
        <div className="flex items-center justify-between w-full gap-4 sm:mt-0 sm:flex-auto">
          <div className="flex flex-col items-start gap-1">
            <h4 className="font-semibold text-foreground">
              Workspace Visibility
            </h4>
            <p className="text-sm text-foreground-500">
              Activate a to interact with the PayBoss platform using this
              workspace.
            </p>
          </div>
          <Switch
            isSelected={isVisible}
            size="lg"
            onValueChange={handleWorkspaceVisibility}
          />
        </div>

        <hr className="my-6 h-px border-foreground/10" />
        {/* ****************************** WORKSPACE MEMBERS MANAGEMENT *********************************** */}
        {!isSandbox && (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:justify-between">
              <div className="flex max-w-4xl flex-col gap-1">
                <h4 className="font-semibold text-foreground">
                  Add Users to Workspace
                </h4>
                <p className="text-sm text-foreground-500">
                  Add users to this workspace to allow them to interact with the
                  PayBoss platform.
                </p>
              </div>

              <Button
                onClick={onOpenAdd}
                className="self-end rounded-md px-3 py-2 text-sm font-semibold  shadow-sm"
                endContent={<PlusIcon className="h-5 w-5" />}
              >
                Add Workspace Members
              </Button>
            </div>
            <hr className="my-6 h-px border-foreground/10" />
            <div className="flex flex-col gap-8 md:flex-row md:justify-between">
              <div className="flex max-w-4xl flex-col gap-1">
                <h4 className="font-semibold text-foreground">
                  Deactivate Workspace
                </h4>
                <p className="text-sm text-foreground-500">
                  If you wish to deactivate or delete your workspace. This
                  action can only be reversed by contacting our support team.
                  Please note that all information related to this workspace
                  will be retained for audit purposes in accordance with
                  regulatory requirements.
                </p>
              </div>

              <Button
                color="danger"
                onClick={onOpen}
                className="self-end rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
              >
                Yes, deactivate my workspace
              </Button>
            </div>
          </>
        )}
      </div>

      {/* *******************OVERLAYS AND MODALS**************************** */}

      <PromptModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title="Delete/Deactivate Workspace"
        onConfirm={handleDeleteWorkspace}
        confirmText="Deactivate"
        isDisabled={deleteLoading}
        isLoading={deleteLoading}
        isDismissable={false}
      >
        <p className="leading-2 m-0">
          <strong>Are you sure you want to perform this action?</strong>
        </p>
        <p className="text-sm text-foreground/70">
          This action cannot be undone. Please type{" "}
          <code className="rounded-md bg-primary/10 p-1 px-2 font-medium text-primary-700">
            {selectedWorkspace?.workspace}
          </code>{" "}
          to confirm your choice to proceed.
        </p>

        <Input
          label="Confirm Delete"
          isDisabled={deleteLoading}
          onError={deleteError.status}
          errorText={deleteError.message}
          onChange={(e) => setDeleteWorkspaceName(e.target.value)}
        />
      </PromptModal>

      <AddUserToWorkspace
        isOpen={openAdd}
        onOpen={onOpenAdd}
        onClose={onCloseAdd}
        workspaceID={workspaceID}
        workspaceName={selectedWorkspace?.workspace}
        workspaceMembers={workspaceMembers}
        workspaceRoles={workspaceRoles}
        allUsers={allUsers}
      />
    </div>
  );
}

export default WorkspaceSummary;
