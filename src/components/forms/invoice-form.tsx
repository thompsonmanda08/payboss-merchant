'use client';

import {
  FileText as DocumentTextIcon,
  List as ListBulletIcon,
  Trash2 as TrashIcon,
  Plus as PlusIcon,
} from 'lucide-react';
import {
  Card,
  CardBody,
  CardHeader,
  Tab,
  Tabs,
  NumberInput,
  addToast,
} from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import { createInvoice } from '@/app/_actions/vas-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input-field';
import { useWorkspaceInit } from '@/hooks/use-query-data';
import { QUERY_KEYS } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/utils';

const INIT_INVOICE: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  // invoiceNumber: string;
  // invoiceDate: string;
  dueDate: string;
  notes: string;
  taxRate: number;
  tax: number;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
} = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  customerAddress: '',
  // invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  // invoiceDate: "",
  // dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  dueDate: '', // 30 days from now
  notes: '',
  taxRate: 0,
  tax: 0,
  lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
};

export default function InvoiceForm({
  workspaceID,
  handleClosePrompts,
}: {
  workspaceID: string;
  handleClosePrompts: () => void;
}) {
  const queryClient = useQueryClient();

  // const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  // const permissions = workspaceInit?.data?.workspacePermissions;

  const [formData, setFormData] = useState(INIT_INVOICE);
  const [selectedTab, setSelectedTab] = useState('invoice-details');
  const [isLoading, setIsLoading] = useState(false);

  // const thirtyDaysAgoDate = new Date();

  // thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  // const start_date = formatDate(thirtyDaysAgoDate, 'YYYY-MM-DD');
  // const end_date = formatDate(new Date(), 'YYYY-MM-DD');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function updateFormData(fields: Partial<typeof formData>) {
    setFormData((prev) => ({ ...prev, ...fields }));
  }

  const calculateSubtotal = () => {
    return formData.lineItems.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0,
    );
  };

  const calculateTax = (subtotal: number, taxRate = 0) => {
    // Defaults taxRate to 0 if no value is provided
    return subtotal * taxRate;
  };

  const calculateTotal = (subtotal: number, tax: number) => {
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);

    if (selectedTab == 'invoice-details' && isValidDetails()) {
      setSelectedTab('invoice-items');
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
        title: 'Invoice created',
        description: 'Invoice created successfully.',
        color: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVOICES, workspaceID],
      });
      handleClosePrompts();
    } else {
      addToast({
        title: 'Error',
        description: response.message,
        color: 'danger',
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
      className="h-screen max-h-[calc(100svh-80px)] flex flex-col"
      onSubmit={onSubmit}
    >
      <div className="flex-col items-start pb-4 pt-2">
        <h4 className="text-large font-bold">Client & Invoice Information</h4>
        <small className="text-default-500">All fields are required</small>
      </div>
      <Tabs
        aria-label="payment-methods"
        className="w-full"
        classNames={{
          tabList: 'w-full p-1',
        }}
        color="primary"
        radius="sm"
        selectedKey={selectedTab}
        size="lg"
        variant="bordered"
        onSelectionChange={(key) => {
          if (!isValidDetails() && key == 'invoice-items') {
            addToast({
              color: 'warning',
              title: 'Missing Fields',
              description: 'Required fields are missing!',
            });

            return;
          }
          setSelectedTab(key as string);
        }}
      >
        <Tab
          key={'invoice-details'}
          className="gap-2 flex flex-col"
          title={
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="h-5 w-5" />
              <span>Invoice Details</span>
            </div>
          }
        >
          <InvoiceDetails
            key={'details'}
            formData={formData}
            handleChange={handleChange}
            updateFormData={updateFormData}
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
                    className="w-28 -ml-2"
                    classNames={{
                      input: 'shadow-none outline-transparent',
                      errorMessage: 'text-nowrap',
                    }}
                    formatOptions={{
                      style: 'percent',
                    }}
                    labelPlacement="outside"
                    maxValue={100}
                    minValue={0}
                    name={'taxRate'}
                    radius="sm"
                    startContent="Tax: "
                    validate={(value) => {
                      if (value < 0) {
                        return "Tax percentage can't be less than 0";
                      }

                      if (value > 100) {
                        return 'Tax percentage must be less than 100';
                      }

                      return null;
                    }}
                    value={formData?.taxRate}
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        taxRate: value,
                        tax,
                      }));
                    }}
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
        isDisabled={isLoading}
        isLoading={isLoading}
        loadingText={'Processing...'}
        type="submit"
      >
        {selectedTab == 'invoice-details' ? 'Next' : 'Create Invoice'}
      </Button>
    </form>
  );
}

function InvoiceDetails({
  formData,
  updateFormData,
  handleChange,
}: {
  formData: Partial<typeof INIT_INVOICE>;
  updateFormData: (fields: Partial<typeof formData>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="shadow-none bg-transparent">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            required
            label={'Customer Name'}
            name={'customerName'}
            placeholder={'Brick Enterprise'}
            value={formData?.customerName}
            onChange={handleChange}
          />
          <Input
            required
            label={'Customer Email'}
            name={'customerEmail'}
            placeholder={'brick@enterprise.com'}
            type={'email'}
            value={formData?.customerEmail}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            required
            label={'Phone Number'}
            name={'customerPhone'}
            placeholder={'0977 XXX XXX'}
            value={formData?.customerPhone}
            onChange={handleChange}
          />
          <Input
            required
            label={'Address'}
            name={'customerAddress'}
            placeholder={'87A Main Street, Ibex hill'}
            value={formData?.customerAddress}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

function InvoiceItems({
  formData,
  updateFormData,
}: {
  formData: Partial<typeof INIT_INVOICE>;
  updateFormData: (fields: Partial<typeof formData>) => void;
}) {
  const [lineItems, setLineItems] = useState([
    { description: '', quantity: 1, unitPrice: 0 },
  ]);

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { description: '', quantity: 1, unitPrice: 0 },
    ]);
    updateFormData({
      lineItems: [
        ...(formData?.lineItems ?? []),
        { description: '', quantity: 1, unitPrice: 0 },
      ],
    });
  };

  const removeLineItem = (index: number) => {
    if (formData?.lineItems && formData?.lineItems?.length > 1) {
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
          className={'bg-primary/10'}
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
                wrapper: 'col-span-5',
              }}
              label="Description"
              name={`lineItems.${index}.description`}
              placeholder="Item description"
              value={formData?.lineItems?.[index]?.description}
              onChange={(e) => {
                updateFormData({
                  lineItems: [
                    ...(formData?.lineItems ?? [])?.slice(0, index),
                    {
                      description: e.target.value,
                      quantity: formData?.lineItems?.[index]?.quantity ?? 1,
                      unitPrice: formData?.lineItems?.[index]?.unitPrice ?? 0,
                    },
                    ...(formData?.lineItems ?? [])?.slice(index + 1),
                  ],
                });
              }}
            />
            <Input
              required
              classNames={{
                wrapper: 'col-span-1',
              }}
              label="Qty"
              min={1}
              name={`lineItems.${index}.description`}
              type="number"
              value={formData?.lineItems?.[index]?.quantity}
              onChange={(e) => {
                updateFormData({
                  lineItems: [
                    ...(formData?.lineItems ?? [])?.slice(0, index),
                    {
                      ...formData?.lineItems?.[index],
                      quantity: Number(e.target.value) ?? 1,
                      unitPrice: formData?.lineItems?.[index]?.unitPrice ?? 0,
                      description:
                        formData?.lineItems?.[index]?.description ?? '',
                    },
                    ...(formData?.lineItems ?? [])?.slice(index + 1),
                  ],
                });
              }}
            />
            <Input
              required
              classNames={{
                wrapper: 'col-span-2',
              }}
              label="Unit Price"
              name={`lineItems.${index}.unitPrice`}
              type="number"
              value={formData?.lineItems?.[index]?.unitPrice}
              onChange={(e) => {
                updateFormData({
                  lineItems: [
                    ...(formData?.lineItems ?? []).slice(0, index),
                    {
                      ...formData?.lineItems?.[index],
                      quantity: formData?.lineItems?.[index]?.quantity ?? 1,
                      unitPrice: Number(e.target.value) ?? 1,
                      description:
                        formData?.lineItems?.[index]?.description ?? '',
                    },
                    ...(formData?.lineItems ?? [])?.slice(index + 1),
                  ],
                });
              }}
            />
            <Button
              isIconOnly
              className={'col-span-1'}
              color="danger"
              disabled={formData?.lineItems && formData?.lineItems.length === 1}
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
