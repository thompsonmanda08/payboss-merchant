"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  Square2StackIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { formatDate, maskString, notify } from "@/lib/utils";
import PromptModal from "@/components/base/prompt";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import CustomTable from "@/components/tables/table";
import { useWorkspaceAPIKey } from "@/hooks/useQueryHooks";
import {
  refreshWorkspaceAPIKey,
  setupWorkspaceAPIKey,
} from "@/app/_actions/workspace-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { getBillsLatestTransactions } from "@/app/_actions/transaction-actions";
import LoadingPage from "@/app/loading";
import Card from "@/components/base/card";
import CardHeader from "@/components/base/card-header";
import BillPaymentAPIConfigModal from "./bill-api-config-modal";

import { BILLS_TRANSACTION_COLUMNS } from "@/lib/table-columns";

const BillPayments = ({ workspaceID }) => {
  const queryClient = useQueryClient();
  const { data: apiKeyResponse, isFetching } = useWorkspaceAPIKey(workspaceID);
  const [apiKey, setApiKey] = useState([]);
  const [apiKeyData, setApiKeyData] = useState([]);
  const { onOpen, onClose } = useDisclosure();
  const [copiedKey, setCopiedKey] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unmaskAPIKey, setUnmaskAPIKey] = useState(false);
  const [openViewConfig, setOpenViewConfig] = useState(false);

  const thirtyDaysAgoDate = new Date();
  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  const start_date = formatDate(thirtyDaysAgoDate, "YYYY-MM-DD");
  const end_date = formatDate(new Date(), "YYYY-MM-DD");

  // HANDLE FETCH API COLLECTION LATEST TRANSACTION DATA
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.API_COLLECTIONS, workspaceID],
    mutationFn: (dateRange) =>
      getBillsLatestTransactions(workspaceID, dateRange),
  });

  const API = useMemo(() => {
    if (!apiKeyResponse?.success) return [];
    return {
      key: apiKeyResponse?.data?.apiKey,
      username: apiKeyResponse?.data?.username,
    };
  }, [apiKeyResponse]);

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    notify({
      color: "success",
      title: "Success",
      description: "Copied to clipboard",
    });
  };

  async function handleUserAction() {
    setIsLoading(true);
    // THERE CAN ONLY BE ONE API KEY
    if (apiKey?.key && isNew) {
      notify({
        color: "danger",
        title: "Failed to generate API key!",
        description: "You already have an API key for this workspace.",
      });
      return;
    }

    // HIT THE BACKEND TO UPDATE THE API KEY
    if (isRefresh && apiKey?.key) {
      const response = await refreshWorkspaceAPIKey(workspaceID);

      if (!response?.success) {
        notify({
          color: "danger",
          title: "Failed to refresh API key!",
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
        description: "API key has been updated!",
      });
      setIsRefresh(false);
      setIsLoading(false);
      return;
    }

    //  GENERATE BILL PAYMENTS API KEY
    const response = await setupWorkspaceAPIKey(workspaceID);

    if (!response?.success) {
      notify({
        color: "danger",
        title: "Failed to generate API key!",
        description: response?.message,
      });
      setIsLoading(false);
      return;
    }

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.WORKSPACE_API_KEY, workspaceID],
    });

    setApiKeyData(response?.data);
    setApiKey(response?.data?.API);

    notify({
      color: "success",
      title: "Success",
      description: "API key has been generated!",
    });
    setIsLoading(false);
    setIsNew(false);

    return;
  }

  useEffect(() => {
    if (API) {
      setApiKeyData(apiKeyResponse?.data);
      setApiKey(API);
    }
  }, [API]);

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

  return isFetching ? (
    <LoadingPage />
  ) : (
    <>
      <div className="flex w-full flex-col gap-4">
        <Card className="">
          <div className="mb-8 flex justify-between">
            <CardHeader
              title={"Bills API Key"}
              infoText={
                "Use the API keys to collect payments to your workspace wallet."
              }
              classNames={{
                titleClasses: "xl:text-2xl lg:text-xl font-bold",
                infoClasses: "!text-sm xl:text-base",
              }}
            />
            <Button
              isDisabled={Boolean(apiKey?.key)}
              endContent={<PlusIcon className="h-5 w-5" />}
              onClick={() => setIsNew(true)}
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
              isLoading={isFetching}
              loadingContent={
                <div className="relative top-6 mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50 py-3">
                  <span className="flex gap-4 text-sm font-bold capitalize text-primary">
                    <Spinner size="sm" /> Loading API key...
                  </span>
                </div>
              }
              emptyContent={
                <div className="relative top-6 mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50 py-3">
                  <span className="flex gap-4 text-sm font-bold capitalize text-foreground/70">
                    You have no API keys generated
                  </span>
                </div>
              }
            >
              {apiKey && (
                <TableRow key="1">
                  <TableCell>{apiKey?.username}</TableCell>
                  <TableCell className="flex gap-1">
                    {apiKey.key ? (
                      <>
                        <span className="flex items-center gap-4 font-medium">
                          {unmaskAPIKey
                            ? apiKey.key
                            : maskString(apiKey.key, 0, 20)}
                        </span>
                        <Button
                          className={"h-max max-h-max max-w-max p-1"}
                          color="default"
                          variant="light"
                          size="sm"
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
                  {/* FEATURE TO ENABLE AND DISBALE API KEY */}
                  {/* <TableCell>
                    <Switch
                      checked={apiKey?.enabled}
                      startContent={<XMarkIcon />}
                      endContent={<CheckIcon />}
                      onChange={() =>
                        setApiKey((prev) => ({
                          ...prev,
                          enabled: !apiKey?.enabled,
                        }))
                      }
                    />
                  </TableCell> */}
                  <TableCell>
                    {apiKey.key && (
                      <>
                        <div className="flex items-center gap-4">
                          <Tooltip color="secondary" content="API Config">
                            <Cog6ToothIcon
                              onClick={() => setOpenViewConfig(true)}
                              className="h-5 w-5 cursor-pointer text-secondary hover:opacity-90"
                            />
                          </Tooltip>
                          <Tooltip
                            color="default"
                            content="Copy API Key to clipboard"
                          >
                            <Square2StackIcon
                              className={`h-6 w-6 cursor-pointer ${
                                copiedKey === apiKey?.key
                                  ? "text-primary"
                                  : "text-gray-500"
                              } hover:text-primary`}
                              onClick={() => copyToClipboard(apiKey?.key)}
                            />
                          </Tooltip>
                          <Tooltip color="primary" content="Refresh API Key">
                            <ArrowPathIcon
                              onClick={() => setIsRefresh(true)}
                              className="h-5 w-5 cursor-pointer text-primary hover:text-primary-300"
                            />
                          </Tooltip>
                          {/*  FEATURE TO DELETE AN API KEY */}
                          {/* <Tooltip color="danger" content="Delete API Key">
                          <TrashIcon
                            onClick={() => setIsDelete(true)}
                            className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-300"
                          />
                        </Tooltip> */}
                        </div>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <Card>
          <div className="flex w-full items-center justify-between gap-4">
            <CardHeader
              className={"mb-4"}
              title={"Recent Bill Transactions"}
              infoText={
                "Transactions made to your workspace wallet in the last 30days."
              }
            />
          </div>
          <CustomTable
            // removeWrapper
            classNames={{ wrapper: "shadow-none px-0 mx-0" }}
            columns={BILLS_TRANSACTION_COLUMNS}
            rows={LATEST_TRANSACTIONS}
            isLoading={mutation.isPending}
          />
        </Card>
      </div>

      <BillPaymentAPIConfigModal
        configData={apiKeyData}
        isLoading={isFetching}
        isOpen={openViewConfig}
        onClose={() => {
          setOpenViewConfig(false);
          onClose();
        }}
      />

      {/* DELETE PROMPTS */}
      <PromptModal
        isOpen={isNew || isDelete || isRefresh}
        onOpen={onOpen}
        onClose={() => {
          onClose();
          setIsNew(false);
          setIsDelete(false);
          setIsRefresh(false);
        }}
        title={
          isNew
            ? "Generate New API Key"
            : isDelete
            ? "Delete API Key"
            : isRefresh
            ? "Refresh API Key"
            : "API Keys"
        }
        onConfirm={handleUserAction}
        confirmText={
          isNew
            ? "Generate"
            : isDelete
            ? "Delete"
            : isRefresh
            ? "Refresh"
            : "Confirm"
        }
        isDisabled={isLoading}
        isLoading={isLoading}
        isDismissable={false}
      >
        {isDelete ? (
          <>
            <p className="-mt-4 text-sm leading-6 text-foreground/70">
              <strong>Are you sure you want to delete this API Key?</strong>{" "}
              <br />
              This action is not reversible and will result in the non-operation
              of this key. Make sure you update any application making use of
              this Key.
            </p>
          </>
        ) : isNew ? (
          <p className="-mt-4 text-sm leading-6 text-foreground/70">
            <strong>Are you sure you want to generate a new API key?</strong>
            <br />
            This API key will allow you channel funds to your workspace wallet
            from 3rd party applications and interfaces.
          </p>
        ) : (
          <p className="-mt-4 text-sm leading-6 text-foreground/70">
            <strong>Are you sure you want to refresh this API key?</strong>
            <br />
            By confirming this, your API key will be changed to a new one and
            you will not be able to use the old API anymore.
          </p>
        )}
      </PromptModal>
    </>
  );
};

export default BillPayments;
