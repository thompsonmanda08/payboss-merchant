"use client";
import {
  Cog6ToothIcon,
  PlusIcon,
  LinkIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  Square2StackIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
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
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import CustomTable from "@/components/tables/table";
import Card from "@/components/base/custom-card";
import CardHeader from "@/components/base/card-header";
import { INVOICE_COLUMNS } from "@/lib/table-columns";
import InvoiceForm from "@/components/forms/invoice-form";
import { QUERY_KEYS, slideDownInView } from "@/lib/constants";
import { cn, maskString, notify } from "@/lib/utils";
import { uploadCheckoutLogoFile } from "@/app/_actions/pocketbase-actions";
import PromptModal from "@/components/base/prompt-modal";
import { generateCheckoutURL } from "@/app/_actions/vas-actions";
import { useWorkspaceCheckout } from "@/hooks/useQueryHooks";
import { Input } from "@/components/ui/input-field";
import { SingleFileDropzone } from "@/components/base/file-dropzone";

const INIT_FORM = {
  display_name: "",
  logo: "",
  logo_url: "",
  physical_address: "",
  city_country: "",
  recordID: null,
};

export default function CheckoutAndInvoicing({ workspaceID, permissions }) {
  const queryClient = useQueryClient();

  const { onOpen, onClose, isOpen } = useDisclosure();
  const { data: checkoutResponse, isLoading: isLoadingConfig } =
    useWorkspaceCheckout(workspaceID);

  const configData = checkoutResponse?.data || {};

  const [selectedKey, setSelectedKey] = useState(null);
  const [copiedKey, setCopiedKey] = useState("");
  const [newCheckoutFormData, setNewCheckoutFormData] = useState(INIT_FORM);

  const [openViewConfig, setOpenViewConfig] = useState(false);
  const [unmaskURL, setUnmaskURL] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const iconClasses = "w-5 h-5 pointer-events-none flex-shrink-0";

  function handleManageDropdown(key) {
    /* OPEN MODAL */
    if (key == "new-invoice" || key == "generate-checkout-url") {
      // CHECK IF URL ALREADY EXISTS
      if (configData?.url && key == "generate-checkout-url") {
        notify({
          color: "danger",
          title: "Error",
          description: "URL already exists for this workspace.",
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
    setCopiedKey("");
    setSelectedKey("");
    setNewCheckoutFormData(INIT_FORM);
    // setCurrentActionIndex(null);
    setOpenViewConfig(false);
  }

  function copyToClipboard(key) {
    try {
      navigator?.clipboard?.writeText(key);
      setCopiedKey(key);
      notify({
        color: "success",
        title: "Success",
        description: "Checkout URL copied to clipboard!",
      });
    } catch (error) {
      notify({
        color: "danger",
        title: "Error",
        description: "Failed to copy Checkout URL to clipboard!",
      });
      console.error("FAILED", error);
    }
  }

  useEffect(() => {
    let timeoutId;

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
    let timeoutId;

    if (copiedKey) {
      timeoutId = setTimeout(() => {
        setCopiedKey("");
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [copiedKey]);

  async function handleFileUpload(file, recordID) {
    setIsUploading(true);

    let response = await uploadCheckoutLogoFile(file, recordID);

    if (response?.success) {
      notify({
        color: "success",
        title: "Logo Uploaded!",
        description: "Logo File uploaded successfully!",
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

    notify({
      title: "Error",
      color: "danger",
      description: "Failed to upload file.",
    });
    setIsUploading(false);

    return {};
  }

  async function handleCheckoutURLGenerate() {
    setIsLoading(true);

    if (!permissions?.create || !permissions?.edit) {
      notify({
        color: "danger",
        title: "NOT ALLOWED",
        description: "Only admins are allowed to generate URLs.",
      });
      setIsLoading(false);
      handleClosePrompts();

      return;
    }

    const checkoutData = {
      display_name: newCheckoutFormData?.display_name,
      logo: newCheckoutFormData?.logo_url,
      physical_address: newCheckoutFormData?.physical_address,
      city: newCheckoutFormData?.city_country,
    };

    const response = await generateCheckoutURL({
      workspaceID,
      checkoutData,
    });

    if (!response?.success) {
      notify({
        title: "Error",
        color: "danger",
        description: response?.message,
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKSPACE_CHECKOUT, workspaceID],
      });
      notify({
        title: "Success",
        color: "success",
        description: "Checkout URL Generated Successfully!",
      });
    }

    setIsLoading(false);
    handleClosePrompts();

    return;
  }

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <Card className="">
          <div className="mb-4 flex justify-between">
            <CardHeader
              classNames={{
                titleClasses: "xl:text-2xl lg:text-xl font-bold",
                infoClasses: "!text-sm xl:text-base",
              }}
              infoText={
                "Generate checkout URLs for your clients to make payments for their invoices."
              }
              title={"Checkout & Invoicing"}
            />
            {isOpen ? (
              <>
                <Button
                  isIconOnly
                  className="bg-red-500/10 text-red-500"
                  color="danger"
                  radius={"full"}
                  variant="flat"
                  onClick={handleClosePrompts}
                >
                  <XMarkIcon className="w-6 h-6" />
                </Button>
              </>
            ) : (
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    color="primary"
                    startContent={<Cog6ToothIcon className="h-6 w-6" />}
                    variant="faded"
                    // isLoading={initLoading}
                    loadingText={"Please wait..."}
                  >
                    Menu
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="select-action"
                  onAction={(key) => handleManageDropdown(key)}
                >
                  <DropdownItem
                    key="generate-checkout-url"
                    description="
                  Generate a payment URL for your clients
                  "
                    startContent={<LinkIcon className={cn(iconClasses)} />}
                  >
                    Generate Checkout URL
                  </DropdownItem>
                  <DropdownItem
                    key="new-invoice"
                    description="Create a new invoice for your client"
                    startContent={<PlusIcon className={cn(iconClasses)} />}
                    onPress={onOpen}
                  >
                    Create New Invoice
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>

          {selectedKey != "new-invoice" && (
            <Alert hideIcon className="bg-stone-50" color="default">
              <Table removeWrapper aria-label="Checkout URL TABLE">
                <TableHeader>
                  <TableColumn width={"40%"}>CHECKOUT DISPLAY NAME</TableColumn>
                  <TableColumn width={"55%"}>URL</TableColumn>
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
                              className={"h-max max-h-max max-w-max p-1"}
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
          )}

          {/* TO GENERATE AN INVOICE */}
          {isOpen && selectedKey == "new-invoice" && (
            <AnimatePresence>
              <motion.div
                animate={"visible"}
                className="mt-4"
                exit={"hidden"}
                initial={"hidden"}
                variants={slideDownInView}
              >
                <InvoiceForm />
              </motion.div>
            </AnimatePresence>
          )}
        </Card>

        <Card>
          <div className="flex w-full items-center justify-between">
            <CardHeader
              className={"mb-4"}
              infoText={"Invoices made to your clients in the last 30days."}
              title={"Recent Invoices"}
            />

            <Button
              color="primary"
              isDisabled={selectedKey == "new-invoice"}
              startContent={<PlusIcon className="h-6 w-6" />}
              variant="solid"
              onClick={() => {
                setSelectedKey("new-invoice");
                onOpen();
              }}
            >
              Create New Invoice
            </Button>
          </div>
          <CustomTable
            classNames={{ wrapper: "shadow-none px-0 mx-0" }}
            columns={INVOICE_COLUMNS}
            rowsPerPage={12}
            // isLoading={mutation.isPending}
            // removeWrapper
            rows={[]}
          />
        </Card>
      </div>

      {/* GENERATE URL PROMPT MODAL */}
      <PromptModal
        confirmText={"Confirm"}
        isDisabled={isLoading}
        isDismissable={false}
        isLoading={isLoading}
        isOpen={isOpen && selectedKey == "generate-checkout-url"}
        size="sm"
        title={"Generate Checkout URL?"}
        onClose={handleClosePrompts}
        onConfirm={handleCheckoutURLGenerate}
        onOpen={onOpen}
      >
        <div className="flex flex-col gap-4 w-full mb-4">
          <Input
            required
            label={"Display Name"}
            name={"displayName"}
            placeholder={"Brick Enterprise"}
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
            label={"Physical Address"}
            name={"customerName"}
            placeholder={"87A Kabulonga Road"}
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
            label={"City & Country"}
            name={"city_country"}
            placeholder={"Lusaka, Zambia"}
            value={newCheckoutFormData?.city_country}
            onChange={(e) =>
              setNewCheckoutFormData({
                ...newCheckoutFormData,
                city_country: e.target.value,
              })
            }
          />
        </div>
        <label
          className={cn(
            "pl-1 text-sm font-medium text-nowrap mb-1 text-foreground/70"
          )}
        >
          Logo (Optional)
        </label>
        <SingleFileDropzone
          showPreview
          isLoading={isUploading}
          otherAcceptedFiles={{
            // images
            "image/png": [],
            "image/jpeg": [],
            "image/jpg": [],
            "image/svg+xml": [],
            "image/webp": [],
          }}
          onChange={async (file) =>
            await handleFileUpload(file, newCheckoutFormData?.recordID)
          }
        />
      </PromptModal>

      {/* VIEW CHECKOUT URL MODAL */}
      <Modal
        isDismissable
        isKeyboardDismissDisabled
        className={"z-[99999999] max-w-full 2xl:max-w-[calc(100svw-200px)]"}
        isOpen={isOpen && openViewConfig}
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader className="tracking-tight">{"Checkout URL"}</ModalHeader>
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
                    color={"warning"}
                    title={
                      <span>
                        Please replace the 'XXXXXX' placeholder ONLY on the
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
