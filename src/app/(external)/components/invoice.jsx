"use client";

import React, { useRef, useState } from "react";

import { CloudArrowDownIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { formatCurrency, formatDate } from "@/lib/utils";
import Logo from "@/components/base/payboss-logo";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Link } from "@heroui/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import Image from "next/image";

export default function Invoice({ invoice }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const captureRef = useRef(null);

  const formatter = useDateFormatter({ dateStyle: "long" });

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

  return (
    <div
      ref={captureRef}
      className="max-w-[800px] relative mx-auto p-8 bg-white min-h-screen rounded-lg shadow-xl shadow-primary/5 "
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
            <div className="uppercase text-sm font-bold h-16 ">
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

        {invoice?.from && Object.keys(invoice?.from).length > 0 && (
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
                <td className="py-3 px-4">{item.description}</td>
                <td className="py-3 px-4 text-center">{item.quantity}</td>
                <td className="py-3 px-4 text-center">
                  {formatCurrency(item.price)}
                </td>
                <td className="py-3 px-4 text-right">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="pt-2 px-4 text-right font-medium">
                Tax
              </td>
              <td className=" px-4 text-right font-semibold">
                {formatCurrency(invoice?.tax)}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="pb-4 pt-2 px-4 text-right font-medium">
                Total
              </td>
              <td className="pb-4 pt-2 px-4 text-right font-bold">
                {formatCurrency(invoice?.total)}
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

        {invoice?.status?.toUpperCase() !== "PAID" && (
          <Button
            as={Link}
            href={invoice?.checkoutUrl}
            target="_blank"
            size="lg"
            className="w-full no-print sm:w-auto"
          >
            Pay Invoice ({formatCurrency(invoice?.total)})
          </Button>
        )}
      </div>
    </div>
  );
}
