import {
  deleteWorkspace,
  updateWorkspace,
} from "@/app/_actions/config-actions";
import PromptModal from "@/components/base/Prompt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-field";
import AddUserToWorkspace from "@/components/containers/workspace/AddUserToWorkspace";
import useWorkspaces from "@/hooks/useWorkspaces";
import {
  SETUP_QUERY_KEY,
  WORKSPACE_TYPES,
  WORKSPACES_QUERY_KEY,
} from "@/lib/constants";
import { cn, notify } from "@/lib/utils";
import { Switch, useDisclosure } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

function WorkspaceDetails({
  workspaceID,
  navigateTo,
  workspaceName,
  workspaceMembers,
  workspaceRoles,
  allUsers,
}) {
  const { back } = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: openAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();
  const [error, setError] = useState({
    status: false,
    message: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteWorkspaceName, setDeleteWorkspaceName] = useState("");
  const [callbackURL, setCallbackURL] = useState("");
  const { activeWorkspace } = useWorkspaces();
  const [isVisible, setIsVisible] = useState(activeWorkspace?.isVisible);

  const [isSandbox, setIsSandbox] = useState(
    activeWorkspace?.workspace?.toLowerCase() == "sandbox"
  );

  const [newWorkspace, setNewWorkspace] = useState({
    workspace: activeWorkspace?.workspace,
    description: activeWorkspace?.description,
  });


  const noChangesToSave =
    !activeWorkspace ||
    isSandbox ||
    (newWorkspace.workspace == activeWorkspace?.workspace &&
      newWorkspace.description == activeWorkspace?.description);

  function editWorkspaceField(fields) {
    setNewWorkspace((prev) => {
      return { ...prev, ...fields };
    });
  }

  // UPDATE WORKSPACE DETAIL CHANGES
  async function handleUpdateWorkspace(e) {
    e.preventDefault();
    setLoading(true);

    // VALIDATE INPUTS
    if (
      newWorkspace.workspace?.length <= 3 ||
      newWorkspace.description?.length <= 3
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
      queryClient.invalidateQueries();

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

    if (deleteWorkspaceName !== activeWorkspace?.workspace) {
      setDeleteLoading(false);
      setError({
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

  // CHECK IF WORKSPACE IS VISIBLE
  useEffect(() => {
    if (activeWorkspace != undefined && activeWorkspace?.isVisible) {
      setIsVisible(activeWorkspace?.isVisible);
    }

    if (
      activeWorkspace != undefined &&
      activeWorkspace?.workspace?.toLowerCase() == "sandbox"
    ) {
      setIsSandbox(true);
    }
  }, [activeWorkspace]);

  // CLEAR ERROR STATE
  useEffect(() => {
    setError({ status: false, message: "" });

    return () => {
      setError({ status: false, message: "" });
    };
  }, [deleteWorkspaceName]);

  return (
    <>
      <div className="flex w-full flex-1 flex-col gap-4">
        <div className="flex flex-col gap-6">
          <form
            onSubmit={handleUpdateWorkspace}
            role={"edit-workspace-details"}
            className="flex w-full flex-col gap-4 sm:items-start md:flex-row md:items-end"
          >
            <Input
              label="Workspace Name"
              defaultValue={activeWorkspace?.workspace}
              isDisabled={loading || isSandbox}
              onChange={(e) => {
                editWorkspaceField({ workspace: e.target.value });
              }}
            />

            <Input
              label="Description"
              isDisabled={loading || isSandbox}
              defaultValue={activeWorkspace?.description}
              containerClasses={cn("", { "w-full max-w-[700px]": isSandbox })}
              onChange={(e) => {
                editWorkspaceField({ description: e.target.value });
              }}
            />
            {!isSandbox && (
              <Button
                type="submit"
                isDisabled={loading || noChangesToSave}
                isLoading={loading}
                loadingText={"Saving..."}
              >
                Save Changes
              </Button>
            )}
          </form>
        </div>
      </div>

      <hr className="my-6 h-px bg-foreground-900/5" />
      <div className="flex flex-col gap-8 md:flex-row md:justify-between md:gap-16 xl:gap-24">
        <div className="flex w-full items-center justify-between md:flex-row">
          <div className="flex max-w-4xl flex-col gap-2">
            <h2 className="text-sm font-semibold leading-3 text-foreground sm:text-base">
              Add Users to Workspace
            </h2>
            <p className="text-xs leading-6 text-gray-400 sm:text-sm">
              Give others access to this workspace
            </p>
          </div>

          <Button
            onClick={onOpenAdd}
            className="rounded-md px-3 py-2 text-sm font-semibold shadow-sm"
            endContent={<PlusIcon className="h-5 w-5" />}
          >
            Add Members
          </Button>
        </div>
      </div>

      {/* DISBURSEMENTS WORKSPACE DOES NOT NEED A CALLBACK-URL */}
      {activeWorkspace?.workspaceType !== WORKSPACE_TYPES[1]?.ID && (
        <>
          <hr className="my-4 h-px bg-foreground-900/5 sm:my-6" />

          {/* CHANGE WORKSPACE VISIBILITY */}
          <div className="flex flex-col gap-6">
            <div className="flex max-w-4xl flex-col gap-2">
              <h2 className="text-sm font-semibold leading-3 text-foreground sm:text-base">
                CallbackURL Config
              </h2>
              <p className="text-xs leading-6 text-gray-400 sm:text-sm">
                PayBoss core will send a response to the callback URL provided
                here complete the transaction
              </p>
            </div>
            <form
              onSubmit={handleUpdateWorkspace}
              role={"edit-workspace-details"}
              className="flex w-full flex-col gap-4 sm:items-start md:flex-row md:items-end"
            >
              <Input
                label="Callback URL"
                defaultValue={activeWorkspace?.callBackURL}
                isDisabled={loading}
                value={callbackURL}
                isInvalid={error?.onCallbackURL}
                onChange={(e) => setCallbackURL(e.target.value)}
              />

              <Button
                type="submit"
                isDisabled={loading}
                isLoading={loading}
                loadingText={"Saving..."}
              >
                Save
              </Button>
            </form>
          </div>
        </>
      )}

      <hr className="my-4 h-px bg-foreground-900/5 sm:my-6" />

      {/* CHANGE WORKSPACE VISIBILITY */}
      <div className="flex w-full items-center justify-between">
        <div className="flex max-w-4xl flex-col gap-2">
          <h2 className="text-sm font-semibold leading-3 text-foreground sm:text-base">
            Change Workspace Visibility
          </h2>
          <p className="text-xs leading-6 text-gray-400 sm:text-sm">
            Change workspace to allow other users to have access
          </p>
        </div>

        <Switch isSelected={true} isDisabled></Switch>
      </div>

      <hr className="my-4 h-px bg-foreground-900/5 sm:my-6" />

      {/* DELETE A WORKSPACE */}
      <div className="flex flex-col gap-8 md:flex-row md:justify-between">
        <div className="flex max-w-4xl flex-col gap-4">
          <h2 className="text-sm font-semibold leading-3 text-foreground sm:text-base">
            Deactivate Workspace
          </h2>
          <p className="text-xs leading-6 text-gray-400 sm:text-sm">
            If you wish to deactivate or delete your workspace. This action can
            only be reversed by contacting our support team. Please note that
            all information related to this workspace will be retained for audit
            purposes in accordance with regulatory requirements.
          </p>
        </div>

        <Button
          color="danger"
          onClick={onOpen}
          className="w-full self-end rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 sm:w-auto"
        >
          Yes, deactivate my workspace
        </Button>
      </div>

      {/* MODALS */}
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
            {activeWorkspace?.workspace}
          </code>{" "}
          to confirm your choice to proceed.
        </p>

        <Input
          label="Confirm Delete"
          isDisabled={deleteLoading}
          onError={error.status}
          errorText={error.message}
          onChange={(e) => setDeleteWorkspaceName(e.target.value)}
        />
      </PromptModal>

      <AddUserToWorkspace
        isOpen={openAdd}
        onOpen={onOpenAdd}
        onClose={onCloseAdd}
        workspaceID={workspaceID}
        workspaceName={workspaceName}
        navigateTo={navigateTo}
        workspaceMembers={workspaceMembers}
        workspaceRoles={workspaceRoles}
        allUsers={allUsers}
      />
    </>
  );
}

export default WorkspaceDetails;
