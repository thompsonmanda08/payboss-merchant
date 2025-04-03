import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

import { Button } from "../ui/button";

function PromptModal({
  size = "lg",
  isOpen,
  onClose,
  onConfirm,
  title = "Prompt",
  cancelText = "Cancel",
  confirmText = "Confirm",
  isDisabled,
  isLoading,
  isDismissable = true,
  isKeyboardDismissDisabled = true,
  children,
}) {
  return (
    <Modal
      className={"z-[99999999] max-w-[600px]"}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      isOpen={isOpen}
      size={size}
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="tracking-tight">{title}</ModalHeader>
            <ModalBody className="gap-0">{children}</ModalBody>
            <ModalFooter>
              <Button color="danger" isDisabled={isDisabled} onPress={onClose}>
                {cancelText}
              </Button>
              <Button
                color="primary"
                isDisabled={isDisabled}
                isLoading={isLoading}
                onPress={onConfirm}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default PromptModal;
