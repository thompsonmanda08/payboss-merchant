import { authenticateUser, getUserProfile, revokeToken } from "@/app/actions";
import { apiClient, notify } from "@/lib/utils";
import axios from "axios";
import { create } from "zustand";
import useProfileStore from "./profileStore";

const INITIAL_STATE = {
  loading: false,
  error: false,
  message: "",
};

const useAuthStore = create((set, get) => ({
  ...INITIAL_STATE,

  //SETTERS
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setMessage: (message) => set({ message }),

  // METHODS AND ACTIONS
  createAccount: async (signupDetails) => {
    set({ loading: true });

    try {
      console.log("PAYLOAD: ", signupDetails);
      const response = await apiClient.post(
        // CREATE ACCOUNT API
        "/auth/register",
        {
          // REQUEST BODY
          ...signupDetails,
        },
        {
          // REQUEST OPTIONS
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status == 201) {
        set({ message: response.data.message });
        console.log("SERVER HAPPY", response);
        return {
          success: true, //
          message: response.data.message,
          data: response.data.data,
          status: response.status,
        };
      }
    } catch (error) {
      set({ error: true });
      console.error(
        "Error occurred while trying to create account: Fn(createAccount)\n",
        error
      );

      if (error.response) {
        const { data } = error.response;
        set({ message: data.message });
        return;
      }

      set({ message: error.message });
      return;
    } finally {
      setTimeout(() => {
        set({
          error: false,
          loading: false,
          message: "",
        });
      }, 3000);
    }
  },

  logUserIn: async (loginDetails) => {
    set({ loading: true });
    const response = await authenticateUser(loginDetails);
    /** IF ERRORS  ***/
    if (!response.success) {
      set({ message: response.message, error: true, loading: false });
      setTimeout(() => {
        set({
          error: false,
          loading: false,
          message: "",
        });
      }, 3000);
      return response;
    }

    const user = await getUserProfile();
    console.log("USER DATA:", user);

    /** IF SUCCESS - GET AND SET USER DATA IN STATE ***/
    useProfileStore.getState().setUser(user.data?.profile);

    // GO TO THE HOME PAGE
    window.location.href = "/";
    setTimeout(() => {
      set({
        error: false,
        loading: false,
        message: "",
      });
    }, 3000);
    return response;
  },

  logUserOut: async () => {
    set({ loading: true });

    const response = await revokeToken();
    if (!response) {
      // localStorage.clear()
      localStorage.removeItem("sp-profile");
      window.location.href = "/auth/login";
    }
    setTimeout(() => {
      set({
        error: false,
        loading: false,
        message: "",
      });
    }, 3000);
  },

  // CLear & Reset
  resetAuthData: () =>
    set({
      ...INITIAL_STATE,
    }),
}));

export default useAuthStore;
