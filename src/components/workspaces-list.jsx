"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useDisclosure } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";

import { Button } from "@/components/ui/button";
import { capitalize, cn, notify } from "@/lib/utils";
import { createNewWorkspace } from "@/app/_actions/merchant-actions";
import { QUERY_KEYS } from "@/lib/constants";
import useWorkspace from "@/hooks/useWorkspaces";
import OverlayLoader from "@/components/ui/overlay-loader";
import Loader from "@/components/ui/loader";
import useAccountProfile from "@/hooks/useProfileDetails";
import Card from "@/components/base/custom-card";
import InfoBanner from "@/components/base/info-banner";
import EmptyLogs from "@/components/base/empty-logs";

import WorkspaceItem from "./workspace-card-item";
import CreateNewWorkspaceModal from "./create-new-workspace-modal";

function WorkspacesList({ user, showHeader = false, className, workspaces }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { merchantKYC, isAccountAdmin, isOwner } = useAccountProfile();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const isManagePage = pathname.split("/").includes("manage-account");
  const {
    workspaces: activeWorkspaces,
    isLoading,
    workspaceTypes,
  } = useWorkspace();

  const canCreateWorkspace =
    (isAccountAdmin || isOwner) && merchantKYC?.stageID == 3;

  const [newWorkspace, setNewWorkspace] = useState({
    workspace: "",
    description: "",
    workspaceType: "",
    isMerchantWorkspace: merchantKYC?.merchant_type == "super",
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
      notify({
        title: "Error",
        color: "danger",
        description: "Provide valid name and description!",
      });
      setLoading(false);
    }

    const response = await createNewWorkspace(newWorkspace);

    if (response?.success) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SETUP],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKSPACES] });

      notify({
        color: "success",
        title: "Success",
        description: "Workspaces created successfully!",
      });
      onOpenChange();
      setLoading(false);

      return;
    }

    notify({
      title: "Error",
      color: "danger",
      description: "Failed to create Workspace!",
    });

    notify({
      title: "Error",
      color: "danger",
      description: response?.message,
    });

    setLoading(false);
    onOpenChange();
  }

  // IF ON MANAGE WORKSPACES PAGE, SHOW ALL WORKSPACES AND IF ON DASHBOARD SHOW ONLY PROVIDED WORKSPACES OR ACTIVE WORKSPACES
  const WORKSPACES = isManagePage ? workspaces : workspaces || activeWorkspaces;

  return (
    <>
      <Card className={cn("gap-6 min-h-[450px]", className)}>
        {showHeader && (
          <div className="flex justify-between gap-8">
            <div>
              <h2 className="heading-3 !font-bold tracking-tight text-foreground">
                Choose a Workspace
              </h2>
              <p className="max-w-4xl text-sm text-slate-600">
                Access your account through a workspace for the convenience of
                having all your tools and resources organized in one place.
              </p>
            </div>
            {canCreateWorkspace && (
              <Button
                className={
                  "mt-auto bg-primary-50 dark:bg-primary dark:text-primary-foreground px-4"
                }
                color="primary"
                endContent={<PlusIcon className="h-5 w-5" />}
                isDisabled={loading}
                size="lg"
                variant="flat"
                onPress={onOpen}
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
            href={"manage-account/account-verification"}
            infoText="Just one more step, please submit your business documents to aid us with the approval process"
          />
        )}

        <div className="flex w-full flex-col items-center justify-center">
          {/* SCROLL-AREA */}
          <div
            className={cn(
              "max-h-[600px] overflow-y-auto no-scrollbar flex w-full min-w-[400px]  flex-col lg:px-2",
              { "max-h-auto lg:max-h-max ": isManagePage }
            )}
          >
            {isLoading ? (
              <Loader loadingText={"Loading Workspaces..."} size={80} />
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
                        description={`${capitalize(
                          item?.workspaceType
                        )}'s Workspace`}
                        href={
                          isManagePage
                            ? `manage-account/workspaces/${item?.ID}`
                            : `/dashboard/${item?.ID}`
                        }
                        isVisible={item?.isVisible}
                        name={item?.workspace}
                        onClick={() => setLoading(true)}
                      />
                    );
                  })
                ) : (
                  <div className="flex flex-col aspect-square max-h-[500px] w-full flex-1 items-center rounded-lg text-sm font-semibold text-slate-600">
                    <EmptyLogs
                      className={"my-8"}
                      subTitle={
                        merchantKYC?.stage.toLowerCase() == "review"
                          ? "Your KYC application is under review. Once approved, you will be able to create a workspace."
                          : "Only the admin or account owner can create a workspace."
                      }
                      title={
                        merchantKYC?.stage.toLowerCase() == "review"
                          ? "KYC Under Review"
                          : "Oops! Looks like you have no workspaces yet!"
                      }
                    />
                    <>
                      {/* ONLY ON EMPTY STATES */}
                      {merchantKYC?.stage.toLowerCase() == "review" && (
                        <Popover placement="top">
                          <PopoverTrigger>
                            <Button
                              className={"p-8 min-w-[300px] bg-primary-50"}
                              color="primary"
                              endContent={<PlusIcon className="h-5 w-5" />}
                              variant="flat"
                            >
                              Create Workspace
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="px-1 py-2">
                              <div className="text-small font-bold">
                                KYC Pending
                              </div>
                              <div className="text-tiny max-w-sm">
                                Your KYC application is under review. You will
                                receive an email notification when your
                                application has been reviewed
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}

                      {canCreateWorkspace &&
                        merchantKYC?.stage.toLowerCase() == "approved" && (
                          <Button
                            className={
                              "bg-primary-50 p-8 min-w-[300px] dark:bg-primary dark:text-primary-foreground px-4"
                            }
                            color="primary"
                            endContent={<PlusIcon className="h-5 w-5" />}
                            isDisabled={loading}
                            size="lg"
                            variant="flat"
                            onPress={onOpen}
                          >
                            Create New Workspace
                          </Button>
                        )}
                    </>
                    {/* ONLY ON EMPTY STATES */}
                  </div>
                )}

                {canCreateWorkspace && isManagePage && (
                  <Button
                    className={cn(
                      "h-24 w-full flex-col border border-primary-100 dark:border-primary-300/30 bg-transparent font-medium text-primary hover:border-primary-100 hover:bg-primary-50",
                      { "col-span-full": workspaces?.length < 0 }
                    )}
                    onPress={onOpen}
                  >
                    <PlusIcon className="h-6 w-6" />
                    Create Workspace
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* OVERLAYS AND MODALS  */}
      {<OverlayLoader show={loading} />}

      <CreateNewWorkspaceModal
        editWorkspaceField={editWorkspaceField}
        formData={newWorkspace}
        handleClose={handleClose}
        handleCreateWorkspace={handleCreateWorkspace}
        isOpen={isOpen}
        loading={loading}
        workspaceTypes={workspaceTypes}
        onOpenChange={onOpenChange}
      />
    </>
  );
}

export default WorkspacesList;
