'use client'
import { Input } from '@/components/ui/InputField'
import SelectField from '@/components/ui/SelectField'
import { notify } from '@/lib/utils'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from '@nextui-org/react'
import { useState } from 'react'

function CreateNewUserModal({ isOpen, onOpen, onOpenChange }) {
  const [loading, setLoading] = useState(false)
  // const { isOpen, onOpen, onOpenChange } = useDisclosure()

  function handleClose(onClose) {
    // Cancel
    onClose()
  }
  function handleCreateUser() {
    setLoading(true)
    
    // CREATE A USER

    setTimeout(() => {
      setLoading(false)
      notify('success', 'User created successfully!')
    }, 3000)
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New User
              </ModalHeader>
              <ModalBody>
                <SelectField label="User Role" placeholder="Admin" />
                <SelectField
                  label="Workspace"
                  placeholder="Choose Workspace"
                  className="mt-px"
                />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input autoFocus label="First Name" />
                  <Input label="Last Name" />
                </div>
                <Input label="Phone #" />
                <Input label="Email Address" />

                <p className="text-[14px] font-medium text-slate-700">
                  A password will be sent to the provided email. The new user
                  must change it on first login.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={() => handleClose(onClose)}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={loading}
                  isDisabled={loading}
                  onPress={() => handleCreateUser(onClose)}
                >
                  Create User
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateNewUserModal
