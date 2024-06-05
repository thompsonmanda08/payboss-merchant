import axios from 'axios'
import { create } from 'zustand'

const INITIAL_STATE = {
  paymentAction: {
    type: '',
    file: null,
  },
  bulkPayments: [],
  openPaymentsModal: false,
  loading: false,
}

const usePaymentsStore = create((set, get) => ({
  ...INITIAL_STATE,

  // METHODS AND ACTIONS
  setOpenPaymentsModal: (open) => set({ openPaymentsModal: open }),
  setLoading: (loading) => set({ loading }),

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
