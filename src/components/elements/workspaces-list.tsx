"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { use, useMemo, useState } from "react";
import { Alert, Link, useDisclosure } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  addToast,
} from "@heroui/react";

import { Button } from "@/components/ui/button";
import { capitalize, cn } from "@/lib/utils";
import { createNewWorkspace } from "@/app/_actions/merchant-actions";
import { QUERY_KEYS } from "@/lib/constants";
import useWorkspace from "@/hooks/use-workspaces";
import OverlayLoader from "@/components/ui/overlay-loader";
import useAccountProfile from "@/hooks/use-profile-info";
import Card from "@/components/base/custom-card";
import EmptyLogs from "@/components/base/empty-logs";

import WorkspaceItem from "./workspace-card-item";
import CreateNewWorkspaceModal from "../modals/create-new-workspace-modal";
import useKYCInfo from "@/hooks/use-kyc-info";
import WorkspacesLoading from "@/app/manage-account/loading";
import { Workspace } from "@/types";

const INIT_DATA = {
  workspace: "",
  description: "",
  workspaceType: "",
};

function WorkspacesList({
  showHeader = false,
  className,
  workspaces,
}: {
  showHeader?: boolean;
  className?: string;
  workspaces?: Workspace[];
}) {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    workspaces: assignedWorkspaces,
    isLoading: loadingWorkspaces,
    workspaceTypes,
  } = useWorkspace();

  const {
    isAccountAdmin,
    isOwner,
    isLoading: loadingAccountProfile,
  } = useAccountProfile();
  const { merchantKYC, isCompleteKYC, isLoading: loadingKYC } = useKYCInfo();

  const [isLoading, setIsLoading] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState(INIT_DATA);
  const editWorkspaceField = (fields: Partial<typeof INIT_DATA>) =>
    setNewWorkspace((prev) => ({ ...prev, ...fields }));

  const isManagePage = pathname.split("/").includes("manage-account");

  const canCreateWorkspace =
    (isAccountAdmin || isOwner) && merchantKYC?.stage_id == 3;

  function handleClose() {
    setNewWorkspace(INIT_DATA);
    setIsLoading(false);
    onClose();
  }

  async function handleCreateWorkspace() {
    setIsLoading(true);

    if (
      newWorkspace.workspace.length < 3 &&
      newWorkspace.description.length < 3
    ) {
      addToast({
        title: "Error",
        color: "danger",
        description: "Provide valid name and description!",
      });
      setIsLoading(false);
      return;
    }

    const response = await createNewWorkspace(newWorkspace);

    if (response?.success) {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETUP] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKSPACES] });

      addToast({
        color: "success",
        title: "Success",
        description: "Workspaces created successfully!",
      });
      handleClose();
      setIsLoading(false);

      return;
    }

    addToast({
      title: "Error",
      color: "danger",
      description: "Failed to create Workspace!",
    });

    setIsLoading(false);
    handleClose();
  }

  // IF ON MANAGE WORKSPACES PAGE, SHOW ALL WORKSPACES AND IF ON DASHBOARD SHOW ONLY PROVIDED WORKSPACES OR ACTIVE WORKSPACES
  const WORKSPACES: Workspace[] =
    isManagePage && workspaces
      ? workspaces
      : workspaces || (assignedWorkspaces as Workspace[]);

  const isLoadingData = useMemo(() => {
    return loadingWorkspaces || loadingKYC || loadingAccountProfile;
  }, [loadingWorkspaces, loadingKYC, loadingAccountProfile]);

  if (isLoadingData) {
    return (
      <OverlayLoader
        description="Please be patient while we configure your session"
        show={true}
        title="Initializing Account"
      />
    );
  }

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

            {canCreateWorkspace && !isLoadingData && (
              <Button
                className={
                  "mt-auto bg-primary-50 dark:bg-primary dark:text-primary-foreground px-4"
                }
                color="primary"
                endContent={<PlusIcon className="h-5 w-5" />}
                isDisabled={isLoadingData}
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
        {merchantKYC?.can_edit ? (
          <Alert
            className="my-4"
            color="warning"
            classNames={{ mainWrapper: "flex flex-row items-center max-h-16" }}
          >
            <span>
              Just one more step, please submit your business documents to aid
              us with the approval process
            </span>
            <Button
              as={Link}
              color="warning"
              href={"/manage-account/account-verification"}
              className={"text-white bg-warning m-0 ml-auto"}
            >
              Complete Verification
            </Button>
          </Alert>
        ) : null}

        <div className="flex w-full flex-col items-center justify-center">
          {/* SCROLL-AREA */}
          <div
            className={cn(
              "max-h-[600px] overflow-y-auto no-scrollbar flex w-full min-w-[400px]  flex-col lg:px-2",
              { "max-h-auto lg:max-h-max ": isManagePage },
            )}
          >
            {loadingWorkspaces || loadingAccountProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length }, (_, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 flex items-center justify-between animate-pulse"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary-100 h-16 w-16 rounded-md" />
                      <div className="space-y-2">
                        <div className="bg-gray-200 h-6 w-24 rounded-md" />
                        <div className="bg-gray-200 h-4 w-40 rounded-md" />
                      </div>
                    </div>
                    <div className="bg-gray-200 h-6 w-6 rounded-md" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={cn(
                  "grid w-full place-items-center gap-4 rounded-lg",
                  {
                    "grid-cols-[repeat(auto-fill,minmax(400px,1fr))]":
                      WORKSPACES?.length > 0,
                  },
                )}
              >
                {WORKSPACES.length ? (
                  WORKSPACES?.map((item, index) => {
                    return (
                      <WorkspaceItem
                        key={index}
                        description={`${capitalize(
                          item?.workspaceType,
                        )}'s Workspace`}
                        href={
                          isManagePage
                            ? `manage-account/workspaces/${item?.ID}`
                            : `/dashboard/${item?.ID}`
                        }
                        isVisible={item?.isVisible}
                        name={item?.workspace}
                        onClick={() => setIsLoading(true)}
                      />
                    );
                  })
                ) : (
                  <div className="flex flex-col aspect-square max-h-[500px] w-full flex-1 items-center rounded-lg text-sm font-semibold text-slate-600">
                    <EmptyLogs
                      className={"my-8"}
                      subTitle={
                        merchantKYC?.stageID < 2
                          ? "Submit your KYC documents to start creating workspaces."
                          : merchantKYC?.stageID >= 2 &&
                              merchantKYC?.stage?.toLowerCase() == "review"
                            ? "Your KYC application is under review. Once approved, you will be able to create a workspace."
                            : "Only the admin or account owner can create a workspace."
                      }
                      title={
                        merchantKYC?.stageID < 2
                          ? "Start Account Verification"
                          : merchantKYC?.stageID >= 2 &&
                              merchantKYC?.stage?.toLowerCase() == "review"
                            ? "KYC Under Review"
                            : "Oops! Looks like you have no workspaces yet!"
                      }
                    />
                    <>
                      {/* ONLY ON EMPTY STATES */}
                      {merchantKYC?.stageID >= 2 && !isCompleteKYC && (
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

                      {canCreateWorkspace && isCompleteKYC && !isManagePage && (
                        <Button
                          className={
                            "bg-primary-50 p-8 min-w-[300px] dark:bg-primary dark:text-primary-foreground px-4"
                          }
                          color="primary"
                          endContent={<PlusIcon className="h-5 w-5" />}
                          isDisabled={isLoading}
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

                {canCreateWorkspace && (
                  <Button
                    className={cn(
                      "h-24 w-full flex-col border border-primary-100 dark:border-primary-300/30 bg-transparent font-medium text-primary hover:border-primary-100 hover:bg-primary-50",
                      {
                        "col-span-full": !workspaces || workspaces?.length < 0,
                      },
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
      {
        <OverlayLoader
          show={isLoading}
          title="Initializing Workspace"
          description="Your workspace is being prepared. Please wait..."
        />
      }

      <CreateNewWorkspaceModal
        editWorkspaceField={editWorkspaceField}
        formData={newWorkspace}
        handleClose={handleClose}
        handleCreateWorkspace={handleCreateWorkspace}
        isOpen={isOpen}
        loading={isLoading}
        workspaceTypes={workspaceTypes}
      />
    </>
  );
}

export default WorkspacesList;
