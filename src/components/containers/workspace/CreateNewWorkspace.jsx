'use client'
import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react'
import { Input } from '@/components/ui/InputField'
import { Button } from '@/components/ui/Button'
import SelectField from '@/components/ui/SelectField'

const WORKSPACE_TYPES = [
  {
    ID: 'collection',
    label: 'Collection',
  },
  {
    ID: 'disbursement',
    label: 'Disbursement',
  },
  {
    ID: 'hybrid',
    label: 'Hybrid',
  },
]

export default function CreateNewWorkspaceModal({
  handleCreateWorkspace,
  isOpen,
  onOpenChange,
  editWorkspaceField,
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
                onChange={(e) => {
                  editWorkspaceField({ workspace: e.target.value })
                }}
              />
              <SelectField
                options={WORKSPACE_TYPES}
                label="Workspace Type"
                name="workspaceType"
                required={true}
                onChange={(e) => {
                  editWorkspaceField({ workspaceType: e.target.value })
                }}
              />

              <Input
                label="Description"
                placeholder="Describe the workspace"
                onChange={(e) => {
                  editWorkspaceField({ description: e.target.value })
                }}
                className="mt-px"
              />
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
  )
}
