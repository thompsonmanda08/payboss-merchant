import { notify } from '@/lib/utils'
import { create } from 'zustand'

const INITIAL_STATE = {
  paymentAction: {
    type: '',
    url: '',
  },

  error: {
    status: false,
    message: '',
  },

  bulkPayments: [],
  batchDetails: {},
  openPaymentsModal: false,
  openAllRecordsModal: false,
  openValidRecordsModal: false,
  openInvalidRecordsModal: false,
  openAddOrEditModal: false,
  loading: false,
  selectedRecord: null,
}

const usePaymentsStore = create((set, get) => ({
  ...INITIAL_STATE,

  // METHODS AND ACTIONS
  setOpenPaymentsModal: (open) => set({ openPaymentsModal: open }),
  setBulkPayments: (bulkPayments) => set({ bulkPayments }),
  setPaymentAction: (action) => set({ paymentAction: action }),
  setError: (error) => set({ error }),
  setBatchDetails: (batchDetails) => set({ batchDetails }),
  setOpenAllRecordsModal: (open) => set({ openAllRecordsModal: open }),
  setOpenValidRecordsModal: (open) => set({ openValidRecordsModal: open }),
  setOpenInvalidRecordsModal: (open) => set({ openInvalidRecordsModal: open }),
  setOpenAddOrEditModal: (open) => set({ openAddOrEditModal: open }),
  setLoading: (loading) => set({ loading }),
  setSelectedRecord: (record) => set({ selectedRecord: record }),

  // UPDATE FIELDS ON THE SELECTED INVALID RECORD
  updateSelectedRecord: (fields) => {
    set((state) => {
      return {
        selectedRecord: {
          ...state.selectedRecord,
          ...fields,
        },
      }
    })
  },

  // OPEN VALIDATION AND RECORD MODALS
  openRecordsModal: (type) => {
    if (type === 'all') set({ openAllRecordsModal: true })

    if (type === 'valid') set({ openValidRecordsModal: true })

    if (type === 'invalid') set({ openInvalidRecordsModal: true })
  },

  // CLOSE ALL VALIDATION AND RECORD MODALS
  closeRecordsModal: () => {
    set({
      openAllRecordsModal: false,
      openValidRecordsModal: false,
      openInvalidRecordsModal: false,
    })
  },

  // UPDATE PAYMENT ACTION FIELDS ON THE TRANSACTION PROCESS
  updatePaymentFields: (values) => {
    set((state) => ({
      paymentAction: { ...state.paymentAction, ...values },
    }))
  },

  saveSelectedRecord: () => {
    const { selectedRecord, batchDetails } = get()

    // find selected record in invalid records
    const selectedRecordID = selectedRecord.ID

    // find selected record in invalid records using selectedRecordID and replace it with the updated record in state
    const invalidRecords = batchDetails.invalid
    const updatedInvalidRecords = invalidRecords.map((record) => {
      // if record ID matches selectedRecordID, return the updated record
      if (record.ID === selectedRecordID) {
        return selectedRecord
      }
      // otherwise return the original record
      return record
    })

    // Now that we have updated the invalid record array, we can either send  it back to the server for validation or update our current BatchDetails

    // Update our current BatchDetails
    set((state) => ({
      loading: false,
      batchDetails: {
        ...state.batchDetails,
        invalid: updatedInvalidRecords,
      },
    }))
    notify('success', 'Changes Saved!')

    // Send updated invalid records back to the server for validation
    // const response = await submitInvalidRecords(updatedInvalidRecords)
  },

  // Clear & Reset
  resetPaymentData: () =>
    set((state) => {
      return {
        ...INITIAL_STATE,
      }
    }),
}))

export default usePaymentsStore

export const validationColumns = [
  { header: 'First Name', accessor: 'first_name' },
  { header: 'Last Name', accessor: 'last_name' },
  { header: 'Email', accessor: 'email' },
  { header: 'Mobile No.', accessor: 'contact' },
  { header: 'NRC', accessor: 'nrc' },
  // { header: 'Account Type', accessor: 'account' },
  { header: 'Mobile/Account No.', accessor: 'destination' },
  { header: 'Amount', accessor: 'amount' },
  { header: 'Service', accessor: 'service' },
  { header: 'Remarks', accessor: 'remarks' },
]
