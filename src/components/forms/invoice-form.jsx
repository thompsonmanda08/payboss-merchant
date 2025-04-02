"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import { formatCurrency, formatDate, notify } from "@/lib/utils";
import { getLocalTimeZone, today } from "@internationalized/date";

import DateSelectField from "@/components/ui/date-select-field";

const INIT_INVOICE = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  invoiceDate: "",
  // dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  dueDate: "", // 30 days from now
  notes: "",
  lineItems: [{ description: "", quantity: 1, unitPrice: 0 }],
};

export default function InvoiceForm() {
  const [lineItems, setLineItems] = useState([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const [formData, setFormData] = useState(INIT_INVOICE);

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

  const calculateTax = (subtotal) => {
    // Assuming a tax rate of 16%
    return subtotal * 0.16;
  };

  const calculateTotal = (subtotal, tax) => {
    return subtotal + tax;
  };
  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { description: "", quantity: 1, unitPrice: 0 },
    ]);
    updateFormData({
      lineItems: [
        ...formData.lineItems,
        { description: "", quantity: 1, unitPrice: 0 },
      ],
    });
  };

  const removeLineItem = (index) => {
    if (lineItems.length > 1) {
      const updatedItems = [...lineItems];
      updatedItems.splice(index, 1);
      setLineItems(updatedItems);

      const formLineItems = [...formData?.lineItems];
      formLineItems.splice(index, 1);
      updateFormData({ lineItems: formLineItems });
    }
  };

  function onSubmit(data) {
    notify({
      title: "Invoice created",
      description: "Your invoice has been created successfully.",
    });
    console.log(data);
    // Here you would typically send the data to your backend
  }

  useEffect(() => {
    return () => {
      setFormData(INIT_INVOICE);
      setLineItems([{ description: "", quantity: 1, unitPrice: 0 }]);
      setIsLoading(false);
    };
  }, []);

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="shadow-none bg-transparent">
          <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
            <h4 className="text-large font-bold">
              Customer & Invoice Information
            </h4>
            <small className="text-default-500">All fields are required</small>
          </CardHeader>

          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                required
                label={"Customer Name"}
                placeholder={"Brick Enterprise"}
                name={"customerName"}
                value={formData?.customerName}
                onChange={handleChange}
              />
              <Input
                required
                label={"Customer Email"}
                placeholder={"brick@enterprise.com"}
                name={"customerEmail"}
                value={formData?.customerEmail}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                required
                label={"Phone Number"}
                placeholder={"0977 XXX XXX"}
                name={"customerPhone"}
                value={formData?.customerPhone}
                onChange={handleChange}
              />
              <Input
                required
                label={"Address"}
                placeholder={"87A Main Street, Ibex hill"}
                name={"customerAddress"}
                value={formData?.customerAddress}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Input
                required
                label={"Invoice Number "}
                name={"invoiceNumber"}
                value={formData?.invoiceNumber}
                onChange={handleChange}
              />
              <DateSelectField
                label={"Invoice Date"}
                className="max-w-sm"
                classNames={{
                  label: "-mt-1.5",
                }}
                // description={"Date the invoice was issued"}
                defaultValue={formData?.invoiceDate}
                value={
                  formData?.invoiceDate &&
                  `${formData?.invoiceDate}`?.split("").length > 9
                    ? formData?.invoiceDate
                    : ""
                }
                labelPlacement={"outside"}
                required={true}
                maxValue={today(getLocalTimeZone())}
                onChange={(date) => {
                  updateFormData({
                    invoiceDate: formatDate(date, "YYYY-MM-DD"),
                  });
                }}
              />
              <DateSelectField
                label={"Due Date"}
                className="max-w-sm"
                classNames={{
                  label: "-mt-1.5",
                }}
                // description={"Date the invoice is due"}
                defaultValue={formData?.dueDate}
                value={
                  formData?.dueDate &&
                  String(formData?.dueDate)?.split("").length > 9
                    ? formData?.dueDate
                    : ""
                }
                labelPlacement={"outside"}
                required={true}
                minValue={today(getLocalTimeZone())}
                onChange={(date) => {
                  updateFormData({
                    dueDate: formatDate(date, "YYYY-MM-DD"),
                  });
                }}
              />
            </div>

            {/* INVOICE NOTES - VISIBLE FOR XL SCREENS ONLY */}
            <div className="hidden xl:block">
              <label
                htmlFor="message"
                className="block text-sm font-medium leading-6 text-foreground/50 "
              >
                Notes
              </label>
              <div className="mt-2">
                <textarea
                  rows={3}
                  name="notes"
                  placeholder="Additional notes or payment instructions"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/80 sm:text-sm sm:leading-6"
                  value={formData?.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-none bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between">
            <h4 className="text-large font-bold">Line Items</h4>

            <Button
              type="button"
              variant="flat"
              size="sm"
              onClick={addLineItem}
              startContent={<PlusIcon className="h-4 w-4" />}
              className={"bg-primary/10"}
            >
              Add Item
            </Button>
          </CardHeader>
          <CardBody className="gap-3 max-h-[360px] no-scrollbarr overflow-y-auto ">
            {lineItems.map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-9 gap-2 items-end border-b pb-4 last:border-0 "
              >
                <Input
                  required
                  label="Description"
                  placeholder="Item description"
                  classNames={{
                    wrapper: "col-span-5",
                  }}
                  name={`lineItems.${index}.description`}
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
                  label="Qty"
                  type="number"
                  classNames={{
                    wrapper: "col-span-1",
                  }}
                  min={1}
                  name={`lineItems.${index}.description`}
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
                  label="Unit Price"
                  type="number"
                  classNames={{
                    wrapper: "col-span-2",
                  }}
                  name={`lineItems.${index}.unitPrice`}
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
                  type="button"
                  variant="flat"
                  color="danger"
                  className={"col-span-1"}
                  isIconOnly
                  onClick={() => removeLineItem(index)}
                  disabled={lineItems.length === 1}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* INVOICE NOTES - VISIBLE ON ANY SCREEN THE IS IS NOT XL */}
        <div className="xl:hidden">
          <label
            htmlFor="message"
            className="block text-sm font-medium leading-6 text-foreground/50 "
          >
            Notes
          </label>
          <div className="mt-2">
            <textarea
              rows={3}
              name="notes"
              placeholder="Additional notes or payment instructions"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/80 sm:text-sm sm:leading-6"
              value={formData?.notes}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <Card className="shadow-none bg-transparent">
        <CardBody className="">
          <div className="space-y-2">
            {(() => {
              const subtotal = calculateSubtotal() || 0;
              const tax = calculateTax(subtotal) || 0;
              const total = calculateTotal(subtotal, tax) || 0;

              return (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>{formatCurrency(subtotal.toFixed(2))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (17%):</span>
                    <span>{formatCurrency(tax.toFixed(2))}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(total.toFixed(2))}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </CardBody>
        <CardFooter>
          <Button type="submit" className="w-full">
            Create Invoice
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
