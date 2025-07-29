"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

import { Input } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import SelectField from "@/components/ui/select-field";

export default function CreateNewWorkspaceModal({
  workspaceTypes,
  handleCreateWorkspace,
  isOpen,
  editWorkspaceField,
  formData,
  handleClose,
  loading,
}: {
  workspaceTypes: any[];
  handleCreateWorkspace: any;
  isOpen: any;
  editWorkspaceField: any;
  formData: any;
  handleClose: any;
  loading: any;
}) {
  return (
    <Modal isOpen={isOpen} placement="top-center" onClose={handleClose}>
      <ModalContent>
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
        </ModalBody>
        <ModalFooter>
          <Button color="danger" isDisabled={loading} onPress={handleClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            isDisabled={loading}
            isLoading={loading}
            onPress={handleCreateWorkspace}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
