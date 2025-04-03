"use client";
import { useEffect, useState } from "react";
import {
  PlusIcon,
  Square2StackIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  ComputerDesktopIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Spinner,
  Tooltip,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn, formatDate, maskString, notify } from "@/lib/utils";
import CustomTable from "@/components/tables/table";
import {
  useWorkspaceAPIKey,
  useWorkspaceInit,
  useWorkspaceTerminals,
} from "@/hooks/useQueryHooks";
import {
  activateWorkspaceTerminals,
  deactivateWorkspaceTerminals,
  refreshWorkspaceAPIKey,
  setupWorkspaceAPIKey,
} from "@/app/_actions/workspace-actions";
import { QUERY_KEYS } from "@/lib/constants";
import { getAPICollectionLatestTransactions } from "@/app/_actions/transaction-actions";
import LoadingPage from "@/app/loading";
import Card from "@/components/base/custom-card";
import CardHeader from "@/components/base/card-header";
import {
  API_KEY_TERMINAL_TRANSACTION_COLUMNS,
  API_KEY_TRANSACTION_COLUMNS,
} from "@/lib/table-columns";
import TerminalsTable from "@/components/tables/terminal-tables";
import Loader from "@/components/ui/loader";
import PromptModal from "@/components/base/prompt-modal";

import TerminalConfigViewModal from "./TerminalConfigView";
import APIConfigViewModal from "./APIConfigView";

const APIIntegration = ({ workspaceID }) => {
  const queryClient = useQueryClient();
  const { onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenAddTerminal,
    onOpen: onAddTerminal,
    onClose: onCloseTerminal,
  } = useDisclosure();

  const { data, isLoading: isLoadingConfig } = useWorkspaceAPIKey(workspaceID);
  const { data: terminalData, isLoading: isLoadingTerminals } =
    useWorkspaceTerminals(workspaceID);
  const { data: workspaceResponse, isLoading: initLoading } =
    useWorkspaceInit(workspaceID);
  const permissions = workspaceResponse?.data;

  const [copiedKey, setCopiedKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unmaskAPIKey, setUnmaskAPIKey] = useState(false);
  const [openViewConfig, setOpenViewConfig] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClosePrompt = () => {
    onClose();
    setIsLoading(false);
    setCurrentActionIndex(null);
  };

  const thirtyDaysAgoDate = new Date();

  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  const start_date = formatDate(thirtyDaysAgoDate, "YYYY-MM-DD");
  const end_date = formatDate(new Date(), "YYYY-MM-DD");

  const configData = data?.data;
  const terminals = terminalData?.data?.terminals || []; //
  const hasTerminals = Boolean(configData?.hasTerminals);
  const terminalsConfigured = Boolean(terminals.length > 0);

  // HANDLE FETCH API COLLECTION LATEST TRANSACTION DATA
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.API_COLLECTIONS, workspaceID],
    mutationFn: (dateRange) =>
      getAPICollectionLatestTransactions(workspaceID, dateRange),
  });

  function copyToClipboard(key) {
    try {
      navigator?.clipboard?.writeText(key);
      setCopiedKey(key);
      notify({
        color: "success",
        title: "Success",
        description: "API key copied to clipboard!",
      });
    } catch (error) {
      notify({
        color: "danger",
        title: "Error",
        description: "Failed to copy API key!",
      });
      console.error("FAILED", error);
    }
  }

  async function handleGenerateAPIKey() {
    setIsLoading(true);

    if (!permissions?.update || !permissions?.delete) {
      notify({
        color: "danger",
        title: "Error",
        description: "Only admins are allowed to generate API keys!",
      });

      setIsLoading(false);
      handleClosePrompt();

      return;
    }

    // THERE CAN ONLY BE ONE API KEY
    if (configData?.apiKey) {
      notify({
        color: "danger",
        title: "Error",
        description: "You already have an API key for this workspace!",
      });

      return;
    }

    const response = await setupWorkspaceAPIKey(workspaceID);

    if (!response?.success) {
      notify({
        color: "danger",
        title: "Failed to generate API key",
        description: response?.message,
      });
      setIsLoading(false);

      return;
    }

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.WORKSPACE_API_KEY, workspaceID],
    });
    notify({
      color: "success",
      title: "Success",
      description: "API key has been generated",
    });
    setIsLoading(false);
    handleClosePrompt();

    return;
  }

  async function handleRefreshAPIKey() {
    setIsLoading(true);

    if (!permissions?.update || !permissions?.delete) {
      notify({
        color: "danger",
        title: "Error",
        description: "Only admins are allowed to refresh API keys.",
      });
      setIsLoading(false);
      handleClosePrompt();

      return;
    }

    if (!configData?.apiKey) {
      notify({
        color: "danger",
        title: "Error",
        description: "You have no API key.",
      });
      setIsLoading(false);

      return;
    }

    const response = await refreshWorkspaceAPIKey(workspaceID);

    if (!response?.success) {
      notify({
        color: "danger",
        title: "Error",
        description: "Failed to refresh API key.",
      });
      console.error(response?.message);
      setIsLoading(false);

      return;
    }

    notify({
      color: "success",
      title: "Success",
      description: "API key has been updated",
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.WORKSPACE_API_KEY, workspaceID],
    });
    setIsLoading(false);
    handleClosePrompt();

    return;
  }

  async function handleTerminalActivation() {
    setIsLoading(true);

    if (!permissions?.update || !permissions?.delete) {
      notify({
        color: "danger",
        title: "Error",
        description: "Only admins are allowed to activate terminals.",
      });
      setIsLoading(false);
      handleClosePrompt();

      return;
    }

    if (configData?.terminals || hasTerminals) {
      notify({
        color: "danger",
        title: "Error",
        description: "Terminals already activated for this workspace.",
      });
      setIsLoading(false);
      handleClosePrompt();

      return;
    }

    const response = await activateWorkspaceTerminals(workspaceID);

    if (!response?.success) {
      notify({
        color: "danger",
        title: "Error",
        description: response?.message,
      });
      setIsLoading(false);

      return;
    }

    queryClient.invalidateQueries();

    notify({
      color: "success",
      title: "Success",
      description: "Collection Terminals activated.",
    });
    setIsLoading(false);
    handleClosePrompt();

    return;
  }

  async function handleTerminalDeactivation() {
    setIsLoading(true);

    if (!permissions?.update || !permissions?.delete) {
      notify({
        color: "danger",
        title: "NOT ALLOWED",
        description: "Only admins are allowed to deactivate terminals.",
      });
      setIsLoading(false);
      handleClosePrompt();

      return;
    }

    const response = await deactivateWorkspaceTerminals(workspaceID);

    if (!response?.success) {
      notify({
        title: "Error",
        color: "danger",
        description: response?.message,
      });
      setIsLoading(false);

      return;
    }

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.WORKSPACE_API_KEY, workspaceID],
    });

    notify({
      title: "Success",
      color: "success",
      description: "Collection Terminals activated!",
    });
    setIsLoading(false);
    handleClosePrompt();

    return;
  }

  function handleTerminalStatus(actionKey) {
    if (hasTerminals && actionKey == "activate-terminals") {
      notify({
        title: "Error",
        color: "danger",
        description: "Terminals already activated for this workspace!",
      });
      handleClosePrompt();

      return;
    }

    // IF ACTIVE AND TERMINALS ARE CURRENTLY UPLOADED THEN NO DEACTIVATE
    if (
      hasTerminals &&
      terminalsConfigured &&
      actionKey == "deactivate-terminals"
    ) {
      notify({
        title: "Error",
        color: "danger",
        description: "Contact support to deactivate terminals!",
      });
      handleClosePrompt();

      return;
    }

    // ALLOW DEACTIVATION IF TERMINALS ARE NOT UPLOADED
    if (actionKey == "deactivate-terminals") {
      setCurrentActionIndex(3);

      return;
    }

    setCurrentActionIndex(2);
  }

  function handleManageTerminals(selectedKey) {
    if (!permissions?.update || !permissions?.delete) {
      notify({
        color: "danger",
        title: "NOT ALLOWED!",
        description: "You cannot perform this action",
      });
      handleClosePrompt();

      return;
    }

    if (selectedKey == "add-terminal") {
      onAddTerminal();

      return;
    }

    if (
      selectedKey == "activate-terminals" ||
      selectedKey == "deactivate-terminals"
    ) {
      handleTerminalStatus(selectedKey);

      return;
    }
  }

  useEffect(() => {
    let timeoutId;

    if (unmaskAPIKey) {
      timeoutId = setTimeout(() => {
        setUnmaskAPIKey(true);
      }, 1000 * 60);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [unmaskAPIKey]);

  useEffect(() => {
    // IF NO DATA IS FETCH THEN GET THE LATEST TRANSACTIONS
    if (!mutation.data) {
      mutation.mutateAsync({ start_date, end_date });
    }
  }, []);

  const LATEST_TRANSACTIONS = mutation.data?.data?.data || [];

  // ACTIONS FOR API COLLECTIONS
  const USER_PROMPT_ACTIONS = [
    {
      title: "Generate API Key",
      icon: PlusIcon,
      color: "primary",
      confirmText: "Generate",
      onConfirmAction: handleGenerateAPIKey,
      description: "Generate a new API key for this workspace",
      promptText: "Are you sure you want to generate a new API key?",
      promptDescription:
        "This API key will allow you channel funds to your workspace wallet from 3rd party applications and interfaces.",
    },
    {
      title: "Refresh API Key",
      icon: ArrowPathIcon,
      color: "warning",
      confirmText: "Refresh",
      onConfirmAction: handleRefreshAPIKey,
      description: "Refresh the API key for this workspace",
      promptText: "Are you sure you want to refresh this API key?",
      promptDescription:
        "By confirming this, your API key will be changed to a new one and you will not be able to use the old API anymore.",
    },
    {
      title: "Activate Terminals",
      icon: ComputerDesktopIcon,
      color: "primary",
      confirmText: "Activate",
      onConfirmAction: handleTerminalActivation,
      description: "Activate Terminals for this workspace",
      promptText: "Are you sure you want to activate Terminals?",
      promptDescription:
        "By confirming this, Terminals will be activated and you will be able to create and manage terminal transactions.",
    },
    {
      title: "Deactivate Terminals",
      icon: ComputerDesktopIcon,
      color: "primary",
      confirmText: "Deactivate",
      onConfirmAction: handleTerminalDeactivation,
      description: "Deactivate Terminals for this workspace",
      promptText: "Are you sure you want to deactivate Terminals?",
      promptDescription:
        "By confirming this, Terminals will be deactivated and you will NOT be able to create and manage terminal transactions.",
    },
    {
      title: "Delete API Key",
      icon: TrashIcon,
      color: "danger",
      confirmText: "Delete",
      onConfirmAction: () => {},
      description: "Delete the API key for this workspace",
      promptText: "Are you sure you want to delete this API key?",
      promptDescription:
        "This action is not reversible and will result in the non-operation of this key. Make sure you update any application making use of this Key.",
    },
  ];

  const iconClasses = "w-5 h-5 pointer-events-none flex-shrink-0";

  return isLoadingConfig ? (
    <LoadingPage />
  ) : (
    <>
      <div className="flex w-full flex-col gap-4">
        <Card className="">
          <div className="mb-8 flex justify-between">
            <CardHeader
              classNames={{
                titleClasses: "xl:text-2xl lg:text-xl font-bold",
                infoClasses: "!text-sm xl:text-base",
              }}
              infoText={
                "Use the API keys to collect payments to your workspace wallet."
              }
              title={"API Key"}
            />
            <Button
              endContent={<PlusIcon className="h-5 w-5" />}
              isDisabled={Boolean(configData?.apiKey)}
              onClick={() => setCurrentActionIndex(0)}
            >
              Generate Key
            </Button>
          </div>

          <Table removeWrapper aria-label="API KEY TABLE">
            <TableHeader>
              <TableColumn width={"30%"}>NAME</TableColumn>
              <TableColumn width={"65%"}>KEY</TableColumn>
              {/* <TableColumn>ENABLE</TableColumn> */}
              <TableColumn align="center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <div className="relative top-6 mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50 py-3">
                  <span className="flex gap-4 text-sm font-bold capitalize text-foreground/70">
                    You have no API keys generated
                  </span>
                </div>
              }
              isLoading={isLoadingConfig}
              loadingContent={
                <div className="relative top-6 mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50 py-3">
                  <span className="flex gap-4 text-sm font-bold capitalize text-primary">
                    <Spinner size="sm" /> Loading API key...
                  </span>
                </div>
              }
            >
              {configData && (
                <TableRow key="1">
                  <TableCell>{configData?.username}</TableCell>
                  <TableCell className="flex gap-1">
                    {configData?.apiKey ? (
                      <>
                        <span className="flex items-center gap-4 font-medium">
                          {unmaskAPIKey
                            ? configData?.apiKey
                            : maskString(configData?.apiKey, 0, 20)}
                        </span>
                        <Button
                          className={"h-max max-h-max max-w-max p-1"}
                          color="default"
                          size="sm"
                          variant="light"
                          onClick={() => setUnmaskAPIKey(!unmaskAPIKey)}
                        >
                          {unmaskAPIKey ? (
                            <EyeSlashIcon className="h-5 w-5 cursor-pointer text-primary" />
                          ) : (
                            <EyeIcon className="h-5 w-5 cursor-pointer text-primary" />
                          )}
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="relative -left-32 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50/0 py-3 text-xs text-foreground/70">
                          You have no API keys generated
                        </span>
                      </>
                    )}
                  </TableCell>

                  <TableCell>
                    {configData?.apiKey && (
                      <div className="flex items-center gap-4">
                        <Tooltip color="secondary" content="API Config">
                          <Cog6ToothIcon
                            className="h-5 w-5 cursor-pointer text-secondary hover:opacity-90"
                            onClick={() => setOpenViewConfig(true)}
                          />
                        </Tooltip>
                        <Tooltip
                          color="default"
                          content="Copy API Key to clipboard"
                        >
                          <Square2StackIcon
                            className={`h-6 w-6 cursor-pointer ${
                              copiedKey === configData?.apiKey
                                ? "text-primary"
                                : "text-gray-500"
                            } hover:text-primary`}
                            onClick={() => copyToClipboard(configData?.apiKey)}
                          />
                        </Tooltip>
                        <Tooltip color="primary" content="Refresh API Key">
                          <ArrowPathIcon
                            className="h-5 w-5 cursor-pointer text-primary hover:text-primary-300"
                            onClick={() => setCurrentActionIndex(1)}
                          />
                        </Tooltip>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <Card className="">
          <div className="mb-8 flex justify-between">
            <CardHeader
              classNames={{
                titleClasses: "xl:text-2xl lg:text-xl font-bold",
                infoClasses: "!text-sm xl:text-base",
              }}
              infoText={
                "Activate terminals to manage  multiple collection points like POS machines, tills, etc."
              }
              title={"Terminals"}
            />

            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <Dropdown backdrop="blur">
                <DropdownTrigger>
                  <Button
                    color="primary"
                    endContent={<WrenchScrewdriverIcon className="h-5 w-5" />}
                    isLoading={initLoading}
                    loadingText={"Please wait..."}
                  >
                    Manage
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Action event example"
                  onAction={(key) => handleManageTerminals(key)}
                >
                  {hasTerminals && (
                    <DropdownItem
                      key="add-terminal"
                      description="Add new terminals to workspace"
                      startContent={<PlusIcon className={cn(iconClasses)} />}
                    >
                      Add New Terminal
                    </DropdownItem>
                  )}

                  {/* <DropdownItem
                    key="workspace-settings"
                    href={`${dashboardRoute}/workspace-settings`}
                    description="Goto your workspace settings"
                    startContent={<Cog6ToothIcon className={cn(iconClasses)} />}
                  >
                    Workspace Settings
                  </DropdownItem> */}
                  <DropdownSection title={hasTerminals ? "" : "Danger zone"}>
                    {!hasTerminals ? (
                      <DropdownItem
                        key="activate-terminals"
                        classNames={{
                          shortcut: "group-hover:text-white",
                        }}
                        color="primary"
                        description="Activate collection terminals"
                        shortcut="⌘⇧A"
                        startContent={
                          <ComputerDesktopIcon
                            className={cn(
                              iconClasses,
                              "group-hover:text-white font-bold group-hover:border-white",
                            )}
                          />
                        }
                        variant="solid"
                      >
                        Activate Terminals
                      </DropdownItem>
                    ) : (
                      <DropdownItem
                        key="deactivate-terminals"
                        className="text-danger"
                        classNames={{
                          shortcut:
                            "group-hover:text-white font-bold group-hover:border-white",
                        }}
                        color="danger"
                        description="Deactivate collection terminals"
                        href="/support"
                        shortcut="⌘⇧D"
                        startContent={
                          <TrashIcon
                            className={cn(
                              iconClasses,
                              "text-danger group-hover:text-white",
                            )}
                          />
                        }
                      >
                        Deactivate Terminals
                      </DropdownItem>
                    )}
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
              <Tooltip
                classNames={{
                  content: "max-w-96 text-sm leading-6 p-3",
                }}
                color="secondary"
                content="Show configured terminals"
              >
                <Button
                  color={"secondary"}
                  variant="flat"
                  onPress={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <EyeSlashIcon className="h-5 w-5 text-orange-600" />
                  ) : (
                    <ComputerDesktopIcon className="h-5 w-5 text-orange-600" />
                  )}
                </Button>
              </Tooltip>
            </div>
          </div>

          <AnimatePresence>
            <motion.div
              animate={{
                height: isExpanded ? "auto" : 0,
                opacity: isExpanded ? 1 : 0,
              }}
              initial={{ height: 0, opacity: 0 }}
            >
              {hasTerminals && terminalsConfigured ? (
                <TerminalsTable
                  removeWrapper
                  isLoading={isLoadingTerminals}
                  rows={terminals}
                />
              ) : (
                <div className="-mt-4 flex h-full min-h-32 flex-1 items-center justify-center rounded-2xl bg-primary-50 text-sm font-medium dark:bg-foreground/5">
                  {initLoading || isLoadingTerminals || isLoadingConfig ? (
                    <Loader
                      classNames={{
                        wrapper: "bg-foreground-200/50 rounded-xl h-full",
                      }}
                      loadingText={"Getting configuration..."}
                      size={60}
                    />
                  ) : (
                    <Tooltip
                      classNames={{
                        content: "max-w-96 text-sm leading-6 p-3",
                      }}
                      content="Terminals are like a POS/Till machines that can be used to collect payments from your customers."
                    >
                      <Button
                        className={
                          "flex-grow min-h-auto max-h-auto min-h-32 w-full flex-1 font-medium text-primary-600"
                        }
                        isDisabled={isLoadingConfig || mutation?.isPending}
                        isLoading={isLoadingConfig || mutation?.isPending}
                        loadingText={"Getting Configuration..."}
                        startContent={
                          terminalsConfigured && hasTerminals ? (
                            <PlusIcon className={cn(iconClasses)} />
                          ) : (
                            <ComputerDesktopIcon className={cn(iconClasses)} />
                          )
                        }
                        variant="light"
                        onClick={
                          terminalsConfigured && hasTerminals
                            ? onAddTerminal
                            : handleTerminalStatus
                        }
                      >
                        {terminalsConfigured && hasTerminals
                          ? "Add Terminals"
                          : "Activate Terminals"}
                      </Button>
                    </Tooltip>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>

        <Card>
          <div className="flex w-full items-center justify-between gap-4">
            <CardHeader
              className={"mb-4"}
              infoText={
                "Transactions made to your workspace wallet in the last 30days."
              }
              title={"Recent Transactions"}
            />
          </div>
          <CustomTable
            // removeWrapper
            classNames={{ wrapper: "shadow-none px-0 mx-0" }}
            columns={
              hasTerminals && terminalsConfigured
                ? API_KEY_TERMINAL_TRANSACTION_COLUMNS
                : API_KEY_TRANSACTION_COLUMNS
            }
            isLoading={mutation.isPending}
            rows={LATEST_TRANSACTIONS}
          />
        </Card>
      </div>

      <APIConfigViewModal
        configData={configData}
        isLoading={isLoadingConfig}
        isOpen={openViewConfig}
        onClose={() => {
          setOpenViewConfig(false);
          onClose();
        }}
      />

      <TerminalConfigViewModal
        isOpen={isOpenAddTerminal}
        workspaceID={workspaceID}
        onClose={onCloseTerminal}
      />

      {/* DELETE PROMPT MODAL */}
      <PromptModal
        confirmText={
          USER_PROMPT_ACTIONS[currentActionIndex]?.confirmText || "Confirm"
        }
        isDisabled={isLoading}
        isDismissable={false}
        isLoading={isLoading}
        isOpen={currentActionIndex !== null}
        title={USER_PROMPT_ACTIONS[currentActionIndex]?.title}
        onClose={handleClosePrompt}
        onConfirm={USER_PROMPT_ACTIONS[currentActionIndex]?.onConfirmAction}
        onOpen={onOpen}
      >
        <p className="-mt-4 text-sm leading-6 text-foreground/70">
          <strong>{USER_PROMPT_ACTIONS[currentActionIndex]?.promptText}</strong>{" "}
          <br />
          {USER_PROMPT_ACTIONS[currentActionIndex]?.promptDescription}
        </p>
      </PromptModal>
    </>
  );
};

export default APIIntegration;
