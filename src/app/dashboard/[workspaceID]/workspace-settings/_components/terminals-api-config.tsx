'use client';
import {
  Plus,
  EyeOff,
  Wrench,
  Monitor,
  Trash2,
  Settings2Icon,
} from 'lucide-react';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Tooltip,
  useDisclosure,
  addToast,
} from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import {
  activateWorkspaceTerminals,
  deactivateWorkspaceTerminals,
} from '@/app/_actions/workspace-actions';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import PromptModal from '@/components/modals/prompt-modal';
import TerminalsTable from '@/components/tables/terminal-tables';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import {
  useRecentTransactions,
  useWorkspaceAPIKey,
  useWorkspaceInit,
  useWorkspaceTerminals,
} from '@/hooks/use-query-data';
import { QUERY_KEYS } from '@/lib/constants';
import { cn, formatDate } from '@/lib/utils';
import TerminalConfigViewModal from './terminal-config-modal';

const TerminalsConfig = ({ workspaceID }: { workspaceID: string }) => {
  const queryClient = useQueryClient();

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  const permissions = workspaceInit?.data?.workspacePermissions;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isTerminalConfigOpen,
    onOpen: openTerminalConfig,
    onClose: closeTerminalConfig,
  } = useDisclosure();

  const { data: API, isLoading: isLoadingConfig } =
    useWorkspaceAPIKey(workspaceID);
  const { data: CONFIG, isLoading: isLoadingTerminals } =
    useWorkspaceTerminals(workspaceID);

  const [isLoading, setIsLoading] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClosePrompt = () => {
    setIsLoading(false);
    setCurrentActionIndex(0);
    onClose();
    setIsExpanded(true);
  };

  const thirtyDaysAgoDate = new Date();
  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  const start_date = formatDate(thirtyDaysAgoDate, 'YYYY-MM-DD');
  const end_date = formatDate(new Date(), 'YYYY-MM-DD');

  const API_KEYS_DATA = API?.data || {};

  const terminals = CONFIG?.data?.terminals || [];
  const hasTerminals = API?.data?.hasTerminals || false;
  const terminalsConfigured = Boolean(terminals.length > 0);

  // HANDLE FETCH LATEST TRANSACTION DATA
  const mutation = useRecentTransactions({
    workspaceID,
    service: 'api-integration',
    filters: {
      start_date,
      end_date,
      page: 1,
      limit: 10,
    },
    queryKeys: [QUERY_KEYS.API_COLLECTIONS],
  });

  async function activateTerminals() {
    if (!permissions?.update || !permissions?.delete) {
      addToast({
        color: 'danger',
        title: 'Error',
        description: 'Only admins are allowed to activate terminals.',
      });
      handleClosePrompt();

      return;
    }

    if (API_KEYS_DATA?.terminals || hasTerminals) {
      addToast({
        color: 'danger',
        title: 'Error',
        description: 'Terminals already activated for this workspace.',
      });

      handleClosePrompt();

      return;
    }

    setIsLoading(true);
    const response = await activateWorkspaceTerminals(workspaceID);

    if (response?.success) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKSPACE_API_KEY, workspaceID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKSPACE_TERMINALS, workspaceID],
      });

      addToast({
        color: 'success',
        title: 'Success',
        description: 'Collection Terminals activated.',
      });
    } else {
      addToast({
        color: 'danger',
        title: 'Error',
        description: response?.message,
      });
    }
    handleClosePrompt();
  }

  async function deactivateTerminals() {
    if (!permissions?.update || !permissions?.delete) {
      addToast({
        color: 'danger',
        title: 'NOT ALLOWED',
        description: 'Only admins are allowed to deactivate terminals.',
      });
      handleClosePrompt();
      return;
    }

    setIsLoading(true);
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

    // IF ACTIVE AND CONFIG ARE CURRENTLY UPLOADED THEN NO DEACTIVATE
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

    // ALLOW DEACTIVATION IF CONFIG ARE NOT UPLOADED
    if (actionKey == 'deactivate-terminals') {
      setCurrentActionIndex(1);
      onOpen();

      return;
    }

    setCurrentActionIndex(0);
    onOpen();
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
      openTerminalConfig();
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

  // useEffect(() => {
  //   // IF NO DATA IS FETCH THEN GET THE LATEST TRANSACTIONS
  //   if (!mutation.data) {
  //     mutation.mutateAsync();
  //   }
  // }, []);

  // ACTIONS FOR CONFIG
  const USER_PROMPT_ACTIONS = [
    {
      title: 'Activate Terminals',
      icon: Monitor,
      color: 'primary',
      confirmText: 'Activate',
      onConfirmAction: activateTerminals,
      description: 'Activate Terminals for this workspace',
      promptText: 'Are you sure you want to activate Terminals?',
      promptDescription:
        'By confirming this, Terminals will be activated and you will be able to create and manage terminal transactions.',
    },
    {
      title: 'Deactivate Terminals',
      icon: Monitor,
      color: 'primary',
      confirmText: 'Deactivate',
      onConfirmAction: deactivateTerminals,
      description: 'Deactivate Terminals for this workspace',
      promptText: 'Are you sure you want to deactivate Terminals?',
      promptDescription:
        'By confirming this, Terminals will be deactivated and you will NOT be able to create and manage terminal transactions.',
    },
    // {
    //   title: 'Delete API Key',
    //   icon: Trash2,
    //   color: 'danger',
    //   confirmText: 'Delete',
    //   onConfirmAction: () => {},
    //   description: 'Delete the API key for this workspace',
    //   promptText: 'Are you sure you want to delete this API key?',
    //   promptDescription:
    //     'This action is not reversible and will result in the non-operation of this key. Make sure you update any application making use of this Key.',
    // },
  ];

  const iconClasses = 'w-5 h-5 pointer-events-none flex-shrink-0';

  return (
    <>
      {/* CONFIG API CONFIG */}
      <Card className="shadow-none px-0 border-none">
        <div className="mb-8 flex justify-between">
          <div className="flex max-w-4xl flex-col gap-2 lg:gap-1">
            <h2 className="text-sm font-semibold leading-3 text-foreground sm:text-base">
              Terminal Management
            </h2>
            <p className="text-xs text-gray-400 sm:text-sm">
              Activate terminals to manage multiple collection points like POS
              machines, tills, etc.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            {(permissions?.create ||
              permissions?.update ||
              permissions?.edit) && (
              <Dropdown backdrop="blur">
                <DropdownTrigger>
                  <Button
                    color="primary"
                    startContent={<Settings2Icon className="h-5 w-5" />}
                    isDisabled={isLoadingTerminals || isLoadingConfig}
                    loadingText={'Please wait...'}
                  >
                    Edit
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
                      startContent={<Plus className={cn(iconClasses)} />}
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
                          <Monitor
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
                          <Trash2
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
            {/* <Tooltip
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
                  <EyeOff className="h-5 w-5 text-orange-600" />
                ) : (
                  <Monitor className="h-5 w-5 text-orange-600" />
                )}
              </Button>
            </Tooltip> */}
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
                        hasTerminals ? (
                          <Plus className={cn(iconClasses)} />
                        ) : (
                          <Monitor className={cn(iconClasses)} />
                        )
                      }
                      variant="light"
                      onClick={() => {
                        return hasTerminals
                          ? openTerminalConfig()
                          : handleTerminalStatus();
                      }}
                    >
                      {hasTerminals ? 'Add Terminals' : 'Activate Terminals'}
                    </Button>
                  </Tooltip>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>

      <TerminalConfigViewModal
        isOpen={isTerminalConfigOpen}
        workspaceID={workspaceID}
        onClose={closeTerminalConfig}
      />

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

export default TerminalsConfig;
