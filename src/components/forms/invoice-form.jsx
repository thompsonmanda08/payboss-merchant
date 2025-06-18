"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Tab,
  Tabs,
  NumberInput,
  addToast,
} from "@heroui/react";

import {
  DocumentTextIcon,
  ListBulletIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";

import { formatCurrency, formatDate } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-field";
import { createInvoice } from "@/app/_actions/vas-actions";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { useWorkspaceInit } from "@/hooks/useQueryHooks";

const INIT_INVOICE = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  // invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  // invoiceDate: "",
  // dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  dueDate: "", // 30 days from now
  notes: "",
  taxRate: 0,
  tax: 0,
  lineItems: [{ description: "", quantity: 1, unitPrice: 0 }],
};

export default function InvoiceForm({ workspaceID, handleClosePrompts }) {
  const queryClient = useQueryClient();

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  const permissions = workspaceInit?.data?.workspacePermissions;

  const [formData, setFormData] = useState(INIT_INVOICE);
  const [selectedTab, setSelectedTab] = useState("invoice-details");
  const [isLoading, setIsLoading] = useState(false);

  const thirtyDaysAgoDate = new Date();

  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  const start_date = formatDate(thirtyDaysAgoDate, "YYYY-MM-DD");
  const end_date = formatDate(new Date(), "YYYY-MM-DD");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function updateFormData(fields) {
    setFormData((prev) => ({ ...prev, ...fields }));
  }

  const calculateSubtotal = () => {
    return formData.lineItems.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  };

  const calculateTax = (subtotal, taxRate = 0) => {
    // Defaults taxRate to 0 if no value is provided
    return subtotal * taxRate;
  };

  const calculateTotal = (subtotal, tax) => {
    return subtotal + tax;
  };

  function isValidDetails() {
    if (
      !formData?.customerName ||
      !formData?.customerEmail ||
      !formData?.customerPhone ||
      !formData?.customerAddress
    ) {
      return false;
    }

    return true;
  }

  async function onSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    if (selectedTab == "invoice-details" && isValidDetails()) {
      setSelectedTab("invoice-items");
      setIsLoading(false);
      return;
    }

    const subtotal = calculateSubtotal() || 0;
    const tax = calculateTax(subtotal, formData?.taxRate) || 0;
    const total = calculateTotal(subtotal, tax) || 0;

    const invoiceData = {
      customer_name: formData?.customerName,
      customer_email: formData?.customerEmail,
      customer_phone_number: formData?.customerPhone,
      customer_address: formData?.customerAddress,
      items: formData?.lineItems?.map((item) => {
        return {
          description: item?.description,
          quantity: String(item?.quantity),
          unit_price: String(item?.unitPrice),
        };
      }),
      tax_rate: String(formData?.taxRate * 100),
      tax: String(tax.toFixed(2)),
      total: String(total.toFixed(2)),
    };

    const response = await createInvoice(workspaceID, invoiceData);

    if (response?.success) {
      addToast({
        title: "Invoice created",
        description: "Invoice created successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVOICES, workspaceID],
      });
      handleClosePrompts();
    } else {
      addToast({
        title: "Error",
        description: response.message,
        color: "danger",
      });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      setFormData(INIT_INVOICE);
      setIsLoading(false);
    };
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="h-screen max-h-[calc(100svh-80px)] flex flex-col"
    >
      <div className="flex-col items-start pb-4 pt-2">
        <h4 className="text-large font-bold">Client & Invoice Information</h4>
        <small className="text-default-500">All fields are required</small>
      </div>
      <Tabs
        aria-label="payment-methods"
        className="w-full"
        classNames={{
          tabList: "w-full p-1",
        }}
        color="primary"
        radius="sm"
        selectedKey={selectedTab}
        size="lg"
        variant="bordered"
        onSelectionChange={(key) => {
          if (!isValidDetails() && key == "invoice-items") {
            addToast({
              color: "warning",
              title: "Missing Fields",
              description: "Required fields are missing!",
            });
            return;
          }
          setSelectedTab(key);
        }}
      >
        <Tab
          key={"invoice-details"}
          className="gap-2 flex flex-col"
          title={
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="h-5 w-5" />
              <span>Invoice Details</span>
            </div>
          }
        >
          <InvoiceDetails
            key={"details"}
            formData={formData}
            updateFormData={updateFormData}
            handleChange={handleChange}
          />
        </Tab>

        <Tab
          key="invoice-items"
          className="gap-2  flex flex-col"
          title={
            <div className="flex items-center space-x-2">
              <ListBulletIcon className="h-5 w-5" />
              <span>Invoice Items</span>
            </div>
          }
        >
          <InvoiceItems
            key="items"
            formData={formData}
            updateFormData={updateFormData}
          />
        </Tab>
      </Tabs>
      <div className="flex flex-col gap-1 mt-auto">
        {(() => {
          const subtotal = calculateSubtotal() || 0;
          const tax = calculateTax(subtotal, formData?.taxRate);
          const total = calculateTotal(subtotal, tax) || 0;

          return (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground ml-2">Subtotal:</span>
                <span>{formatCurrency(subtotal.toFixed(2))}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-muted-foreground flex gap-2 items-center">
                  <NumberInput
                    required
                    radius="sm"
                    minValue={0}
                    maxValue={100}
                    startContent="Tax: "
                    labelPlacement="outside"
                    formatOptions={{
                      style: "percent",
                    }}
                    className="w-28 -ml-2"
                    classNames={{
                      input: "shadow-none outline-transparent",
                      errorMessage: "text-nowrap",
                    }}
                    validate={(value) => {
                      if (value < 0) {
                        return "Tax percentage can't be less than 0";
                      }

                      if (value > 100) {
                        return "Tax percentage must be less than 100";
                      }

                      return null;
                    }}
                    name={"taxRate"}
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        taxRate: value,
                        tax,
                      }));
                    }}
                    value={formData?.taxRate}
                  />
                </div>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <span className="text-base ml-2">Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </>
          );
        })()}
      </div>
      <Button
        className="w-full my-4 min-h-9"
        isLoading={isLoading}
        isDisabled={isLoading}
        loadingText={"Processing..."}
        type="submit"
      >
        {selectedTab == "invoice-details" ? "Next" : "Create Invoice"}
      </Button>
    </form>
  );
}

function InvoiceDetails({ formData, updateFormData, handleChange }) {
  return (
    <div className="shadow-none bg-transparent">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            required
            label={"Customer Name"}
            name={"customerName"}
            placeholder={"Brick Enterprise"}
            value={formData?.customerName}
            onChange={handleChange}
          />
          <Input
            required
            label={"Customer Email"}
            name={"customerEmail"}
            type={"email"}
            placeholder={"brick@enterprise.com"}
            value={formData?.customerEmail}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            required
            label={"Phone Number"}
            name={"customerPhone"}
            placeholder={"0977 XXX XXX"}
            value={formData?.customerPhone}
            onChange={handleChange}
          />
          <Input
            required
            label={"Address"}
            name={"customerAddress"}
            placeholder={"87A Main Street, Ibex hill"}
            value={formData?.customerAddress}
            onChange={handleChange}
          />
        </div>

        {/* INVOICE NUMBERS AND DATES */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Input
            required
            label={"Invoice Number "}
            name={"invoiceNumber"}
            value={formData?.invoiceNumber}
            onChange={handleChange}
          />
          <DateSelectField
            className="max-w-sm"
            defaultValue={formData?.invoiceDate}
            classNames={{
              label: "-mt-1.5",
            }}
            // description={"Date the invoice was issued"}
            label={"Invoice Date"}
            labelPlacement={"outside"}
            maxValue={today(getLocalTimeZone())}
            required={true}
            value={
              formData?.invoiceDate &&
              `${formData?.invoiceDate}`?.split("").length > 9
                ? formData?.invoiceDate
                : ""
            }
            onChange={(date) => {
              updateFormData({
                invoiceDate: formatDate(date, "YYYY-MM-DD"),
              });
            }}
          />
          <DateSelectField
            className="max-w-sm"
            defaultValue={formData?.dueDate}
            classNames={{
              label: "-mt-1.5",
            }}
            // description={"Date the invoice is due"}
            label={"Due Date"}
            labelPlacement={"outside"}
            minValue={today(getLocalTimeZone())}
            required={true}
            value={
              formData?.dueDate &&
              String(formData?.dueDate)?.split("").length > 9
                ? formData?.dueDate
                : ""
            }
            onChange={(date) => {
              updateFormData({
                dueDate: formatDate(date, "YYYY-MM-DD"),
              });
            }}
          />
        </div> */}

        {/* INVOICE NOTES */}
        {/* <div className="">
          <label
            className="block text-sm font-medium leading-6 text-foreground/50 "
            htmlFor="message"
          >
            Notes
          </label>
          <textarea
            required
            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/80 sm:text-sm sm:leading-6 p-3"
            name="notes"
            placeholder="Additional notes or payment instructions"
            rows={3}
            value={formData?.notes}
            onChange={handleChange}
          />
        </div> */}
      </div>
    </div>
  );
}

function InvoiceItems({ formData, updateFormData }) {
  const [lineItems, setLineItems] = useState([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { description: "", quantity: 1, unitPrice: 0 },
    ]);
    updateFormData({
      lineItems: [
        ...formData?.lineItems,
        { description: "", quantity: 1, unitPrice: 0 },
      ],
    });
  };

  const removeLineItem = (index) => {
    if (formData?.lineItems.length > 1) {
      // const updatedLineItems = formData.lineItems.filter((_, i) => i !== index);
      // Create a copy of the array first
      const lineItemsCopy = [...lineItems];
      lineItemsCopy.splice(index, 1);

      setLineItems(lineItemsCopy);
      updateFormData({ lineItems: lineItemsCopy });
    }
  };

  return (
    <Card className="shadow-none bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between">
        <h4 className="text-large font-bold">Line Items</h4>

        <Button
          className={"bg-primary/10"}
          size="sm"
          startContent={<PlusIcon className="h-4 w-4" />}
          type="button"
          variant="flat"
          onClick={addLineItem}
        >
          Add Item
        </Button>
      </CardHeader>
      <CardBody className="gap-3 max-h-[300px] overflow-y-auto ">
        {lineItems?.map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-9 gap-2 items-end border-b pb-4 last:border-0 "
          >
            <Input
              required
              classNames={{
                wrapper: "col-span-5",
              }}
              label="Description"
              name={`lineItems.${index}.description`}
              placeholder="Item description"
              value={formData?.lineItems[index]?.description}
              onChange={(e) => {
                updateFormData({
                  lineItems: [
                    ...formData?.lineItems.slice(0, index),
                    {
                      ...formData?.lineItems[index],
                      description: e.target.value,
                    },
                    ...formData?.lineItems.slice(index + 1),
                  ],
                });
              }}
            />
            <Input
              required
              classNames={{
                wrapper: "col-span-1",
              }}
              label="Qty"
              min={1}
              name={`lineItems.${index}.description`}
              type="number"
              value={formData?.lineItems[index]?.quantity}
              onChange={(e) => {
                updateFormData({
                  lineItems: [
                    ...formData?.lineItems.slice(0, index),
                    {
                      ...formData?.lineItems[index],
                      quantity: e.target.value,
                    },
                    ...formData?.lineItems.slice(index + 1),
                  ],
                });
              }}
            />
            <Input
              required
              classNames={{
                wrapper: "col-span-2",
              }}
              label="Unit Price"
              name={`lineItems.${index}.unitPrice`}
              type="number"
              value={formData?.lineItems[index]?.unitPrice}
              onChange={(e) => {
                updateFormData({
                  lineItems: [
                    ...formData?.lineItems.slice(0, index),
                    {
                      ...formData?.lineItems[index],
                      unitPrice: e.target.value,
                    },
                    ...formData?.lineItems.slice(index + 1),
                  ],
                });
              }}
            />
            <Button
              isIconOnly
              className={"col-span-1"}
              color="danger"
              disabled={formData?.lineItems.length === 1}
              type="button"
              variant="flat"
              onClick={() => removeLineItem(index)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
