import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/modal'
import { Button } from '../ui/Button'

function PromptModal({
  size = 'lg',
  isOpen,
  onClose,
  onConfirm,
  title = 'Prompt',
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  children,
}) {
  function handleOnConfirm() {
    onConfirm()
    onClose()
  }
  return (
    <Modal
      size={size}
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {cancelText}
              </Button>
              <Button color="primary" onPress={handleOnConfirm}>
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default Prompt
