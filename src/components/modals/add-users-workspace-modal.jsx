"use client";
import { useCallback, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Chip,
  Tooltip,
  addToast,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import StatusMessage from "@/components/base/status-message";
import EmptyState from "@/components/elements/empty-state";
import CardHeader from "@/components/base/card-header";
import SelectField from "@/components/ui/select-field";
import useWorkspaceStore from "@/context/workspaces-store";

import Spinner from "@/components/ui/custom-spinner";
import {
  roleColorMap,
  UserAvatarComponent,
} from "@/components/tables/users-table";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "SYSTEM ROLE", uid: "role" },
  { name: "ACTION", uid: "action_add" },
];
const columns_added = [
  { name: "NAME", uid: "added_name" },
  { name: "WORKSPACE ROLE", uid: "workspace_role" },
  { name: "ACTION", uid: "action_remove" },
];

function AddUserToWorkspace({
  isOpen,
  onClose,
  workspaceID,
  workspaceName,
  navigateTo,
  workspaceMembers,
  allUsers,
  workspaceRoles,
}) {
  const queryClient = useQueryClient();

  const {
    addedUsers,
    error,
    setError,
    isLoading,
    setIsLoading,
    handleAddToWorkspace,
    handleRemoveFromWorkspace,
    handleClearAllSelected,
    handleUserRoleChange,
    handleSubmitAddedUsers,
    existingUsers,
    setExistingUsers,
  } = useWorkspaceStore();

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name": // FIRST_NAME IDENTIFIED THE ALL USERS TABLE AND LAST NAME IDENTIFIES THE ADDED_USERS TABLE
        return (
          <UserAvatarComponent
            key={cellValue}
            isBordered
            className="rounded-md"
            email={user?.email}
            firstName={user?.first_name}
            handleOnSelect={
              !user?.isAdded
                ? () => handleAddToWorkspace(user) // IF USER NOT ADDED THEN ADD THE USER
                : undefined // ELSE NO FUNCTION TO TRIGGER
            }
            lastName={user?.last_name}
            radius="md"
            size="sm"
            src={user?.image}
          />
        );
      case "added_name": // LAST NAME IDENTIFIES THE ADDED_USERS TABLE
        return (
          <UserAvatarComponent
            key={cellValue}
            isBordered
            className="rounded-md"
            email={user?.email}
            firstName={user?.first_name}
            handleOnSelect={
              user?.isAdded ? () => handleRemoveFromWorkspace(user) : undefined // ELSE NO FUNCTION TO TRIGGER
            }
            lastName={user?.last_name}
            radius="md"
            size="sm"
            src={user?.image}
          />
        );

      case "role":
        return (
          <Chip
            key={cellValue}
            className="capitalize"
            color={roleColorMap[user?.role?.toLowerCase()]}
            size="sm"
            variant="flat"
          >
            {user?.role}
          </Chip>
        );

      case "workspace_role":
        return (
          <SelectField
            key={user?.ID}
            className={"max-w-[200px]"}
            listItemName={"role"}
            name="role"
            options={workspaceRoles}
            placeholder={"Select Role"}
            value={user?.workspaceRole}
            onChange={(e) => handleUserRoleChange(user, e.target.value)}
          />
        );

      case "action_add":
        return (
          <Button
            isIconOnly
            className="relative"
            color="primary"
            isDisabled={user?.role == "owner"}
            size="sm"
            variant="light"
            onPress={() => handleAddToWorkspace(user)}
          >
            <Tooltip color="primary" content="Add User">
              <span className="cursor-pointer text-lg text-primary active:opacity-50">
                <UserPlusIcon className="h-5 w-5" />
              </span>
            </Tooltip>
          </Button>
        );
      case "action_remove":
        return (
          <Button
            isIconOnly
            className="relative"
            color="danger"
            isDisabled={user?.role == "owner"}
            size="sm"
            variant="light"
            onPress={() => handleRemoveFromWorkspace(user)}
          >
            <Tooltip color="danger" content="Remove User">
              <span className="cursor-pointer text-lg text-danger active:opacity-50">
                <XMarkIcon className="h-5 w-5" />
              </span>
            </Tooltip>
          </Button>
        );
      default:
        return cellValue;
    }
  }, []);

  async function submitAddedUsers() {
    const response = await handleSubmitAddedUsers(workspaceID);

    if (!response?.success) {
      setError({
        status: true,
        message: response?.message,
      });

      addToast({
        title: "Error",
        color: "danger",
        description: response?.message,
      });
      setIsLoading(false);

      return;
    }

    addToast({
      color: "success",
      title: "Success",
      description: `Users were added to ${workspaceName}!`,
    });
    navigateTo?.(1);
    onClose();
    handleClearAllSelected();
    queryClient.invalidateQueries();

    return;
  }

  useEffect(() => {
    return () => {
      handleClearAllSelected();
    };
  }, []);

  useEffect(() => {
    setError({ status: false, message: "" });
  }, [addedUsers]);

  useEffect(() => {
    // UPDATE EXISTING USERS LIST
    if (workspaceMembers != [] && existingUsers?.length == 0) {
      setExistingUsers(workspaceMembers);
    }
  }, [workspaceMembers]);

  const isDataReady = workspaceRoles?.length > 0 && allUsers?.length > 0;
  const router = useRouter();

  return (
    <Modal
      // IF ROLES AND USERS ARE LOADED THEN RENDER FULL SIZE
      // size={'5xl'}
      className="max-w-[1560px]"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) =>
          isDataReady ? (
            <>
              <ModalHeader className="flex gap-1">
                Add Members to
                {workspaceName && <span>{workspaceName}</span>}
              </ModalHeader>
              <ModalBody>
                <section className="flex w-full gap-8" role="user-section">
                  {/**** A LIST OF ALL USERS THAT CAN BE ADDED TO A WORKSPACE ******/}
                  <div className="flex flex-1 flex-col">
                    <CardHeader title="All Users" />
                    <div className="" role="ALL_USERS_LIST">
                      <Table
                        aria-label="Table with dynamic content"
                        className="max-h-[720px] shadow-none"
                      >
                        <TableHeader>
                          {columns.map((column) => (
                            <TableColumn
                              key={column.uid}
                              align={
                                column.uid === "action_add" ? "center" : "start"
                              }
                            >
                              {column.name}
                            </TableColumn>
                          ))}
                        </TableHeader>
                        <TableBody
                          emptyContent={"No Users to display."}
                          items={allUsers}
                        >
                          {(user) => (
                            <TableRow
                              key={user?.ID}
                              // TODO: DISABLED OWNER ROW
                              isDisabled={user?.role == "owner"}
                            >
                              {(columnKey) => (
                                <TableCell>
                                  {renderCell(user, columnKey)}
                                </TableCell>
                              )}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  {/* ********************************************************* */}

                  {/**** A LIST OF ADDED USERS TO A WORKSPACE ******/}
                  <div className="flex flex-1 flex-col">
                    <CardHeader title="Added Users" />
                    <div className="flex flex-col" role="ADDED_USERS_LIST">
                      {error && error.status && (
                        <div className="mx-auto mt-2 flex w-full flex-col items-center justify-center gap-4">
                          <StatusMessage
                            error={error.status}
                            message={error.message}
                          />
                        </div>
                      )}
                      <Table
                        aria-label="Table with dynamic content"
                        className="max-h-[720px] shadow-none"
                      >
                        <TableHeader>
                          {columns_added.map((column) => (
                            <TableColumn
                              key={column.uid}
                              align={
                                column.uid === "action_remove"
                                  ? "center"
                                  : "start"
                              }
                            >
                              {column.name}
                            </TableColumn>
                          ))}
                        </TableHeader>
                        <TableBody
                          emptyContent={
                            "You have not selected any all Users to add to this workspace"
                          }
                          items={addedUsers || []}
                        >
                          {(user) => (
                            <TableRow key={user?.ID}>
                              {(columnKey) => (
                                <TableCell>
                                  {renderCell(user, columnKey)}
                                </TableCell>
                              )}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>

                      <Button
                        className={"ml-auto mt-5"}
                        color="primary"
                        variant="light"
                        onPress={handleClearAllSelected}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  {/* ********************************************************* */}
                </section>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Back
                </Button>
                <Button
                  color="primary"
                  isDisabled={isLoading || addedUsers.length == 0}
                  isLoading={isLoading}
                  onPress={submitAddedUsers}
                >
                  Add Selected Users
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              {/* WHEN THERE ARE NO USERS ADDED TO THE ACCOUNT */}
              <ModalHeader className="flex flex-col gap-1">
                Add User to Workspace
              </ModalHeader>
              <ModalBody>
                {!allUsers || !workspaceRoles ? (
                  <div className="flex aspect-square w-[200px] flex-1 items-center justify-center self-center p-10">
                    <Spinner size={64} />
                  </div>
                ) : (
                  <section className="flex gap-8" role="user-section">
                    <EmptyState
                      buttonText={"Add New Users"}
                      classNames={{
                        heading: "md:text-[40px] tracking-tight leading-3",
                        paragraph: "text-[18px] text-slate-600",
                      }}
                      message={
                        "Add allUsers to your workspace to start assigning them."
                      }
                      title={"NO USERS ADDED"}
                      onButtonClick={() => {
                        router.push("/manage-account/users");
                        onClose();
                      }}
                    />
                  </section>
                )}
              </ModalBody>
            </>
          )
        }
      </ModalContent>
    </Modal>
  );
}

export default AddUserToWorkspace;
