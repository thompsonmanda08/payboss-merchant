"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input-field";
import AutoCompleteField from "@/components/base/auto-complete";
import { Button } from "@/components/ui/button";
import useConfigOptions from "@/hooks/use-config-options";
import { payWithBankCard } from "@/app/_actions/checkout-actions";
import SelectField from "@/components/ui/select-field";
import { cn } from "@/lib/utils";
import { useDisclosure, addToast } from "@heroui/react";
import { useCheckoutTransactionStatus } from "@/hooks/use-checkout-transaction-status";
import PromptModal from "@/components/modals/prompt-modal";
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
    status: "PENDING",
    message: "Please wait while we process your payment request",
    serviceProviderDescription: "",
  });

  const router = useRouter();

  const [paymentRefID, setPaymentRefID] = React.useState("");

  //!! GET TRANSACTION STATUS HOOK
  const { transactionResponse, isSuccess, isFailed, isProcessing } =
    useCheckoutTransactionStatus(paymentRefID, isPaymentStarted);

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
    const width = 800;
    const height = 720;

    // Calculate center position
    const left = (window.innerWidth - width) / 2 + window.screenX;
    const top = (window.innerHeight - height) / 2 + window.screenY;

    /* CYBER-SOURCE PAYMENT LINK */
    const paymentUrl =
      paymentData?.redirectUrl || paymentData?.redirect_url || "";

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
      status: "PENDING",
      message: "Please wait while we process your payment request",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      addToast({
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
      currency: "zmw", //REQUIRED
      ...checkoutData,
      ...formData,
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
        title: "Error",
        description: response.message,
        color: "danger",
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
              selector={"province"}
              options={provinces}
              prefilled={true}
              value={formData?.province}
              onChange={handleChange}
            />
          ) : (
            <Input
              id="province"
              name="province"
              label="State"
              value={formData.province}
              onChange={handleChange}
              placeholder="Copperbelt"
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
        isOpen={isOpen}
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
        onOpen={onOpen}
        className={"max-w-max"}
        size="sm"
        removeActionButtons
      >
        <div className="flex flex-col gap-4 flex-1 justify-center items-center max-w-max m-auto p-4 pb-6">
          <div className="aspect-square flex justify-center items-center mx-auto mb-4">
            {transaction?.status == "SUCCESSFUL" ? (
              <CheckBadgeIcon className="w-32 text-success" />
            ) : transaction?.status == "FAILED" ? (
              <XCircleIcon className="w-32 text-danger" />
            ) : (
              <Spinner size={100} />
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
              {transaction?.status == "SUCCESSFUL"
                ? "Payment completed successfully!"
                : transaction?.status == "FAILED"
                  ? "Payment failed. Try again later!"
                  : "Transaction is processing. " + transaction?.message}
              {transaction?.serviceProviderDescription && (
                <>
                  <br />
                  {`Reason: ${transaction?.serviceProviderDescription}`}
                </>
              )}
            </small>
          </div>

          {!isProcessing && transaction?.status != "PENDING" && (
            <Button
              color="danger"
              isDisabled={isProcessing}
              onPress={() => {
                const redirect =
                  checkoutData?.redirect_url ||
                  checkoutData?.redirectUrl ||
                  "#";
                if (isSuccess && redirect) {
                  router.push(`${redirect}?success=true`);
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
