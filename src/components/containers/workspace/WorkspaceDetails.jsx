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
import { cn, notify, syntaxHighlight } from "@/lib/utils";
import { Snippet, Switch, useDisclosure } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import SelectField from "@/components/ui/select-field";
import { useWorkspaceCallbackURL } from "@/hooks/useQueryHooks";
import { updateWorkspaceCallback } from "@/app/_actions/workspace-actions";

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
  const [isLoadingCallback, setIsLoadingCallback] = useState(false);
  const [deleteWorkspaceName, setDeleteWorkspaceName] = useState("");
  const [callbackURL, setCallbackURL] = useState({ method: "GET", url: "" });
  const { activeWorkspace } = useWorkspaces();
  const [isVisible, setIsVisible] = useState(activeWorkspace?.isVisible);

  const { data: callbackResponse, isLoading: loadingCallback } =
    useWorkspaceCallbackURL(workspaceID);

  const [isSandbox, setIsSandbox] = useState(
    activeWorkspace?.workspace?.toLowerCase() == "sandbox"
  );

  const [newWorkspace, setNewWorkspace] = useState({
    workspace: activeWorkspace?.workspace,
    description: activeWorkspace?.description,
  });

  function updateCallbackURL(fields) {
    setCallbackURL((prev) => ({ ...prev, ...fields }));
  }

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

  // UPDATE WORKSPACE CALLBACK URL
  async function handleUpdateWorkspaceCallback(e) {
    e.preventDefault();
    setIsLoadingCallback(true);

    const isValidURL = /^(http|https):\/\/[^ "]+$/.test(callbackURL.url);

    // VALIDATE INPUTS
    if (!callbackURL?.url || !isValidURL) {
      notify("error", "Provide a valid url!");
      setError({ onCallbackURL: true, message: "Provide a valid url!" });
      setIsLoadingCallback(false);
      return;
    }

    const response = await updateWorkspaceCallback(workspaceID, callbackURL);

    if (response?.success) {
      queryClient.invalidateQueries();
      setIsLoadingCallback(false);
      notify("success", "Callback URL updated!");
      return;
    }

    notify("error", "Failed to Update callback URL!");
    setIsLoadingCallback(false);
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
    // CHECK VISIBILITY OF WORKSPACE
    if (activeWorkspace != undefined && activeWorkspace?.isVisible) {
      setIsVisible(activeWorkspace?.isVisible);
    }

    // CHECK IF WORKSPACE IS A SANDBOX
    // if (
    //   activeWorkspace != undefined &&
    //   activeWorkspace?.workspace?.toLowerCase() == "sandbox"
    // ) {
    //   setIsSandbox(true);
    // }
  }, [activeWorkspace]);

  // CLEAR ERROR STATE
  useEffect(() => {
    setError({ status: false, message: "" });

    return () => {
      setError({ status: false, message: "" });
    };
  }, [deleteWorkspaceName]);

  useEffect(() => {
    setError({ status: false, message: "" });

    // SET CALLBACK URL DATA
    if (
      callbackResponse?.data?.method !== "n/a" &&
      callbackResponse?.data?.url !== "n/a"
    ) {
      setCallbackURL((prev) => ({ ...prev, ...callbackResponse?.data }));
    }

    // SET ACTIVE WORKSPACE IN STATE
    if (activeWorkspace?.workspace) {
      setNewWorkspace((prev) => ({ ...prev, ...activeWorkspace }));
    }
  }, [callbackResponse?.data, activeWorkspace]);

  const noChangesToSave =
    isSandbox ||
    (newWorkspace.workspace == activeWorkspace?.workspace &&
      newWorkspace.description == activeWorkspace?.description);

  const noCallbackChanges =
    callbackURL.method == callbackResponse?.data?.method &&
    callbackURL.url == callbackResponse?.data?.url;


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
            <div className="flex flex-col gap-6">
              <div className="flex max-w-4xl flex-col gap-2 lg:gap-1">
                <h2 className="text-sm font-semibold leading-3 text-foreground sm:text-base">
                  CallbackURL Config
                </h2>
                <p className="text-xs text-gray-400 sm:text-sm">
                  PayBoss core will send a response to the callback URL provided
                  here complete the transaction
                </p>
              </div>

              <form
                onSubmit={handleUpdateWorkspaceCallback}
                role={"edit-workspace-details"}
                className="flex w-full flex-col gap-1 sm:items-start md:flex-row md:items-end"
              >
                <SelectField
                  label="Method"
                  defaultValue={"GET"}
                  placeholder={"GET"}
                  wrapperClassName={cn("max-w-24")}
                  className={cn(
                    "max-w-[100px] bg-orange-300 bg-opacity-50 rounded-md",
                    {
                      "bg-primary-300 bg-opacity-50 rounded-md ":
                        callbackURL.method == "POST",
                    }
                  )}
                  classNames={{
                    value: cn(
                      "font-bold text-orange-600 group-data-[has-value=true]:text-orange-600",
                      {
                        "text-primary-600 group-data-[has-value=true]:text-primary-600":
                          callbackURL.method == "POST",
                      }
                    ),
                  }}
                  options={["GET", "POST"]}
                  isDisabled={isLoadingCallback}
                  value={callbackURL?.method}
                  onError={error?.onCallbackURL}
                  onChange={(e) =>
                    updateCallbackURL({ method: e.target.value })
                  }
                  prefilled={true}
                />

                <Input
                  label="URL"
                  defaultValue={activeWorkspace?.callBackURL}
                  isDisabled={loading}
                  value={callbackURL?.url}
                  onError={error?.onCallbackURL}
                  required={true}
                  pattern="https?://.+"
                  title="https://www.domain-name.com"
                  onChange={(e) => updateCallbackURL({ url: e.target.value })}
                />

                <Button
                  type="submit"
                  isDisabled={isLoadingCallback || noCallbackChanges}
                  isLoading={isLoadingCallback}
                  loadingText={"Saving..."}
                >
                  Save
                </Button>
              </form>
            </div>
            <div className="flex max-w-4xl flex-col gap-2 lg:gap-1">
              <h2 className="text-sm font-semibold leading-3 text-foreground sm:text-base">
                Status Response
              </h2>
              <p className="text-xs text-gray-400 sm:text-sm">
                Your callback URL will get the following response
              </p>

              <div>
                {callbackURL?.method == "GET" ? (
                  <Snippet hideSymbol className="w-full flex-1">
                    <span className="text-wrap">
                      {"GET"} ~{" "}
                      {callbackURL?.url +
                        "?status=&message=&transactionID=&mno_ref=&mno_status_description="}
                    </span>
                  </Snippet>
                ) : (
                  <Snippet
                    classNames={{
                      base: "max-w-sm flex text-wrap",
                    }}
                    hideSymbol
                  >
                    <pre
                      dangerouslySetInnerHTML={{
                        __html: syntaxHighlight(
                          JSON.stringify(
                            {
                              status: "string",
                              message: "string",
                              transactionID: "string",
                              mno_ref: "string | null",
                              mno_status_description: "string",
                            },
                            undefined,
                            2
                          )
                        ),
                      }}
                    ></pre>
                  </Snippet>
                )}
              </div>
            </div>
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
