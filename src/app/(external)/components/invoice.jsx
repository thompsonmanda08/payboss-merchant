"use client";

import React, { useRef, useState } from "react";

import { CloudArrowDownIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "@/lib/utils";
import Logo from "@/components/base/payboss-logo";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Invoice({ invoice }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const captureRef = useRef(null);

  const generatePDF = async (blob) => {
    setIsProcessing(true);
    try {
      const element = captureRef.current;
      if (!element) return;

      // Temporarily hide elements with class 'no-print'
      const noPrintEls = element.querySelectorAll(".no-print");
      noPrintEls.forEach((el) => (el.style.display = "none"));

      const canvas = await html2canvas(element, { scale: 2 }); // higher scale for better quality
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`INV-${invoice?.number}-PB.pdf`);
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
      className="max-w-[800px] mx-auto p-8 bg-white min-h-screen"
    >
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div className="text-gray-700">
            {/* <div className="uppercase text-sm font-bold">YOUR LOGO</div> */}
            <div className="uppercase text-sm font-bold">
              <Logo src={"/images/payboss-logo-light.png"} />
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm">NO. {invoice.number}</span>
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

      <div className="mb-8">
        <div className="text-sm mb-1">Date:</div>
        <div className="font-medium">{invoice.date}</div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <div className="text-sm font-medium mb-2">Billed to:</div>
          <div className="font-medium">{invoice.billedTo.name}</div>
          <div>
            {invoice.billedTo.address}, {invoice.billedTo.city}
          </div>
          <div>{invoice.billedTo.email}</div>
        </div>

        {invoice.from && Object.keys(invoice.from).length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">From:</div>
            <div className="font-medium">{invoice.from.name}</div>
            <div>
              {invoice.from.address}, {invoice.from.city}
            </div>
            <div>{invoice.from.email}</div>
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
            {invoice.items.map((item, index) => (
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
              <td colSpan={3} className="py-4 px-4 text-right font-medium">
                Total
              </td>
              <td className="py-4 px-4 text-right font-bold">
                {formatCurrency(invoice.total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <p className="font-medium max-w-lg">
          Note:
          <span className="text-sm text-muted-foreground mx-1 font-normal">
            {invoice.note || "Thank you for doing business with us!"}
          </span>
        </p>

        <Button size="lg" className="w-full no-print sm:w-auto">
          Pay Invoice ({formatCurrency(invoice.total)})
        </Button>
      </div>

      {/* Wave decoration at the bottom */}
      <div className="relative h-40 mt-16">
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 320" className="w-full">
            <path
              fill="#5776e020"
              fillOpacity="1"
              d="M0,192L80,176C160,160,320,128,480,128C640,128,800,160,960,165.3C1120,171,1280,149,1360,138.7L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
            <path
              fill="#f58b452a"
              fillOpacity="1"
              d="M0,224L80,229.3C160,235,320,245,480,234.7C640,224,800,192,960,181.3C1120,171,1280,181,1360,186.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
