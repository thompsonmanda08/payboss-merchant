import { updateInvalidDirectBulkTransactionDetails } from '@/app/_actions/transaction-actions'
import { PAYMENT_SERVICE_TYPES } from '@/lib/constants'
import { notify } from '@/lib/utils'
import { create } from 'zustand'

const INITIAL_STATE = {
  selectedProtocol: '', // DIRECT OR VOUCHER
  selectedActionType: {},
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
  transactionDetails: {},
  createPaymentLoading: false,
  openPaymentsModal: false,
  openAllRecordsModal: false,
  openValidRecordsModal: false,
  openInvalidRecordsModal: false,
  openAddOrEditModal: false,
  openBatchDetailsModal: false,
  openTransactionDetailsModal: false,
  loading: false,
  selectedRecord: null,
  selectedBatch: null,
  dateFilter: '',
}

const usePaymentsStore = create((set, get) => ({
  ...INITIAL_STATE,

  // METHODS AND ACTIONS
  setOpenPaymentsModal: (open) => set({ openPaymentsModal: open }),
  setCreatePaymentLoading: (open) => set({ openPaymentsModal: open }),

  setBulkPayments: (bulkPayments) => set({ bulkPayments }),
  setPaymentAction: (action) => set({ paymentAction: action }),
  setError: (error) => set({ error }),
  setBatchDetails: (batchDetails) => set({ batchDetails }),
  setOpenAllRecordsModal: (open) => set({ openAllRecordsModal: open }),
  setOpenValidRecordsModal: (open) => set({ openValidRecordsModal: open }),
  setOpenInvalidRecordsModal: (open) => set({ openInvalidRecordsModal: open }),
  setOpenAddOrEditModal: (open) => set({ openAddOrEditModal: open }),
  setOpenBatchDetailsModal: (open) => set({ openBatchDetailsModal: open }),
  setLoading: (loading) => set({ loading }),
  setSelectedProtocol: (protocol) => set({ selectedProtocol: protocol }),
  setSelectedRecord: (record) => set({ selectedRecord: record }),
  setSelectedBatch: (record) => set({ selectedBatch: record }),
  setSelectedActionType: (type) => set({ selectedActionType: type }),
  setTransactionDetails: (details) => set({ transactionDetails: details }),
  setOpenTransactionDetailsModal: (open) =>
    set({ openTransactionDetailsModal: open }),
  updateDateFilter: (dateFilter) => set({ dateFilter }),

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
    if (type === 'all')
      set({
        openAllRecordsModal: true,
        openValidRecordsModal: false,
        openInvalidRecordsModal: false,
      })

    if (type === 'valid')
      set({
        openValidRecordsModal: true,
        openAllRecordsModal: false,
        openInvalidRecordsModal: false,
      })

    if (type === 'invalid')
      set({
        openInvalidRecordsModal: true,
        openAllRecordsModal: false,
        openValidRecordsModal: false,
      })
  },

  // CLOSE ALL VALIDATION AND RECORD MODALS
  closeRecordsModal: () => {
    set({
      openAllRecordsModal: false,
      openValidRecordsModal: false,
      openInvalidRecordsModal: false,
      // openBatchDetailsModal: false,
    })
  },

  // UPDATE PAYMENT ACTION FIELDS ON THE TRANSACTION PROCESS
  updatePaymentFields: (values) => {
    set((state) => ({
      paymentAction: { ...state.paymentAction, ...values },
    }))
  },

  saveSelectedRecord: async () => {
    const { selectedRecord, batchDetails, updateSelectedRecord } = get()

    // find selected record in invalid records
    const selectedRecordID = selectedRecord?.ID

    // find selected record in invalid records using selectedRecordID and replace it with the updated record in state
    const invalidRecords = batchDetails?.invalid

    const payload = {
      batchID: selectedRecord?.batchID,
      destination: selectedRecord?.destination,
      amount: selectedRecord?.amount,
    }

    const response = await updateInvalidDirectBulkTransactionDetails(
      selectedRecordID,
      payload,
    )

    if (response?.success) {
      const updatedInvalidRecords = invalidRecords?.map((record) => {
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
      notify('success', 'Record updated!')
      return response
    }

    // If the update fails, set the error message and loading status
    set({
      loading: false,
      error: {
        status: true,
        message: response?.message,
      },
    })
    notify('error', 'Record update failed!')
    return response
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
  { header: 'FIRST NAME', uid: 'first_name' },
  { header: 'LAST NAME', uid: 'last_name' },
  { header: 'EMAIL', uid: 'email' },
  { header: 'MOBILE NO.', uid: 'contact' },
  { header: 'NRC', uid: 'nrc' },
  { header: 'MOBILE/ACCOUNT NO.', uid: 'destination' },
  { header: 'SERVICE', uid: 'service_provider' },
  { header: 'NARRATION', uid: 'narration' },
  { header: 'REMARKS', uid: 'remarks' },
  { header: 'AMOUNT', uid: 'amount' },
  { header: 'STATUS', uid: 'status' },
]

export const singleReportsColumns = [
  { name: 'DATE CREATED', uid: 'created_at', sortable: true },
  { name: 'FIRST NAME', uid: 'first_name', sortable: true },
  { name: 'LAST NAME', uid: 'last_name', sortable: true },
  // { name: 'NRC', uid: 'nrc', sortable: true },
  // { name: 'PHONE', uid: 'contact', sortable: true },
  { name: 'SERVICE PROVIDER', uid: 'service_provider' },
  { name: 'DESTINATION ACCOUNT', uid: 'destination', sortable: true },
  // { name: 'NARRATION', uid: 'narration', sortable: true },
  { name: 'REMARKS', uid: 'remarks', sortable: true },
  { name: 'AMOUNT', uid: 'amount', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },

  // { name: 'ACTIONS', uid: 'actions' },
]
