"use client";

import React, { useState } from "react";

import { Input } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { AIRTEL_NO, MTN_NO } from "@/lib/constants";
import { cn, notify } from "@/lib/utils";
import { Image, useDisclosure } from "@heroui/react";
import PromptModal from "@/components/base/prompt-modal";
import { useWebhook } from "@/hooks/use-webhook";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { payWithMobileMoney } from "@/app/_actions/checkout-actions";
import Spinner from "@/components/ui/custom-spinner";

export default function MobileMoneyForm({ checkoutData }) {
  const { amount, transactionID } = checkoutData || "";

  const [pinPromptSent, setPinPromptSent] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [operatorLogo, setOperatorLogo] = React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  /* WEB HOOK */
  const { data, isSuccess, isError, isLoading } = useWebhook(
    transactionID,
    pinPromptSent
  );

  console.log("CONSOLE WEB HOOK: ==>", data);

  const [formData, setFormData] = useState({
    phoneNumber: "",
    amount: amount,
    narration: "",
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

    if (process.env.NODE_ENV === "development") {
      setPinPromptSent(true);
      onOpen();
      // Simulate API call
      setTimeout(() => {
        console.log("Mobile Money Payment:", formData);
        notify({
          title: "Mobile Payment",
          description: "Still under maintenance. [Demo]",
          color: "warning",
        });
        setIsSubmitting(false);
        setPinPromptSent(false);

        // Handle success/redirect here
      }, 2000);

      return;
    }

    const response = await payWithMobileMoney(formData);

    if (response?.success) {
      notify({
        title: "Mobile Payment",
        description: `Pin prompt sent to${formData?.phoneNumber}`,
        color: "success",
      });
      onOpen();
      setIsSubmitting(false);
      setPinPromptSent(true); // THIS WILL TRIGGER THE WEB HOOK

      setTimeout(() => {
        setPinPromptSent(false); // THIS WILL DISABLE THE WEB HOOK AFTER 5 SECONDS
      }, 5000);
    } else {
      notify({
        title: "Error",
        description: response.message,
        color: "danger",
      });
      setIsSubmitting(false);
      setPinPromptSent(false);
    }
  };

  function handleClosePrompt() {
    onClose();
    setIsSubmitting(false);
    setPinPromptSent(false);
  }

  console.log("LOG: [WEBHOOK-API]", data);

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

        <div>
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
        </div>

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
        // confirmText={"Confirm"}
        backdrop="blur"
        isDismissable={false}
        isDisabled={pinPromptSent}
        // isLoading={isLoading}
        isOpen={isOpen}
        title={"Transaction Status"}
        onClose={handleClosePrompt}
        // onConfirm={handleClosePrompt}
        onOpen={onOpen}
        className={"max-w-sm"}
        size="sm"
      >
        {pinPromptSent ? (
          <div className="grid flex-1 place-items-center max-w-max max-h-max m-auto aspect-square">
            {/* <Loader loadingText={"Please wait..."} size={100} /> */}
            <Spinner size={100} />
            <div className="grid place-items-center gap-2">
              <p
                className={cn(
                  "mt-4 max-w-sm break-words font-bold text-foreground/80"
                )}
              >
                {"Please wait..."}
              </p>
              <small className="text-muted-foreground">
                Check your phone for an approval prompt
              </small>
            </div>
          </div>
        ) : isSuccess ? (
          <>
            <div className="grid flex-1 place-items-center max-w-max max-h-max m-auto aspect-square">
              {/* <Loader loadingText={"Please wait..."} size={100} /> */}
              <CheckBadgeIcon className="w-32 text-success" />
              <div className="grid place-items-center gap-2">
                <p
                  className={cn(
                    "mt-4 max-w-sm break-words font-bold text-foreground/80"
                  )}
                >
                  Success
                </p>
                <small className="text-muted-foreground">
                  Payment completed successfully!
                </small>
              </div>
            </div>
          </>
        ) : (
          <div className="grid flex-1 place-items-center max-w-max max-h-max m-auto aspect-square">
            {/* <Loader loadingText={"Please wait..."} size={100} /> */}
            <XCircleIcon className="w-32 text-danger" />
            <div className="grid place-items-center gap-2">
              <p
                className={cn(
                  "mt-4 max-w-sm break-words font-bold text-foreground/80"
                )}
              >
                {"Failed"}
              </p>
              <small className="text-muted-foreground">
                Payment failed. Try again later! <br />
                {data?.message}
              </small>
            </div>
          </div>
        )}
      </PromptModal>
    </>
  );
}
