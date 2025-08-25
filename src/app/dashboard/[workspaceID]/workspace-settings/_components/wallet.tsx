import { Paperclip as PaperClipIcon } from 'lucide-react';
import { Chip, Tooltip, useDisclosure, addToast } from '@heroui/react';
import { getLocalTimeZone, today } from '@internationalized/date';
import { useQueryClient } from '@tanstack/react-query';
import { formatDistance } from 'date-fns';
import { useState } from 'react';

import { uploadFile } from '@/app/_actions/pocketbase-actions';
import {
  approveWalletPrefund,
  submitPOP,
} from '@/app/_actions/workspace-actions';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import EmptyLogs from '@/components/base/empty-logs';
import UploadField, {
  ACCEPTABLE_FILE_TYPES,
} from '@/components/base/file-dropzone';
import IframeWithFallback from '@/components/base/IframeWithFallback';
import StatusMessage from '@/components/base/status-message';
import Balance from '@/components/base/wallet-balance';
import Modal from '@/components/modals/custom-modal';
import PromptModal from '@/components/modals/prompt-modal';
import { Button } from '@/components/ui/button';
import DateSelectField from '@/components/ui/date-select-field';
import { Input } from '@/components/ui/input-field';
import { Skeleton } from '@/components/ui/skeleton';
import useWalletStore from '@/context/wallet-store';
import { useWorkspaceInit } from '@/hooks/use-query-data';
import { QUERY_KEYS, TASK_TYPE, WORKSPACE_TYPES } from '@/lib/constants';
import { capitalize, cn, formatCurrency, formatDate } from '@/lib/utils';
import { WorkspaceSession } from '@/types';

function Wallet({
  workspaceID,
  workspaceName,
  balance,
  hideHistory,
  removeWrapper,
  transactionData,
}: {
  workspaceID: string;
  workspaceName: string;
  balance: number;
  hideHistory?: boolean;
  removeWrapper?: boolean;
  transactionData?: any;
}) {
  const queryClient = useQueryClient();

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  const session = workspaceInit?.data as WorkspaceSession;
  const permissions = session?.workspacePermissions;

  const {
    // setOpenAttachmentModal,
    // openAttachmentModal,
    // setSelectedPrefund,
    isLoading,
    setIsLoading,
    walletLoading,
    setWalletLoading,
    formData,
    setFormData,
    updateFormData,
  } = useWalletStore();

  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();

  const workspaceType = permissions.workspaceType;

  const [error, setError] = useState({
    status: false,
    message: '',
  });

  const isDisabled =
    !formData?.amount ||
    formData?.amount < 0 ||
    !formData?.date_of_deposit ||
    !formData?.bank_rrn ||
    !formData?.url ||
    isLoading ||
    walletLoading;

  async function handleFileUpload(file: File, recordID: string) {
    setWalletLoading(true);
    setError({ message: '', status: false });

    const response = await uploadFile(file, recordID);

    if (response?.success) {
      addToast({
        title: 'Success',
        color: 'success',
        description: response?.message,
      });
    } else {
      addToast({
        title: 'Error',
        color: 'danger',
        description: response?.message,
      });
    }

    setWalletLoading(false);
    return response?.data;
  }

  async function handleWalletPreFund() {
    setError({
      message: '',
      status: false,
    });

    if (!formData.url) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Attach proof of payment!',
      });
      setError({
        message: 'Verify that you have attached a proof of payment!',
        status: true,
      });
      onClose();

      return;
    }

    if (!formData.bank_rrn) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Enter a valid bank reference number!',
      });
      setError({
        message: 'Verify that you have entered a valid bank reference number!',
        status: true,
      });
      onClose();

      return;
    }

    if (!formData.date_of_deposit) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Enter a valid date of deposit!',
      });
      setError({
        message: 'Verify that you have entered a valid date of deposit!',
        status: true,
      });
      onClose();

      return;
    }

    if (!formData.name) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Enter a valid prefund name!',
      });
      setError({
        message: 'Verify that you have entered a valid prefund name!',
        status: true,
      });
      onClose();

      return;
    }

    if (
      !formData.amount ||
      formData.amount < 0 ||
      formData.amount.toString().length > 0
    ) {
      addToast({
        title: 'Invalid Amount',
        color: 'danger',
        description: 'Verify that you have entered a valid amount!',
      });
      setError({
        message: 'Verify that you have entered a valid amount!',
        status: true,
      });
      onClose();

      return;
    }

    if (workspaceType == WORKSPACE_TYPES[0]?.ID) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'You are not allowed to prefund your collections wallet!',
      });
      setError({
        message: 'You are not allowed to prefund your collections wallet!',
        status: true,
      });

      return;
    }

    setIsLoading(true);
    const response = await submitPOP(formData, workspaceID);

    if (response?.success) {
      addToast({
        title: 'Success',
        color: 'success',
        description: 'Proof of payment submitted successfully.',
      });

      setFormData({
        amount: '',
        bank_rrn: '',
        date_of_deposit: '',
        url: '',
        name: '',
      });
      onClose();
      setFormData({} as typeof formData);

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLET_HISTORY],
      });
    } else {
      setError({
        status: true,
        message: response?.message,
      });
      addToast({
        title: 'Error',
        color: 'danger',
        description: response?.message,
      });
    }

    setIsLoading(false);
  }

  return (
    <>
      <section className="flex w-full items-center" role="wallet-section">
        <Card
          className={cn(
            'flex w-full flex-col items-start justify-center gap-8 md:flex-row',
            {
              'items-center justify-center gap-x-0': hideHistory,
              'rounded-none border-none p-0 shadow-none': removeWrapper,
            },
          )}
        >
          {/* ONLY THE INITIATOR CAN SEE THIS FORM IN DISBURSEMENT WORKSPACE */}
          {permissions?.can_initiate &&
            workspaceType !== WORKSPACE_TYPES[0]?.ID && (
              <div
                className={cn('flex w-full max-w-md flex-1 flex-col gap-4', {
                  'mx-auto': hideHistory,
                })}
              >
                <Balance
                  isLandscape
                  amount={balance}
                  title={`${workspaceName} Wallet Balance`}
                />
                <div
                  className={cn(
                    'flex w-full flex-col gap-y-4 p-[25px] lg:border lg:border-y-0 lg:border-l-0 lg:border-border',
                    {
                      'lg:border-r-0': hideHistory,
                    },
                  )}
                >
                  <div className="flex flex-col gap-4" role="pre-fund-wallet">
                    <p className="text-[14px] font-semibold text-foreground/80">
                      Deposit funds into your PayBoss Wallet
                    </p>

                    <Input
                      required
                      label="Amount"
                      name="amount"
                      placeholder="Enter an amount"
                      type="number"
                      value={formData?.amount}
                      onChange={(e) =>
                        updateFormData({ amount: e.target.value })
                      }
                    />

                    <Input
                      required
                      label="Reference Number"
                      name="bank_rrn"
                      placeholder="Bank Reference No. "
                      value={formData.bank_rrn}
                      onChange={(e) =>
                        updateFormData({ bank_rrn: e.target.value })
                      }
                    />
                    <DateSelectField
                      isRequired
                      className="max-w-md"
                      defaultValue={formData?.date_of_deposit}
                      description={'Date the funds were deposited'}
                      label={'Date of Deposit'}
                      labelPlacement={'outside'}
                      maxValue={today(getLocalTimeZone())}
                      value={
                        formData?.date_of_deposit?.split('').length > 9
                          ? formData?.date_of_deposit
                          : undefined
                      }
                      onChange={(date: any) => {
                        updateFormData({
                          date_of_deposit: formatDate(date, 'YYYY-MM-DD'),
                        });
                      }}
                    />

                    <UploadField
                      required
                      acceptedFiles={{
                        ...ACCEPTABLE_FILE_TYPES.images,
                        ...ACCEPTABLE_FILE_TYPES.pdf,
                      }}
                      handleFile={async (file) => {
                        const file_record = await handleFileUpload(
                          file,
                          formData.file?.file_record_id,
                        );

                        updateFormData({ url: file_record?.file_url });
                      }}
                      isLoading={walletLoading}
                      label="Proof of Payment"
                    />
                    {error.status && (
                      <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
                        <StatusMessage
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
                      Create Deposit
                    </Button>
                  </div>
                </div>
              </div>
            )}
          {!hideHistory && (
            <div className="flex h-full max-h-[600px] overflow-y-auto no-scrollbar flex-[2] flex-grow flex-col items-start gap-8">
              <CardHeader
                infoText={
                  'Transaction history logs for every activity on the wallet'
                }
                title="Wallet Transaction History"
              />
              <WalletTransactionHistory
                permissions={permissions}
                transactionData={transactionData}
                workspaceID={workspaceID}
              />
            </div>
          )}
        </Card>

        <PromptModal
          confirmText="Confirm"
          isDisabled={isLoading}
          isLoading={isLoading}
          isOpen={isOpen}
          title="Confirm POP Submission"
          onClose={onClose}
          onConfirm={handleWalletPreFund}
          onOpenChange={onOpenChange}
        >
          <p className="-mt-4 mb-4 text-[15px] leading-7 text-foreground/80">
            Your wallet will be credited with the amount{' '}
            <strong>{formatCurrency(formData?.amount)}</strong> of bank
            reference number
            <code className="mx-1 mb-2 rounded-md bg-primary/10 p-1 px-2 font-bold text-primary-700">
              {formData?.bank_rrn}
            </code>
            as soon as your transaction is approved and reviewed.
          </p>

          <Input
            label="Prefund Name/Label"
            name="name"
            placeholder="Enter a prefund name"
            value={formData?.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
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
  permissions,
}: {
  workspaceID: string;
  limit?: number;
  transactionData?: any;
  isLoading?: boolean;
  className?: string;
  classNames?: {
    wrapper?: string;
    icon?: string;
    text?: string;
  };
  permissions?: any;
}) {
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

  const walletData = transactionData || [];

  const walletHistory: any = walletData.sort(
    (a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const data = [
    {
      title: 'Wallet Transactions',
      data: limit ? walletHistory.slice(0, limit) : walletHistory,
    },
  ];

  const reverseSort = false;
  const formattedActivityData = formatActivityData(data, reverseSort);

  function handleClosePrompt() {
    setOpenAttachmentModal(false);
    setSelectedPrefund(null);
    updatePrefundApproval({
      action: '',
      remarks: '',
    });
    onClose();
  }

  function handleApproveOrReject(item: any, action: 'approved' | 'rejected') {
    setSelectedPrefund(item);
    updatePrefundApproval({
      action: action,
      remarks: `Transaction was ${action}.`,
    });

    onOpen();
  }

  // PREFUND APPROVAL STATUS SUBMISSION
  async function handleApproval() {
    setIsLoading(true);

    if (!prefundApproval.remarks) {
      setIsLoading(false);
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Review reason is required.',
      });

      return;
    }

    if (!prefundApproval?.action) {
      setIsLoading(false);
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Action is required!',
      });

      return;
    }

    const response = await approveWalletPrefund(
      prefundApproval,
      selectedPrefund?.ID,
      workspaceID,
    );

    if (!response?.success) {
      setIsLoading(false);
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Failed to submit approval action!',
      });

      return;
    }

    setIsLoading(false);
    addToast({
      title: 'Success',
      color: 'success',
      description: 'Submitted successfully!',
    });
    handleClosePrompt();
  }

  if (isLoading) {
    return <WalletLHistoryLoader />;
  }

  return (
    <>
      <div
        className={cn(
          'my-auto flex min-h-96 flex-col py-4 w-full',
          {
            'my-0': formattedActivityData?.length > 0,
          },
          className,
          classNames?.wrapper,
        )}
      >
        {formattedActivityData.length > 0 ? (
          formattedActivityData.map((items, index) => {
            // TRANSACTIONS GROUPED BY DATE
            return (
              <div
                key={`${index + 1 * Math.random()}${items?.title}`}
                className="pr-6"
              >
                <p className="text-base font-semibold text-slate-600">
                  {items.title}
                </p>

                {items?.data?.map((item) => {
                  // EACH TRANSACTION ITEM
                  const isGreen =
                    (item?.status == 'success' || item?.status == 'approved') &&
                    item?.transaction_type == 'credit' &&
                    item?.isPrefunded;

                  const isYellow = item?.status == 'pending';

                  const isRed =
                    item?.status == 'rejected' ||
                    item?.transaction_type == 'debit';

                  // const isGray = item?.isExpired;

                  return (
                    <div
                      key={`${item?.id || (index + 1) * Math.random()}`}
                      className="flex flex-col gap-y-4 py-2"
                    >
                      <div className="flex items-start space-x-4">
                        <LogTaskType
                          classNames={{ wrapper: '' }}
                          type={item?.transaction_type}
                        />

                        <div className="w-full items-start">
                          <div className="flex w-full justify-between">
                            <p className="text-xs text-foreground/70 truncate -mt-1">
                              <span className="text-base font-semibold text-foreground/80 capitalize leading-6">
                                {item?.narration}{' '}
                                {/* APPEND CREATED BY FOR PREFUND TRANSACTIONS */}
                                {item?.created_by
                                  ? ` - ${item?.created_by as string}`
                                  : ''}
                              </span>{' '}
                              <br />
                              {item?.transaction_description}
                              <span className="ml-2 font-normal leading-4 text-foreground/40">
                                ...
                                {formatDistance(
                                  new Date(item?.created_at),
                                  new Date(),
                                )}{' '}
                                ago
                              </span>
                            </p>

                            <div className="flex max-w-max flex-col items-end">
                              <div className="flex gap-2">
                                <Tooltip
                                  classNames={{
                                    content: cn(
                                      'text-nowrap bg-primary text-white',
                                      {
                                        'bg-success/10 text-green-600': isGreen,
                                        'bg-secondary/10 text-secondary':
                                          isYellow,
                                        'bg-danger/10 text-danger': isRed,
                                      },
                                    ),
                                  }}
                                  content={`${capitalize(
                                    item?.transaction_description,
                                  )}`}
                                  placement="left"
                                >
                                  <Chip
                                    classNames={{
                                      base: cn(
                                        'p-2 py-4 cursor-pointer rounded-md bg-primary/10 text-primary-700',

                                        {
                                          'bg-success/10 text-green-500':
                                            isGreen,
                                          'bg-secondary/10 text-secondary':
                                            isYellow,
                                          'bg-danger/10 text-danger': isRed,
                                        },
                                      ),
                                      content: cn('text-base font-bold', {}),
                                    }}
                                    variant="flat"
                                  >
                                    {formatCurrency(item?.amount)}
                                  </Chip>
                                </Tooltip>
                                {item?.transaction_type?.toLowerCase() ==
                                  'deposit' && (
                                  <Tooltip
                                    content={'View Proof of payment'}
                                    placement="top"
                                  >
                                    <span
                                      className="'h-6 hover:bg-foreground-300' cursor-pointer self-start rounded-md bg-foreground-200 p-[6px] text-lg font-bold text-slate-600 active:opacity-50"
                                      onClick={() => {
                                        setSelectedPrefund(item);
                                        setOpenAttachmentModal(true);
                                      }}
                                    >
                                      <PaperClipIcon className="aspect-square w-5" />
                                    </span>
                                  </Tooltip>
                                )}
                              </div>

                              {/* TRANSACTION APPROVAL BUTTON COMPONENTS} */}
                              {item?.status == 'pending' &&
                                permissions?.can_approve && (
                                  <div className="mb-4 ml-auto mt-2 flex max-w-max gap-2">
                                    <Button
                                      className={'h-8'}
                                      color={'danger'}
                                      size="sm"
                                      onClick={() =>
                                        handleApproveOrReject(item, 'rejected')
                                      }
                                    >
                                      Reject
                                    </Button>
                                    <Button
                                      className={'h-8'}
                                      size="sm"
                                      onClick={() =>
                                        handleApproveOrReject(item, 'approved')
                                      }
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
                  <hr className="my-4 h-px border-0 bg-foreground-100" />
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-1 items-center rounded-lg bg-slate-50 text-sm font-semibold text-slate-600 dark:bg-foreground/5">
            <EmptyLogs
              className={'my-auto'}
              subTitle={'You have not made any wallet transactions yet.'}
              title={'No Wallet Transactions'}
            />
          </div>
        )}
      </div>

      {/* **************************************************** */}
      <ApprovalStatusPrompt
        handleApproval={handleApproval}
        handleClosePrompt={handleClosePrompt}
        isLoading={loadingPrefund}
        isOpen={isOpen}
        prefundApproval={prefundApproval}
        selectedPrefund={selectedPrefund}
        updatePrefundApproval={updatePrefundApproval}
      />
      {/* **************************************************** */}
    </>
  );
}

export function LogTaskType({
  type,
  classNames,
}: {
  type: string;
  classNames?: {
    wrapper?: string;
    icon?: string;
    text?: string;
  };
}) {
  const taskType = TASK_TYPE[type];

  const Icon = taskType?.icon as React.ElementType;

  if (taskType) {
    return (
      <div
        className={cn(
          `inline-flex h-8 w-fit items-center justify-center gap-2 text-nowrap rounded-[4px]  px-2 py-1.5`,
          `cursor-pointer px-4`,
          `bg-${taskType?.color}/10`,
          classNames?.wrapper,
        )}
      >
        <span className={cn(`text-${taskType?.color}`, classNames?.icon)}>
          <Icon className="h-5 w-5" />
        </span>
        <p
          className={cn(
            `text-sm font-medium leading-6`,
            `text-${taskType?.color}`,
            classNames?.text,
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
      removeCallToAction
      cancelText="Close"
      height={800}
      infoText="Ensure the document aligns with the submitted details"
      isDismissible={true}
      show={openAttachmentModal}
      title={`${capitalize(selectedPrefund?.name)} - Proof of payment document`}
      width={1200}
      onClose={() => {
        setOpenAttachmentModal(false);
        setSelectedPrefund(null);
      }}
    >
      {selectedPrefund?.url && (
        <IframeWithFallback
          src={selectedPrefund?.url}
          title={selectedPrefund?.name}
        />
      )}
    </Modal>
  );
}

export function WalletLHistoryLoader({ limit = 5 }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <Skeleton className="w-48 h-7 rounded-lg " />
        <Skeleton className="w-96 h-5 mt-2 rounded-lg " />
      </div>

      {Array.from({ length: limit }).map((_, index) => (
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
  handleClosePrompt,
  handleApproval,
  isLoading,
  prefundApproval,
  selectedPrefund,
  updatePrefundApproval,
}: {
  isOpen: boolean;
  handleClosePrompt: () => void;
  handleApproval: () => void;
  isLoading: boolean;
  prefundApproval: any;
  selectedPrefund: any;
  updatePrefundApproval: (fields: any) => void;
}) {
  return (
    <PromptModal
      confirmText="Confirm"
      isDisabled={isLoading}
      isDismissable={false}
      isLoading={isLoading}
      isOpen={isOpen}
      title="Approve Wallet Deposit Transaction"
      onClose={handleClosePrompt}
      onConfirm={handleApproval}
    >
      <p className="-mt-4 mb-2 text-sm leading-6 text-foreground/70">
        Are you sure you want to <strong>{prefundApproval?.action}</strong> the
        wallet transaction of{' '}
        <code className="rounded-md bg-primary/10 p-1 px-2 font-semibold text-primary-700">
          {`(${formatCurrency(selectedPrefund?.amount || '00')})`}
        </code>{' '}
      </p>
      <Input
        isDisabled={isLoading}
        label="Review/Remarks"
        placeholder="Enter a review remark"
        onChange={(e) =>
          updatePrefundApproval({
            remarks: e.target.value,
          })
        }
      />
    </PromptModal>
  );
}

export type ActivityLogItem = {
  id: string;
  workspace_id: string;
  amount: number;
  narration: string;
  transaction_type: string;
  sys_service: string;
  transaction_description: string;
  created_at: string;
  created_by?: string;
  isPrefunded?: boolean;
  isExpired?: boolean;
  status?: 'approved' | 'pending' | 'prefunded' | 'rejected' | 'success';
};

export type ActivityLogGroup = {
  title: string;
  data: ActivityLogItem[];
};
export function formatActivityData(
  activityLog: any,
  isNotReverse = true,
): ActivityLogGroup[] {
  const groupedData: { [x: string]: any } = {};

  activityLog?.forEach((activity: { title: string; data: any[] }) => {
    activity.data?.forEach((item: any) => {
      const created_at = new Date(item.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!groupedData[created_at]) {
        groupedData[created_at] = [];
      }

      groupedData?.[created_at].push(item);
    });
  });

  const result = Object.keys(groupedData).map(
    (date) =>
      ({
        title: String(date),
        data: isNotReverse
          ? groupedData[String(date)]
          : groupedData[date].reverse(),
      }) as ActivityLogGroup,
  );

  return result;
}

export default Wallet;
