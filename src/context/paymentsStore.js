import { create } from 'zustand'

const INITIAL_STATE = {
  paymentAction: {
    type: '',
    file: null,
  },
  bulkPayments: [],
  openPaymentsModal: false,
  openAllRecordsModal: false,
  openValidRecordsModal: false,
  openInvalidRecordsModal: false,
  openAddOrEditModal: false,
  loading: false,
}

const usePaymentsStore = create((set, get) => ({
  ...INITIAL_STATE,

  // METHODS AND ACTIONS
  setOpenPaymentsModal: (open) => set({ openPaymentsModal: open }),
  setOpenAllRecordsModal: (open) => set({ openAllRecordsModal: open }),
  setOpenValidRecordsModal: (open) => set({ openValidRecordsModal: open }),
  setOpenInvalidRecordsModal: (open) => set({ openInvalidRecordsModal: open }),
  setOpenAddOrEditModal: (open) => set({ openAddOrEditModal: open }),
  setLoading: (loading) => set({ loading }),

  openRecordsModal: (type) => {
    if (type === 'all') set({ openAllRecordsModal: true })

    if (type === 'valid') set({ openValidRecordsModal: true })

    if (type === 'invalid') set({ openInvalidRecordsModal: true })
  },

  closeRecordsModal: () => {
    set({
      openAllRecordsModal: false,
      openValidRecordsModal: false,
      openInvalidRecordsModal: false,
    })
  },

  updatePaymentFields: (values) => {
    set((state) => ({
      paymentAction: { ...state.paymentAction, ...values },
    }))
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
