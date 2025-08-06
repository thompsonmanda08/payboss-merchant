import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
} from "@heroui/modal";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

type PromptModalProps = ModalProps &
  PropsWithChildren & {
    onConfirm?: () => void;
    title?: string;
    cancelText?: string;
    confirmText?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    isDismissable?: boolean;
    isKeyboardDismissDisabled?: boolean;
    className?: string;
    // backdrop?: "transparent" | "opaque" | "blur";
    // placement?: string;
    removeActionButtons?: boolean;
  };

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
  placement = "bottom-center",
  removeActionButtons = false,
  children,
}: PromptModalProps) {
  return (
    <Modal
      backdrop={backdrop}
      className={cn("z-[99999999] max-w-[600px]", className)}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      placement={placement}
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
        <ModalBody className="gap-0 py-0 my-0">{children}</ModalBody>
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
