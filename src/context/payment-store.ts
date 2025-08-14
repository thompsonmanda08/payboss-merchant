import { create } from 'zustand';

import { PaymentStore } from '@/types/stores';

const INITIAL_STATE = {
  selectedProtocol: '', // DIRECT OR VOUCHER
  selectedActionType: {},
  selectedBatch: null,
  selectedRecord: null,
  paymentAction: {
    type: '',
    url: '',
    batch_name: '',
    file: null,
  },

  error: {
    status: false,
    message: '',
  },

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
  dateFilter: '',
};

const usePaymentsStore = create<PaymentStore>((set) => ({
  ...INITIAL_STATE,

  // METHODS AND ACTIONS
  setOpenPaymentsModal: (open) => set({ openPaymentsModal: open }),
  setCreatePaymentLoading: (open) => set({ openPaymentsModal: open }),

  setPaymentAction: (action) => set({ paymentAction: action }),
  setError: (error) => set({ error }),
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

  // OPEN VALIDATION AND RECORD MODALS
  openRecordsModal: (type) => {
    if (type === 'all')
      set({
        openAllRecordsModal: true,
        openValidRecordsModal: false,
        openInvalidRecordsModal: false,
      });

    if (type === 'valid')
      set({
        openValidRecordsModal: true,
        openAllRecordsModal: false,
        openInvalidRecordsModal: false,
      });

    if (type === 'invalid')
      set({
        openInvalidRecordsModal: true,
        openAllRecordsModal: false,
        openValidRecordsModal: false,
      });
  },

  // CLOSE ALL VALIDATION AND RECORD MODALS
  closeRecordsModal: () => {
    set({
      openAllRecordsModal: false,
      openValidRecordsModal: false,
      openInvalidRecordsModal: false,
      // openBatchDetailsModal: false,
    });
  },

  // UPDATE PAYMENT ACTION FIELDS ON THE TRANSACTION PROCESS
  updatePaymentFields: (values) => {
    set((state) => ({
      paymentAction: { ...state.paymentAction, ...values },
    }));
  },

  // Clear & Reset
  resetPaymentData: () =>
    set(() => {
      return {
        ...INITIAL_STATE,
      };
    }),
}));

export default usePaymentsStore;
