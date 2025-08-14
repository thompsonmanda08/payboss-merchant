'use client';
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
} from '@heroicons/react/24/outline';
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
  addToast,
} from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getCollectionLatestTransactions } from '@/app/_actions/transaction-actions';
import {
  activateWorkspaceTerminals,
  deactivateWorkspaceTerminals,
  refreshWorkspaceAPIKey,
  setupWorkspaceAPIKey,
} from '@/app/_actions/workspace-actions';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import PromptModal from '@/components/modals/prompt-modal';
import CustomTable from '@/components/tables/table';
import TerminalsTable from '@/components/tables/terminal-tables';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import {
  useWorkspaceAPIKey,
  useWorkspaceInit,
  useWorkspaceTerminals,
} from '@/hooks/use-query-data';
import { QUERY_KEYS } from '@/lib/constants';
import {
  API_KEY_TERMINAL_TRANSACTION_COLUMNS,
  API_KEY_TRANSACTION_COLUMNS,
} from '@/lib/table-columns';
import { cn, formatDate, maskString } from '@/lib/utils';

import APIConfigViewModal from './api-config-view';
import TerminalConfigViewModal from './terminal-config-view';

const APIIntegration = () => {
  const queryClient = useQueryClient();

  const params = useParams();
  const workspaceID = String(params.workspaceID);

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  const permissions = workspaceInit?.data?.workspacePermissions;

  const { onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenAddTerminal,
    onOpen: onAddTerminal,
    onClose: onCloseTerminal,
  } = useDisclosure();

  const { data: apiKeyResponse, isLoading: isLoadingConfig } =
    useWorkspaceAPIKey(workspaceID);
  const { data: terminalData, isLoading: isLoadingTerminals } =
    useWorkspaceTerminals(workspaceID);

  const [copiedKey, setCopiedKey] = useState('');
  const [refreshKeyID, setRefreshKeyID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unmaskAPIKey, setUnmaskAPIKey] = useState(false);
  const [openViewConfig, setOpenViewConfig] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClosePrompt = () => {
    onClose();
    setIsLoading(false);
    setCurrentActionIndex(0);
    setUnmaskAPIKey(false);
    setRefreshKeyID('');
  };

  const thirtyDaysAgoDate = new Date();

  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  const start_date = formatDate(thirtyDaysAgoDate, 'YYYY-MM-DD');
  const end_date = formatDate(new Date(), 'YYYY-MM-DD');

  const API_KEYS_DATA = apiKeyResponse?.data || [];
  const API_CONFIG = API_KEYS_DATA?.config || [];
  const API_KEYS = API_KEYS_DATA?.data || [];
  const terminals = terminalData?.data?.terminals || []; //
  const hasTerminals = Boolean(API_KEYS_DATA?.hasTerminals);
  const terminalsConfigured = Boolean(terminals.length > 0);

  // HANDLE FETCH API COLLECTION LATEST TRANSACTION DATA
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.API_COLLECTIONS, workspaceID],
    mutationFn: (dateRange) =>
      getCollectionLatestTransactions(
        workspaceID,
        'api-integration',
        dateRange,
      ),
  });

  function copyToClipboard(key: string) {
    try {
      navigator?.clipboard?.writeText(key);
      setCopiedKey(key);
      addToast({
        color: 'success',
        title: 'Success',
        description: 'API key copied to clipboard!',
      });
    } catch (error) {
      addToast({
        color: 'danger',
        title: 'Error',
        description: 'Failed to copy API key!',
      });
      console.error('FAILED', error);
    }
  }

  async function handleGenerateAPIKey() {
    setIsLoading(true);

    if (!permissions?.update || !permissions?.delete) {
      addToast({
        color: 'danger',
        title: 'Error',
        description: 'Only admins are allowed to generate API keys!',
      });

      setIsLoading(false);
      handleClosePrompt();

      return;
    }

    // THERE CAN ONLY BE 2 API KEYS ==> UAT AND PRODUCTION
    if (API_KEYS?.length == 2) {
      addToast({
        color: 'danger',
        title: 'Error',
        description: 'You already have an API key for this workspace!',
      });

      return;
    }

    const response = await setupWorkspaceAPIKey(workspaceID);

    if (!response?.success) {
      addToast({
        color: 'danger',
        title: 'Failed to generate API key',
        description: response?.message,
      });
      setIsLoading(false);

      return;
    }

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.WORKSPACE_API_KEY, workspaceID],
    });
    addToast({
      color: 'success',
      title: 'Success',
      description: 'API key has been generated',
    });
    setIsLoading(false);
    handleClosePrompt();

    return;
  }

  async function handleRefreshAPIKey() {
    setIsLoading(true);

    if (!permissions?.update || !permissions?.delete) {
      addToast({
        color: 'danger',
        title: 'Error',
        description: 'Only admins are allowed to refresh API keys.',
      });
      setIsLoading(false);
      handleClosePrompt();

      return;
    }

    if (API_KEYS?.length == 0) {
      addToast({
        color: 'danger',
        title: 'Error',
        description: 'You have no API key.',
      });
      setIsLoading(false);

      return;
    }

    const response = await refreshWorkspaceAPIKey(workspaceID, refreshKeyID);

    if (response?.success) {
      addToast({
        color: 'success',
        title: 'Success',
        description: 'API key has been updated',
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKSPACE_API_KEY, workspaceID],
      });
    } else {
      addToast({
        color: 'danger',
        title: 'Error',
        description: response?.message || 'Failed to refresh API key.',
      });
    }

    setIsLoading(false);
    handleClosePrompt();

    return;
  }

  async function handleTerminalActivation() {
    setIsLoading(true);

    if (!permissions?.update || !permissions?.delete) {
      addToast({
        color: 'danger',
        title: 'Error',
        description: 'Only admins are allowed to activate terminals.',
      });
      setIsLoading(false);
      handleClosePrompt();

      return;
    }

    if (API_KEYS_DATA?.terminals || hasTerminals) {
      addToast({
        color: 'danger',
        title: 'Error',
        description: 'Terminals already activated for this workspace.',
      });
      setIsLoading(false);
      handleClosePrompt();

      return;
    }

    const response = await activateWorkspaceTerminals(workspaceID);

    if (!response?.success) {
      addToast({
        color: 'danger',
        title: 'Error',
        description: response?.message,
      });
      setIsLoading(false);

      return;
    }

    queryClient.invalidateQueries();

    addToast({
      color: 'success',
      title: 'Success',
      description: 'Collection Terminals activated.',
    });
    setIsLoading(false);
    handleClosePrompt();

    return;
  }

  async function handleTerminalDeactivation() {
    setIsLoading(true);

    if (!permissions?.update || !permissions?.delete) {
      addToast({
        color: 'danger',
        title: 'NOT ALLOWED',
        description: 'Only admins are allowed to deactivate terminals.',
      });
      setIsLoading(false);
      handleClosePrompt();

      return;
    }

    const response = await deactivateWorkspaceTerminals(workspaceID);

    if (!response?.success) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: response?.message,
      });
      setIsLoading(false);

      return;
    }

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.WORKSPACE_API_KEY, workspaceID],
    });

    addToast({
      title: 'Success',
      color: 'success',
      description: 'Collection Terminals activated!',
    });
    setIsLoading(false);
    handleClosePrompt();

    return;
  }

  function handleTerminalStatus(actionKey?: string) {
    if (hasTerminals && actionKey == 'activate-terminals') {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Terminals already activated for this workspace!',
      });
      handleClosePrompt();

      return;
    }

    // IF ACTIVE AND TERMINALS ARE CURRENTLY UPLOADED THEN NO DEACTIVATE
    if (
      hasTerminals &&
      terminalsConfigured &&
      actionKey == 'deactivate-terminals'
    ) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Contact support to deactivate terminals!',
      });
      handleClosePrompt();

      return;
    }

    // ALLOW DEACTIVATION IF TERMINALS ARE NOT UPLOADED
    if (actionKey == 'deactivate-terminals') {
      setCurrentActionIndex(3);

      return;
    }

    setCurrentActionIndex(2);
  }

  function handleManageTerminals(selectedKey: string) {
    if (!permissions?.update || !permissions?.delete) {
      addToast({
        color: 'danger',
        title: 'NOT ALLOWED!',
        description: 'You cannot perform this action',
      });
      handleClosePrompt();

      return;
    }

    if (selectedKey == 'add-terminal') {
      onAddTerminal();

      return;
    }

    if (
      selectedKey == 'activate-terminals' ||
      selectedKey == 'deactivate-terminals'
    ) {
      handleTerminalStatus(selectedKey);

      return;
    }
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

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
      mutation.mutateAsync();
    }
  }, []);

  const LATEST_TRANSACTIONS = mutation.data?.data?.data || [];

  // ACTIONS FOR API COLLECTIONS
  const USER_PROMPT_ACTIONS = [
    {
      title: 'Generate API Key',
      icon: PlusIcon,
      color: 'primary',
      confirmText: 'Generate',
      onConfirmAction: handleGenerateAPIKey,
      description: 'Generate a new API key for this workspace',
      promptText: 'Are you sure you want to generate a new API key?',
      promptDescription:
        'This API key will allow you channel funds to your workspace wallet from 3rd party applications and interfaces.',
    },
    {
      title: 'Refresh API Key',
      icon: ArrowPathIcon,
      color: 'warning',
      confirmText: 'Refresh',
      onConfirmAction: handleRefreshAPIKey,
      description: 'Refresh the API key for this workspace',
      promptText: 'Are you sure you want to refresh this API key?',
      promptDescription:
        'By confirming this, your API key will be changed to a new one and you will not be able to use the old API anymore.',
    },
    {
      title: 'Activate Terminals',
      icon: ComputerDesktopIcon,
      color: 'primary',
      confirmText: 'Activate',
      onConfirmAction: handleTerminalActivation,
      description: 'Activate Terminals for this workspace',
      promptText: 'Are you sure you want to activate Terminals?',
      promptDescription:
        'By confirming this, Terminals will be activated and you will be able to create and manage terminal transactions.',
    },
    {
      title: 'Deactivate Terminals',
      icon: ComputerDesktopIcon,
      color: 'primary',
      confirmText: 'Deactivate',
      onConfirmAction: handleTerminalDeactivation,
      description: 'Deactivate Terminals for this workspace',
      promptText: 'Are you sure you want to deactivate Terminals?',
      promptDescription:
        'By confirming this, Terminals will be deactivated and you will NOT be able to create and manage terminal transactions.',
    },
    {
      title: 'Delete API Key',
      icon: TrashIcon,
      color: 'danger',
      confirmText: 'Delete',
      onConfirmAction: () => {},
      description: 'Delete the API key for this workspace',
      promptText: 'Are you sure you want to delete this API key?',
      promptDescription:
        'This action is not reversible and will result in the non-operation of this key. Make sure you update any application making use of this Key.',
    },
  ];

  const iconClasses = 'w-5 h-5 pointer-events-none flex-shrink-0';

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <Card className="">
          <div className="mb-8 flex justify-between">
            <CardHeader
              classNames={{
                titleClasses: 'xl:text-2xl lg:text-xl font-bold',
                infoClasses: '!text-sm xl:text-base',
              }}
              infoText={
                'Use the API keys to collect payments to your workspace wallet.'
              }
              title={'API Key'}
            />
            <Button
              endContent={<PlusIcon className="h-5 w-5" />}
              isDisabled={isLoadingConfig || Boolean(API_KEYS?.length > 0)}
              onPress={() => {
                setCurrentActionIndex(0);
              }}
            >
              Generate Key
            </Button>
          </div>

          <Table
            removeWrapper
            aria-label="API KEY TABLE"
            // items={API_KEYS as any}
          >
            <TableHeader>
              <TableColumn width={'30%'}>NAME</TableColumn>
              <TableColumn width={'60%'}>API KEY</TableColumn>
              <TableColumn align="center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={isLoadingConfig}
              loadingContent={
                <div className="relative top-6 mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50 py-3">
                  <span className="flex gap-4 text-sm font-bold capitalize text-primary">
                    <Spinner size="sm" /> Loading API key...
                  </span>
                </div>
              }
            >
              {API_KEYS?.length > 0 ? (
                API_KEYS?.map((item: any) => (
                  <TableRow key={`${item?.state}-key`}>
                    <TableCell>{item?.username}</TableCell>
                    <TableCell className="flex gap-1">
                      {item?.apikey && (
                        <>
                          <span className="flex items-center gap-4 font-medium">
                            {unmaskAPIKey
                              ? item?.apikey
                              : maskString(item?.apikey, 0, 50)}
                          </span>
                          <Button
                            className={'h-max max-h-max max-w-max p-1'}
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
                      )}
                    </TableCell>

                    <TableCell>
                      {item?.username && (
                        <div className="flex items-center gap-4">
                          <Tooltip
                            color="secondary"
                            content="See Documentation"
                          >
                            <Link href="/docs/collections" target="_blank">
                              <Cog6ToothIcon
                                className="h-5 w-5 cursor-pointer text-secondary hover:opacity-90"
                                // onClick={() => setOpenViewConfig(true)}
                              />
                            </Link>
                          </Tooltip>
                          <Tooltip
                            color="default"
                            content="Copy API Key to clipboard"
                          >
                            <Square2StackIcon
                              className={`h-6 w-6 cursor-pointer ${
                                copiedKey === item?.apikey
                                  ? 'text-primary'
                                  : 'text-gray-500'
                              } hover:text-primary`}
                              onClick={() => copyToClipboard(item?.apikey)}
                            />
                          </Tooltip>
                          <Tooltip color="primary" content="Refresh API Key">
                            <ArrowPathIcon
                              className="h-5 w-5 cursor-pointer text-primary hover:text-primary-300"
                              onClick={() => {
                                setCurrentActionIndex(1);
                                setRefreshKeyID(item?.ID);
                              }}
                            />
                          </Tooltip>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow key="empty">
                  <TableCell
                    align="center"
                    className="font-medium text-center"
                    colSpan={3}
                  >
                    <span className="flex gap-4 text-xs text-center text-foreground/50 py-2 w-max mx-auto">
                      You have no API keys generated
                    </span>
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
                titleClasses: 'xl:text-2xl lg:text-xl font-bold',
                infoClasses: '!text-sm xl:text-base',
              }}
              infoText={
                'Activate terminals to manage  multiple collection points like POS machines, tills, etc.'
              }
              title={'Terminals'}
            />

            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              {(permissions?.create ||
                permissions?.update ||
                permissions?.edit ||
                permissions?.delete) && (
                <Dropdown backdrop="blur">
                  <DropdownTrigger>
                    <Button
                      color="primary"
                      endContent={<WrenchScrewdriverIcon className="h-5 w-5" />}
                      isDisabled={isLoadingTerminals || isLoadingConfig}
                      loadingText={'Please wait...'}
                    >
                      Manage
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Action event example"
                    onAction={(key) => handleManageTerminals(String(key))}
                  >
                    {hasTerminals ? (
                      <DropdownItem
                        key="add-terminal"
                        description="Add new terminals to workspace"
                        startContent={<PlusIcon className={cn(iconClasses)} />}
                      >
                        Add New Terminal
                      </DropdownItem>
                    ) : null}

                    {/* <DropdownItem
                    key="workspace-settings"
                    href={`${dashboardRoute}/workspace-settings`}
                    description="Goto your workspace settings"
                    startContent={<Cog6ToothIcon className={cn(iconClasses)} />}
                  >
                    Workspace Settings
                  </DropdownItem> */}
                    <DropdownSection title={hasTerminals ? '' : 'Danger zone'}>
                      {!hasTerminals ? (
                        <DropdownItem
                          key="activate-terminals"
                          classNames={{
                            shortcut: 'group-hover:text-white',
                          }}
                          color="primary"
                          description="Activate collection terminals"
                          shortcut="⌘⇧A"
                          startContent={
                            <ComputerDesktopIcon
                              className={cn(
                                iconClasses,
                                'group-hover:text-white font-bold group-hover:border-white',
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
                              'group-hover:text-white font-bold group-hover:border-white',
                          }}
                          color="danger"
                          description="Deactivate collection terminals"
                          href="/support"
                          shortcut="⌘⇧D"
                          startContent={
                            <TrashIcon
                              className={cn(
                                iconClasses,
                                'text-danger group-hover:text-white',
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
              )}
              <Tooltip
                classNames={{
                  content: 'max-w-96 text-sm leading-6 p-3',
                }}
                color="secondary"
                content="Show configured terminals"
              >
                <Button
                  color={'secondary'}
                  isDisabled={isLoadingTerminals || isLoadingConfig}
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
                height: isExpanded ? 'auto' : 0,
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
                  {isLoadingTerminals || isLoadingConfig ? (
                    <Loader
                      classNames={{
                        wrapper: 'bg-foreground-200/50 rounded-xl h-full',
                      }}
                      loadingText={'Getting configuration...'}
                      size={60}
                    />
                  ) : (
                    <Tooltip
                      classNames={{
                        content: 'max-w-96 text-sm leading-6 p-3',
                      }}
                      content="Terminals are like a POS/Till machines that can be used to collect payments from your customers."
                    >
                      <Button
                        className={
                          'flex-grow min-h-auto max-h-auto min-h-32 w-full flex-1 font-medium text-primary-600'
                        }
                        isDisabled={isLoadingConfig || mutation?.isPending}
                        isLoading={isLoadingConfig || mutation?.isPending}
                        loadingText={'Getting Configuration...'}
                        startContent={
                          terminalsConfigured && hasTerminals ? (
                            <PlusIcon className={cn(iconClasses)} />
                          ) : (
                            <ComputerDesktopIcon className={cn(iconClasses)} />
                          )
                        }
                        variant="light"
                        onClick={() => {
                          return terminalsConfigured && hasTerminals
                            ? onAddTerminal()
                            : handleTerminalStatus();
                        }}
                      >
                        {terminalsConfigured && hasTerminals
                          ? 'Add Terminals'
                          : 'Activate Terminals'}
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
              className={'mb-4'}
              infoText={
                'Transactions made to your workspace wallet in the last 30days.'
              }
              title={'Recent Transactions'}
            />
          </div>
          <CustomTable
            // removeWrapper
            classNames={{ wrapper: 'shadow-none px-0 mx-0' }}
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
        API_CONFIG={API_CONFIG}
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
          USER_PROMPT_ACTIONS[currentActionIndex]?.confirmText || 'Confirm'
        }
        isDisabled={isLoading}
        isDismissable={false}
        isLoading={isLoading}
        isOpen={currentActionIndex !== null}
        title={USER_PROMPT_ACTIONS[currentActionIndex]?.title}
        onClose={handleClosePrompt}
        onConfirm={USER_PROMPT_ACTIONS[currentActionIndex]?.onConfirmAction}
        // onOpen={onOpen}
      >
        <p className="-mt-4 text-sm leading-6 text-foreground/70">
          <strong>{USER_PROMPT_ACTIONS[currentActionIndex]?.promptText}</strong>{' '}
          <br />
          {USER_PROMPT_ACTIONS[currentActionIndex]?.promptDescription}
        </p>
      </PromptModal>
    </>
  );
};

export default APIIntegration;
