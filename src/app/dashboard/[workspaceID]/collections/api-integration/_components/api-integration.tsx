'use client';
import {
  PlusIcon,
  Square2StackIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import {
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
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getCollectionLatestTransactions } from '@/app/_actions/transaction-actions';
import {
  refreshWorkspaceAPIKey,
  setupWorkspaceAPIKey,
} from '@/app/_actions/workspace-actions';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import PromptModal from '@/components/modals/prompt-modal';
import { Button } from '@/components/ui/button';
import { useWorkspaceAPIKey, useWorkspaceInit } from '@/hooks/use-query-data';
import { QUERY_KEYS } from '@/lib/constants';
import { maskString } from '@/lib/utils';

const APIIntegration = ({ workspaceID }: { workspaceID: string }) => {
  const queryClient = useQueryClient();

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  const permissions = workspaceInit?.data?.workspacePermissions;

  const { isOpen, onOpen, onClose } = useDisclosure(); // GENERATE API KEY PROMPT

  const { data: apiKeyResponse, isLoading: isLoadingConfig } =
    useWorkspaceAPIKey(workspaceID);

  const [copiedKey, setCopiedKey] = useState('');
  const [refreshKeyID, setRefreshKeyID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unmaskAPIKey, setUnmaskAPIKey] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState<number>(0);

  const handleClosePrompt = () => {
    onClose();
    setIsLoading(false);
    setCurrentActionIndex(0);
    setUnmaskAPIKey(false);
    setRefreshKeyID('');
    setCopiedKey('');
  };

  const API_KEYS_DATA = apiKeyResponse?.data || [];
  const API_KEYS = API_KEYS_DATA?.data || [];

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
  ];

  return (
    <>
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
          {Boolean(API_KEYS?.length < 0) && (
            <Button
              endContent={<PlusIcon className="h-5 w-5" />}
              isDisabled={isLoadingConfig || Boolean(API_KEYS?.length > 0)}
              onPress={onOpen}
            >
              Generate API Key
            </Button>
          )}
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
                        <Tooltip color="secondary" content="See Documentation">
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
                              onOpen();
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

      {/*PROMPT MODAL BY ACTION */}
      <PromptModal
        confirmText={
          USER_PROMPT_ACTIONS[currentActionIndex]?.confirmText || 'Confirm'
        }
        isDisabled={isLoading}
        isDismissable={false}
        isLoading={isLoading}
        isOpen={isOpen}
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
