import BulkPaymentForm from "./bulk-payment-form";
import { PageProps } from "@/types";

export default async function CreateBatchPayment({ params }: PageProps) {
  const workspaceID = (await params)?.workspaceID as string;
  const protocol = (await params)?.protocol as string;

  return (
    <>
      <BulkPaymentForm workspaceID={workspaceID} protocol={protocol} />
    </>
  );
}
