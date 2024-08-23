import SummaryTable from './SummaryTable'
import { validationColumns } from '@/context/paymentsStore'

export default function ValidRecords({ records }) {
  return <SummaryTable columns={validationColumns} data={records} />
}
