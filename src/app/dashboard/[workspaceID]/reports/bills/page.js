import BillPaymentReports from "./bill-payments-report";

export default async function BillPaymentReportsPage(props) {
  const params = await props.params;
  const { workspaceID } = params;

  return <BillPaymentReports workspaceID={workspaceID} />;
}
