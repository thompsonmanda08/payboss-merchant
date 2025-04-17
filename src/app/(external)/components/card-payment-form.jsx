"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input-field";
import AutoCompleteField from "@/components/base/auto-complete";
import { Button } from "@/components/ui/button";
import useConfigOptions from "@/hooks/useConfigOptions";
import { payWithBankCard } from "@/app/_actions/checkout-actions";
import SelectField from "@/components/ui/select-field";
import { cn, notify } from "@/lib/utils";
import { useDisclosure } from "@heroui/react";
import { useCheckoutTransactionStatus } from "@/hooks/use-checkout-transaction-status";
import PromptModal from "@/components/base/prompt-modal";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Spinner from "@/components/ui/custom-spinner";
import { useRouter } from "next/navigation";

export default function CardPaymentForm({ checkoutData }) {
  const { countries, provinces } = useConfigOptions();
  const { amount, transactionID } = checkoutData || "";

  const { isOpen, onOpen, onClose } = useDisclosure();

  const CARD_FORM = {
    phoneNumber: "",
    amount: amount,
    narration: "",
    transactionID: transactionID,
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    province: "",
    country: "ZM",
    postalCode: "10101",
  };

  const [formData, setFormData] = useState(CARD_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentStarted, setIsPaymentStarted] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [transaction, setTransaction] = React.useState({
    status: "pending",
    data: null,
    message: "",
  });

  const router = useRouter();

  // GET TRANSACTION STATUS HOOK
  const { data, isSuccess, isFailed, isProcessing } =
    useCheckoutTransactionStatus(transactionID, isPaymentStarted);

  const popUpWindowRef = React.useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only update if the value is different
    if (formData[name] !== value) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user types
      if (name in errors) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required";
      isValid = false;
    }

    if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Valid phone number is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const openPaymentWindow = async (paymentData) => {
    const width = 768;
    const height = 600;

    // Calculate center position
    const left = (window.innerWidth - width) / 2 + window.screenX;
    const top = (window.innerHeight - height) / 2 + window.screenY;

    const paymentUrl =
      paymentData?.paymentUrl || paymentData?.redirect_url || ""; // Route where the client runs

    if (!paymentUrl) throw new Error("Payment URL not found");

    const paymentWindow = window.open(
      paymentUrl,
      "PayBoss Checkout",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!paymentWindow) {
      alert("Popup blocked! Please allow popups for this site.");
      return;
    }

    popUpWindowRef.current = paymentWindow;
  };

  function handleClosePrompt() {
    onClose();
    setIsSubmitting(false);
    setIsPaymentStarted(false);
    setTransaction({
      status: "pending",
      data: null,
      message: "",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      notify({
        title: "Card Payment Error",
        description: "Missing Fields",
        color: "danger",
      });
      console.error(errors);
      return;
    }

    setIsSubmitting(true);

    const response = await payWithBankCard({
      transactionID,
      amount,
      postal_code: formData.postalCode,
      ...checkoutData,
      ...formData,
    });

    if (response?.success) {
      const payload = {
        ...checkoutData,
        ...formData,
        // FROM PAYBOSS BACKEND
        paymentUrl: response?.data?.redirect_url,
        ...response?.data,
      };

      // OPEN PAYMENT WINDOW
      onOpen();
      setIsSubmitting(false); // THIS WILL TRIGGER THE WEB HOOK
      setIsPaymentStarted(true);
      await openPaymentWindow(payload);
    } else {
      notify({
        title: "Error",
        description: response.message,
        color: "danger",
      });
      setIsSubmitting(false);
      setIsPaymentStarted(false);
    }
  }

  useEffect(() => {
    if (isSuccess && isPaymentStarted) {
      // PREVENT THE TRANSACTION STATUS HOOK FROM FIRING

      setIsPaymentStarted(false);
      setTransaction(data);

      /* TODO: AUTO CLOSE THE OPEN WINDOW USING THE REF OBJECT */
    }
    if (isFailed && isPaymentStarted) {
      // PREVENT THE TRANSACTION STATUS HOOK FROM FIRING
      setIsPaymentStarted(false);
      setTransaction(data);
    }
  }, [data, isProcessing, isSuccess, isFailed]);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input
            id="firstName"
            name="firstName"
            label="First Name"
            required
            value={formData.firstName}
            onError={errors.firstName}
            errorText={errors.firstName}
            onChange={handleChange}
            placeholder="Bob"
          />

          <Input
            id="lastName"
            name="lastName"
            label="Last Name"
            required
            value={formData.lastName}
            onError={errors.lastName}
            errorText={errors.lastName}
            onChange={handleChange}
            placeholder="Mwale"
          />
        </div>

        <Input
          id="email"
          name="email"
          type="email"
          label="  Email"
          required
          value={formData.email}
          onError={errors.email}
          errorText={errors.email}
          onChange={handleChange}
          placeholder="bob.mwale@mail.com"
        />

        <div className="relative">
          <Input
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            required
            onError={errors.phoneNumber}
            value={formData.phoneNumber}
            errorText={errors.phoneNumber}
            onChange={handleChange}
            placeholder="09XXXXXX77"
          />
        </div>

        <Input
          id="address"
          name="address"
          label="Address"
          required
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main St"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="city"
            name="city"
            label="City"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="Lusaka"
          />
          {formData?.country == "ZM" ? (
            <SelectField
              label="Province"
              listItemName={"province"}
              name="province"
              options={provinces}
              prefilled={true}
              value={formData?.province}
              onChange={handleChange}
            />
          ) : (
            <Input
              id="province"
              name="province"
              label="Province"
              value={formData.province}
              onChange={handleChange}
              placeholder="Lusaka"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="postalCode"
            name="postalCode"
            label="Postal Code"
            required
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="10101"
          />

          <AutoCompleteField
            label="Country"
            // required
            listItemName={"country"}
            selector={"country_code"}
            name="country"
            options={countries || []}
            value={formData?.country}
            onChange={(value) => handleSelectChange("country", value)}
          />
        </div>

        {/* <div>
          <label
            className="block text-sm font-medium leading-6 text-foreground/50 "
            htmlFor="narration"
          >
            Payment Description
          </label>
          <div className="mt-2">
            <textarea
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
          type="submit"
          isLoading={isSubmitting}
          loadingText={"Processing..."}
          disabled={isSubmitting}
          className={"w-full"}
          size={"lg"}
        >
          Pay with Card
        </Button>
      </form>

      <PromptModal
        backdrop="blur"
        isDismissable={false}
        isDisabled={isPaymentStarted}
        isOpen={isOpen}
        // title={"Transaction Status"}
        onClose={isProcessing ? undefined : handleClosePrompt}
        onOpen={onOpen}
        className={"max-w-md"}
        size="sm"
        removeActionButtons
      >
        <div className="flex flex-col gap-4 flex-1 justify-center items-center max-w-max m-auto p-4 pb-6">
          <div className="aspect-square flex justify-center items-center mx-auto ">
            {isSuccess ? (
              <CheckBadgeIcon className="w-32 text-success" />
            ) : isFailed ? (
              <XCircleIcon className="w-32 text-danger" />
            ) : (
              <Spinner size={120} />
            )}
          </div>
          <div className="grid place-items-center w-full mx-auto">
            <p
              className={cn(
                " max-w-sm break-words text-center uppercase font-bold text-foreground/80"
              )}
            >
              {transaction?.status}
            </p>
            <small className="text-muted-foreground text-center min-w-60 mx-auto">
              {isSuccess
                ? "Payment completed successfully!"
                : isFailed
                  ? "Payment failed. Try again later!"
                  : "Transaction is processing. " + transaction?.message}
              {isFailed && (
                // REASON FOR FAILURE
                <>
                  <br />
                  {/* {data?.message} */}
                  {`Reason: ${transaction?.mno_status_description}`}
                </>
              )}
            </small>
          </div>

          {!isProcessing && (
            <Button
              color="danger"
              isDisabled={isProcessing}
              onPress={() => {
                if (isSuccess) {
                  router.push(checkoutData?.redirect_url);
                }
                handleClosePrompt();
              }}
              className={"w-full "}
            >
              Close
            </Button>
          )}
        </div>
      </PromptModal>
    </>
  );
}
