import { Snippet, useDisclosure, addToast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  deleteWorkspace,
  updateWorkspace,
} from '@/app/_actions/merchant-actions';
import { updateWorkspaceCallback } from '@/app/_actions/workspace-actions';
import AddUserToWorkspace from '@/components/modals/add-users-workspace-modal';
import PromptModal from '@/components/modals/prompt-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input-field';
import SelectField from '@/components/ui/select-field';
import { useWorkspaceCallbackURL } from '@/hooks/use-query-data';
import useWorkspaces from '@/hooks/use-workspaces';
import { QUERY_KEYS, WORKSPACE_TYPES } from '@/lib/constants';
import { cn, syntaxHighlight } from '@/lib/utils';
import { ErrorState } from '@/types';
import TerminalsConfig from '@/app/dashboard/[workspaceID]/workspace-settings/_components/terminals-api-config';
import { SaveIcon } from 'lucide-react';

function WorkspaceDetails({
  workspaceID,
  navigateTo,
  workspaceName,
  workspaceMembers,
  workspaceRoles,
  allUsers,
}: {
  workspaceID: string;
  navigateTo: (index: number) => void;
  workspaceName: string;
  workspaceMembers?: any[];
  workspaceRoles?: any[];
  allUsers?: any[];
}) {
  const { back } = useRouter();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: openAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();

  const [error, setError] = useState<ErrorState>({
    status: false,
    message: '',
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isLoadingCallback, setIsLoadingCallback] = useState(false);
  const [deleteWorkspaceName, setDeleteWorkspaceName] = useState('');
  const [callbackURL, setCallbackURL] = useState({ method: 'GET', url: '' });
  const { activeWorkspace } = useWorkspaces();

  const { data: callbackResponse } = useWorkspaceCallbackURL(workspaceID);

  const [isSandbox, setIsSandbox] = useState(
    activeWorkspace?.workspace?.toLowerCase() == 'sandbox',
  );

  const [newWorkspace, setNewWorkspace] = useState({
    workspace: activeWorkspace?.workspace,
    description: activeWorkspace?.description,
  });

  function updateCallbackURL(fields: Partial<typeof callbackURL>) {
    setCallbackURL((prev) => ({ ...prev, ...fields }));
  }

  function editWorkspaceField(fields: Partial<typeof newWorkspace>) {
    setNewWorkspace((prev) => {
      return { ...prev, ...fields };
    });
  }

  // UPDATE WORKSPACE DETAIL CHANGES
  async function handleUpdateWorkspace(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // VALIDATE INPUTS
    if (
      newWorkspace?.workspace &&
      (newWorkspace?.workspace?.length < 3 ||
        newWorkspace?.description?.length < 3)
    ) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Provide valid name and description!',
      });
      setLoading(false);

      return;
    }

    const response = await updateWorkspace({
      ...newWorkspace,
      ID: workspaceID,
    });

    if (response?.success) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKSPACES],
      });

      addToast({
        color: 'success',
        title: 'Success',
        description: 'Workspace updated successfully!',
      });
    } else {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Failed to Update Workspace!',
      });
    }
    setLoading(false);
  }

  // UPDATE WORKSPACE CALLBACK URL
  async function handleUpdateWorkspaceCallback(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    setIsLoadingCallback(true);

    const isValidURL = /^(http|https):\/\/[^ "]+$/.test(callbackURL.url);

    // VALIDATE INPUTS
    if (!callbackURL?.url || !isValidURL) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Provide valid url!',
      });
      setError({ onCallbackURL: true, message: 'Provide a valid url!' });
      setIsLoadingCallback(false);

      return;
    }

    const response = await updateWorkspaceCallback(workspaceID, callbackURL);

    if (response?.success) {
      queryClient.invalidateQueries();
      setIsLoadingCallback(false);
      addToast({
        color: 'success',
        title: 'Success',
        description: 'Callback URL updated!',
      });

      return;
    }

    addToast({
      title: 'Error',
      color: 'danger',
      description: 'Failed to Update callback URL!',
    });
    setIsLoadingCallback(false);
  }

  // DEACTIVATE / DELETE WORKSPACE
  async function handleDeleteWorkspace() {
    if (deleteWorkspaceName !== activeWorkspace?.workspace) {
      setError({
        status: true,
        message: 'Type the workspace name to confirm delete',
      });

      return;
    }

    setDeleteLoading(true);
    const response = await deleteWorkspace(workspaceID);

    if (response?.success) {
      queryClient.invalidateQueries();

      addToast({
        color: 'success',
        title: 'Success',
        description: 'Workspaces Deactivated successfully!',
      });
      back();
    } else {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Failed to Deactivate Workspace!',
      });
    }

    setDeleteLoading(false);
  }

  // CLEAR ERROR STATE
  useEffect(() => {
    setError({ status: false, message: '' });

    return () => {
      setError({ status: false, message: '' });
    };
  }, [deleteWorkspaceName]);

  useEffect(() => {
    setError({ status: false, message: '' });

    // SET CALLBACK URL DATA
    if (
      callbackResponse?.data?.method !== 'n/a' &&
      callbackResponse?.data?.url !== 'n/a'
    ) {
      setCallbackURL((prev) => ({ ...prev, ...callbackResponse?.data }));
    }

    // SET ACTIVE WORKSPACE IN STATE
    if (activeWorkspace?.workspace) {
      setNewWorkspace((prev) => ({ ...prev, ...activeWorkspace }));
    }
  }, [callbackResponse?.data, activeWorkspace]);

  const noChangesToSave =
    isSandbox ||
    (newWorkspace.workspace == activeWorkspace?.workspace &&
      newWorkspace.description == activeWorkspace?.description);

  const noCallbackChanges =
    callbackURL.method == callbackResponse?.data?.method &&
    callbackURL.url == callbackResponse?.data?.url;

  return (
    <>
      <div className="flex w-full flex-1 flex-col gap-4">
        <div className="flex flex-col gap-6">
          <form
            className="flex w-full  flex-col gap-4 sm:items-start md:flex-row md:items-end"
            role={'edit-workspace-details'}
            onSubmit={handleUpdateWorkspace}
          >
            <Input
              defaultValue={activeWorkspace?.workspace}
              isDisabled={loading || isSandbox}
              label="Workspace Name"
              onChange={(e) => {
                editWorkspaceField({ workspace: e.target.value });
              }}
            />

            <Input
              classNames={{
                wrapper: cn('max-w-full', { 'w-full  w-full': isSandbox }),
              }}
              defaultValue={activeWorkspace?.description}
              isDisabled={loading || isSandbox}
              label="Description"
              onChange={(e) => {
                editWorkspaceField({ description: e.target.value });
              }}
            />
            {!isSandbox && (
              <Button
                isDisabled={loading || noChangesToSave}
                isLoading={loading}
                loadingText={'Saving...'}
                type="submit"
                startContent={<SaveIcon className="h-5 w-5" />}
              >
                Save
              </Button>
            )}
          </form>
        </div>
      </div>

      <hr className="my-6 h-px bg-foreground-900/5" />

      {/* COLLECTION WORKSPACE CALLBACK-URL */}
      {activeWorkspace?.workspaceType !== WORKSPACE_TYPES[1]?.ID && (
        <>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex max-w-4xl flex-col gap-2 lg:gap-1">
                <h2 className="text-sm font-semibold leading-3 text-foreground sm:text-base">
                  CallbackURL Config
                </h2>
                <p className="text-xs text-gray-400 sm:text-sm">
                  PayBoss core will send a response to the callback URL provided
                  here complete the transaction
                </p>
              </div>

              <form
                className="flex w-full flex-col gap-4 sm:items-start md:flex-row md:items-end"
                role={'edit-workspace-details'}
                onSubmit={handleUpdateWorkspaceCallback}
              >
                <div className="flex gap-2 w-full">
                  <SelectField
                    size="lg"
                    className={cn(
                      'max-w-[100px] bg-orange-300 bg-opacity-50 rounded-md',
                      {
                        'bg-primary-300 bg-opacity-50 rounded-md ':
                          callbackURL.method == 'POST',
                      },
                    )}
                    classNames={{
                      value: cn(
                        'font-bold text-orange-600 group-data-[has-value=true]:text-orange-600',
                        {
                          'text-primary-600 group-data-[has-value=true]:text-primary-600':
                            callbackURL.method == 'POST',
                        },
                      ),
                    }}
                    defaultValue={'GET'}
                    isDisabled={isLoadingCallback}
                    label="Method"
                    options={['GET', 'POST']}
                    placeholder={'GET'}
                    prefilled={true}
                    value={callbackURL?.method}
                    wrapperClassName={cn('max-w-24')}
                    onChange={(e) =>
                      updateCallbackURL({ method: e.target.value })
                    }
                    // isInvalid={error?.onCallbackURL}
                  />

                  <Input
                    className="w-full"
                    classNames={{
                      wrapper: 'max-w-full',
                    }}
                    defaultValue={activeWorkspace?.callBackURL}
                    isDisabled={loading}
                    isInvalid={error?.onCallbackURL}
                    label="URL"
                    pattern="https?://.+"
                    required={true}
                    title="https://www.domain-name.com"
                    value={callbackURL?.url}
                    onChange={(e) => updateCallbackURL({ url: e.target.value })}
                  />
                </div>

                <Button
                  isDisabled={isLoadingCallback || noCallbackChanges}
                  isLoading={isLoadingCallback}
                  loadingText={'Saving...'}
                  type="submit"
                  startContent={<SaveIcon className="h-5 w-5" />}
                >
                  Save
                </Button>
              </form>
            </div>

            <div className="flex flex-col gap-2 lg:gap-1">
              <h2 className="text-sm font-semibold leading-3 text-foreground sm:text-base">
                Status Response
              </h2>
              <p className="text-xs text-gray-400 sm:text-sm">
                Your callback URL will get the following response
              </p>

              <div>
                {callbackURL?.method == 'GET' ? (
                  <Snippet hideSymbol className="w-full flex-1">
                    <span className="text-wrap">
                      {'GET'} ~{' '}
                      {callbackURL?.url +
                        '?status=&message=&transactionID=&mno_ref=&mno_status_description='}
                    </span>
                  </Snippet>
                ) : (
                  <Snippet
                    hideSymbol
                    classNames={{
                      base: 'max-w- w-full flex text-wrap',
                    }}
                  >
                    <pre
                      dangerouslySetInnerHTML={{
                        __html: syntaxHighlight(
                          JSON.stringify(
                            {
                              status: 'string',
                              message: 'string',
                              transactionID: 'string',
                              mno_ref: 'string | null',
                              mno_status_description: 'string',
                            },
                            undefined,
                            2,
                          ),
                        ),
                      }}
                    />
                  </Snippet>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <hr className="my-4 h-px bg-foreground-900/5 sm:my-6" />
      <TerminalsConfig workspaceID={workspaceID} />
      <hr className="my-4 h-px bg-foreground-900/5 sm:my-6" />

      {/* DELETE A WORKSPACE */}
      <div className="flex flex-col gap-8 md:flex-row md:justify-between">
        <div className="flex max-w-4xl flex-col gap-4">
          <h2 className="text-sm font-semibold leading-3 text-foreground sm:text-base">
            Deactivate Workspace
          </h2>
          <p className="text-xs leading-6 text-gray-400 sm:text-sm">
            This action can only be reversed by contacting our support team.
            Please note that all information related to this workspace will be
            retained for audit purposes in accordance with regulatory
            requirements.
          </p>
        </div>

        <Button
          className="w-full self-end rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 sm:w-auto"
          color="danger"
          onClick={onOpen}
        >
          Yes, deactivate my workspace
        </Button>
      </div>

      {/* MODALS */}
      <PromptModal
        confirmText="Deactivate"
        isDisabled={deleteLoading}
        isDismissable={false}
        isLoading={deleteLoading}
        isOpen={isOpen}
        title="Delete/Deactivate Workspace"
        onClose={onClose}
        onConfirm={handleDeleteWorkspace}
        // onOpen={onOpen}
      >
        <p className="leading-2 m-0">
          <strong>Are you sure you want to perform this action?</strong>
        </p>
        <p className="text-sm text-foreground/70">
          This action cannot be undone. Please type{' '}
          <code className="rounded-md bg-primary/10 p-1 px-2 font-medium text-primary-700">
            {activeWorkspace?.workspace}
          </code>{' '}
          to confirm your choice to proceed.
        </p>

        <Input
          errorText={error.message}
          isDisabled={deleteLoading}
          isInvalid={error.status}
          label="Confirm Delete"
          onChange={(e) => setDeleteWorkspaceName(e.target.value)}
        />
      </PromptModal>

      <AddUserToWorkspace
        allUsers={allUsers}
        isOpen={openAdd}
        navigateTo={navigateTo}
        workspaceID={workspaceID}
        workspaceMembers={workspaceMembers}
        workspaceName={workspaceName}
        workspaceRoles={workspaceRoles}
        onClose={onCloseAdd}
        // onOpen={onOpenAdd}
      />
    </>
  );
}

export default WorkspaceDetails;
