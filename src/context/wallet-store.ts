import { create } from 'zustand';

import { WalletStore } from '@/types/stores';

export const POP_INIT = {
  amount: '',
  bank_rrn: '',
  date_of_deposit: '',
  url: '',
  name: '',
};

const INITIAL_STATE = {
  selectedPrefund: null,
  prefundApproval: {
    action: '',
    remarks: '',
  },
  openAttachmentModal: false,
  walletLoading: false,
  isLoading: false,

  formData: POP_INIT,
};

const useWalletStore = create<WalletStore>((set) => ({
  ...INITIAL_STATE,

  //SETTERS
  setSelectedPrefund: (selectedPrefund) => set({ selectedPrefund }),
  setOpenAttachmentModal: (open) => set({ openAttachmentModal: open }),
  setWalletLoading: (status) => set({ walletLoading: status }),
  setIsLoading: (status) => set({ isLoading: status }),
  setFormData: (data) => set({ formData: data }),
  setPrefundApproval: (data) => set({ prefundApproval: data }),

  // METHODS
  updateFormData: (fields) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...fields,
      },
    })),

  updatePrefundApproval: (fields) =>
    set((state) => ({
      prefundApproval: {
        ...state.prefundApproval,
        ...fields,
      },
    })),

  // CLear & Reset
  clearWalletStore: () =>
    set({
      ...INITIAL_STATE,
    }),
}));

export default useWalletStore;
