export type ColumnType = {
  name: string;
  uid: string;
  sortable?: boolean;
  [x: string]: any;
};

export type Columns = ColumnType[];

export const API_KEY_TRANSACTION_COLUMNS: Columns = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'NARRATION', uid: 'narration' },
  { name: 'PROVIDER', uid: 'service_provider' },
  { name: 'MNO REF.', uid: 'mno_ref' },
  { name: 'SOURCE ACCOUNT', uid: 'destination', sortable: true },
  { name: 'AMOUNT', uid: 'amount', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'REMARKS', uid: 'status_description' },
  { name: 'MNO STATUS DESCRIPTION', uid: 'mno_status_description' },
  { name: 'TRANSACTION ID', uid: 'transactionID' },
];
export const API_KEY_TERMINAL_TRANSACTION_COLUMNS: Columns = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'TERMINAL ID', uid: 'terminalID', sortable: true },
  { name: 'NARRATION', uid: 'narration' },
  { name: 'PROVIDER', uid: 'service_provider' },
  { name: 'MNO REF.', uid: 'mno_ref' },
  { name: 'SOURCE ACCOUNT', uid: 'destination', sortable: true },
  { name: 'AMOUNT', uid: 'amount', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'REMARKS', uid: 'status_description' },
  { name: 'MNO STATUS DESCRIPTION', uid: 'mno_status_description' },
  { name: 'TRANSACTION ID', uid: 'transactionID' },
];

export const TILL_TRANSACTION_COLUMNS: Columns = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'NARRATION', uid: 'narration' },
  { name: 'PROVIDER', uid: 'service_provider', sortable: true },
  { name: 'SOURCE ACCOUNT', uid: 'destination', sortable: true },
  { name: 'MNO REF.', uid: 'mno_ref' },
  // { name: 'MNO STATUS DESCRIPTION', uid: 'mno_status_description' },
  { name: 'REMARKS', uid: 'status_description' },
  { name: 'AMOUNT', uid: 'amount', sortable: true },
  { name: 'TRANSACTION ID', uid: 'transactionID' },
  { name: 'STATUS', uid: 'status', sortable: true },
];

export const BULK_REPORTS_COLUMNS: Columns = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'TOTAL RECORDS', uid: 'allRecords', sortable: true },
  { name: 'TOTAL AMOUNT', uid: 'allRecordsValue', sortable: true },
  { name: 'TOTAL SUCCESSFUL', uid: 'successfulRecords', sortable: true },
  { name: 'AMOUNT SUCCESSFUL', uid: 'successfulRecordsValue', sortable: true },
  { name: 'TOTAL FAILED', uid: 'failedRecords', sortable: true },
  { name: 'AMOUNT FAILED', uid: 'failedRecordsValue', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
];

export const BULK_TRANSACTIONS_COLUMN: Columns = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'NAME', uid: 'batch_name', sortable: true },
  { name: 'TOTAL RECORDS', uid: 'number_of_records', sortable: true },
  { name: 'TOTAL AMOUNT', uid: 'total_amount', sortable: true },
  { name: 'SERVICE', uid: 'service', sortable: true },
  { name: 'LAST MODIFIED', uid: 'updated_at', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
];
export const INVOICE_COLUMNS: Columns = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'NAME', uid: 'customer_name', sortable: true },
  { name: 'CUSTOMER EMAIL', uid: 'customer_email', sortable: true },

  { name: 'INVOICE NO.', uid: 'invoice_id' },
  { name: 'TAX RATE', uid: 'tax_rate' },
  { name: 'TAX ', uid: 'tax' },
  { name: 'AMOUNT', uid: 'total', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
];

export const BILLS_TRANSACTION_COLUMNS: Columns = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'PROVIDER', uid: 'service_provider', sortable: true },
  { name: 'VOUCHER TYPE', uid: 'voucher_type', sortable: true },
  { name: 'NARRATION', uid: 'narration' },
  { name: 'BILL REF.', uid: 'bill_ref' },
  { name: 'BILL STATUS DESCRIPTION', uid: 'bill_status_description' },
  { name: 'ACCOUNT', uid: 'destination', sortable: true },
  { name: 'REMARKS', uid: 'status_description' },
  { name: 'AMOUNT', uid: 'amount', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'TRANSACTION ID', uid: 'transactionID' },
];

export const SINGLE_TRANSACTIONS_VALIDATION_COLUMNS: Columns = [
  { name: 'FIRST NAME', uid: 'first_name', sortable: true },
  { name: 'LAST NAME', uid: 'last_name', sortable: true },
  { name: 'EMAIL', uid: 'email', sortable: true },
  { name: 'MOBILE NO.', uid: 'contact', sortable: true },
  { name: 'NRC', uid: 'nrc', sortable: true },
  { name: 'MOBILE/ACCOUNT NO.', uid: 'destination', sortable: true },
  { name: 'SERVICE', uid: 'service_provider', sortable: true },
  { name: 'NARRATION', uid: 'narration' },
  { name: 'REMARKS', uid: 'remarks' },
  { name: 'AMOUNT', uid: 'amount', sortable: true },
];

export const SINGLE_TRANSACTIONS_COLUMNS: Columns = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'FIRST NAME', uid: 'first_name', sortable: true },
  { name: 'LAST NAME', uid: 'last_name', sortable: true },
  { name: 'NRC', uid: 'nrc', sortable: true },
  { name: 'SERVICE', uid: 'service' },
  { name: 'PROVIDER', uid: 'service_provider' },
  { name: 'DESTINATION ACCOUNT', uid: 'destination', sortable: true },
  { name: 'LAST MODIFIED', uid: 'updated_at', sortable: true },
  { name: 'AMOUNT', uid: 'amount', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
  // { name: 'ACTIONS', uid: 'actions' },
];

export const SINGLE_TRANSACTION_REPORTS_COLUMNS: Columns = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'FIRST NAME', uid: 'first_name', sortable: true },
  { name: 'LAST NAME', uid: 'last_name', sortable: true },
  { name: 'NRC', uid: 'nrc', sortable: true },
  { name: 'PROVIDER', uid: 'service_provider' },
  { name: 'DESTINATION ACCOUNT', uid: 'destination', sortable: true },
  { name: 'MNO RRN', uid: 'transaction_rrn' },
  { name: 'REMARKS', uid: 'remarks' },
  { name: 'AMOUNT', uid: 'amount', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'STATUS DESCRIPTION', uid: 'status_description' },
];

export const WALLET_STATEMENT_REPORT_COLUMNS: Columns = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'NARRATION', uid: 'narration', sortable: true },
  { name: 'TRANSACTION INITIATOR', uid: 'initiator', sortable: true },
  { name: 'AMOUNT', uid: 'amount', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'REMARKS', uid: 'remarks', sortable: true },
];

export const SUBSCRIPTION_PAYMENT_COLUMNS: Columns = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'MEMBER NAME', uid: 'name', sortable: true },
  { name: 'MEMBER ID', uid: 'member_id', sortable: true },

  { name: 'SUBSCRIPTION', uid: 'service' },
  { name: 'AMOUNT', uid: 'total', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
];
