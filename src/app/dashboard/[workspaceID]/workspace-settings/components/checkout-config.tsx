'use client';
import {
  Cog6ToothIcon,
  LinkIcon,
  EyeIcon,
  EyeSlashIcon,
  Square2StackIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  Tooltip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  Snippet,
  ModalHeader,
  ModalFooter,
  addToast,
} from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Key, useEffect, useState } from 'react';

import { uploadCheckoutLogoFile } from '@/app/_actions/pocketbase-actions';
import {
  generateCheckoutURL,
  updateCheckoutURL,
} from '@/app/_actions/vas-actions';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import { SingleFileDropzone } from '@/components/base/file-dropzone';
import PromptModal from '@/components/modals/prompt-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input-field';
import { useWorkspaceCheckout, useWorkspaceInit } from '@/hooks/use-query-data';
import { cn, maskString } from '@/lib/utils';

const INIT_FORM = {
  display_name: '',
  logo: '',
  logo_url: '',
  physical_address: '',
  city_country: '',
  redirect_url: '',
  recordID: '',
};

export default function CheckoutConfig({
  workspaceID,
}: {
  workspaceID: string;
}) {
  const queryClient = useQueryClient();

  const { onOpen, onClose, isOpen } = useDisclosure();
  const { data: checkoutResponse, isLoading: isLoadingConfig } =
    useWorkspaceCheckout(workspaceID);

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  const permissions = workspaceInit?.data?.workspacePermissions;

  const configData = checkoutResponse?.data || {};

  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [copiedKey, setCopiedKey] = useState('');
  const [newCheckoutFormData, setNewCheckoutFormData] = useState(INIT_FORM);

  const [openViewConfig, setOpenViewConfig] = useState(false);
  const [unmaskURL, setUnmaskURL] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const iconClasses = 'w-5 h-5 pointer-events-none flex-shrink-0';

  async function handleFileUpload(file: File, recordID?: string) {
    setIsUploading(true);

    const response = await uploadCheckoutLogoFile(file, recordID);

    if (response?.success) {
      addToast({
        color: 'success',
        title: 'Logo Uploaded!',
        description: 'Logo File uploaded successfully!',
      });
      setNewCheckoutFormData((prev) => ({
        ...prev,
        logo: response?.data?.file_name,
        logo_url: response?.data?.file_url,
        recordID: response?.data?.file_record_id,
      }));
      setIsUploading(false);

      return response?.data;
    }

    addToast({
      title: 'Error',
      color: 'danger',
      description: 'Failed to upload file.',
    });
    setIsUploading(false);

    return {};
  }

  function handleManageDropdown(key: Key) {
    if (configData?.url && key == 'update-checkout-url') {
      setNewCheckoutFormData({
        ...configData,
        city_country: configData?.city,
        redirect_url: configData?.redirect_url,
      });
      setSelectedKey(key);
      onOpen();

      return;
    }

    /* OPEN MODAL */
    if (key == 'generate-checkout-url') {
      // CHECK IF URL ALREADY EXISTS
      if (configData?.url && key == 'generate-checkout-url') {
        addToast({
          color: 'danger',
          title: 'Error',
          description: 'URL already exists for this workspace.',
        });
        setIsLoading(false);
        handleClosePrompts();

        return;
      }

      setSelectedKey(key);
      onOpen();

      return;
    }
  }

  function handleClosePrompts() {
    onClose();
    setIsLoading(false);
    setIsUploading(false);
    setUnmaskURL(false);
    setCopiedKey('');
    setSelectedKey('');
    setNewCheckoutFormData(INIT_FORM);
    // setCurrentActionIndex(null);
    setOpenViewConfig(false);
  }

  function copyToClipboard(key: string) {
    try {
      navigator?.clipboard?.writeText(key);
      setCopiedKey(key);
      addToast({
        color: 'success',
        title: 'Success',
        description: 'Checkout URL copied to clipboard!',
      });
    } catch (error) {
      addToast({
        color: 'danger',
        title: 'Error',
        description: 'Failed to copy Checkout URL to clipboard!',
      });
      console.error('FAILED', error);
    }
  }

  async function handleCheckoutURLGenerate() {
    setIsLoading(true);

    if (!permissions?.create || !permissions?.update) {
      addToast({
        color: 'danger',
        title: 'NOT ALLOWED',
        description: 'Only admins are allowed to generate URLs.',
      });
      setIsLoading(false);

      return;
    }

    const checkoutData = {
      display_name: newCheckoutFormData?.display_name,
      logo: newCheckoutFormData?.logo_url,
      physical_address: newCheckoutFormData?.physical_address,
      city: newCheckoutFormData?.city_country,
      redirect_url: newCheckoutFormData?.redirect_url,
    };

    let response;

    if (configData?.url && selectedKey == 'update-checkout-url') {
      const checkoutID = configData?.ID;

      response = await updateCheckoutURL(workspaceID, checkoutID, checkoutData);
    } else {
      response = await generateCheckoutURL(workspaceID, checkoutData);
    }

    if (!response?.success) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: response?.message,
      });
    } else {
      addToast({
        title: 'Success',
        color: 'success',
        description: 'Checkout URL Configured Successfully!',
      });
      queryClient.invalidateQueries();
    }

    setIsLoading(false);
    handleClosePrompts();

    return;
  }

  useEffect(() => {
    let timeoutId: any;

    if (unmaskURL) {
      timeoutId = setTimeout(() => {
        setUnmaskURL(true);
      }, 1000 * 60);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [unmaskURL]);

  /* Clear copied key after 5 seconds */
  useEffect(() => {
    let timeoutId: any;

    if (copiedKey) {
      timeoutId = setTimeout(() => {
        setCopiedKey('');
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [copiedKey]);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <Card className=" shadow-none">
          <div className="mb-4 flex justify-between">
            <CardHeader
              classNames={{
                titleClasses: 'xl:text-2xl lg:text-xl font-bold',
                infoClasses: '!text-sm xl:text-base',
              }}
              infoText={
                'Generate checkout URLs for your clients to make payments for their invoices.'
              }
              title={'Checkout Config'}
            />
            <Dropdown>
              <DropdownTrigger>
                <Button
                  color="primary"
                  startContent={<Cog6ToothIcon className="h-6 w-6" />}
                  variant="faded"
                  // isLoading={initLoading}
                  loadingText={'Please wait...'}
                >
                  Menu
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="select-action"
                onAction={(key) => handleManageDropdown(key)}
              >
                {configData?.url ? (
                  <DropdownItem
                    key="update-checkout-url"
                    description="
                  Generate a payment URL for your clients
                  "
                    startContent={<LinkIcon className={cn(iconClasses)} />}
                  >
                    Update Checkout URL
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    key="generate-checkout-url"
                    description="
                  Generate a payment URL for your clients
                  "
                    startContent={<LinkIcon className={cn(iconClasses)} />}
                  >
                    Generate Checkout URL
                  </DropdownItem>
                )}

                {/* <DropdownItem
                    key="new-invoice"
                    description="Create a new invoice for your client"
                    startContent={<PlusIcon className={cn(iconClasses)} />}
                    onPress={onOpen}
                  >
                    Create New Invoice
                  </DropdownItem> */}
              </DropdownMenu>
            </Dropdown>
          </div>

          <Alert hideIcon className="bg-stone-50" color="default">
            <Table removeWrapper aria-label="Checkout URL TABLE">
              <TableHeader>
                <TableColumn width={'40%'}>CHECKOUT DISPLAY NAME</TableColumn>
                <TableColumn width={'55%'}>URL</TableColumn>
                <TableColumn align="center">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody
                isLoading={isLoadingConfig}
                loadingContent={
                  <div className="relative top-6 mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50 py-3">
                    <span className="flex gap-4 text-sm font-bold capitalize text-primary">
                      <Spinner size="sm" /> Loading Checkout Data...
                    </span>
                  </div>
                }
              >
                {Object.keys(configData).length > 0 ? (
                  <TableRow key="checkout-url-row">
                    <TableCell className="font-bold">
                      {configData?.display_name}
                    </TableCell>
                    <TableCell className="flex gap-1">
                      {configData?.display_name ? (
                        <>
                          <span className="flex items-center gap-4 font-medium">
                            {unmaskURL
                              ? configData?.url
                              : maskString(configData?.url, 0, 60)}
                          </span>
                          <Button
                            className={'h-max max-h-max max-w-max p-1'}
                            color="default"
                            size="sm"
                            variant="light"
                            onClick={() => setUnmaskURL(!unmaskURL)}
                          >
                            {unmaskURL ? (
                              <EyeSlashIcon className="h-5 w-5 cursor-pointer text-primary" />
                            ) : (
                              <EyeIcon className="h-5 w-5 cursor-pointer text-primary" />
                            )}
                          </Button>
                        </>
                      ) : (
                        <TableRow>
                          <TableCell
                            className="relative -left-32 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50/0 py-3 text-xs text-foreground/70"
                            colSpan={3}
                          >
                            You have no API keys generated
                          </TableCell>
                        </TableRow>
                      )}
                    </TableCell>
                    <TableCell>
                      {configData?.url && (
                        <div className="flex items-center gap-2">
                          <Tooltip
                            color="secondary"
                            content="Checkout URL Config"
                          >
                            <Button
                              isIconOnly
                              color="secondary"
                              variant="light"
                              onPress={() => {
                                setOpenViewConfig(true);
                                onOpen();
                              }}
                            >
                              <Cog6ToothIcon className="h-6 w-6 " />
                            </Button>
                          </Tooltip>
                          <Tooltip
                            color="default"
                            content="Copy URL to clipboard"
                          >
                            <Button
                              isIconOnly
                              variant="light"
                              onPress={() => copyToClipboard(configData?.url)}
                            >
                              {copiedKey ? (
                                <ClipboardDocumentCheckIcon
                                  className={`h-6 w-6`}
                                />
                              ) : (
                                <Square2StackIcon className={`h-6 w-6`} />
                              )}
                            </Button>
                          </Tooltip>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key="checkout-url-row">
                    <TableCell
                      align="center"
                      className="font-medium text-center"
                      colSpan={3}
                    >
                      <span className="flex gap-4 text-xs text-center text-foreground/50 py-2 w-max mx-auto">
                        You have not generated a checkout URL yet
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Alert>
        </Card>
      </div>

      {/* GENERATE URL PROMPT MODAL */}
      <PromptModal
        confirmText={'Confirm'}
        isDisabled={isLoading}
        isDismissable={false}
        isLoading={isLoading}
        isOpen={isOpen}
        size="sm"
        title={'Checkout URL Information'}
        onClose={handleClosePrompts}
        onConfirm={handleCheckoutURLGenerate}
        // onOpen={onOpen}
      >
        <div className="flex flex-col gap-4 w-full mb-4">
          <Input
            required
            label={'Display Name'}
            name={'displayName'}
            placeholder={'Brick Enterprise'}
            value={newCheckoutFormData?.display_name}
            onChange={(e) =>
              setNewCheckoutFormData({
                ...newCheckoutFormData,
                display_name: e.target.value,
              })
            }
          />
          <Input
            required
            label={'Physical Address'}
            name={'customerName'}
            placeholder={'87A Kabulonga Road'}
            value={newCheckoutFormData?.physical_address}
            onChange={(e) =>
              setNewCheckoutFormData({
                ...newCheckoutFormData,
                physical_address: e.target.value,
              })
            }
          />
          <Input
            required
            label={'City & Country'}
            name={'city_country'}
            placeholder={'Lusaka, Zambia'}
            value={newCheckoutFormData?.city_country}
            onChange={(e) =>
              setNewCheckoutFormData({
                ...newCheckoutFormData,
                city_country: e.target.value,
              })
            }
          />
          <Input
            required
            label={'Redirect URL'}
            name={'redirect_url'}
            placeholder={'https://'}
            value={newCheckoutFormData?.redirect_url}
            onChange={(e) =>
              setNewCheckoutFormData({
                ...newCheckoutFormData,
                redirect_url: e.target.value,
              })
            }
          />
        </div>
        <label
          className={cn(
            'pl-1 text-sm font-medium text-nowrap mb-1 text-foreground/70',
          )}
        >
          Logo (Optional)
        </label>
        <SingleFileDropzone
          showPreview
          isLoading={isUploading}
          otherAcceptedFiles={{
            // images
            'image/png': [],
            'image/jpeg': [],
            'image/jpg': [],
            'image/svg+xml': [],
            'image/webp': [],
          }}
          onChange={async (file) =>
            await handleFileUpload(file as File, newCheckoutFormData?.recordID)
          }
        />
      </PromptModal>

      {/* VIEW CHECKOUT URL MODAL */}
      <Modal
        isDismissable
        isKeyboardDismissDisabled
        className={'z-[99999999] max-w-full 2xl:max-w-[calc(100svw-200px)]'}
        isOpen={isOpen && openViewConfig}
        placement="center"
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader className="tracking-tight">{'Checkout URL'}</ModalHeader>
          <ModalBody className="gap-0">
            <div className="flex w-full flex-col gap-8">
              <Snippet hideSymbol className="w-full flex-1">
                <p className="text-wrap">{configData?.url}</p>
              </Snippet>
              <div className="flex flex-col gap-2">
                <h4 className="text-base font-bold text-slate-600">
                  URL Anatomy
                </h4>
                <Snippet hideSymbol className="w-full">
                  <p>
                    {
                      "{BASE_URL}/checkout/?checkout_id='xxxxxxxxx'&workspace_id='xxxxxxxxx'&service_id='xxxxxxxx'"
                    }
                    <span className="font-bold">
                      {"&amount='1.0'&transaction_id='XXXXXXXX'"}
                    </span>
                  </p>
                </Snippet>
                <div className="w-full flex items-center my-3">
                  <Alert
                    color={'warning'}
                    title={
                      <span>
                        Please replace the &apos;XXXXXX&apos; placeholder ONLY
                        on the
                        <span className="font-bold mx-1 uppercase">amount</span>
                        &amp;
                        <span className="font-bold mx-1 uppercase">
                          transaction_id
                        </span>
                        <span>
                          {`fields with your own values as you do your integration for this workspace`}
                        </span>
                      </span>
                    }
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={handleClosePrompts}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
