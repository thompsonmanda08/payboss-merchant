"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useCustomTabsHook from "@/hooks/useCustomTabsHook";
import { Switch, useDisclosure } from "@nextui-org/react";
import useWorkspaces from "@/hooks/useWorkspaces";
import {
  ArrowRightStartOnRectangleIcon,
  ArrowUturnLeftIcon,
  PencilIcon,
  PencilSquareIcon,
  PlusIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import useNavigation from "@/hooks/useNavigation";
import useAllUsersAndRoles from "@/hooks/useAllUsersAndRoles";
import { useWorkspaceMembers } from "@/hooks/useQueryHooks";
import useWorkspaceStore from "@/context/workspaceStore";
import LoadingPage from "@/app/loading";
import { cn, formatCurrency, notify } from "@/lib/utils";
import UsersTable from "@/components/containers/tables/UsersTable";
import WorkspaceDetails from "@/components/containers/workspace/WorkspaceDetails";
import Wallet from "@/components/containers/workspace/Wallet";
import Link from "next/link";
import { Input } from "@/components/ui/input-field";
import { useQueryClient } from "@tanstack/react-query";
import AddUserToWorkspace from "@/components/containers/workspace/AddUserToWorkspace";
import PromptModal from "@/components/base/Prompt";
import {
  changeWorkspaceVisibility,
  deleteWorkspace,
  updateWorkspace,
} from "@/app/_actions/config-actions";
import NavIconButton from "@/components/ui/nav-icon-button";

const TABS = [
  { name: "General", index: 0 },
  { name: "Members", index: 1 },
  { name: "Wallet", index: 2 },
];

function WorkspaceSummary({ workspaceID }) {
  const { back } = useRouter();
  const queryClient = useQueryClient();
  const { allWorkspaces, isUserInWorkspace } = useWorkspaces();

  const selectedWorkspace = allWorkspaces.find(
    (workspace) => workspace.ID === workspaceID
  );

  const [isSandbox, setIsSandbox] = useState(
    selectedWorkspace?.workspace.toLowerCase() == "sandbox"
  );
  const [changeWorkspaceDetails, setChangeWorkspaceDetails] = useState(false);

  const { setExistingUsers, existingUsers } = useWorkspaceStore();

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const [deleteWorkspaceName, setDeleteWorkspaceName] = useState("");

  const { data: members } = useWorkspaceMembers(workspaceID);

  const workspaceUsers = members?.data?.users || [];

  const [newWorkspace, setNewWorkspace] = useState({
    workspace: selectedWorkspace?.workspace,
    description: selectedWorkspace?.description,
  });

  const [isVisible, setIsVisible] = useState(selectedWorkspace?.isVisible);

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
    // UPDATE EXISITING USERS LIST
    if (workspaceUsers && !existingUsers.length) {
      setExistingUsers(workspaceUsers);
    }
  }, []);

  // UPDATE WORKSPACE DETAIL CHANGES
  async function handleUpdateWorkspace(e) {
    e.preventDefault();
    setLoading(true);

    if (noChangesToSave) {
      setLoading(false);
      setChangeWorkspaceDetails(false);
      notify("success", "Changes Saved!");
      return;
    }

    // VALIDATE INPUTS
    if (
      newWorkspace.workspace.length <= 3 ||
      newWorkspace.description.length <= 3
    ) {
      notify("error", "Provide valid name and description!");
      setLoading(false);
      return;
    }

    const response = await updateWorkspace({
      ...newWorkspace,
      ID: workspaceID,
    });

    if (response?.success) {
      queryClient.invalidateQueries({ queryKey: [SETUP_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WORKSPACES_QUERY_KEY] });
      setLoading(false);
      notify("success", "Changes Saved!");
      return;
    }

    notify("error", "Failed to Update Workspace!");
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
      queryClient.invalidateQueries({
        queryKey: [WORKSPACES_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [SETUP_QUERY_KEY],
      });
      setDeleteLoading(false);
      notify("success", "Workspaces Deactivated successfully!");
      back();
      return;
    }

    notify("error", "Failed to Deactivate Workspace!");
    setDeleteLoading(false);
  }

  // CHANGE WORKSPACE VISIBILITY
  async function handleWorkspaceVisibility() {
    setIsVisible(!isVisible);
    const response = await changeWorkspaceVisibility(workspaceID, !isVisible);

    if (!response?.success) {
      setIsVisible(!isVisible);
      notify("error", "Failed to update visibility");
      return;
    }

    queryClient.invalidateQueries();
    notify("success", "Visibility updated successfully");
  }

  return !selectedWorkspace && !isUserInWorkspace ? (
    <LoadingPage />
  ) : (
    <div className={cn("px-2", { "px-3": isUserInWorkspace })}>
      <div className="relative mb-8 flex w-full items-center justify-between lg:-left-5">
        <Button
          aria-label="back"
          color="light"
          className={"text-primary sm:w-auto sm:max-w-fit"}
          onClick={() => back()}
          startContent={<ArrowUturnLeftIcon className="h-5 w-5" />}
        >
          Return to Workspaces
        </Button>
        <Button
          as={Link}
          href={`/dashboard/${workspaceID}`}
          aria-label="back"
          color="light"
          className={"text-primary sm:w-auto sm:max-w-fit"}
          endContent={<ArrowRightStartOnRectangleIcon className="h-5 w-5" />}
        >
          Go to Workspace Dashboard
        </Button>
      </div>
      <div className={cn("mb-8")}>
        <h2 className="heading-5 !font-bold uppercase tracking-tight text-foreground">
          Workspace ({selectedWorkspace?.workspace})
        </h2>
        <p className=" text-sm text-foreground-600">
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
            <p className=" text-sm text-foreground-600">
              {selectedWorkspace?.description}
            </p>
          </div>
        )}
        <hr className="my-6 h-px bg-foreground-900/5" />
        {/* ****************************** WALLET DETAILS *********************************** */}
        <div className="flex w-full gap-4">
          <div
            className={cn(
              "flex group select-none items-start gap-2 text-foreground-600"
            )}
          >
            <WalletIcon className="h-12 w-12" />{" "}
            <div className=" flex flex-col items-start">
              <span className={cn("text-sm font-medium ")}>
                Workspace Wallet Balance
              </span>
              <span className="-mt-1 text-base lg:text-lg font-bold text-primary">
                {formatCurrency(selectedWorkspace?.balance || "0.00")}
              </span>
            </div>
          </div>
        </div>
        <hr className="my-6 h-px bg-foreground-900/5" />
        {/* ****************************** WORKSPACE VISIBILITY *********************************** */}
        <div className="flex items-center justify-between w-full gap-4 sm:mt-0 sm:flex-auto">
          <div className="flex flex-col items-start gap-1">
            <h4 className="font-semibold text-foreground">
              Workspace Visibility
            </h4>
            <p className="text-sm text-foreground-400">
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

        <hr className="my-6 h-px bg-foreground-900/5" />
        {/* ****************************** WORKSPACE MEMBERS MANAGEMENT *********************************** */}
        {!isSandbox && (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:justify-between">
              <div className="flex max-w-4xl flex-col gap-1">
                <h4 className="font-semibold text-foreground">
                  Add Users to Workspace
                </h4>
                <p className="text-sm text-foreground-400">
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
            <hr className="my-6 h-px bg-foreground-900/5" />
            <div className="flex flex-col gap-8 md:flex-row md:justify-between">
              <div className="flex max-w-4xl flex-col gap-1">
                <h4 className="font-semibold text-foreground">
                  Deactivate Workspace
                </h4>
                <p className="text-sm text-foreground-400">
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
        workspaceUsers={workspaceUsers}
      />
    </div>
  );
}

export default WorkspaceSummary;
