import { create } from "zustand";

export const POP_INIT = {
  amount: "",
  bank_rrn: "",
  date_of_deposit: "",
  url: "",
  name: "",
};

const INITIAL_STATE = {
  selectedPrefund: null,
  prefundApproval: {
    action: "",
    remarks: "",
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

type WalletStore = {
  selectedPrefund: any;
  prefundApproval: any;
  openAttachmentModal: boolean;
  walletLoading: boolean;
  isLoading: boolean;
  formData: any;
  setSelectedPrefund: (selectedPrefund: any) => void;
  setOpenAttachmentModal: (open: boolean) => void;
  setWalletLoading: (status: boolean) => void;
  setIsLoading: (status: boolean) => void;
  setFormData: (data: any) => void;
  setPrefundApproval: (data: any) => void;
  updateFormData: (fields: any) => void;
  updatePrefundApproval: (fields: any) => void;
  clearWalletStore: () => void;
};

export default useWalletStore;
