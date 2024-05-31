import axios from 'axios'
import { create } from 'zustand'

const INITIAL_STATE = {
  paymentAction: null,
  bulkPayments: [],
  openPaymentsModal: false,
  loading: false,
}

const usePaymentsStore = create((set, get) => ({
  ...INITIAL_STATE,

  // METHODS AND ACTIONS
  setOpenPaymentsModal: (open) => set({ openPaymentsModal: open }),

  updatePaymentFields: (values) => {
    set((state) => {
      return {
        payment: { ...state.paymentAction, ...values },
      }
    })
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
