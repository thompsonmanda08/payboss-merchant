'use client';

import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Image, useDisclosure, addToast } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { payWithMobileMoney } from '@/app/_actions/checkout-actions';
import PromptModal from '@/components/modals/prompt-modal';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/custom-spinner';
import { Input } from '@/components/ui/input-field';
import { useCheckoutTransactionStatus } from '@/hooks/use-checkout-transaction-status';
import { AIRTEL_NO, MTN_NO } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function MobileMoneyForm({ checkoutData }: any) {
  const { amount, transactionID, serviceID, workspaceID } = checkoutData || '';

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const [operatorLogo, setOperatorLogo] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [pinPromptSent, setPinPromptSent] = React.useState(false);
  const [transaction, setTransaction] = React.useState<{
    status: string;
    message: string;
    serviceProviderDescription?: string;
  }>({
    status: 'PENDING',
    message: 'Please wait while we process your payment request',
    serviceProviderDescription: '',
  });

  const [paymentRefID, setPaymentRefID] = React.useState('');
  //!! GET TRANSACTION STATUS HOOK
  const { transactionResponse, isSuccess, isFailed, isProcessing } =
    useCheckoutTransactionStatus(paymentRefID, pinPromptSent);

  const [formData, setFormData] = useState<{
    phoneNumber: string;
    amount: string;
  }>({
    phoneNumber: '',
    amount: amount,
  });
  const [errors, setErrors] = useState({
    phoneNumber: '',
  });

  function checkOperator(phone: string) {
    if (AIRTEL_NO.test(phone)) {
      setFormData((prev) => ({ ...prev, operator: 'airtel' }));
      setOperatorLogo('/images/airtel-logo.png');

      return;
    }

    if (MTN_NO.test(phone)) {
      setFormData((prev) => ({ ...prev, operator: 'mtn' }));
      setOperatorLogo('/images/mtn-logo.png');

      return;
    }

    setOperatorLogo('');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Only update if the value is different
    if (formData[name as keyof typeof formData] !== value) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Simple validation
      if (name === 'phoneNumber' && value.length < 10) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: 'Phone number must be at least 10 digits.',
        }));
      } else if (name === 'phoneNumber') {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: '',
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Validate before submission
    if (formData.phoneNumber.length < 10) {
      setErrors({
        phoneNumber: 'Phone number must be at least 10 digits.',
      });

      return;
    }

    const response = await payWithMobileMoney({
      transactionID,
      serviceID,
      workspaceID,
      phoneNumber: formData.phoneNumber,
      amount: formData.amount,
    });

    if (response?.success) {
      addToast({
        title: 'Mobile Payment',
        description: `Pin prompt sent to${formData?.phoneNumber}`,
        color: 'success',
      });
      setPaymentRefID(response?.data?.transactionID);
      onOpen();
      setIsSubmitting(false);
      setPinPromptSent(true); // THIS WILL ENABLE THE TRANSACTION STATUS HOOK - FIRES IN INTERVALS
    } else {
      addToast({
        title: 'Error',
        description: response.message,
        color: 'danger',
      });
      setIsSubmitting(false);
      setPinPromptSent(false); // THIS WILL DISABLE THE TRANSACTION STATUS HOOK - FIRES IN INTERVALS
    }
  };

  function handleClosePrompt() {
    onClose();
    setIsSubmitting(false);
    setPinPromptSent(false);
    setTransaction({
      status: 'PENDING',
      message: 'Please wait while we process your payment request',
    });
  }

  useEffect(() => {
    // PREVENT THE TRANSACTION STATUS HOOK FROM FIRING AFTER STATE CHANGES
    if (isSuccess && pinPromptSent) {
      setPinPromptSent(false);
      setTransaction(transactionResponse);
    }

    if (isFailed && pinPromptSent) {
      setPinPromptSent(false);
      setTransaction(transactionResponse);
    }
  }, [isSuccess, isFailed]);

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
          <div className="relative flex flex-col">
            <Input
              required
              errorText={errors.phoneNumber}
              id="phoneNumber"
              isInvalid={Boolean(errors.phoneNumber)}
              label="Phone Number"
              name="phoneNumber"
              placeholder={'Mobile Number'}
              value={formData.phoneNumber}
              onChange={(e) => {
                handleChange(e);
                checkOperator(e.target.value);
              }}
            />
            <span className="absolute right-0 top-6 h-full w-24 px-4">
              {Boolean(operatorLogo) && (
                <Image
                  alt="logo"
                  className="h-full w-full object-contain"
                  height={32}
                  src={operatorLogo}
                  width={60}
                />
              )}
            </span>
            <small className="text-[12px] mt-1 ml-1 text-default-500">
              E.g. 097XX/077XX/096XXX/095XX etc.
            </small>
          </div>
        </div>

        {/* <div>
          <label
            className="block text-sm font-medium leading-6 text-foreground/80"
            htmlFor="narration"
          >
            Payment Description
          </label>
          <div className="">
            <textarea
              required
              className="block w-full rounded-md border-0 py-1.5 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/80 sm:text-sm sm:leading-6"
              onChange={handleChange}
              value={formData?.narration}
              id="narration"
              name="narration"
              rows={2}
            />
          </div>
        </div> */}

        <Button
          className={'w-full'}
          disabled={isSubmitting}
          isLoading={isSubmitting}
          loadingText={'Processing...'}
          size={'lg'}
          type="submit"
        >
          Pay with Mobile Money
        </Button>
      </form>

      <PromptModal
        removeActionButtons
        backdrop="blur"
        className={"max-w-max"}
        onClose={
          transaction?.status == "PENDING"
            ? () => {
                addToast({
                  color: "warning",
                  title: "Pending Transaction",
                  description: "Transaction is still pending, please wait.",
                });
              }
            : handleClosePrompt
        }
        // onOpen={onOpen}
        isDismissable={false}
        isOpen={isOpen}
        size="sm"
      >
        <div className="flex flex-col gap-4 flex-1 justify-center items-center max-w-max m-auto p-4 pb-6">
          <div className="aspect-square flex justify-center items-center mx-auto mb-4 max-w-xs">
            {transaction?.status == 'SUCCESSFUL' ? (
              <CheckBadgeIcon className="w-32 text-success" />
            ) : transaction?.status == 'FAILED' ? (
              <XCircleIcon className="w-32 text-danger" />
            ) : (
              <Spinner size={100} />
            )}
          </div>
          <div className="grid place-items-center w-full mx-auto">
            <p
              className={cn(
                ' max-w-sm break-words text-center uppercase font-bold text-foreground/80',
              )}
            >
              {transaction?.status}
            </p>
            <small className="text-muted-foreground text-center min-w-60 mx-auto">
              {transaction?.status == 'SUCCESSFUL'
                ? 'Payment completed successfully!'
                : transaction?.status == 'FAILED'
                  ? 'Payment failed. Try again later!'
                  : transaction?.message}
              {transaction?.serviceProviderDescription && (
                <>
                  <br />
                  {`Reason: ${transaction?.serviceProviderDescription}`}
                </>
              )}
            </small>
          </div>

          {!isProcessing && transaction?.status != 'PENDING' && (
            <>
              <Button
                className={'w-full '}
                color="danger"
                isDisabled={isProcessing}
                onPress={() => {
                  const redirect =
                    checkoutData?.redirect_url ||
                    checkoutData?.redirectUrl ||
                    '#';

                  if (isSuccess && redirect) {
                    router.push(`${redirect}?success=true`);
                  }
                  handleClosePrompt();
                }}
              >
                Close
              </Button>
            </>
          )}
        </div>
      </PromptModal>
    </>
  );
}
