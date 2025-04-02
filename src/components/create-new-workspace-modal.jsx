"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
} from "@heroui/react";
import { Input } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import SelectField from "@/components/ui/select-field";
import { WORKSPACE_TYPES } from "@/lib/constants";

export default function CreateNewWorkspaceModal({
  workspaceTypes,
  handleCreateWorkspace,
  isOpen,
  onOpenChange,
  editWorkspaceField,
  formData,
  handleClose,
  loading,
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create New Workspace
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Workspace Name"
                placeholder="Commercial Team"
                className="mt-px"
                required={true}
                value={formData?.workspace}
                onChange={(e) => {
                  editWorkspaceField({ workspace: e.target.value });
                }}
              />
              <SelectField
                options={workspaceTypes}
                label="Workspace Type"
                name="workspaceType"
                listItemName={"workspace_type"}
                required={true}
                value={formData?.workspaceType}
                onChange={(e) => {
                  editWorkspaceField({ workspaceType: e.target.value });
                }}
              />

              <Input
                label="Description"
                placeholder="Describe the workspace"
                value={formData?.description}
                onChange={(e) => {
                  editWorkspaceField({ description: e.target.value });
                }}
                className="my-px"
              />

              <Checkbox
                size="md"
                defaultSelected={false}
                isSelected={formData?.isMerchantWorkspace}
                onValueChange={(isSelected) =>
                  editWorkspaceField({ isMerchantWorkspace: isSelected })
                }
              >
                Is Merchant Workspace
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                isDisabled={loading}
                onPress={() => handleClose(onClose)}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={loading}
                isDisabled={loading}
                onPress={() => handleCreateWorkspace(onClose)}
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
