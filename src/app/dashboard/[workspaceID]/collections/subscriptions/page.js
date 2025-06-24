"use client";
import { useEffect, useMemo, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
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
  Chip,
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
  Pagination,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { SquarePenIcon, UserCog, Users2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import CustomTable from "@/components/tables/table";
import {
  useWorkspaceInit,
  useWorkspaceSubscriptions,
} from "@/hooks/use-query-data";
import { QUERY_KEYS } from "@/lib/constants";
import { getCollectionLatestTransactions } from "@/app/_actions/transaction-actions";
import Card from "@/components/base/custom-card";
import CardHeader from "@/components/base/card-header";
import { SUBSCRIPTION_PAYMENT_COLUMNS } from "@/lib/table-columns";
import { Input } from "@/components/ui/input-field";
import {
  createSubscriptionPack,
  updateSubscriptionPack,
} from "@/app/_actions/subscription-actions";

const Subscriptions = () => {
  const queryClient = useQueryClient();

  const params = useParams();
  const workspaceID = params.workspaceID;

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  const permissions = workspaceInit?.data?.workspacePermissions;

  const [selectedServicePack, setSelectedServicePack] = useState({
    name: "",
    price: 0,
    key: "",
    isUpdating: false,
    isDeleting: false,
    isLoading: false,
  });

  function updateServiceData(fields) {
    setSelectedServicePack((prev) => {
      return {
        ...prev,
        ...fields,
      };
    });
  }

  const [formData, setFormData] = useState({
    isLoading: false,
    isUpdating: false,
    services: [{ name: "", price: 0, key: "" }],
  });

  function updateFormData(fields) {
    setFormData((prev) => {
      return {
        ...prev,
        ...fields,
      };
    });
  }

  const { onOpen, onClose, isOpen } = useDisclosure();

  const { data: subPacksRes, isLoading: isLoadingConfig } =
    useWorkspaceSubscriptions(workspaceID);

  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    onClose();

    setFormData({
      isLoading: false,
      isUpdating: false,
      services: [{ name: "", price: 0, key: "" }],
    });
    setSelectedServicePack({
      name: "",
      isLoading: false,
      isUpdating: false,
    });
  }

  const thirtyDaysAgoDate = new Date();

  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  const start_date = formatDate(thirtyDaysAgoDate, "YYYY-MM-DD");
  const end_date = formatDate(new Date(), "YYYY-MM-DD");

  const ALL_SERVICE_PACKS = subPacksRes?.data.services || [];

  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const pages = Math.ceil(ALL_SERVICE_PACKS.length / rowsPerPage);

  const SERVICE_PACKS = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return ALL_SERVICE_PACKS.slice(start, end);
  }, [page, ALL_SERVICE_PACKS]);

  // HANDLE FETCH SUBS COLLECTION LATEST TRANSACTION DATA
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.API_COLLECTIONS, workspaceID],
    mutationFn: (dateRange) =>
      getCollectionLatestTransactions(workspaceID, "subscription", dateRange),
  });

  async function handleCreateSubscription() {
    if (!permissions?.update || !permissions?.delete) {
      addToast({
        color: "danger",
        title: "NOT ALLOWED",
        description: "Only admins are allowed to create subscriptions.",
      });
      handleClose();

      return;
    }
    const payload = {
      services: formData?.services,
    };

    updateFormData({ isLoading: true });
    const response = await createSubscriptionPack(workspaceID, payload);

    if (!response?.success) {
      addToast({
        title: "Error",
        color: "danger",
        description: response?.message,
      });
      updateFormData({ isLoading: false });

      return;
    }

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.SUBSCRIPTION_PACKS, workspaceID],
    });

    addToast({
      title: "Success",
      color: "success",
      description: "Subscriptions created successfully!",
    });
    updateFormData({ isLoading: false });
    handleClose();

    return;
  }

  async function handleUpdateSubscription() {
    if (!permissions?.update || !permissions?.delete) {
      addToast({
        color: "danger",
        title: "NOT ALLOWED",
        description: "Only admins are allowed to update subscriptions.",
      });
      handleClose();

      return;
    }

    const payload = {
      services: formData?.isUpdating
        ? formData.services
        : selectedServicePack?.isUpdating
          ? [selectedServicePack]
          : null,
    };

    if (payload == null) {
      addToast({
        title: "Error",
        color: "danger",
        description: "There are no subscriptions being edited",
      });

      return;
    }

    updateFormData({ isLoading: true });
    updateServiceData({ isLoading: true });
    const response = await updateSubscriptionPack(workspaceID, payload);

    if (!response?.success) {
      addToast({
        title: "Error",
        color: "danger",
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
      title: "Success",
      color: "success",
      description: `Subscription${selectedServicePack?.isUpdating ? "" : "s"} updated successfully!`,
    });
    updateFormData({ isLoading: false });
    updateServiceData({ isLoading: false });
    handleClose();

    return;
  }

  function handleSelectedAction(key) {
    if (key == "update-subscriptions") {
      setFormData((prev) => ({
        ...prev,
        isUpdating: true,
        services: SERVICE_PACKS,
      }));
      onOpen();
    }

    return;
  }

  useEffect(() => {
    // IF NO DATA IS FETCH THEN GET THE LATEST TRANSACTIONS
    if (!mutation.data) {
      mutation.mutateAsync({ start_date, end_date });
    }
  }, []);

  const LATEST_TRANSACTIONS = mutation.data?.data?.data || [];

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <Card className="">
          <div className="mb-8 flex flex-col sm:flex-row justify-between">
            <CardHeader
              classNames={{
                titleClasses: "xl:text-2xl lg:text-xl font-bold",
                infoClasses: "!text-sm xl:text-base",
              }}
              infoText={
                "Members will make payments to you by subscribing to the packs you create"
              }
              title={"Subscription Packs"}
            />
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              {SERVICE_PACKS?.length == 0 && (
                <Button
                  endContent={<PlusIcon className="h-5 w-5" />}
                  isDisabled={isLoadingConfig}
                  onPress={() => {
                    updateServiceData({ isUpdating: false });
                    onOpen();
                  }}
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
                        isDisabled={isLoadingConfig}
                        isLoading={isLoadingConfig}
                        onPress={() => {}}
                      >
                        Manage
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Action event example"
                      onAction={(key) => handleSelectedAction(key)}
                    >
                      <DropdownItem
                        key="update-subscriptions"
                        description="Add new terminals to workspace"
                        startContent={
                          <SquarePenIcon
                            className={cn(
                              "w-5 h-5 pointer-events-none flex-shrink-0"
                            )}
                          />
                        }
                      >
                        Update Subscriptions
                      </DropdownItem>
                      <DropdownItem
                        key="add"
                        description="Add new terminals to workspace"
                        startContent={
                          <PlusIcon
                            className={cn(
                              "w-5 h-5 pointer-events-none flex-shrink-0"
                            )}
                          />
                        }
                      >
                        Add New Members
                      </DropdownItem>
                      <DropdownItem
                        key="view"
                        description="Add new terminals to workspace"
                        startContent={
                          <Users2
                            className={cn(
                              "w-5 h-5 pointer-events-none flex-shrink-0"
                            )}
                          />
                        }
                      >
                        View Members
                      </DropdownItem>

                      <DropdownSection title={"Danger zone"}>
                        <DropdownItem
                          key="delete-users"
                          isReadOnly
                          className="text-danger"
                          classNames={{
                            shortcut:
                              "group-hover:text-white font-bold group-hover:border-white",
                          }}
                          color="danger"
                          description="Remove all members"
                          href="/support"
                          shortcut="⌘⇧D"
                          startContent={
                            <TrashIcon
                              className={
                                "w-5 h-5 pointer-events-none flex-shrink-0 text-danger group-hover:text-white"
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

            <Modal
              backdrop="blur"
              className={"z-[999]"}
              isDismissable={false}
              isOpen={isOpen || selectedServicePack?.isUpdating}
              placement="top-center"
              size={!selectedServicePack?.isUpdating ? "3xl" : undefined}
              onClose={handleClose}
            >
              <ModalContent>
                <ModalHeader className="flex flex-col">
                  <h4 className="text-large font-bold">
                    {selectedServicePack?.isUpdating
                      ? "Edit Subscription Pack"
                      : "Create New Subscription"}
                  </h4>
                  <small className="text-default-500 font-normal -mt-1">
                    Add subscription packs that your members/users can pay for
                  </small>
                </ModalHeader>
                <ModalBody>
                  {selectedServicePack?.isUpdating ? (
                    <>
                      <Input
                        required
                        classNames={{
                          wrapper: "col-span-5",
                        }}
                        label="Name"
                        name={`service-pack-name`}
                        placeholder="subscription Name"
                        value={selectedServicePack?.name}
                        onChange={(e) =>
                          updateServiceData({ name: e.target.value })
                        }
                      />
                      <Input
                        required
                        label="Key (Identifier)"
                        name={`service-pack-key`}
                        value={selectedServicePack?.key}
                        onChange={(e) =>
                          updateServiceData({ key: e.target.value })
                        }
                      />
                      <Input
                        required
                        label="Price"
                        min={1}
                        name={`service-pack-price`}
                        type="number"
                        value={selectedServicePack?.price}
                        onChange={(e) =>
                          updateServiceData({ price: e.target.value })
                        }
                      />
                    </>
                  ) : (
                    <SubscriptionPacks
                      formData={formData}
                      updateFormData={updateFormData}
                    />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    isDisabled={
                      formData?.isLoading || selectedServicePack?.isLoading
                    }
                    onPress={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    isDisabled={
                      formData?.isLoading || selectedServicePack?.isLoading
                    }
                    isLoading={
                      formData?.isLoading || selectedServicePack?.isLoading
                    }
                    onPress={
                      selectedServicePack?.isUpdating || formData?.isUpdating
                        ? handleUpdateSubscription
                        : handleCreateSubscription
                    }
                  >
                    {formData?.isUpdating || selectedServicePack?.isUpdating
                      ? "Save"
                      : "Create"}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>

          <Table
            removeWrapper
            aria-label="SUBSCRIPTION PACK TABLE"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
            items={SERVICE_PACKS}
          >
            <TableHeader>
              <TableColumn>##</TableColumn>
              <TableColumn width={"50%"}>NAME</TableColumn>
              <TableColumn width={"30%"}>KEY</TableColumn>
              <TableColumn align="center" width={"10%"}>
                AMOUNT
              </TableColumn>
              <TableColumn align="center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                "You have no subscription packs configured. Press the 'Create New' button to add a config"
              }
              isLoading={isLoadingConfig}
              loadingContent={
                <div className="relative flex w-full h-36 flex-1 items-center justify-center gap-2 rounded-lg bg-neutral-100/60">
                  <span className="flex gap-4 text-sm sm:text-base font-bold capitalize text-primary">
                    <Spinner size="sm" /> Initializing services...
                  </span>
                </div>
              }
            >
              {SERVICE_PACKS?.map((item, index) => (
                <TableRow key={`${item?.name}-${index}-key`}>
                  <TableCell>
                    {/* <FileBoxIcon className="h-6 w-6" /> */}
                    <span className="text-lg font-bold text-primary">
                      #{index + 1}
                    </span>
                  </TableCell>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>{item?.key || "N/A"}</TableCell>

                  <TableCell>
                    <Chip
                      classNames={{
                        content:
                          "uppercase rounded-sm text-lg font-semibold text-primary",
                      }}
                      color={"primary"}
                      size="lg"
                      variant="flat"
                    >
                      {formatCurrency(item?.price)}
                    </Chip>
                  </TableCell>

                  <TableCell>
                    {item?.name && (
                      <div className="flex items-center gap-4">
                        <Tooltip color="primary" content="Edit Subscription">
                          <SquarePenIcon
                            className="h-5 w-5 cursor-pointer text-primary hover:text-primary-300 outline-none"
                            onClick={() => {
                              updateServiceData({ isUpdating: true, ...item });
                              onOpen();
                            }}
                          />
                        </Tooltip>
                        <Tooltip color="danger" content="Delete Subscription">
                          <TrashIcon
                            className="h-5 w-5 cursor-pointer text-danger hover:text-red-300 outline-none"
                            onClick={() => {
                              // updateServiceData({ isUpdating: true, ...item });
                              // onOpen();
                            }}
                          />
                        </Tooltip>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* RECENT TRANSACTIONS */}
        <Card>
          <div className="flex w-full items-center justify-between gap-4">
            <CardHeader
              className={"mb-4"}
              infoText={
                "Subscription payment transactions made to your workspace wallet in the last 30days."
              }
              title={"Recent Transactions"}
            />
          </div>
          <CustomTable
            // removeWrapper
            classNames={{ wrapper: "shadow-none px-0 mx-0" }}
            columns={SUBSCRIPTION_PAYMENT_COLUMNS}
            isLoading={mutation.isPending}
            rows={LATEST_TRANSACTIONS}
          />
        </Card>
      </div>
    </>
  );
};

function SubscriptionPacks({ formData, updateFormData }) {
  const [lineItems, setLineItems] = useState(
    formData?.services || [{ name: "", price: 0, key: "" }]
  );

  const addLineItem = () => {
    if (
      formData?.services[formData.services.length - 1]?.name === "" ||
      formData?.services[formData.services.length - 1]?.key === "" ||
      formData?.services[formData.services.length - 1]?.price === 0
    ) {
      return;
    }

    // Both updates are good, but they need to happen after the check based on formData.services
    const newLineItem = { name: "", price: 0, key: "" };

    setLineItems((prev) => [...prev, newLineItem]); // Update local state for rendering
    updateFormData({
      services: [...(formData?.services || []), newLineItem], // Update form data
    });
  };

  const removeLineItem = (index) => {
    if (formData?.services.length > 1) {
      const lineItemsCopy = [...formData?.services];

      lineItemsCopy.splice(index, 1);

      setLineItems(lineItemsCopy);
      updateFormData({ services: lineItemsCopy });
    }
  };

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
        {lineItems?.map((_, index) => (
          <div
            key={"pack" + index}
            className="grid grid-cols-1 md:grid-cols-9 gap-2 items-end border-b pb-4 pt-2 -mt-4 last:border-0"
          >
            <Input
              required
              classNames={{
                wrapper: "col-span-3",
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
                wrapper: "col-span-3",
              }}
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
                      key: e.target.value,
                    },
                    ...formData?.services.slice(index + 1),
                  ],
                });
              }}
            />
            <Input
              required
              classNames={{
                wrapper: "col-span-2",
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

            <div className={"flex gap-2 col-span-1"}>
              <Button
                isIconOnly
                color="danger"
                disabled={formData?.services.length === 1}
                type="button"
                variant="flat"
                onClick={() => removeLineItem(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
              <Button
                isIconOnly
                startContent={<PlusIcon className="h-4 w-4" />}
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

export default Subscriptions;
