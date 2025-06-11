"use client";

import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { AIRTEL_NO, MTN_NO } from "@/lib/constants";
import { cn, notify } from "@/lib/utils";
import { Image, useDisclosure } from "@heroui/react";
import { useCheckoutTransactionStatus } from "@/hooks/use-checkout-transaction-status";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { payWithMobileMoney } from "@/app/_actions/checkout-actions";

import Spinner from "@/components/ui/custom-spinner";
import PromptModal from "@/components/base/prompt-modal";
import { useRouter } from "next/navigation";

export default function MobileMoneyForm({ checkoutData }) {
  const { amount, transactionID } = checkoutData || "";

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const [operatorLogo, setOperatorLogo] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [pinPromptSent, setPinPromptSent] = React.useState(false);
  const [transaction, setTransaction] = React.useState({
    status: "PENDING",
    message: "Please wait while we process your payment request",
    serviceProviderDescription: "",
  });

  const [paymentRefID, setPaymentRefID] = React.useState("");
  //!! GET TRANSACTION STATUS HOOK
  const { transactionResponse, isSuccess, isFailed, isProcessing } =
    useCheckoutTransactionStatus(paymentRefID, pinPromptSent);

  const [formData, setFormData] = useState({
    phoneNumber: "",
    amount: amount,
  });
  const [errors, setErrors] = useState({
    phoneNumber: "",
  });

  function checkOperator(phone) {
    if (AIRTEL_NO.test(phone)) {
      setFormData((prev) => ({ ...prev, operator: "airtel" }));
      setOperatorLogo("/images/airtel-logo.png");

      return;
    }

    if (MTN_NO.test(phone)) {
      setFormData((prev) => ({ ...prev, operator: "mtn" }));
      setOperatorLogo("/images/mtn-logo.png");

      return;
    }

    setOperatorLogo("");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only update if the value is different
    if (formData[name] !== value) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Simple validation
      if (name === "phoneNumber" && value.length < 10) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: "Phone number must be at least 10 digits.",
        }));
      } else if (name === "phoneNumber") {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Validate before submission
    if (formData.phoneNumber.length < 10) {
      setErrors({
        phoneNumber: "Phone number must be at least 10 digits.",
      });
      return;
    }

    const response = await payWithMobileMoney({
      transactionID,
      phoneNumber: formData.phoneNumber,
      amount: formData.amount,
    });

    if (response?.success) {
      notify({
        title: "Mobile Payment",
        description: `Pin prompt sent to${formData?.phoneNumber}`,
        color: "success",
      });
      setPaymentRefID(response?.data?.transactionID);
      onOpen();
      setIsSubmitting(false);
      setPinPromptSent(true); // THIS WILL ENABLE THE TRANSACTION STATUS HOOK - FIRES IN INTERVALS
    } else {
      notify({
        title: "Error",
        description: response.message,
        color: "danger",
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
      status: "PENDING",
      message: "Please wait while we process your payment request",
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="relative flex flex-col">
            <Input
              required
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              onError={errors.phoneNumber}
              value={formData.phoneNumber}
              errorText={errors.phoneNumber}
              placeholder={"Mobile Number"}
              size="lg"
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
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          loadingText={"Processing..."}
          className={"w-full"}
          size={"lg"}
        >
          Pay with Mobile Money
        </Button>
      </form>

      <PromptModal
        backdrop="blur"
        isDismissable={false}
        isOpen={isOpen}
        onClose={
          transaction?.status == "PENDING"
            ? () => {
                notify({
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
          <div className="aspect-square flex justify-center items-center mx-auto mb-4 max-w-xs">
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
                " max-w-sm break-words text-center uppercase font-bold text-foreground/80",
              )}
            >
              {transaction?.status}
            </p>
            <small className="text-muted-foreground text-center min-w-60 mx-auto">
              {transaction?.status == "SUCCESSFUL"
                ? "Payment completed successfully!"
                : transaction?.status == "FAILED"
                  ? "Payment failed. Try again later!"
                  : transaction?.message}
              {transaction?.serviceProviderDescription && (
                <>
                  <br />
                  {`Reason: ${transaction?.serviceProviderDescription}`}
                </>
              )}
            </small>
          </div>

          {!isProcessing && transaction?.status != "PENDING" && (
            <>
              <Button
                color="danger"
                isDisabled={isProcessing}
                onPress={() => {
                  if (isSuccess && checkoutData?.redirect_url) {
                    router.push(`${checkoutData?.redirect_url}?success=true`);
                  }
                  handleClosePrompt();
                }}
                className={"w-full "}
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
