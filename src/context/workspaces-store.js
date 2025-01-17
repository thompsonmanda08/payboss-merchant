import {
  adminResetUserPassword,
  assignUsersToWorkspace,
  deleteSystemUserData,
} from "@/app/_actions/user-actions";
import { deleteUserFromWorkspace } from "@/app/_actions/workspace-actions";
import { generateRandomString, notify } from "@/lib/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_STATE = {
  addedUsers: [],
  existingUsers: [],
  error: {
    status: false,
    message: "",
  },
  isLoading: false,
  isEditingRole: false,
  selectedUser: null,
};

const useWorkspaceStore = create((set, get) => ({
  ...INITIAL_STATE,

  //SETTERS
  setAddedUsers: (users) => set({ addedUsers: users }),
  setExistingUsers: (users) => set({ existingUsers: users }),
  setIsLoading: (status) => set({ isLoading: status }),
  setIsEditingRole: (status) => set({ isEditingRole: status }),
  setError: (error) => set({ error }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  // METHODS AND ACTIONS

  handleAddToWorkspace: (user) => {
    set({ error: { status: false, message: "" } });

    // Filter out the user with the matching email, if exists then don't add
    const { addedUsers, existingUsers } = get();
    const aldreadyAdded = addedUsers.find((u) => u.ID === user.ID);
    const userExists = existingUsers.find((u) => u.userID === user.ID);

    if (aldreadyAdded) {
      notify("warning", `${aldreadyAdded?.first_name} is already added!`);
      return;
    }

    if (userExists) {
      notify(
        "warning",
        `${userExists?.first_name} already exists in workspace!`
      );
      return;
    }

    // Filter out the user with role == "owner", if exists then don't add
    // if (user?.role?.toLowerCase() == 'owner') {
    //   notify('warning', 'Owner is already part of the workspace!')
    //   return
    // }

    set((state) => {
      return {
        addedUsers: [...state.addedUsers, user],
      };
    });

    notify("success", `You Added ${user?.first_name}!`);
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

    notify("success", `You Removed ${user?.first_name}!`);
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

  handleResetUserPassword: async (workspaceID) => {
    set({ isLoading: true, error: { status: false, message: "" } });

    const { selectedUser } = get();

    // TODO: Generate random string
    const passwordInfo = {
      changePassword: true,
      password: generateRandomString(12),
    };

    const response = await adminResetUserPassword(
      selectedUser?.ID,
      passwordInfo
    );

    if (response?.success) {
      notify("success", `You Reset ${selectedUser?.first_name}'s Password!`);
      return response?.success;
    }

    notify("error", response?.message);
    return response?.success;
  },

  handleDeleteFromWorkspace: async (workspaceID) => {
    set({ isLoading: true });
    const { selectedUser } = get();

    const response = await deleteUserFromWorkspace(selectedUser?.ID);

    if (response?.success) {
      notify("success", `You Removed ${selectedUser?.first_name}!`);
      return response?.success;
    }

    notify("error", response?.message);
    return response?.success;
  },

  handleDeleteFromAccount: async () => {
    set({ isLoading: true });
    const { selectedUser } = get();

    const response = await deleteSystemUserData(selectedUser?.ID);

    if (response?.success) {
      notify("success", `You Removed ${selectedUser?.first_name}!`);
      return response?.success;
    }

    notify("error", response?.message);
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
