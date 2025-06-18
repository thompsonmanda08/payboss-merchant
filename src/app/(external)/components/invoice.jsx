"use client";

import React, { useRef, useState } from "react";

import { CloudArrowDownIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { cn, formatCurrency } from "@/lib/utils";
import Logo from "@/components/base/payboss-logo";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Link, RadioGroup, useDisclosure } from "@heroui/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import Image from "next/image";
import { slideDownInView } from "@/lib/constants";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input-field";
import CustomRadioButton from "@/components/ui/radio-button";
import PromptModal from "@/components/base/prompt-modal";

export default function Invoice({ invoice, className, classNames }) {
  const captureRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatter = useDateFormatter({ dateStyle: "long" });
  const [paymentType, setPaymentType] = useState("FULL_PAYMENT");
  const [amount, setAmount] = useState(
    invoice?.dueAmount || invoice?.totalAmount || 0
  );

  const generatePDF = async () => {
    setIsProcessing(true);
    try {
      const element = captureRef.current;
      if (!element) return;

      // Temporarily hide elements with class 'no-print'
      const noPrintEls = element.querySelectorAll(".no-print");
      noPrintEls.forEach((el) => (el.style.display = "none"));

      const canvas = await html2canvas(element, { scale: 2, useCORS: true }); // higher scale for better quality
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        pageSize: "a4",
        orientation: "portrait",
        unit: "mm",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${invoice?.invoiceID}.pdf`);

      noPrintEls.forEach((el) => (el.style.display = "flex"));
      setIsProcessing(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isInvalidAmount = amount > invoice?.dueAmount || amount < 1;

  return (
    <>
      <div
        ref={captureRef}
        className={cn(
          "max-w-[800px] relative mx-auto p-8 bg-white min-h-screen rounded-lg shadow-xl shadow-primary/5 w-full",
          className,
          classNames?.wrapper
        )}
      >
        {invoice?.status?.toUpperCase() === "PAID" && (
          <div className="absolute left-24 bottom-0 opacity-10 max-w-sm aspect-square m-auto z-30">
            <Image
              unoptimized
              alt="payment-status stamp"
              className="z-0 h-full w-full object-contain "
              height={200}
              loading="lazy"
              src={"/images/paid.png"}
              width={480}
            />
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-between items-start">
            <div className="text-gray-700">
              <div className="uppercase text-sm max-w-[100px] font-bold h-16 ">
                <Logo
                  className={"object-contain w-full h-full"}
                  src={invoice?.from?.logo || "/images/payboss-logo-light.png"}
                />
              </div>
            </div>
            <div className="text-right text-sm ">
              NO. <span className="font-medium"> {invoice?.invoiceID}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <h1 className="text-5xl font-bold uppercase mb-8">INVOICE</h1>
          <div className="flex gap-2 no-print">
            <Button
              variant="faded"
              size="sm"
              onPress={handlePrint}
              startContent={<PrinterIcon className="h-5 w-5" />}
            >
              Print
            </Button>
            <Button
              size="sm"
              onPress={generatePDF}
              isLoading={isProcessing}
              loadingText={"Processing..."}
            >
              <CloudArrowDownIcon className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm mb-1">Date:</div>
          <div className="font-medium">
            {invoice?.date
              ? formatter.format(
                  parseDate(invoice?.date.split("T")[0]).toDate(
                    getLocalTimeZone()
                  )
                )
              : "---"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <div className="text-sm font-medium mb-2">Billed to:</div>
            <div className="font-medium">{invoice?.billedTo.name}</div>
            <div>
              {invoice?.billedTo.address}, {invoice?.billedTo.city}
            </div>
            <div>{invoice?.billedTo.email}</div>
          </div>

          {invoice?.checkoutUrl && (
            <div>
              <div className="text-sm font-medium mb-2">From:</div>
              <div className="font-medium">{invoice?.from.name}</div>
              <div>{invoice?.from.address}</div>
              <div>{invoice?.from.city}</div>
              <div>{invoice?.from.phone}</div>
              <div>{invoice?.from.email}</div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-50 text-primary">
                <th className="text-left py-2 px-4">Item</th>
                <th className="text-center py-2 px-4">Quantity</th>
                <th className="text-center py-2 px-4">Price</th>
                <th className="text-right py-2 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice?.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">{item?.description}</td>
                  <td className="py-3 px-4 text-center">{item?.quantity}</td>
                  <td className="py-3 px-4 text-center">
                    {formatCurrency(item?.price)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(item?.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="pt-2 px-4 text-right font-medium">
                  Tax: ({invoice?.taxRate}%)
                </td>
                <td className=" px-4 text-right font-semibold">
                  {formatCurrency(invoice?.tax)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="pt-2 px-4 text-right font-medium">
                  Total
                </td>
                <td className=" px-4 text-right font-semibold">
                  {formatCurrency(invoice?.total)}
                </td>
              </tr>
              <tr className="no-print">
                <td
                  colSpan={3}
                  className="pb-4 pt-2 px-4 text-right font-medium"
                >
                  Balance
                </td>
                <td className="pb-4 pt-2 px-4 text-right font-bold">
                  {formatCurrency(invoice?.dueAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="font-medium max-w-lg">
            Note:
            <span className="text-sm text-muted-foreground mx-1 font-normal">
              {invoice?.note || "Thank you for doing business with us!"}
            </span>
          </p>

          {(invoice?.status?.toUpperCase() == "PENDING" ||
            invoice?.status?.toUpperCase() == "PARTIAL_PAYMENT") &&
            invoice?.checkoutUrl && (
              <Button
                onPress={onOpen}
                target="_blank"
                size="lg"
                className="w-full no-print sm:w-auto"
              >
                Proceed to Pay
              </Button>
            )}
        </div>
      </div>

      <PromptModal
        backdrop="blur"
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        onOpen={onOpen}
        className={"max-w-md "}
        size="sm"
        removeActionButtons
      >
        <div className="flex flex-col gap-4 flex-1 justify-center items-center p-4 pb-6">
          <RadioGroup
            className="flex w-full"
            defaultValue={"FULL_PAYMENT"}
            description="PayBoss invoices can be paid in full or in partial payments."
            label="How would you like to proceed?"
            onChange={(e) => {
              if (e.target.value == "FULL_PAYMENT") {
                setAmount(invoice?.dueAmount);
              }

              setPaymentType(e.target.value);
            }}
          >
            <div className="mt-2 flex flex-col items-center gap-2 md:gap-5">
              <CustomRadioButton
                description="Make a full payment"
                value="FULL_PAYMENT"
              >
                <p className="mb-1 font-semibold">Full Payment</p>
              </CustomRadioButton>

              <CustomRadioButton
                description="Make payments in installments"
                disabled={true}
                value="PARTIAL_PAYMENT"
              >
                <p className="mb-1 font-semibold">Partial Payment</p>
              </CustomRadioButton>
            </div>
          </RadioGroup>
          {paymentType == "PARTIAL_PAYMENT" && (
            <motion.div className="my-2 w-full" whileInView={slideDownInView}>
              <Input
                // isDisabled={isLoading}
                min={0}
                value={amount}
                max={invoice?.dueAmount}
                onError={isInvalidAmount}
                errorText={`Amount should be between ${formatCurrency(1)} and ${formatCurrency(invoice?.dueAmount)}`}
                className="no-print h-12"
                type="number"
                placeholder="Enter an amount"
                onChange={(e) => setAmount(e.target.value)}
              />
            </motion.div>
          )}
          <div className="flex items-end w-full gap-2 justify-end">
            {(invoice?.status?.toUpperCase() == "PENDING" ||
              invoice?.status?.toUpperCase() == "PARTIAL_PAYMENT") &&
              invoice?.checkoutUrl && (
                <Button
                  as={Link}
                  href={
                    !isInvalidAmount
                      ? `${invoice?.checkoutUrl}&amount=${amount}`
                      : "#"
                  }
                  isDisabled={isInvalidAmount}
                  target="_blank"
                  size="lg"
                  className="flex-1"
                >
                  Pay ({formatCurrency(amount)})
                </Button>
              )}
          </div>
        </div>
      </PromptModal>
    </>
  );
}
