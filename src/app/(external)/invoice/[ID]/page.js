import { ErrorCard } from "@/components/base/error-card";
import { capitalize } from "@/lib/utils";
import { getInvoiceDetails } from "@/app/_actions/vas-actions";

import Invoice from "../../components/invoice";

async function InvoicePage(props) {
  const params = await props.params;
  const ID = params?.ID;

  const response = await getInvoiceDetails(ID);

  if (!response?.success || !response?.data?.invoice_id) {
    return (
      <>
        <ErrorCard
          className={"max-h-fit m-auto"}
          goBack={true}
          message={
            !response?.data?.invoice_id
              ? "Could not find invoice with the provided ID"
              : capitalize(response?.message)
          }
          status={response?.status}
          title={!response?.data?.invoice_id ? "Invoice not found" : "Error"}
        />
      </>
    );
  }

  const invoice = {
    id: response?.data?.id || ID,
    workspaceID: response?.data?.workspace_id,
    invoiceID: response?.data?.invoice_id,
    date: response?.data?.created_at,
    from: {
      name: response?.data?.from?.display_name,
      address: response?.data?.from?.physical_address,
      logo: response?.data?.from?.logo,
      city: response?.data?.from?.city,
      email: "",
    },
    billedTo: {
      name: response?.data?.customer_name,
      address: response?.data?.customer_address,
      city: response?.data?.city,
      phone: response?.data?.customer_phone_number,
      email: response?.data?.customer_email,
    },
    items: response?.data?.items?.map((item) => ({
      description: item?.description,
      quantity: parseInt(String(item?.quantity || "0")),
      price: parseFloat(String(item?.unit_price || "0")),
      amount: parseFloat(
        parseInt(String(item?.quantity || "0")) *
          parseFloat(String(item?.unit_price || "0")),
      ),
    })),
    taxRate: parseFloat(String(response?.data?.tax_rate || "0")),
    tax: parseFloat(String(response?.data?.tax || "0")),
    paidAmount: parseFloat(String(response?.data?.paid_amount || "0")),
    dueAmount: parseFloat(String(response?.data?.balance || "0")),
    total: parseFloat(String(response?.data?.total || "0")),
    checkoutUrl: response?.data?.checkout_link,
    status: response?.data?.status,
    note:
      response?.data?.description ||
      response?.data?.notes ||
      "Thank you for doing business with us!",
  };

  return (
    <>
      <Invoice invoice={invoice} />
    </>
  );
}

export default InvoicePage;
