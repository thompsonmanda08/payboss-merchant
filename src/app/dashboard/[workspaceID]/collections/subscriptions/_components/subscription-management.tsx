'use client';
import { Plus, Trash2, Settings } from 'lucide-react';
import {
  Spinner,
  useDisclosure,
  addToast,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card as HeroUICard,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Link,
  Chip,
} from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Edit2Icon,
  Settings,
  SquarePenIcon,
  TicketPercentIcon,
  UserCog,
  Users2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { uploadFile as uploadMembersListFile } from '@/app/_actions/pocketbase-actions';
import {
  createSubscriptionPack,
  updateSubscriptionPack,
  uploadSubscriptionMembers,
} from '@/app/_actions/subscription-actions';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import {
  ACCEPTABLE_FILE_TYPES,
  SingleFileDropzone,
} from '@/components/base/file-dropzone';
import SoftBoxIcon from '@/components/base/soft-box-icon';
import PromptModal from '@/components/modals/prompt-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input-field';
import {
  useWorkspaceInit,
  useWorkspaceSubscriptions,
} from '@/hooks/use-query-data';
import { QUERY_KEYS } from '@/lib/constants';
import { cn, formatCurrency } from '@/lib/utils';

type ActionKey = 'create-new-sub' | 'update-sub' | 'delete-sub' | 'add-members';

const SubscriptionManagement = ({ workspaceID }: { workspaceID: string }) => {
  const queryClient = useQueryClient();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  const permissions = workspaceInit?.data?.workspacePermissions;

  const [formData, setFormData] = useState({
    isLoading: false,
    isUpdating: false,
    members_file: null as File | null,
    members_file_name: '',
    members_url: '',
    services: [{ name: '', price: 0, key: '' }],
  });

  const [selectedServicePack, setSelectedServicePack] = useState({
    name: '',
    price: 0,
    key: '',
    isUpdating: false,
    isDeleting: false,
    isLoading: false,
  });

  const [selectedActionKey, setSelectedActionKey] =
    useState<ActionKey>('create-new-sub');

  function updateServiceData(fields: Partial<typeof selectedServicePack>) {
    setSelectedServicePack((prev) => {
      return {
        ...prev,
        ...fields,
      };
    });
  }

  function updateFormData(fields: Partial<typeof formData>) {
    setFormData((prev) => {
      return {
        ...prev,
        ...fields,
      };
    });
  }

  const { data: subPacksRes, isLoading } =
    useWorkspaceSubscriptions(workspaceID);

  const SERVICE_PACKS = useMemo(() => {
    return subPacksRes?.data.services || [];
  }, [subPacksRes?.data.services]);

  function handleClose() {
    onClose();

    setFormData({
      isLoading: false,
      isUpdating: false,
      services: [{ name: '', price: 0, key: '' }],
    } as typeof formData);

    setSelectedServicePack({
      name: '',
      isLoading: false,
      isUpdating: false,
    } as typeof selectedServicePack);

    setSelectedActionKey('' as ActionKey);
  }

  function updateSingleService(
    servicePacks: any,
    selectedPack: any,
    action: ActionKey,
  ) {
    return servicePacks
      ?.map((service: any) => {
        if (service.key !== selectedPack?.key) return service;

        return action === 'delete-sub' ? null : { ...service, ...selectedPack };
      })
      ?.filter(Boolean);
  }

  function isValidPayload(payload: any) {
    const isValidPrices = payload?.services?.every(
      (service: any) => service.price > 0,
    );

    const isValidNames = payload?.services?.every(
      (service: any) => service.name !== '',
    );

    const isUniqueValidKeys = (() => {
      if (!payload?.services) return false;

      const keys = payload.services.map((s: any) => s?.key).filter(Boolean);
      const uniqueKeys = new Set(keys);

      return keys.length === uniqueKeys.size;
    })();

    if (payload == null || payload.services == null) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'There are no subscriptions being edited',
      });

      return false;
    }

    if (!isValidPrices) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'All prices must be greater than 0',
      });

      return false;
    }

    if (!isValidNames) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'All names must be provided',
      });

      return false;
    }

    if (!isUniqueValidKeys) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'All keys must be unique and valid!',
      });

      return false;
    }

    return true;
  }

  async function handleCreateSubscription() {
    if (!permissions?.update || !permissions?.delete) {
      addToast({
        color: 'danger',
        title: 'NOT ALLOWED',
        description: 'Only admins are allowed to create subscriptions.',
      });
      handleClose();

      return;
    }
    const payload = {
      services: formData?.services,
    };

    if (!isValidPayload(payload)) return;

    updateFormData({ isLoading: true });
    const response = await createSubscriptionPack(workspaceID, payload);

    if (!response?.success) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: response?.message,
      });
      updateFormData({ isLoading: false });

      return;
    }

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.SUBSCRIPTION_PACKS, workspaceID],
    });

    addToast({
      color: 'success',
      title: ACTION?.[selectedActionKey]?.success.title,
      description: ACTION?.[selectedActionKey]?.success.description,
    });
    updateFormData({ isLoading: false });
    handleClose();

    return;
  }

  async function handleUpdateOrAddMembers() {
    if (!permissions?.update || !permissions?.delete) {
      addToast({
        color: 'danger',
        title: 'NOT ALLOWED',
        description: 'Only admins are allowed to add members.',
      });
      handleClose();

      return;
    }

    if (!formData?.members_url) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Please upload a list of members!',
      });

      return;
    }

    const payload = {
      member_url: formData?.members_url,
    };

    updateFormData({ isLoading: true });
    const response = await uploadSubscriptionMembers(workspaceID, payload);

    if (!response?.success) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: response?.message,
      });
      updateFormData({ isLoading: false });

      return;
    }

    queryClient.invalidateQueries({
      queryKey: ['MEMBERS', workspaceID],
    });

    addToast({
      color: 'success',
      title: ACTION?.[selectedActionKey]?.success.title,
      description: ACTION?.[selectedActionKey]?.success.description,
    });
    updateFormData({ isLoading: false });
    handleClose();

    return;
  }

  async function handleUpdateSubscription() {
    if (!permissions?.update || !permissions?.delete) {
      addToast({
        color: 'danger',
        title: 'NOT ALLOWED',
        description: 'Only admins are allowed to update subscriptions.',
      });
      handleClose();

      return;
    }

    const payload = { services: {} };

    if (formData?.isUpdating) {
      payload.services = formData.services;
    } else if (selectedServicePack?.isUpdating) {
      payload.services = updateSingleService(
        SERVICE_PACKS,
        selectedServicePack,
        selectedActionKey,
      );
    }

    if (!isValidPayload(payload)) return;

    updateFormData({ isLoading: true });
    updateServiceData({ isLoading: true });
    const response = await updateSubscriptionPack(workspaceID, payload);

    if (!response?.success) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: response?.message,
      });
      updateFormData({ isLoading: false });
      updateServiceData({ isLoading: false });

      return;
    }

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.SUBSCRIPTION_PACKS, workspaceID],
    });

    addToast({
      color: 'success',
      title: ACTION?.[selectedActionKey]?.success.title,
      description: ACTION?.[selectedActionKey]?.success.description,
    });
    updateFormData({ isLoading: false });
    updateServiceData({ isLoading: false });
    handleClose();

    return;
  }

  function handleSelectedAction(key: ActionKey) {
    setSelectedActionKey(key);

    if (key == 'create-new-sub') {
      updateServiceData({ isUpdating: false });
      onOpen();
    }

    if (key == 'update-sub') {
      setFormData((prev) => ({
        ...prev,
        isUpdating: true,
        services: SERVICE_PACKS,
      }));
      onOpen();
    }

    if (key == 'add-members') {
      onOpen();
    }

    return;
  }

  async function handleFileUpload(file: File, recordID: string) {
    updateFormData({ isLoading: true });

    const response = await uploadMembersListFile(file, recordID);

    if (response?.success) {
      addToast({
        color: 'success',
        title: 'Completed!',
        description: 'Members list uploaded successfully!',
      });
      updateFormData({
        members_file: file,
        members_file_name: response?.data?.file_name,
        members_url: response?.data?.file_url,
        // recordID: response?.data?.file_record_id,
        isLoading: false,
      });

      return response?.data;
    }

    addToast({
      title: 'Error',
      color: 'danger',
      description: 'Failed to upload file.',
    });
    updateFormData({ isLoading: false });

    return {};
  }

  const ACTION: Record<ActionKey, any> = {
    'create-new-sub': {
      prompt: {
        title: 'Create New Subscription',
        description: 'Subscription packs that your members can pay for',
      },
      success: {
        title: 'Success',
        description: 'Subscription created successfully!',
      },
      onConfirm: handleCreateSubscription,
      buttonText: 'Create',
    },

    'update-sub': {
      prompt: {
        title: 'Update Subscriptions',
        description: 'Modify subscriptions that your members pay for',
      },
      success: {
        title: 'Success',
        description: `Subscription${selectedServicePack?.isUpdating ? '' : 's'} updated successfully!`,
      },
      onConfirm: handleUpdateSubscription,
      buttonText: 'Save',
    },

    'delete-sub': {
      prompt: {
        title: 'Delete Subscription',
        description: 'Are you sure you want to delete this subscription?',
      },
      success: {
        title: 'Success',
        description: 'Subscription deleted successfully!',
      },
      onConfirm: handleUpdateSubscription,
      buttonText: 'Delete',
    },

    'add-members': {
      prompt: {
        title: 'Add Members',
        description: 'Are you sure you want to add members?',
      },
      success: {
        title: 'Success',
        description: 'Members added successfully!',
      },
      onConfirm: handleUpdateOrAddMembers,
      buttonText: 'Save',
    },
  };

  return (
    <>
      <Card className="">
        <div className="mb-8 flex flex-col sm:flex-row justify-between">
          <CardHeader
            classNames={{
              titleClasses: 'xl:text-2xl lg:text-xl font-bold',
              infoClasses: '!text-sm xl:text-base',
            }}
            infoText={
              'Members will make payments to you by subscribing to the packages you create'
            }
            title={'Subscriptions'}
          />
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            {SERVICE_PACKS?.length == 0 && (
              <Button
                endContent={<Plus className="h-5 w-5" />}
                isDisabled={isLoading}
                onPress={() => handleSelectedAction('create-new-sub')}
              >
                Create New
              </Button>
            )}
            {SERVICE_PACKS?.length > 0 &&
              (permissions?.create ||
                permissions?.update ||
                permissions?.edit ||
                permissions?.delete) && (
                <Dropdown backdrop="blur">
                  <DropdownTrigger>
                    <Button
                      endContent={<UserCog className="h-5 w-5" />}
                      isDisabled={isLoading}
                      isLoading={isLoading}
                      onPress={() => {}}
                    >
                      Manage
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Action event example"
                    onAction={(key) => handleSelectedAction(key as ActionKey)}
                  >
                    <DropdownItem
                      key="update-sub"
                      description="Update subscription packages"
                      startContent={
                        <SquarePenIcon
                          className={cn(
                            'w-5 h-5 pointer-events-none flex-shrink-0',
                          )}
                        />
                      }
                    >
                      Update Subscriptions
                    </DropdownItem>
                    <DropdownItem
                      key="add-members"
                      description="Add/Update the members list"
                      startContent={
                        <Plus
                          className={cn(
                            'w-5 h-5 pointer-events-none flex-shrink-0',
                          )}
                        />
                      }
                    >
                      Upload Members
                    </DropdownItem>
                    <DropdownItem
                      key="view-members"
                      description="View your members list"
                      startContent={
                        <Users2
                          className={cn(
                            'w-5 h-5 pointer-events-none flex-shrink-0',
                          )}
                        />
                      }
                    >
                      View Members
                    </DropdownItem>

                    <DropdownSection title={'Danger zone'}>
                      <DropdownItem
                        key="delete-users"
                        isReadOnly
                        className="text-danger"
                        classNames={{
                          shortcut:
                            'group-hover:text-white font-bold group-hover:border-white',
                        }}
                        color="danger"
                        description="Remove all members"
                        href="/support"
                        shortcut="⌘⇧D"
                        startContent={
                          <Trash2
                            className={
                              'w-5 h-5 pointer-events-none flex-shrink-0 text-danger group-hover:text-white'
                            }
                          />
                        }
                      >
                        Remove all Members
                      </DropdownItem>
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              )}
          </div>
        </div>

        {isLoading ? (
          <div className="relative flex w-full min-h-80 flex-1 items-center justify-center gap-2 rounded-lg bg-neutral-100/60">
            <span className="flex gap-4 text-sm sm:text-base font-bold capitalize text-primary">
              <Spinner size="sm" /> Initializing services...
            </span>
          </div>
        ) : SERVICE_PACKS.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] py-2  gap-4 max-h-[600px] overflow-y-auto no-scrollbar">
            {SERVICE_PACKS.map((subscription: any) => (
              <div key={subscription.key} className="p-1 group ">
                <div className=" p-4 relative backdrop-blur-xl rounded-2xl border border-slate-500/10 hover:shadow-md hover:shadow-primary/5 overflow-clip transition-all duration-300 hover:scale-[1.01] bg-card">
                  {/* Gradient Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-primary-400 to-purple-300" />

                  {/* Subscription Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex gap-2">
                        <SoftBoxIcon className={'w-10 h-10 p-1'}>
                          <TicketPercentIcon className="text-white" />
                        </SoftBoxIcon>
                        <h3 className="text-[clamp(14px,2.5vw,14px)] font-semibold text-primary-900 line-clamp-2 group-hover:text-blue-900 transition-colors duration-300">
                          {subscription.name}
                        </h3>
                      </div>
                      <div className="relative group-hover:opacity-100 opacity-0 transition-all duration-300 ease-in-out flex gap-2">
                        <button
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-200 hover:scale-105"
                          onClick={() => {
                            setSelectedActionKey('update-sub');
                            updateServiceData({
                              isUpdating: true,
                              ...subscription,
                            });
                            onOpen();
                          }}
                        >
                          <Edit2Icon className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200 hover:scale-105"
                          onClick={() => {
                            setSelectedActionKey('delete-sub');
                            updateServiceData({
                              isUpdating: true,
                              ...subscription,
                            });
                            onOpen();
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <Chip className="text-xs rounded-lg">
                        {subscription.key}
                      </Chip>
                      <Chip className="text-xs rounded-lg">
                        <span className="text-[clamp(12px,2.5vw,14px)] font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {formatCurrency(subscription.price)}
                        </span>
                      </Chip>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative grid place-items-center w-full min-h-80 flex-1 items-center justify-center gap-2 rounded-lg bg-neutral-50/60">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-fit scale-125">
                <Settings className="w-12 h-12 text-primary" />
              </div>
              <p className="text-sm capitalize text-gray-400">
                You have no active subscriptions
              </p>
            </div>
          </div>
        )}
      </Card>

      <Modal
        backdrop="blur"
        className={'z-[999]'}
        isDismissable={false}
        isOpen={
          (isOpen || selectedServicePack?.isUpdating) &&
          selectedActionKey !== 'delete-sub'
        }
        placement="bottom-center"
        size={!selectedServicePack?.isUpdating ? '3xl' : undefined}
        onClose={handleClose}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col">
            <h4 className="text-large font-bold">
              {ACTION?.[selectedActionKey]?.prompt?.title}
            </h4>
            <small className="text-default-500 font-normal -mt-1">
              {ACTION?.[selectedActionKey]?.prompt?.description}
            </small>
          </ModalHeader>
          <ModalBody>
            {selectedServicePack?.isUpdating &&
            selectedActionKey == 'update-sub' ? (
              <EditSubscriptionFields
                formData={selectedServicePack}
                updateFormData={updateServiceData}
              />
            ) : selectedActionKey == 'create-new-sub' ||
              selectedActionKey == 'update-sub' ? (
              <SubscriptionPacks
                formData={formData}
                updateFormData={updateFormData}
              />
            ) : selectedActionKey == 'add-members' ? (
              <UploadMembersCSV
                formData={formData}
                handleFileUpload={handleFileUpload}
              />
            ) : (
              <></>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              isDisabled={formData?.isLoading || selectedServicePack?.isLoading}
              onPress={handleClose}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              isDisabled={formData?.isLoading || selectedServicePack?.isLoading}
              isLoading={formData?.isLoading || selectedServicePack?.isLoading}
              onPress={ACTION?.[selectedActionKey]?.onConfirm}
            >
              {ACTION?.[selectedActionKey]?.buttonText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* DELETE PROMPT MODAL */}
      <PromptModal
        confirmText={'Confirm'}
        isDisabled={selectedServicePack?.isLoading}
        isDismissable={false}
        isLoading={selectedServicePack?.isLoading}
        isOpen={selectedActionKey == 'delete-sub'}
        title={'Delete Subscription?'}
        onClose={handleClose}
        onConfirm={handleUpdateSubscription}
        className={'max-w-md'}
        // onOpen={onOpen}
      >
        <div className="-mt-3 text-sm leading-6 text-foreground/70">
          <Chip className="rounded-md w-full my-1">
            <strong>
              {selectedServicePack?.name} -{' '}
              {formatCurrency(selectedServicePack?.price)}
            </strong>
          </Chip>{' '}
          <br />
          <p>
            The selected subscription pack will be deleted from your
            subscriptions.{' '}
            <span className="text-red-500">
              This action cannot be reversed!
            </span>
          </p>
        </div>
      </PromptModal>
    </>
  );
};

function EditSubscriptionFields({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: any;
}) {
  return (
    <>
      <Input
        required
        classNames={{
          wrapper: 'col-span-5',
        }}
        label="Name"
        name={`service-pack-name`}
        placeholder="subscription Name"
        value={formData?.name}
        onChange={(e) => updateFormData({ name: e.target.value })}
      />
      <Input
        required
        isDisabled={true}
        label="Key (Identifier)"
        name={`service-pack-key`}
        value={formData?.key}
        onChange={(e) => updateFormData({ key: e.target.value })}
      />
      <Input
        required
        label="Price"
        min={1}
        name={`service-pack-price`}
        type="number"
        value={formData?.price}
        onChange={(e) => updateFormData({ price: e.target.value })}
      />
    </>
  );
}

function UploadMembersCSV({
  formData,
  handleFileUpload,
}: {
  formData: any;
  handleFileUpload: any;
}) {
  return (
    <div className="-mt-4">
      <label
        className={cn(
          'pl-1 text-sm font-medium text-nowrap mb-1 text-foreground/70',
        )}
      >
        Members List File
      </label>
      <SingleFileDropzone
        file={formData?.members_file}
        isLoading={formData?.isLoading}
        isUploaded={formData?.recordID != undefined}
        dropzoneOptions={{
          accept: ACCEPTABLE_FILE_TYPES.excel,
        }}
        onChange={async (file) =>
          await handleFileUpload(file, formData?.recordID)
        }
      />
      <p className="mt-2 text-xs font-medium text-gray-500 lg:text-[13px]">
        Click here to{' '}
        <Link
          className="font-bold text-sm text-primary hover:underline hover:underline-offset-2"
          download={'members_list_template.xlsx'}
          href={'/members_list_template.xlsx'}
        >
          download
        </Link>{' '}
        template file for a members list
      </p>
    </div>
  );
}

function SubscriptionPacks({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: any;
}) {
  const [lineItems, setLineItems] = useState(
    formData?.services || [{ name: '', price: 0, key: '' }],
  );

  const addLineItem = () => {
    if (
      formData?.services[formData.services.length - 1]?.name === '' ||
      formData?.services[formData.services.length - 1]?.key === '' ||
      formData?.services[formData.services.length - 1]?.price === 0
    ) {
      return;
    }

    // Both updates are good, but they need to happen after the check based on formData.services
    const newLineItem = { name: '', price: 0, key: '' };

    setLineItems((prev: any) => [...prev, newLineItem]); // Update local state for rendering
    updateFormData({
      services: [...(formData?.services || []), newLineItem], // Update form data
    });
  };

  const removeLineItem = (index: number) => {
    if (formData?.services.length > 1) {
      const lineItemsCopy = [...formData?.services];

      lineItemsCopy.splice(index, 1);

      setLineItems(lineItemsCopy);
      updateFormData({ services: lineItemsCopy });
    }
  };

  function isUniqueKey(keyInput: any, currentIndex: number) {
    return (
      formData?.services?.filter(
        (service: any, idx: number) =>
          service.key === keyInput && idx !== currentIndex,
      ).length === 0
    );
  }

  // To keep lineItems in sync with formData.services
  // whenever formData.services changes, as formData is a prop.
  useEffect(() => {
    if (
      formData?.services &&
      JSON.stringify(formData.services) !== JSON.stringify(lineItems)
    ) {
      setLineItems(formData.services);
    }
  }, [formData?.services]);

  return (
    <HeroUICard className="shadow-none bg-transparent min-h-60 -mt-4 rounded-none">
      <CardBody className="max-h-[600px] px-0 mx-0 overflow-y-auto gap-4">
        {lineItems?.map((_: any, index: number) => (
          <div
            key={'pack' + index}
            className="grid grid-cols-1 md:grid-cols-9 gap-2 items-end border-b pb-4 pt-2 -mt-4 last:border-0"
          >
            <Input
              required
              classNames={{
                wrapper: 'col-span-3',
              }}
              label="Name"
              name={`services.${index}.name`}
              placeholder="Subscription Name"
              value={formData?.services[index]?.name}
              onChange={(e) => {
                updateFormData({
                  services: [
                    ...formData?.services.slice(0, index),
                    {
                      ...formData?.services[index],
                      name: e.target.value,
                    },
                    ...formData?.services.slice(index + 1),
                  ],
                });
              }}
            />
            <Input
              required
              classNames={{
                wrapper: 'col-span-3',
              }}
              errorText="Key must be unique"
              isInvalid={!isUniqueKey(formData?.services[index]?.key, index)}
              label="Key"
              name={`services.${index}.key`}
              placeholder="Identifier Key"
              value={formData?.services[index]?.key}
              onChange={(e) => {
                updateFormData({
                  services: [
                    ...formData?.services.slice(0, index),
                    {
                      ...formData?.services[index],
                      key: e.target.value?.toLowerCase(),
                    },
                    ...formData?.services.slice(index + 1),
                  ],
                });
              }}
            />
            <Input
              required
              classNames={{
                wrapper: 'col-span-2',
              }}
              label="Price"
              min={1}
              name={`services.${index}.price`}
              type="number"
              value={formData?.services[index]?.price}
              onChange={(e) => {
                updateFormData({
                  services: [
                    ...formData?.services.slice(0, index),
                    {
                      ...formData?.services[index],
                      price: String(parseFloat(e.target.value)),
                    },
                    ...formData?.services.slice(index + 1),
                  ],
                });
              }}
            />

            <div className={'flex gap-2 col-span-1'}>
              <Button
                isIconOnly
                color="danger"
                disabled={formData?.services.length === 1}
                type="button"
                variant="flat"
                onClick={() => removeLineItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                isIconOnly
                startContent={<Plus className="h-4 w-4" />}
                variant="flat"
                onClick={addLineItem}
              />
            </div>
          </div>
        ))}
      </CardBody>
    </HeroUICard>
  );
}

export default SubscriptionManagement;