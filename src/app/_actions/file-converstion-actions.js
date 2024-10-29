import { formatDate } from '@/lib/utils'

export function convertToCSVString(objArray, fileName = 'PayBoss_Report') {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray

  // Get headers dynamically from the first object in the array
  const headers = Object.keys(array[0])
    .map((key) => key.toUpperCase())
    .join(',')
    .replaceAll('_', ' ')

  // Initialize CSV string with headers
  let csvStr = headers + '\r\n'

  // Loop through each object and add values for each key
  array.forEach((obj) => {
    let line = Object.values(obj)
      .map((value) => `"${value || ''}"`)
      .join(',')
    csvStr += line + '\r\n'
  })

  return downloadCSV(csvStr, fileName)
}

export const convertBulkTransactionsReportToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
  let str = ''
  const headers =
    'Date,Name,Total Records,Total Amount,Total Successful,Total Failed, Amount Failed'
  str += headers + '\r\n'

  for (let i = 0; i < array.length; i++) {
    let line = ''
    let date = formatDate(array[i]?.created_at).replaceAll('-', '_')
    line += `"${date || ''}",`
    line += `"${array[i]?.name || ''}",`
    line += `"${array[i]?.allRecords || ''}",`
    line += `"${array[i]?.allRecordsValue || ''}",`
    line += `"${array[i]?.successfulRecords || ''}",`
    line += `"${array[i]?.successfulRecordsValue || ''}",`
    line += `"${array[i]?.failedRecords || ''}",`
    line += `"${array[i]?.failedRecordsValue || ''}",`

    str += line + '\r\n'
  }

  return str
}

export const convertWalletStatementToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
  let str = ''
  const headers = 'Date,Narration,Initiator,Amount,Status,Remarks'
  str += headers + '\r\n'

  for (let i = 0; i < array.length; i++) {
    let line = ''
    line += `"${formatDate(array[i]?.created_at, 'DD-MM-YYYY') || ''}",`
    line += `"${array[i]?.content || ''}",`
    line += `"${array[i]?.created_by || ''}",`
    line += `"${array[i]?.amount || ''}",`
    line += `"${array[i]?.status || ''}",`
    line += `"${array[i]?.remarks || ''}",`

    str += line + '\r\n'
  }

  return str
}

export const convertAPITransactionToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
  let str = ''
  const headers =
    'Date,Transaction ID,Service Provider,Source Account,MNO Ref,MNO Status Description, Remarks, Amount, Status'
  str += headers + '\r\n'

  for (let i = 0; i < array.length; i++) {
    let line = ''
    let date = formatDate(array[i]?.created_at).replaceAll('-', '_')
    line += `"${date || ''}",`
    line += `"${array[i]?.transactionID || ''}",`
    line += `"${array[i]?.service_provider || ''}",`
    line += `"${array[i]?.destination || ''}",`
    line += `"${array[i]?.mno_ref || ''}",`
    line += `"${array[i]?.mno_status_description || ''}",`
    line += `"${array[i]?.status_description || ''}",`
    line += `"${array[i]?.amount || ''}",`
    line += `"${array[i]?.status || ''}",`

    str += line + '\r\n'
  }

  return str
}

export const convertSingleTransactionToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
  let str = ''
  const headers =
    'Date,First Name,Last Name,NRC,Destination,Amount,Service Provider, Status, Remark,'
  str += headers + '\r\n'

  for (let i = 0; i < array.length; i++) {
    let line = ''
    let date = formatDate(array[i]?.created_at).replaceAll('-', '_')
    line += `"${date || ''}",`
    line += `"${array[i]?.first_name || ''}",`
    line += `"${array[i]?.last_name || ''}",`
    line += `"${array[i]?.nrc || ''}",`
    line += `"${array[i]?.destination || ''}",`
    line += `"${array[i]?.amount || ''}",`
    line += `"${array[i]?.service_provider || ''}",`
    line += `"${array[i]?.status || ''}",`
    line += `"${array[i]?.remarks || ''}",`

    str += line + '\r\n'
  }

  downloadCSV(str, 'single_transactions')

  return str
}

export const downloadCSV = (data, fileName) => {
  const csvData = new Blob([data], { type: 'text/csv' })
  const csvURL = URL.createObjectURL(csvData)
  const link = document.createElement('a')
  link.href = csvURL
  link.download = `${fileName}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
