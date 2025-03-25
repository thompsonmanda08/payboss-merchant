import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-field";
import {
  capitalize,
  cn,
  formatCurrency,
  formatDate,
  notify,
} from "@/lib/utils";
import { QUERY_KEYS, TASK_TYPE, WORKSPACE_TYPES } from "@/lib/constants";
import { formatActivityData } from "@/lib/utils";
import PromptModal from "@/components/base/Prompt";
import { Chip, Tooltip, useDisclosure } from "@heroui/react";
import { uploadPOPDocument } from "@/app/_actions/pocketbase-actions";
import {
  approveWalletPrefund,
  submitPOP,
} from "@/app/_actions/workspace-actions";
import DateSelectField from "@/components/ui/date-select-field";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import {
  useWalletPrefundHistory,
  useWorkspaceInit,
} from "@/hooks/useQueryHooks";
import Card from "@/components/base/Card";
import Balance from "@/components/base/Balance";
import StatusMessage from "@/components/base/status-message";
import CardHeader from "@/components/base/CardHeader";
import EmptyLogs from "@/components/base/EmptyLogs";
import UploadField from "@/components/base/FileDropZone";
import { useState } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/base/custom-modal";
import useWalletStore from "@/context/wallet-store";

function Wallet({
  workspaceID,
  workspaceName,
  balance,
  hideHistory,
  removeWrapper,
}) {
  const queryClient = useQueryClient();
  const {
    setOpenAttachmentModal,
    openAttachmentModal,
    setSelectedPrefund,
    isLoading,
    setIsLoading,
    walletLoading,
    setWalletLoading,
    formData,
    setFormData,
    updateFormData,
  } = useWalletStore();
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();

  const { data: workspaceResponse, isLoading: initLoading } =
    useWorkspaceInit(workspaceID);
  const workspaceUserRole = workspaceResponse?.data;
  const workspaceType = workspaceResponse?.data?.workspaceType;

  const [error, setError] = useState({
    status: "",
    message: "",
  });

  const isDisabled =
    !formData?.amount ||
    formData?.amount < 0 ||
    !formData?.date_of_deposit ||
    !formData?.bank_rrn ||
    !formData?.url ||
    isLoading ||
    walletLoading;

  async function handleFileUpload(file, recordID) {
    setWalletLoading(true);
    setError({ message: "", status: "" });

    let response = await uploadPOPDocument(file, recordID);

    if (response?.success) {
      setWalletLoading(false);
      notify({
        title: "Success",
        color: "success",
        description: response?.message,
      });
      return response?.data;
    }

    setWalletLoading(false);
    notify({
      title: "Error",
      color: "danger",
      description: response?.message,
    });
    return null;
  }

  async function handleWalletPreFund() {
    setIsLoading(true);

    if (!formData.url) {
      notify({
        title: "Error",
        color: "danger",
        description: "Attach proof of payment!",
      });
      setError({
        message: "Verify that you have attached a proof of payment!",
        status: true,
      });
      setIsLoading(false);
      onClose();
      return;
    }

    if (!formData.bank_rrn) {
      notify({
        title: "Error",
        color: "danger",
        description: "Enter a valid bank reference number!",
      });
      setError({
        message: "Verify that you have entered a valid bank reference number!",
        status: true,
      });
      setIsLoading(false);
      onClose();
      return;
    }

    if (!formData.date_of_deposit) {
      notify({
        title: "Error",
        color: "danger",
        description: "Enter a valid date of deposit!",
      });
      setError({
        message: "Verify that you have entered a valid date of deposit!",
        status: true,
      });
      setIsLoading(false);
      onClose();
      return;
    }

    if (!formData.name) {
      notify({
        title: "Error",
        color: "danger",
        description: "Enter a valid prefund name!",
      });
      setError({
        message: "Verify that you have entered a valid prefund name!",
        status: true,
      });
      setIsLoading(false);
      onClose();
      return;
    }

    if (
      !formData.amount ||
      formData.amount < 0 ||
      !formData.amount.toString().length > 0
    ) {
      notify({
        title: "Invalid Amount",
        color: "danger",
        description: "Verify that you have entered a valid amount!",
      });
      setError({
        message: "Verify that you have entered a valid amount!",
        status: true,
      });
      setIsLoading(false);
      onClose();
      return;
    }

    if (workspaceType == WORKSPACE_TYPES[0]?.ID) {
      notify({
        title: "Error",
        color: "danger",
        description: "You are not allowed to prefund your collections wallet!",
      });
      setError({
        message: "You are not allowed to prefund your collections wallet!",
        status: true,
      });
      setIsLoading(false);
      return;
    }

    const response = await submitPOP(formData, workspaceID);

    if (response?.success) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLET_HISTORY, workspaceID],
      });
      notify({
        title: "Success",
        color: "success",
        description: "Proof of payment submitted successfully.",
      });
      setIsLoading(false);
      setFormData({
        amount: "",
        bank_rrn: "",
        date_of_deposit: "",
        url: "",
        name: "",
      });
      onClose();
      setIsLoading(false);
      return;
    }

    setError({
      status: true,
      message: response?.message,
    });
    notify({
      title: "Error",
      color: "danger",
      description: response?.message,
    });
    setIsLoading(false);
    return;
  }

  return (
    <>
      <section role="wallet-section" className="flex w-full items-center">
        <Card
          className={cn(
            "flex w-full flex-col items-start justify-center gap-8 md:flex-row",
            {
              "items-center justify-center gap-x-0": hideHistory,
              "rounded-none border-none p-0 shadow-none": removeWrapper,
            }
          )}
        >
          {/* ONLY THE INITIATOR CAN SEE THIS FORM IN DISBURSEMENT WORKSPACE */}
          {workspaceUserRole?.can_initiate &&
            workspaceType !== WORKSPACE_TYPES[0]?.ID && (
              <div
                className={cn("flex w-full max-w-md flex-1 flex-col gap-4", {
                  "mx-auto": hideHistory,
                })}
              >
                <Balance
                  title={`${workspaceName} Wallet Balance`}
                  amount={balance}
                  isLandscape
                />
                <div
                  className={cn(
                    "flex w-full flex-col gap-y-4 p-[25px] lg:border lg:border-y-0 lg:border-l-0 lg:border-border",
                    {
                      "lg:border-r-0": hideHistory,
                    }
                  )}
                >
                  <div role="pre-fund-wallet" className="flex flex-col gap-4">
                    <p className="text-[14px] font-semibold text-foreground/80">
                      Deposit funds into your PayBoss Wallet
                    </p>

                    <Input
                      label="Amount"
                      type="number"
                      required
                      value={formData?.amount}
                      placeholder="Enter an amount"
                      onChange={(e) =>
                        updateFormData({ amount: e.target.value })
                      }
                      name="amount"
                    />

                    <Input
                      placeholder="Bank Reference No. "
                      required
                      label="Reference Number"
                      value={formData.bank_rrn}
                      onChange={(e) =>
                        updateFormData({ bank_rrn: e.target.value })
                      }
                      name="bank_rrn"
                    />
                    <DateSelectField
                      label={"Date of Deposit"}
                      className="max-w-md"
                      required
                      description={"Date the funds were deposited"}
                      defaultValue={formData?.date_of_deposit}
                      value={
                        formData?.date_of_deposit?.split("").length > 9
                          ? formData?.date_of_deposit
                          : undefined
                      }
                      maxValue={today(getLocalTimeZone())}
                      labelPlacement={"outside"}
                      onChange={(date) => {
                        updateFormData({
                          date_of_deposit: formatDate(date, "YYYY-MM-DD"),
                        });
                      }}
                    />

                    <UploadField
                      label="Proof of Payment"
                      isLoading={walletLoading}
                      required
                      handleFile={async (file) => {
                        const file_record = await handleFileUpload(
                          file,
                          formData.file?.file_record_id
                        );
                        updateFormData({ url: file_record?.file_url });
                      }}
                      acceptedFiles={{
                        "application/pdf": [],
                        "image/png": [],
                        "image/jpeg": [],
                        "image/jpg": [],
                      }}
                    />
                    {error.status && (
                      <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
                        <StatusMessage
                          className
                          error={error.status}
                          message={error.message}
                        />
                      </div>
                    )}

                    <Button
                      isDisabled={isDisabled}
                      isLoading={isLoading}
                      type="button"
                      onClick={onOpen}
                    >
                      Deposit
                    </Button>
                  </div>
                </div>
              </div>
            )}
          {!hideHistory && (
            <div className="flex h-full max-h-[600px] overflow-y-auto no-scrollbar flex-[2] flex-grow flex-col items-start gap-8">
              <CardHeader
                title="Wallet Transaction History"
                infoText={
                  "Transaction history logs for every activity on the wallet"
                }
              />
              <WalletTransactionHistory
                workspaceID={workspaceID}
                setOpenAttachmentModal={setOpenAttachmentModal}
                openAttachmentModal={openAttachmentModal}
                setSelectedPrefund={setSelectedPrefund}
              />
            </div>
          )}
        </Card>

        <PromptModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onClose={onClose}
          onConfirm={handleWalletPreFund}
          title="Confirm POP Submission"
          confirmText="Confirm"
          isDisabled={isLoading}
          isLoading={isLoading}
        >
          <p className="-mt-4 mb-4 text-[15px] leading-7 text-foreground/80">
            Your wallet will be credited with the amount{" "}
            <strong>{formatCurrency(formData?.amount)}</strong> of bank
            reference number
            <code className="mx-1 mb-2 rounded-md bg-primary/10 p-1 px-2 font-bold text-primary-700">
              {formData?.bank_rrn}
            </code>
            as soon as your transaction is approved and reviewed.
          </p>

          <Input
            label="Prefund Name/Label"
            value={formData?.name}
            placeholder="Enter a prefund name"
            onChange={(e) => updateFormData({ name: e.target.value })}
            name="name"
          />
        </PromptModal>
      </section>
      <AttachmentModal />
    </>
  );
}

export function WalletTransactionHistory({
  workspaceID,
  limit,
  transactionData,
  isLoading,
  className,
  classNames,
}) {
  const queryClient = useQueryClient();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const {
    setOpenAttachmentModal,
    setSelectedPrefund,
    selectedPrefund,
    prefundApproval,
    isLoading: loadingPrefund,
    setIsLoading,
    updatePrefundApproval,
  } = useWalletStore();

  const { data: workspaceResponse, isLoading: initLoading } =
    useWorkspaceInit(workspaceID);

  const workspaceUserRole = workspaceResponse?.data;

  const { data: walletHistoryResponse, isLoading: loadingWalletHistory } =
    useWalletPrefundHistory(workspaceID);

  const walletData = transactionData || walletHistoryResponse?.data?.data || [];

  const walletHistory = walletData.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const data = [
    {
      title: "Wallet Transactions",
      data: limit ? walletHistory.slice(0, limit) : walletHistory,
    },
  ];

  const reverseSort = false;
  const formattedActivityData = formatActivityData(data, reverseSort);

  const isFetching = isLoading || loadingWalletHistory;

  function handleClosePrompt() {
    setOpenAttachmentModal(false);
    setSelectedPrefund(null);
    updatePrefundApproval({
      action: "",
      remarks: "",
    });
    onClose();
  }

  function approve(item) {
    setSelectedPrefund(item);
    updatePrefundApproval({
      action: "approved",
      remarks: "",
    });

    // Only open prompt if the prefund action and item are set
    onOpen();
  }

  function reject(item) {
    setSelectedPrefund(item);
    updatePrefundApproval({
      action: "rejected",
      remarks: "",
    });

    // Only open prompt if the prefund action and item are set
    onOpen();
  }

  // PREFUND APPROVAL STATUS SUBMISSION
  async function handleApproval() {
    setIsLoading(true);

    if (!prefundApproval.remarks) {
      setIsLoading(false);
      notify({
        title: "Error",
        color: "danger",
        description: "Review reason is required.",
      });
      return;
    }

    if (!prefundApproval?.action) {
      setIsLoading(false);
      notify({
        title: "Error",
        color: "danger",
        description: "Action is required!",
      });
      return;
    }

    const response = await approveWalletPrefund(
      prefundApproval,
      selectedPrefund?.ID,
      workspaceID
    );

    if (!response?.success) {
      setIsLoading(false);
      notify({
        title: "Error",
        color: "danger",
        description: "Failed to submit approval action!",
      });
      return;
    }

    // Invalidate all wallet prefund and transactions
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.WALLET_HISTORY, workspaceID],
    });

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.ACTIVE_PREFUND, workspaceID],
    });
    setIsLoading(false);
    notify({
      title: "Success",
      color: "success",
      description: "Submitted successfully!",
    });
    handleClosePrompt();
  }

  const { wrapper } = classNames || "";

  if (isFetching) {
    return <WalletLHistoryLoader />;
  }

  return (
    <>
      <div
        className={cn(
          "my-auto flex min-h-96 flex-col py-4 w-full",
          {
            "my-0": formattedActivityData?.length > 0,
          },
          className,
          wrapper
        )}
      >
        {formattedActivityData.length > 0 ? (
          formattedActivityData.map((items, index) => {
            // TRANSACTIONS GROUPED BY DATE
            return (
              <div key={`${index}${items?.title}`} className="pr-6">
                <p className="text-base font-semibold text-slate-600">
                  {items.title}
                </p>
                {items?.data?.map((item, itemIndex) => {
                  // EACH TRANSACTION ITEM
                  const isGreen =
                    (item?.status == "success" || item?.status == "approved") &&
                    item?.type == "credit" &&
                    item?.isPrefunded;

                  const isYellow = item?.status == "pending";

                  const isRed =
                    item?.status == "rejected" || item?.type == "debit";

                  const isGray = item?.isExpired;

                  return (
                    <div
                      className="flex flex-col gap-y-4 py-2"
                      key={`${itemIndex}${index}${item?.created_by}`}
                    >
                      <div className="flex items-start space-x-4">
                        <LogTaskType
                          type={item?.type}
                          classNames={{ wrapper: "" }}
                        />

                        <div className="w-full items-start">
                          <div className="flex w-full justify-between">
                            <p className="text-xs text-foreground/70">
                              <span className="text-sm font-medium capitalize leading-6">
                                {item?.created_by || item?.remarks}
                              </span>{" "}
                              <br />
                              {item?.content}
                              <span className="ml-2 font-normal leading-4 text-slate-400">
                                ...
                                {formatDistance(
                                  new Date(item?.created_at),
                                  new Date()
                                )}{" "}
                                ago
                              </span>
                            </p>
                            <div className="flex max-w-max flex-col items-end">
                              <div className="flex gap-2">
                                <Tooltip
                                  placement="left"
                                  classNames={{
                                    content: cn(
                                      "text-nowrap bg-primary text-white",
                                      {
                                        "bg-success/10 text-green-600": isGreen,
                                        "bg-secondary/10 text-secondary":
                                          isYellow,
                                        "bg-danger/10 text-danger": isRed,
                                      }
                                    ),
                                  }}
                                  content={`${capitalize(item?.status)}: ${
                                    item?.isPrefunded && !item?.isExpired
                                      ? "Active funds"
                                      : item?.isExpired
                                      ? "Expired funds"
                                      : item?.status == "approved"
                                      ? "Awaiting fund activation"
                                      : item?.status == "rejected"
                                      ? item?.remarks
                                      : "Awaiting admin action"
                                  }`}
                                >
                                  <Chip
                                    classNames={{
                                      base: cn(
                                        "p-2 py-4 cursor-pointer rounded-md bg-primary/10 text-primary-700",

                                        {
                                          "bg-success/10 text-green-500":
                                            isGreen,
                                          "bg-secondary/10 text-secondary":
                                            isYellow,
                                          "bg-danger/10 text-danger": isRed,
                                        }
                                      ),
                                      content: cn("text-base font-bold", {}),
                                    }}
                                    variant="flat"
                                  >
                                    {formatCurrency(item?.amount)}
                                  </Chip>
                                </Tooltip>
                                {item?.type?.toLowerCase() == "deposit" && (
                                  <Tooltip
                                    placement="top"
                                    content={"View Proof of payment"}
                                  >
                                    <span
                                      onClick={() => {
                                        setSelectedPrefund(item);
                                        setOpenAttachmentModal(true);
                                      }}
                                      className="'h-6 hover:bg-foreground-300' cursor-pointer self-start rounded-md bg-foreground-200 p-[6px] text-lg font-bold text-slate-600 active:opacity-50"
                                    >
                                      <PaperClipIcon className="aspect-square w-5" />
                                    </span>
                                  </Tooltip>
                                )}
                              </div>

                              {/* TRANSACTION APPROVAL BUTTON COMPONENTS} */}
                              {item?.status == "pending" &&
                                workspaceUserRole?.can_approve && (
                                  <div className="mb-4 ml-auto mt-2 flex max-w-max gap-2">
                                    <Button
                                      size="sm"
                                      color={"danger"}
                                      className={"h-8"}
                                      onClick={() => reject(item)}
                                    >
                                      Reject
                                    </Button>
                                    <Button
                                      size="sm"
                                      className={"h-8"}
                                      onClick={() => approve(item)}
                                    >
                                      Approve
                                    </Button>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {index != formattedActivityData?.length - 1 && (
                  <hr className="my-4 h-px border-0 bg-foreground-100"></hr>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-1 items-center rounded-lg bg-slate-50 text-sm font-semibold text-slate-600 dark:bg-foreground/5">
            <EmptyLogs
              className={"my-auto"}
              title={"No Wallet Transactions"}
              subTitle={"You have not made any wallet transactions yet."}
            />
          </div>
        )}
      </div>

      {/* **************************************************** */}
      <ApprovalStatusPrompt
        onOpen={onOpen}
        isOpen={isOpen}
        isLoading={loadingPrefund}
        handleApproval={handleApproval}
        prefundApproval={prefundApproval}
        handleClosePrompt={handleClosePrompt}
        selectedPrefund={selectedPrefund}
        updatePrefundApproval={updatePrefundApproval}
      />
      {/* **************************************************** */}
      {/* {pathname != `${dashboardRoute}/workspace-settings` && (
        <AttachmentModal />
      )} */}
      {/* **************************************************** */}
    </>
  );
}

export function LogTaskType({ type, classNames }) {
  const taskType = TASK_TYPE[type];

  const { wrapper, icon, text } = classNames || "";

  if (taskType) {
    return (
      <div
        className={cn(
          `inline-flex h-8 w-fit items-center justify-center gap-2 text-nowrap rounded-[4px]  px-2 py-1.5`,
          `cursor-pointer px-4`,
          `bg-${taskType?.color}/10`,
          wrapper
        )}
      >
        <span className={cn(`text-${taskType?.color}`, icon)}>
          {taskType?.icon}
        </span>
        <p
          className={cn(
            `text-sm font-medium leading-6`,
            `text-${taskType?.color}`,
            text
          )}
        >
          {taskType?.label}
        </p>
      </div>
    );
  }
  return null;
}

export function AttachmentModal() {
  const {
    setOpenAttachmentModal,
    setSelectedPrefund,
    openAttachmentModal,
    selectedPrefund,
  } = useWalletStore();

  return (
    <Modal
      show={openAttachmentModal}
      onClose={() => {
        setOpenAttachmentModal(false);
        setSelectedPrefund(null);
      }}
      cancelText="Close"
      isDismissible={true}
      title={`${capitalize(selectedPrefund?.name)} - Proof of payment document`}
      infoText="Ensure the document aligns with the submitted details"
      width={1200}
      height={800}
      removeCallToAction
    >
      {selectedPrefund?.url && (
        <iframe
          src={selectedPrefund?.url}
          title={selectedPrefund?.name}
          className="h-full min-h-[60vh] w-full flex-1"
          style={{ border: "none" }}
        />
      )}
    </Modal>
  );
}

export function WalletLHistoryLoader({ limit }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <Skeleton className="mt-6 h-8 max-w-xs" />
      {Array.from({ length: limit || 5 }).map((_, index) => (
        <div key={index} className="flex justify-between">
          <div className="flex w-full gap-4">
            <Skeleton className="h-8 w-24" />
            <div className="flex w-full flex-col gap-2 pr-8">
              <Skeleton className="h-8 w-full max-w-60" />
              <Skeleton className="h-4 w-full max-w-lg" />
            </div>
          </div>
          <div className="flex w-fit max-w-xs flex-col items-end gap-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ApprovalStatusPrompt({
  isOpen,
  onOpen,
  handleClosePrompt,
  handleApproval,
  isLoading,
  prefundApproval,
  selectedPrefund,
  updatePrefundApproval,
}) {
  return (
    <PromptModal
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={handleClosePrompt}
      title="Approve Wallet Deposit Transaction"
      onConfirm={handleApproval}
      confirmText="Confirm"
      isDisabled={isLoading}
      isLoading={isLoading}
      isDismissable={false}
    >
      <p className="-mt-4 mb-2 text-sm leading-6 text-foreground/70">
        Are you sure you want to <strong>{prefundApproval?.action}</strong> the
        wallet transaction of{" "}
        <code className="rounded-md bg-primary/10 p-1 px-2 font-semibold text-primary-700">
          {`(${formatCurrency(selectedPrefund?.amount || "00")})`}
        </code>{" "}
      </p>
      <Input
        label="Review/Remarks"
        placeholder="Enter a review remark"
        isDisabled={isLoading}
        onChange={(e) =>
          updatePrefundApproval({
            remarks: e.target.value,
          })
        }
      />
    </PromptModal>
  );
}

export default Wallet;
