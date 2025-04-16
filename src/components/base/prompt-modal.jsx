import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

function PromptModal({
  size = "lg",
  isOpen,
  onClose,
  onConfirm,
  title = "",
  cancelText = "Cancel",
  confirmText = "Confirm",
  isDisabled,
  isLoading,
  isDismissable = true,
  isKeyboardDismissDisabled = true,
  className,
  backdrop,
  removeActionButtons = false,
  children,
}) {
  return (
    <Modal
      backdrop={backdrop}
      className={cn("z-[99999999] max-w-[600px]", className)}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      isOpen={isOpen}
      size={size}
      onClose={onClose}
    >
      <ModalContent>
        {title && (
          <ModalHeader className="tracking-tight text-base">
            {title}
          </ModalHeader>
        )}
        <ModalBody className="gap-0">{children}</ModalBody>
        {!removeActionButtons && (
          <ModalFooter>
            <Button color="danger" isDisabled={isDisabled} onPress={onClose}>
              {cancelText}
            </Button>
            {onConfirm && (
              <Button
                color="primary"
                isDisabled={isDisabled}
                isLoading={isLoading}
                onPress={onConfirm}
              >
                {confirmText}
              </Button>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}

export default PromptModal;
