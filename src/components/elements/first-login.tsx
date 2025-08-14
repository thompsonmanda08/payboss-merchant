'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  addToast,
} from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { changeUserPassword } from '@/app/_actions/user-actions';
import StatusMessage from '@/components/base/status-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input-field';
import useAuthStore from '@/context/auth-store';
import { PASSWORD_PATTERN } from '@/lib/constants';

export default function FirstLogin({ open }: { open?: boolean }) {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    error,
    setError,
    isLoading,
    setIsLoading,
    password,
    updatePasswordField,
  } = useAuthStore();

  async function handlePasswordChange() {
    setIsLoading(true);

    if (
      password.confirmPassword.length < 8 ||
      !PASSWORD_PATTERN.test(password.newPassword)
    ) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Operation Failed! Try again',
      });
      setIsLoading(false);
      setError({
        status: true,
        onConfirmPassword: true,
        message:
          'Passwords needs to contain at least 8 characters (consisting of lowercase, uppercase, symbols) and have no spaces',
      });

      return;
    }

    // Send New password details to the backend
    const res = await changeUserPassword(password.confirmPassword);

    // If password change success - invalidate query caches - close modals
    if (res.success) {
      onClose();

      addToast({
        color: 'success',
        title: 'Success',
        description: 'Password Changed Successfully',
      });
      queryClient.invalidateQueries();
      setIsLoading(false);

      return;
    }

    setIsLoading(false);
    addToast({
      title: 'Error',
      color: 'danger',
      description: res.message,
    });
  }

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  useEffect(() => {
    setError({ message: '', status: false });
  }, [password, setError]);

  return (
    <Modal
      backdrop="blur"
      hideCloseButton={true}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={open || isOpen}
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Change Your Password
              <p className="text-sm font-medium italic leading-6 text-foreground/70">
                Your login was successful. As a security measure, we require all
                users to change their password on their first login.
              </p>
            </ModalHeader>
            <ModalBody className="flex flex-col gap-y-2">
              <Input
                autoFocus
                required
                label="Password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                type="password"
                value={password.newPassword}
                onChange={(e) =>
                  updatePasswordField({ newPassword: e.target.value })
                }
              />
              <Input
                errorText={'Passwords do not match'}
                isInvalid={
                  (password.confirmPassword !== password.newPassword &&
                    password?.confirmPassword.length > 6) ||
                  error?.onConfirmPassword
                }
                label="Confirm Password"
                type="password"
                value={password.confirmPassword}
                onChange={(e) =>
                  updatePasswordField({ confirmPassword: e.target.value })
                }
              />
              {error?.status && (
                <div className="mx-auto mt-2 flex w-full flex-col items-center justify-center gap-4">
                  <StatusMessage error={error.status} message={error.message} />
                </div>
              )}
              <Button
                className="mt-4"
                isDisabled={
                  !password || password?.newPassword.length < 8 || isLoading
                }
                isLoading={isLoading}
                onPress={handlePasswordChange}
              >
                Change Password
              </Button>
            </ModalBody>
            <ModalFooter>
              <p className="text-center text-sm font-medium italic leading-6 text-primary-800">
                Your new password needs to contain at least 8 characters which
                contains at least one uppercase, lowercase and symbol.
              </p>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
