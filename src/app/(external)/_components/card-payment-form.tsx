'use client';
import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useDisclosure, addToast } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { payWithBankCard } from '@/app/_actions/checkout-actions';
import AutoCompleteField from '@/components/base/auto-complete';
import PromptModal from '@/components/modals/prompt-modal';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/custom-spinner';
import { Input } from '@/components/ui/input-field';
import SelectField from '@/components/ui/select-field';
import { useCheckoutTransactionStatus } from '@/hooks/use-checkout-transaction-status';
import useConfigOptions from '@/hooks/use-config-options';
import { cn } from '@/lib/utils';

export default function CardPaymentForm({
  checkoutData,
}: {
  checkoutData: any;
}) {
  const { countries, provinces } = useConfigOptions();
  const { amount, transactionID } = checkoutData || '';

  const { isOpen, onOpen, onClose } = useDisclosure();

  const CARD_FORM = {
    phoneNumber: '',
    amount: amount,
    narration: '',
    transactionID: transactionID,
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    province: '',
    country: 'ZM',
    postalCode: '10101',
  };

  const [formData, setFormData] = useState(CARD_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentStarted, setIsPaymentStarted] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [transaction, setTransaction] = React.useState<{
    status: string;
    message: string;
    serviceProviderDescription?: string;
  }>({
    status: 'PENDING',
    message: 'Please wait while we process your payment request',
    serviceProviderDescription: '',
  });

  const router = useRouter();

  const [paymentRefID, setPaymentRefID] = React.useState('');

  //!! GET TRANSACTION STATUS HOOK
  const { transactionResponse, isSuccess, isFailed, isProcessing } =
    useCheckoutTransactionStatus(paymentRefID, isPaymentStarted);

  const popUpWindowRef = React.useRef<Window | null>(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    // Only update if the value is different
    if (formData[name as keyof typeof formData] !== value) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user types
      if (name in errors) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
      isValid = false;
    }

    if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Valid phone number is required';
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const openPaymentWindow = async (paymentData: any) => {
    const width = 800;
    const height = 860;

    // Calculate center position
    const left = (window.innerWidth - width) / 2 + window.screenX;
    const top = (window.innerHeight - height) / 2 + window.screenY;

    /* CYBER-SOURCE PAYMENT LINK */
    const paymentUrl =
      paymentData?.redirectUrl || paymentData?.redirect_url || '';

    if (!paymentUrl) throw new Error('Payment URL not found');

    const paymentWindow = window.open(
      paymentUrl,
      'PayBoss Checkout',
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    if (!paymentWindow) {
      alert('Popup blocked! Please allow popups for this site.');

      return;
    }

    popUpWindowRef.current = paymentWindow;
  };

  function handleClosePrompt() {
    onClose();
    setIsSubmitting(false);
    setIsPaymentStarted(false);
    setTransaction({
      status: 'PENDING',
      message: 'Please wait while we process your payment request',
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      addToast({
        title: 'Card Payment Error',
        description: 'Missing Fields',
        color: 'danger',
      });
      console.error(errors);

      return;
    }

    setIsSubmitting(true);

    const response = await payWithBankCard({
      ...checkoutData,
      ...formData,
      transactionID,
      amount,
      currency: 'zmw', // REQUIRED
    });

    if (response?.success) {
      setPaymentRefID(response?.data?.transactionID);

      const payload = {
        ...checkoutData,
        ...formData,
        ...response?.data,
      };

      onOpen(); // OPEN PAYMENT WINDOW
      setIsSubmitting(false); // THIS WILL TRIGGER THE WEB HOOK
      setIsPaymentStarted(true); //
      await openPaymentWindow(payload);
    } else {
      addToast({
        title: 'Error',
        description: response.message,
        color: 'danger',
      });
      setIsSubmitting(false);
      setIsPaymentStarted(false);
    }
  }

  useEffect(() => {
    // PREVENT THE TRANSACTION STATUS HOOK FROM FIRING AFTER STATUS UPDATES
    if (isSuccess && isPaymentStarted) {
      setIsPaymentStarted(false);
      setTransaction(transactionResponse);
    }
    if (isFailed && isPaymentStarted) {
      setIsPaymentStarted(false);
      setTransaction(transactionResponse);
    }
  }, [isSuccess, isFailed]);

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input
            required
            errorText={errors.firstName}
            id="firstName"
            isInvalid={Boolean(errors.firstName)}
            label="First Name"
            name="firstName"
            placeholder="Bob"
            value={formData.firstName}
            onChange={handleChange}
          />

          <Input
            required
            errorText={errors.lastName}
            id="lastName"
            isInvalid={Boolean(errors.lastName)}
            label="Last Name"
            name="lastName"
            placeholder="Mwale"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <Input
          required
          errorText={errors.email}
          id="email"
          isInvalid={Boolean(errors.email)}
          label="  Email"
          name="email"
          placeholder="bob.mwale@mail.com"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <div className="relative">
          <Input
            required
            errorText={errors.phoneNumber}
            id="phoneNumber"
            isInvalid={Boolean(errors.phoneNumber)}
            label="Phone Number"
            name="phoneNumber"
            placeholder="09XXXXXX77"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <Input
          required
          id="address"
          label="Address"
          name="address"
          placeholder="123 Main St"
          value={formData.address}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            required
            id="city"
            label="City"
            name="city"
            placeholder="Lusaka"
            value={formData.city}
            onChange={handleChange}
          />
          {formData?.country == 'ZM' ? (
            <SelectField
              label="Province"
              listItemName={'province'}
              name="province"
              options={provinces}
              prefilled={true}
              selector={'province'}
              value={formData?.province}
              onChange={handleChange}
            />
          ) : (
            <Input
              id="province"
              label="State"
              name="province"
              placeholder="Copperbelt"
              value={formData.province}
              onChange={handleChange}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            required
            id="postalCode"
            label="Postal Code"
            name="postalCode"
            placeholder="10101"
            value={formData.postalCode}
            onChange={handleChange}
          />

          <AutoCompleteField
            name="country"
            options={countries || []}
            selector={'country_code'}
            value={formData?.country}
            onChange={(value) => handleSelectChange('country', value)}
            label="Country"
            // required
            listItemName={'country'}
          />
        </div>

        <Button
          className={'w-full'}
          disabled={isSubmitting}
          isLoading={isSubmitting}
          loadingText={'Processing...'}
          size={'lg'}
          type="submit"
        >
          Pay with Card
        </Button>
      </form>

      <PromptModal
        removeActionButtons
        backdrop="blur"
        className={'max-w-max'}
        onClose={
          transaction?.status == 'PENDING'
            ? () => {
                addToast({
                  color: 'warning',
                  title: 'Pending Transaction',
                  description: 'Transaction is still pending, please wait.',
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
          <div className="aspect-square flex justify-center items-center mx-auto mb-4">
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
                  : 'Transaction is processing. ' + transaction?.message}
              {transaction?.serviceProviderDescription && (
                <>
                  <br />
                  {`Reason: ${transaction?.serviceProviderDescription}`}
                </>
              )}
            </small>
          </div>

          {!isProcessing && transaction?.status != 'PENDING' && (
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
          )}
        </div>
      </PromptModal>
    </>
  );
}
