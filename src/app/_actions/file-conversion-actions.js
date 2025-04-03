import {
  API_KEY_TERMINAL_TRANSACTION_COLUMNS,
  API_KEY_TRANSACTION_COLUMNS,
  BILLS_TRANSACTION_COLUMNS,
  BULK_REPORTS_COLUMNS,
  SINGLE_TRANSACTION_REPORTS_COLUMNS,
  WALLET_STATEMENT_REPORT_COLUMNS,
} from "@/lib/table-columns";
import { formatDate } from "@/lib/utils";

export function downloadCSV(data, fileName) {
  const csvData = new Blob([data], { type: "text/csv" });
  const csvURL = URL.createObjectURL(csvData);
  const link = document.createElement("a");

  link.href = csvURL;
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Converts a given array of objects into a CSV string
 * @param {Array<object>} objArray The array of objects to convert
 * @param {string} [columnHeaders] Optional parameter to specify custom column headers e.g. "Date,Name,Total Records,Status"
 * @param {string} [fileName='PayBoss_Report'] Optional parameter to specify a custom file name for the downloaded file
 * @param {Function} formatDate Function to format date fields
 * @param {Function} formatCurrency Function to format currency fields
 * @returns {string} The CSV string
 */
export function convertToCSVString({
  objArray = [],
  columnHeaders = undefined,
  fileName = "PayBoss_Report",
}) {
  if (!Array.isArray(objArray) || objArray.length === 0) {
    console.error("Invalid or empty data provided for CSV conversion.");

    return;
  }

  // Get all unique keys from the array to maintain column structure
  const allKeys = [...new Set(objArray.flatMap((obj) => Object.keys(obj)))];

  // Use provided column headers, or generate from object keys
  const headers = columnHeaders
    ? columnHeaders
    : allKeys.map((key) => key.toUpperCase().replaceAll("_", " ")).join(",");

  // Initialize CSV string with headers
  let csvStr = headers + "\r\n";

  // Generate rows, ensuring missing values are replaced with "N/A"
  objArray.forEach((obj) => {
    let line = allKeys
      .map((key) => {
        let value = obj[key] !== undefined ? obj[key] : "N/A";

        // Apply date formatting if the key suggests it's a date
        if (key.toLowerCase().includes("created_at") && value !== "N/A") {
          value = formatDate(value);
        }

        // Apply currency formatting if the key suggests it's an amount
        // if (
        //   (key.toLowerCase().includes("amount") ||
        //     key.toLowerCase().includes("")) &&
        //   value !== "N/A"
        // ) {
        //   value = formatCurrency(value);
        // }

        // Apply phone formatting if the key suggests it's an amount
        if (
          (key.toLowerCase().includes("destination") ||
            key.toLowerCase().includes("amount") ||
            key.toLowerCase().includes("price") ||
            key.toLowerCase().includes("source")) &&
          value !== "N/A"
        ) {
          value = `\t\t${value}`;
        }

        return `"${value}"`; // Ensure proper CSV formatting
      })
      .join(",");

    csvStr += line + "\r\n";
  });

  return downloadCSV(csvStr, fileName);
}

export const bulkTransactionsReportToCSV = ({
  objArray = [],
  fileName = "PayBoss_Report",
}) => {
  const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
  let str = "";

  const headers = BULK_REPORTS_COLUMNS?.map((col) => col?.name).join(",");

  str += headers + "\r\n";

  for (let i = 0; i < array.length; i++) {
    let line = "";
    let date = formatDate(array[i]?.created_at);

    line += `"${date || ""}",`;
    line += `"${array[i]?.name || "N/A"}",`;
    line += `"${array[i]?.allRecords || "N/A"}",`;
    line += `"${`\t\t${array[i]?.allRecordsValue}` || "N/A"}",`;
    line += `"${array[i]?.successfulRecords || "N/A"}",`;
    line += `"${`\t\t${array[i]?.successfulRecordsValue}` || "N/A"}",`;
    line += `"${array[i]?.failedRecords || "N/A"}",`;
    line += `"${`\t\t${array[i]?.failedRecordsValue}` || "N/A"}",`;
    line += `"${array[i]?.status || "N/A"}",`;

    str += line + "\r\n";
  }

  return downloadCSV(str, fileName);
};

export const walletStatementReportToCSV = ({
  objArray = [],
  fileName = "PayBoss_Wallet_Statement_Report",
}) => {
  const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;

  let str = "";

  const headers = WALLET_STATEMENT_REPORT_COLUMNS?.map((col) => col?.name).join(
    ",",
  );

  str += headers + "\r\n";

  for (let i = 0; i < array.length; i++) {
    let line = "";
    let date = formatDate(array[i]?.created_at);

    line += `"${date || ""}",`;
    line += `"${array[i]?.content || ""}",`;
    line += `"${array[i]?.created_by || ""}",`;
    line += `"${array[i]?.amount || ""}",`;
    line += `"${array[i]?.status || ""}",`;
    line += `"${array[i]?.remarks || ""}",`;

    str += line + "\r\n";
  }

  return downloadCSV(str, fileName);
};

export const apiTransactionsReportToCSV = ({
  objArray = [],
  hasTerminals = false,
  fileName = "PayBoss_Report",
}) => {
  if (!Array.isArray(objArray) || objArray.length === 0) {
    console.error("Invalid or empty data provided for CSV conversion.");

    return;
  }

  const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
  let str = "";

  const headers = (
    hasTerminals
      ? API_KEY_TERMINAL_TRANSACTION_COLUMNS
      : API_KEY_TRANSACTION_COLUMNS
  )
    ?.map((col) => col?.name)
    .join(",");

  str += headers + "\r\n";

  for (let i = 0; i < array.length; i++) {
    let line = "";
    let date = formatDate(array[i]?.created_at);

    line += `"${date || ""}",`;
    line += hasTerminals ? `"${array[i]?.terminalID || "N/A"}",` : "";
    line += `"${array[i]?.narration || "N/A"}",`;
    line += `"${array[i]?.service_provider || "N/A"}",`;
    line += `"${array[i]?.mno_ref || "N/A"}",`;
    line += `"${`\t\t${array[i]?.destination}` || "N/A"}",`;
    line += `"${array[i]?.amount || "N/A"}",`;
    line += `"${array[i]?.status || "N/A"}",`;
    line += `"${array[i]?.status_description || "N/A"}",`;
    line += `"${array[i]?.mno_status_description || "N/A"}",`;
    line += `"${array[i]?.transactionID || "N/A"}",`;

    str += line + "\r\n";
  }

  return downloadCSV(str, fileName);
};

export const billTransactionsReportToCSV = ({
  objArray = [],
  fileName = "PayBoss_Bill_Report",
}) => {
  if (!Array.isArray(objArray) || objArray.length === 0) {
    console.error("Invalid or empty data provided for CSV conversion.");

    return;
  }

  const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
  let str = "";

  const headers = BILLS_TRANSACTION_COLUMNS?.map((col) => col?.name).join(",");

  str += headers + "\r\n";

  for (let i = 0; i < array.length; i++) {
    let line = "";
    let date = formatDate(array[i]?.created_at);

    line += `"${date || ""}",`;
    line += `"${array[i]?.service_provider || "N/A"}",`;
    line += `"${array[i]?.voucher_type || "N/A"}",`;
    line += `"${array[i]?.narration || "N/A"}",`;
    line += `"${array[i]?.bill_ref || "N/A"}",`;
    line += `"${array[i]?.bill_status_description || "N/A"}",`;
    line += `"${`\t\t${array[i]?.destination}` || "N/A"}",`;
    line += `"${array[i]?.status_description || "N/A"}",`;
    line += `"${array[i]?.amount || "N/A"}",`;
    line += `"${array[i]?.status || "N/A"}",`;
    line += `"${array[i]?.transactionID || "N/A"}",`;

    str += line + "\r\n";
  }

  return downloadCSV(str, fileName);
};

export const convertSingleTransactionToCSV = ({
  objArray = [],
  fileName = "PayBoss_Transactions_Report",
}) => {
  if (!Array.isArray(objArray) || objArray.length === 0) {
    console.error("Invalid or empty data provided for CSV conversion.");

    return;
  }

  const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;

  let str = "";

  const headers = SINGLE_TRANSACTION_REPORTS_COLUMNS?.map(
    (col) => col?.name,
  ).join(",");

  str += headers + "\r\n";

  for (let i = 0; i < array.length; i++) {
    let line = "";
    let date = array[i]?.created_at
      ? formatDate(array[i]?.created_at)
      : undefined;

    line += `"${date || "--/--/----"}",`;
    line += `"${array[i]?.first_name || "N/A"}",`;
    line += `"${array[i]?.last_name || "N/A"}",`;
    line += `"${array[i]?.nrc || "N/A"}",`;
    // line += `"${array[i]?.service || "N/A"}",`;
    line += `"${array[i]?.service_provider || "N/A"}",`;
    line += `"${`\t\t${array[i]?.destination}` || "N/A"}",`;
    line += `"${array[i]?.transaction_rrn || "N/A"}",`;
    line += `"${array[i]?.remarks || "N/A"}",`;
    line += `"${array[i]?.amount || "N/A"}",`;
    line += `"${array[i]?.status || "N/A"}",`;
    line += `"${array[i]?.status_description || "N/A"}",`;

    str += line + "\r\n";
  }

  return downloadCSV(str, fileName);
};
