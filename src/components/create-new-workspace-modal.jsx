"use client";
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

export default function CreateNewWorkspaceModal({
  workspaceTypes,
  handleCreateWorkspace,
  isOpen,
  onOpenChange,
  editWorkspaceField,
  formData,
  handleClose,
  loading,
  merchantKYC,
}) {
  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create New Workspace
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                className="mt-px"
                label="Workspace Name"
                placeholder="Commercial Team"
                required={true}
                value={formData?.workspace}
                onChange={(e) => {
                  editWorkspaceField({ workspace: e.target.value });
                }}
              />
              <SelectField
                label="Workspace Type"
                listItemName={"workspace_type"}
                name="workspaceType"
                options={workspaceTypes}
                required={true}
                value={formData?.workspaceType}
                onChange={(e) => {
                  editWorkspaceField({ workspaceType: e.target.value });
                }}
              />

              <Input
                className="my-px"
                label="Description"
                placeholder="Describe the workspace"
                value={formData?.description}
                onChange={(e) => {
                  editWorkspaceField({ description: e.target.value });
                }}
              />

              {merchantKYC?.merchant_type == "super" && (
                <Checkbox
                  defaultSelected={false}
                  isSelected={formData?.isMerchantWorkspace}
                  size="md"
                  onValueChange={(isSelected) =>
                    editWorkspaceField({ isMerchantWorkspace: isSelected })
                  }
                >
                  Is Merchant Workspace
                </Checkbox>
              )}
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
                isDisabled={loading}
                isLoading={loading}
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
