"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input-field";
import AutoCompleteField from "@/components/base/auto-complete";
import { Button } from "@/components/ui/button";
import useConfigOptions from "@/hooks/useConfigOptions";
import { payWithBankCard } from "@/app/_actions/checkout-actions";
import SelectField from "@/components/ui/select-field";
import { notify } from "@/lib/utils";

export default function CardPaymentForm({ checkoutData }) {
  const { countries, provinces } = useConfigOptions();
  const { amount, transactionID } = checkoutData || "";

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
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

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

    const paymentUrl = paymentData?.url || "https://google.com"; // Route where the client runs

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

    console.log("Opening Payment Window...", paymentWindow);

    // Send payment data to the pop-up after a short delay to ensure window is loaded
    // Send payment data to the pop-up after a short delay
    setTimeout(() => {
      try {
        console.log("Sending Payment data...");
        paymentWindow.postMessage(paymentData, paymentUrl); // Ensure it matches `event.origin`
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }, 2000);

    /* TODO: EVENT LISTENER */
    // Payment event handler
    const handlePaymentEvent = (event) => {
      console.log("Payment event received:", event);

      if (event.origin !== paymentUrl) return; // Security check

      console.log("Payment Response:", event.data);

      if (event.data.status === "success") {
        alert(
          `Payment successful! Transaction ID: ${event.data.transactionId}`
        );
        setIsCompleted(true);
      } else {
        alert("Payment failed or canceled.");
        setIsCancelled(true);
      }

      // Close the pop-up and clean up
      if (!paymentWindow.closed) {
        paymentWindow.close();
        console.log("Closing Payment Window...");
      }

      popUpWindowRef.current = null; // THIS EVENT SHOULD HELP RENDER THE APPROPRIATE MESSAGE
      window.removeEventListener("message", handlePaymentEvent); // Clean up listener
    };

    // Listen for response from the payment provider
    window.addEventListener("message", handlePaymentEvent);

    // Check if the window is closed
    // **Improved window closed detection**
    function checkIfClosed() {
      if (!popUpWindowRef.current) {
        // THE REF WILL NOT BE NULL TILL THE WINDOW IS CLOSED
        console.log("Payment window closed.");

        return true;
      }
      requestAnimationFrame(checkIfClosed); // Continue checking
    }

    requestAnimationFrame(checkIfClosed); // Start checking
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      notify({
        title: "Card Payment Error",
        description: "Missing Fields",
        color: "danger",
      });
      console.log(errors);

      return;
    }

    setIsSubmitting(true);

    if (process.env.NODE_ENV === "development") {
      // Simulate API call
      setTimeout(async () => {
        console.log("Card Payment:", formData);
        notify({
          title: "Card Payment",
          description: "Still under maintenance",
          color: "warning",
        });
        const transactionStatus = await openPaymentWindow({});
        setIsSubmitting(false);
        // Handle success/redirect here
      }, 2000);

      return;
    }

    const response = await payWithBankCard(formData);

    if (response?.success) {
      const payload = {
        ...formData,
        // FROM PAYBOSS BACKEND
        ...response?.data,
      };
      // OPEN PAYMENT WINDOW
      const transactionStatus = await openPaymentWindow(payload);
      setIsSubmitting(false); // THIS WILL TRIGGER THE WEB HOOK

      setTimeout(() => {
        // setPinPromptSent(false); // THIS WILL DISABLE THE WEB HOOK AFTER 5 SECONDS
      }, 5000);
    } else {
      notify({
        title: "Error",
        description: response.message,
        color: "danger",
      });
      setIsSubmitting(false);
    }
  };

  return (
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
  );
}
