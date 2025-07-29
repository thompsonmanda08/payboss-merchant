import { create } from "zustand";
import { addToast } from "@heroui/react";

import {
  adminResetUserPassword,
  assignUsersToWorkspace,
  deleteSystemUserData,
  unlockSystemUser,
} from "@/app/_actions/user-actions";
import { deleteUserFromWorkspace } from "@/app/_actions/workspace-actions";
import { generateRandomString } from "@/lib/utils";
import { WorkspaceStore } from "@/types/stores";

const INITIAL_STATE = {
  addedUsers: [],
  existingUsers: [],
  error: {
    status: false,
    message: "",
  },
  isLoading: false,
  isEditingUser: false,
  selectedUser: null,
};

const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  ...INITIAL_STATE,

  //SETTERS
  setAddedUsers: (users) => set({ addedUsers: users }),
  setExistingUsers: (users) => set({ existingUsers: users }),
  setIsLoading: (status) => set({ isLoading: status }),
  setIsEditingUser: (status) => set({ isEditingUser: status }),
  setError: (error) => set({ error }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  // METHODS AND ACTIONS

  handleAddToWorkspace: (user) => {
    set({ error: { status: false, message: "" } });

    // Filter out the user with the matching email, if exists then don't add
    const { addedUsers, existingUsers } = get();
    const exitingUser = addedUsers.find((u) => u.ID === user.ID);
    const userExists = existingUsers.find((u) => u.userID === user.ID);

    if (exitingUser) {
      addToast({
        title: "Warning",
        color: "warning",
        description: `${exitingUser?.first_name} is already added!`,
      });

      return;
    }

    if (userExists) {
      addToast({
        title: "Warning",
        color: "warning",
        description: `${userExists?.first_name} already exists in workspace!`,
      });

      return;
    }

    // Filter out the user with role == "owner", if exists then don't add
    // if (user?.role?.toLowerCase() == 'owner') {
    // addToast({
    //   title: "Warning",
    //   color: "warning",
    //   description: 'Owner is already part of the workspace!',
    // });
    //   return
    // }

    set((state) => {
      return {
        addedUsers: [...state.addedUsers, user],
      };
    });

    addToast({
      color: "success",
      title: "Success",
      description: `You added ${user?.first_name}!`,
    });
  },

  handleRemoveFromWorkspace: (user) => {
    set({ error: { status: false, message: "" } });

    if (!user || !user.ID) {
      console.error("Invalid user or user ID");

      return;
    }

    // Filter out the user with the matching ID
    // Update the state with the new users list
    set((state) => {
      return {
        addedUsers: state.addedUsers.filter((u) => u.ID != user.ID),
      };
    });

    addToast({
      color: "success",
      title: "Success",
      description: `You removed ${user?.first_name}!`,
    });
  },

  handleUserRoleChange: (user, roleID) => {
    set({ error: { status: false, message: "" } });
    // Map through the users and add the property workspaceRole = roleID to the user with the matching ID and return the other as they are
    set((state) => {
      return {
        addedUsers: state.addedUsers.map((u) => {
          if (u.ID === user.ID) {
            u.workspaceRole = roleID;
          }

          return u;
        }),
      };
    });
  },

  handleSubmitAddedUsers: async (workspaceID) => {
    const { addedUsers } = get();

    set({
      isLoading: true,
      error: { status: false, message: "" },
    });

    // check if the addedUsers list is empty
    if (addedUsers.length === 0) {
      set({
        isLoading: false,
      });

      return { status: true, message: "Please select at least one user" };
    }

    // Check is all users in the addedUSers list have a role assigned
    const userHasNoRole = !addedUsers?.every((user) => user.workspaceRole);

    if (userHasNoRole) {
      set({
        isLoading: false,
      });

      return { status: true, message: "Please assign a role to all users" };
    }

    const users = addedUsers.map((user) => ({
      userID: user.ID,
      roleID: user.workspaceRole,
    }));

    return await assignUsersToWorkspace(users, workspaceID);
  },

  handleResetUserPassword: async () => {
    set({ isLoading: true, error: { status: false, message: "" } });

    const { selectedUser } = get();

    const passwordInfo = {
      changePassword: true,
      password: generateRandomString(12), // Generate random string
    };

    const response = await adminResetUserPassword(
      selectedUser?.ID,
      passwordInfo,
    );

    if (response?.success) {
      addToast({
        color: "success",
        title: "Success",
        description: `You Reset ${selectedUser?.first_name}'s Password!`,
      });

      return response?.success;
    }

    addToast({
      title: "Error",
      color: "danger",
      description: response?.message,
    });

    return response?.success;
  },

  handleDeleteFromWorkspace: async (workspaceID) => {
    set({ isLoading: true });
    const { selectedUser } = get();

    const response = await deleteUserFromWorkspace(
      selectedUser?.ID,
      workspaceID,
    );

    if (response?.success) {
      addToast({
        color: "success",
        title: "Success",
        description: `You Removed ${selectedUser?.first_name}!`,
      });

      return response?.success;
    }

    addToast({
      title: "Error",
      color: "danger",
      description: response?.message,
    });

    return response?.success;
  },

  handleUnlockSystemUser: async () => {
    set({ isLoading: true });
    const { selectedUser } = get();

    const response = await unlockSystemUser(selectedUser?.ID);

    if (response?.success) {
      addToast({
        color: "success",
        title: "Success",
        description: `You unlocked ${selectedUser?.first_name}!`,
      });

      return response?.success;
    }

    addToast({
      title: "Error",
      color: "danger",
      description: response?.message,
    });
    set({ isLoading: false });

    return response?.success;
  },

  handleDeleteFromAccount: async () => {
    set({ isLoading: true });
    const { selectedUser } = get();

    const response = await deleteSystemUserData(selectedUser?.ID);

    if (response?.success) {
      addToast({
        color: "success",
        title: "Success",
        description: `You Removed ${selectedUser?.first_name}!`,
      });

      return response?.success;
    }

    addToast({
      title: "Error",
      color: "danger",
      description: response?.message,
    });

    set({ isLoading: false });

    return response?.success;
  },

  handleClearAllSelected: () => {
    // IF NOT SELECTED USERS RETURN
    if (!get().addedUsers.length) return;

    set({
      addedUsers: [],
      error: { status: false, message: "" },
      isLoading: false,
    });
  },

  // CLear & Reset
  resetWorkspaces: () =>
    set({
      ...INITIAL_STATE,
    }),
}));

export default useWorkspaceStore;
