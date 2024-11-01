"use client";
import { Button } from "@/components/ui/button";
import { capitalize, cn, notify } from "@/lib/utils";
import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import { createNewWorkspace } from "@/app/_actions/config-actions";
import { useQueryClient } from "@tanstack/react-query";
import { SETUP_QUERY_KEY, WORKSPACES_QUERY_KEY } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import useWorkspace from "@/hooks/useWorkspaces";
import WorkspaceItem from "./WorkspaceItem";
import OverlayLoader from "@/components/ui/overlay-loader";
import CreateNewWorkspaceModal from "./CreateNewWorkspace";
import Loader from "@/components/ui/loader";
import useAccountProfile from "@/hooks/useProfileDetails";
import Card from "@/components/base/Card";
import InfoBanner from "@/components/base/InfoBanner";
import EmptyLogs from "@/components/base/EmptyLogs";

function WorkspacesList({ user, showHeader = false, className, workspaces }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { KYCStageID } = useAccountProfile();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const isManagePage = pathname.split("/").includes("manage-account");
  const { workspaces: activeWorkspaces, isLoading } = useWorkspace();

  const canCreateWorkspace =
    (user?.role?.toLowerCase() == "admin" ||
      user?.role?.toLowerCase() == "owner") &&
    KYCStageID == 4;

  const [newWorkspace, setNewWorkspace] = useState({
    workspace: "",
    description: "",
    workspaceType: "collection",
  });

  function editWorkspaceField(fields) {
    setNewWorkspace((prev) => {
      return { ...prev, ...fields };
    });
  }

  function handleClose(onClose) {
    setNewWorkspace({});
    onClose();
  }

  async function handleCreateWorkspace() {
    setLoading(true);

    if (
      newWorkspace.workspace.length <= 3 &&
      newWorkspace.description.length <= 3
    ) {
      notify("error", "Provide valid name and description!");
      setLoading(false);
    }

    const response = await createNewWorkspace(newWorkspace);

    if (response?.success) {
      queryClient.invalidateQueries({
        queryKey: [SETUP_QUERY_KEY],
      });
      queryClient.invalidateQueries({ queryKey: [WORKSPACES_QUERY_KEY] });
      notify("success", "Workspace Created!");
      onOpenChange();
      setLoading(false);
      return;
    }

    notify("error", "Failed to Create Workspace!");
    notify("error", response?.message);

    setLoading(false);
    onOpenChange();
  }

  // IF ON MANAGE WORKSPACES PAGE, SHOW ALL WORKSPACES AND IF ON DASHBOARD SHOW ONLY PROVIDED WORKSPACES OR ACTIVE WORKSPACES
  const WORKSPACES = isManagePage ? workspaces : workspaces || activeWorkspaces;

  return (
    <>
      <Card className={cn("gap-6", className)}>
        {showHeader && (
          <div className="flex justify-between gap-8">
            <div>
              <h2 className="heading-3 !font-bold tracking-tight text-foreground">
                Choose a Workspace
              </h2>
              <p className=" text-sm text-slate-600 max-w-4xl">
                Access your account through a workspace for the convenience of
                having all your tools and resources organized in one place.
              </p>
            </div>
            {canCreateWorkspace && (
              <Button
                onPress={onOpen}
                size="lg"
                isDisabled={loading}
                endContent={<PlusIcon className=" h-5 w-5" />}
                variant="flat"
                color="primary"
                className={
                  "mt-auto bg-primary-50 dark:bg-primary dark:text-primary-foreground px-4"
                }
              >
                New
              </Button>
            )}
          </div>
        )}

        {/* ACCOUNT VERIFICATION PROMPTING BANNER */}
        {user && !user?.isCompleteKYC && (
          <InfoBanner
            buttonText="Submit Documents"
            infoText="Just one more step, please submit your business documents to aid us with the approval process"
            href={"manage-account/account-verification"}
          />
        )}

        <div className="flex w-full flex-col items-center justify-center">
          <ScrollArea
            className={cn(
              "max-h-[500px]} flex w-full min-w-[400px] flex-col lg:px-2",
              { "max-h-auto lg:max-h-max ": isManagePage }
            )}
          >
            {isLoading ? (
              <Loader size={80} loadingText={"Loading Workspaces..."} />
            ) : (
              <div
                className={cn(
                  "grid w-full place-items-center gap-4 rounded-lg",
                  {
                    "grid-cols-[repeat(auto-fill,minmax(400px,1fr))]":
                      WORKSPACES?.length > 0,
                  }
                )}
              >
                {WORKSPACES.length ? (
                  WORKSPACES?.map((item, index) => {
                    return (
                      <WorkspaceItem
                        key={index}
                        onClick={() => setLoading(true)}
                        name={item?.workspace}
                        description={`${capitalize(
                          item?.workspaceType
                        )}'s Workspace`}
                        isVisible={item?.isVisible}
                        href={
                          isManagePage
                            ? `manage-account/workspaces/${item?.ID}`
                            : `/dashboard/${item?.ID}`
                        }
                      />
                    );
                  })
                ) : (
                  <div className="flex aspect-square max-h-[500px] w-full flex-1 items-center rounded-lg  text-sm font-semibold text-slate-600">
                    <EmptyLogs
                      className={"my-auto"}
                      title={"Oops! Looks like you have no workspaces yet!"}
                      subTitle={
                        "Only the admin or account owner can create a workspace."
                      }
                    />
                  </div>
                )}

                {canCreateWorkspace && isManagePage && (
                  <Button
                    onPress={onOpen}
                    className={cn(
                      "h-24 w-full flex-col border border-primary-100 dark:border-primary-300/30 bg-transparent font-medium text-primary hover:border-primary-100 hover:bg-primary-50",
                      { "col-span-full": workspaces?.length < 0 }
                    )}
                  >
                    <PlusIcon className=" h-6 w-6" />
                    Create Workspace
                  </Button>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </Card>

      {/* OVERLAYS AND MODALS  */}
      {<OverlayLoader show={loading} />}

      <CreateNewWorkspaceModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        handleCreateWorkspace={handleCreateWorkspace}
        handleClose={handleClose}
        editWorkspaceField={editWorkspaceField}
        loading={loading}
      />
    </>
  );
}

export default WorkspacesList;
