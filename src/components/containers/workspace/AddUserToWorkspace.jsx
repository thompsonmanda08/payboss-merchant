"use client";
import React, { useCallback, useEffect } from "react";
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
} from "@heroui/react";

import { notify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { roleColorMap, UserAvatarComponent } from "../tables/UsersTable";
import StatusMessage from "@/components/base/StatusMessage";
import EmptyState from "@/components/elements/empty-state";
import CardHeader from "@/components/base/CardHeader";
import Spinner from "../../ui/Spinner";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import SelectField from "@/components/ui/select-field";
import useWorkspaceStore from "@/context/workspaces-store";
import { WORKSPACE_MEMBERS_QUERY_KEY } from "@/lib/constants";
import { useRouter } from "next/navigation";

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
            firstName={user?.first_name}
            lastName={user?.last_name}
            email={user?.email}
            size="sm"
            className="rounded-md"
            src={user?.image}
            isBordered
            radius="md"
            handleOnSelect={
              !user?.isAdded
                ? () => handleAddToWorkspace(user) // IF USER NOT ADDED THEN ADD THE USER
                : undefined // ELSE NO FUNCTION TO TRIGGER
            }
          />
        );
      case "added_name": // LAST NAME IDENTIFIES THE ADDED_USERS TABLE
        return (
          <UserAvatarComponent
            key={cellValue}
            firstName={user?.first_name}
            lastName={user?.last_name}
            email={user?.email}
            size="sm"
            className="rounded-md"
            src={user?.image}
            isBordered
            radius="md"
            handleOnSelect={
              user?.isAdded ? () => handleRemoveFromWorkspace(user) : undefined // ELSE NO FUNCTION TO TRIGGER
            }
          />
        );

      case "role":
        return (
          <Chip
            key={cellValue}
            color={roleColorMap[user?.role?.toLowerCase()]}
            className="capitalize"
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
            options={workspaceRoles}
            listItemName={"role"}
            placeholder={"Select Role"}
            name="role"
            value={user?.workspaceRole}
            onChange={(e) => handleUserRoleChange(user, e.target.value)}
          />
        );

      case "action_add":
        return (
          <Button
            isIconOnly
            variant="light"
            color="primary"
            size="sm"
            className="relative"
            isDisabled={user?.role == "owner"}
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
            variant="light"
            color="danger"
            size="sm"
            className="relative"
            isDisabled={user?.role == "owner"}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitAddedUsers() {
    const response = await handleSubmitAddedUsers(workspaceID);

    if (!response?.success) {
      setError({
        status: true,
        message: response?.message,
      });
      notify("error", response?.message);
      setIsLoading(false);
      return;
    }

    notify("success", `Users were added to ${workspaceName}!`);
    navigateTo?.(1);
    onClose();
    handleClearAllSelected();
    queryClient.invalidateQueries({
      queryKey: [WORKSPACE_MEMBERS_QUERY_KEY, workspaceID],
    });
    return;
  }

  useEffect(() => {
    return () => {
      handleClearAllSelected();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setError({ status: false, message: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedUsers]);

  useEffect(() => {
    // UPDATE EXISITING USERS LIST
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
                <section role="user-section" className="flex w-full gap-8">
                  {/**** A LIST OF ALL USERS THAT CAN BE ADDED TO A WORKSPACE ******/}
                  <div className="flex flex-1 flex-col">
                    <CardHeader title="All Users" />
                    <div role="ALL_USERS_LIST" className="">
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
                          items={allUsers}
                          emptyContent={"No Users to display."}
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
                    <div role="ADDED_USERS_LIST" className="flex flex-col">
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
                          items={addedUsers || []}
                          emptyContent={
                            "You have not selected any all Users to add to this workspace"
                          }
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
                        variant="light"
                        color="primary"
                        className={"ml-auto mt-5"}
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
                  isLoading={isLoading}
                  isDisabled={isLoading || addedUsers.length == 0}
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
                  <div className="flex aspect-square w-[200px] flex-1 items-center justify-center self-center p-10 ">
                    <Spinner size={64} />
                  </div>
                ) : (
                  <section role="user-section" className="flex gap-8">
                    <EmptyState
                      title={"NO USERS ADDED"}
                      classNames={{
                        heading: "md:text-[40px] tracking-tight leading-3",
                        paragraph: "text-[18px] text-slate-600",
                      }}
                      message={
                        "Add allUsers to your workspace to start assigning them."
                      }
                      buttonText={"Add New Users"}
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
