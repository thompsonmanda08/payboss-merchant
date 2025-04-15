import { ErrorCard } from "@/components/base/error-card";
import { capitalize } from "@/lib/utils";

import Invoice from "../../components/invoice";

export async function getInvoice(id) {
  // In a real application, you would fetch this data from your API
  // For example:
  // const res = await fetch(`${process.env.API_URL}/invoices/${id}`)
  // if (!res.ok) return null
  // return res.json()

  // Mock data for demonstration
  return {
    success: true,
    message: "",
    status: 200,
    data: {
      id,
      number: "000001",
      date: "02 June, 2030",
      billedTo: {
        name: "Studio Shodwe",
        address: "123 Anywhere St.",
        city: "Any City",
        email: "hello@reallygreatsite.com",
      },
      from: {
        name: "Olivia Wilson",
        address: "123 Anywhere St.",
        city: "Any City",
        email: "hello@reallygreatsite.com",
      },
      items: [
        {
          description: "Logo",
          quantity: 1,
          price: 500,
          amount: 500,
        },
        {
          description: "Banner (2x6m)",
          quantity: 2,
          price: 45,
          amount: 90,
        },
        {
          description: "Poster (1x2m)",
          quantity: 3,
          price: 55,
          amount: 165,
        },
      ],
      total: 755,
      note: "Payment is due within 15 days. Thank you for your business!",
    },
  };
}

async function InvoicePage(props) {
  const params = await props.params;
  const invoiceID = params?.ID;

  // FIRST POST CHECKOUT DATA TO LOG CHECKOUT INFO FOR VALIDATION
  // const invoice = await getInvoiceDetails(invoiceID);
  const invoice = await getInvoice(invoiceID);

  if (!invoice?.success) {
    return (
      <>
        <ErrorCard
          className={"max-h-fit m-auto"}
          goBack={true}
          message={capitalize(invoice?.message)}
          status={invoice?.status}
          title={"Error"}
        />
      </>
    );
  }

  return (
    <>
      <Invoice invoice={invoice.data} />
    </>
  );
}

export default InvoicePage;
