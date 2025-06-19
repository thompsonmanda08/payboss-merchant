"use client";

import { useState, useCallback } from "react";

import useCustomTabsHook from "@/hooks/use-custom-tabs";

import LandingPage from "./components/LandingPage";
import PaymentForm from "./components/PaymentForm";

// Dummy data for schools and payment packages
const SCHOOLS = [
  { id: "harmony-high", name: "Harmony High School", type: "Secondary" },
  {
    id: "discovery-primary",
    name: "Discovery Primary School",
    type: "Primary",
  },
  { id: "tech-university", name: "Tech University", type: "University" },
  { id: "creative-college", name: "Creative Arts College", type: "College" },
  { id: "science-academy", name: "Science Academy", type: "Academy" },
];

const PAYMENT_PACKAGES = [
  {
    id: "tuition-annual",
    name: "Annual Tuition Fee",
    amount: 2500,
    category: "Tuition",
  },
  {
    id: "tuition-semester",
    name: "Semester Tuition Fee",
    amount: 1250,
    category: "Tuition",
  },
  {
    id: "enrollment-fee",
    name: "Enrollment Fee",
    amount: 150,
    category: "Registration",
  },
  {
    id: "sports-membership",
    name: "Sports Club Membership",
    amount: 75,
    category: "Activities",
  },
  {
    id: "course-materials",
    name: "Course Materials",
    amount: 200,
    category: "Materials",
  },
  {
    id: "library-fee",
    name: "Library Access Fee",
    amount: 50,
    category: "Services",
  },
  {
    id: "custom",
    name: "Other (Custom Amount)",
    amount: 0,
    category: "Custom",
  },
];

export default function EduPayApp() {
  // Main application state
  const [currentView, setCurrentView] = useState("landing");
  const STEPS = [
    {
      title: "Entity Selection & User Details",
      infoText: "Choose an entity and enter user details",
      step: "Entity Selection",
    },
    {
      title: "Payment Selection",
      infoText:
        "Select a payment option and enter payment details of what you want to pay for.",
      step: "Payment ",
    },
  ];
  const {
    currentTabIndex: currentStep,
    navigateForward,
    navigateBackwards,
    firstTab,
    lastTab,
    navigateTo,
  } = useCustomTabsHook(STEPS);

  // Validation state
  const [errors, setErrors] = useState({});
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  // Form data state
  const [paymentData, setPaymentData] = useState({
    school: "",
    payerDetails: {
      fullName: "",
      nrc: "",
      address: "",
      email: "",
      phone: "",
    },
    selectedPackages: [], // Changed from paymentPackage: ""
    customAmount: 0,
    customReference: "", // Add custom reference
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  };

  const validateStep1 = useCallback(() => {
    const newErrors = {};

    if (!paymentData.school) newErrors.school = "Please select a school";
    if (!paymentData.payerDetails.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!paymentData.payerDetails.nrc.trim()) newErrors.nrc = "NRC is required";
    if (!paymentData.payerDetails.address.trim())
      newErrors.address = "Address is required";
    if (!paymentData.payerDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(paymentData.payerDetails.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!paymentData.payerDetails.phone.trim())
      newErrors.phone = "Phone number is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [paymentData.school, paymentData.payerDetails]);

  const validateStep2 = useCallback(() => {
    const newErrors = {};

    if (paymentData.selectedPackages.length === 0) {
      newErrors.paymentPackage = "Please select at least one payment option";
    } else if (
      paymentData.selectedPackages.includes("custom") &&
      (paymentData.customAmount <= 0 || !paymentData.customReference.trim())
    ) {
      if (paymentData.customAmount <= 0) {
        newErrors.customAmount = "Please enter a valid amount";
      }
      if (!paymentData.customReference.trim()) {
        newErrors.customReference = "Please enter a payment reference";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [
    paymentData.selectedPackages,
    paymentData.customAmount,
    paymentData.customReference,
  ]);

  // Add these helper functions after the validation functions
  const handlePackageToggle = useCallback((packageId) => {
    setPaymentData((prev) => {
      const isSelected = prev.selectedPackages.includes(packageId);
      const newSelectedPackages = isSelected
        ? prev.selectedPackages.filter((id) => id !== packageId)
        : [...prev.selectedPackages, packageId];

      return {
        ...prev,
        selectedPackages: newSelectedPackages,
      };
    });

    // Clear errors when user makes selection
    setErrors((prev) => {
      if (prev.paymentPackage) {
        const newErrors = { ...prev };

        delete newErrors.paymentPackage;

        return newErrors;
      }

      return prev;
    });
  }, []);

  const getTotalAmount = useCallback(() => {
    let total = 0;

    paymentData.selectedPackages.forEach((packageId) => {
      if (packageId === "custom") {
        total += paymentData.customAmount;
      } else {
        const pkg = PAYMENT_PACKAGES.find((p) => p.id === packageId);

        if (pkg) total += pkg.amount;
      }
    });

    return total;
  }, [paymentData.selectedPackages, paymentData.customAmount]);

  const getSelectedPackageDetails = useCallback(() => {
    return paymentData.selectedPackages
      .map((packageId) => {
        if (packageId === "custom") {
          return {
            id: "custom",
            name: `Custom Payment - ${paymentData.customReference}`,
            amount: paymentData.customAmount,
          };
        }

        return PAYMENT_PACKAGES.find((p) => p.id === packageId);
      })
      .filter(Boolean);
  }, [
    paymentData.selectedPackages,
    paymentData.customAmount,
    paymentData.customReference,
  ]);

  // Event handlers
  const handleStartPayment = useCallback(() => {
    setCurrentView("payment");
  }, []);

  const handleNextStep = useCallback(() => {
    if (validateStep1()) {
      navigateForward();
    }
  }, [
    paymentData.school,
    paymentData.payerDetails,
    validateStep1,
    navigateForward,
  ]);

  const handlePreviousStep = useCallback(() => {
    navigateBackwards();
    setErrors({});
  }, [navigateBackwards]);

  const handleBackToLanding = useCallback(() => {
    setCurrentView("landing");
    navigateTo(firstTab);
    setErrors({});
    setShowRedirectMessage(false);
  }, [firstTab]);

  const handlePayerDetailsChange = useCallback((field, value) => {
    setPaymentData((prev) => ({
      ...prev,
      payerDetails: {
        ...prev.payerDetails,
        [field]: value,
      },
    }));
    // Clear error when user starts typing
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };

        delete newErrors[field];

        return newErrors;
      }

      return prev;
    });
  }, []);

  const handleProceedToCheckout = useCallback(() => {
    if (validateStep2()) {
      // Construct dummy URL with all collected data
      const selectedSchool = SCHOOLS.find((s) => s.id === paymentData.school);
      const selectedPackageDetails = getSelectedPackageDetails();
      const finalAmount = getTotalAmount();

      const queryParams = new URLSearchParams({
        school_id: paymentData.school,
        school_name: selectedSchool?.name || "",
        payer_name: paymentData.payerDetails.fullName,
        payer_nrc: paymentData.payerDetails.nrc,
        payer_address: paymentData.payerDetails.address,
        payer_email: paymentData.payerDetails.email,
        payer_phone: paymentData.payerDetails.phone,
        selected_packages: JSON.stringify(selectedPackageDetails),
        total_amount: finalAmount.toString(),
        custom_reference: paymentData.customReference,
        timestamp: new Date().toISOString(),
      });

      const dummyUrl = `https://payment-gateway.example.com/checkout?${queryParams.toString()}`;

      // Show redirect message instead of actual navigation
      setShowRedirectMessage(true);

      // Log the URL for demonstration
      console.log("Constructed Payment URL:", dummyUrl);
    }
  }, [paymentData, validateStep2, getSelectedPackageDetails, getTotalAmount]);

  const handleCustomAmountChange = useCallback((value) => {
    setPaymentData((prev) => ({
      ...prev,
      customAmount: Number.parseFloat(value) || 0,
    }));
    setErrors((prev) => {
      if (prev.customAmount) {
        const newErrors = { ...prev };

        delete newErrors.customAmount;

        return newErrors;
      }

      return prev;
    });
  }, []);

  const handleCustomReferenceChange = useCallback((value) => {
    setPaymentData((prev) => ({ ...prev, customReference: value }));
    setErrors((prev) => {
      if (prev.customReference) {
        const newErrors = { ...prev };

        delete newErrors.customReference;

        return newErrors;
      }

      return prev;
    });
  }, []);

  const handleSchoolChange = useCallback((value) => {
    setPaymentData((prev) => ({ ...prev, school: value }));
    setErrors((prev) => {
      if (prev.school) {
        const newErrors = { ...prev };

        delete newErrors.school;

        return newErrors;
      }

      return prev;
    });
  }, []);

  // Replace the getFinalAmount function with:
  const getFinalAmount = () => {
    return getTotalAmount();
  };

  // Main render logic
  return (
    <div className="font-inter">
      {currentView === "landing" ? (
        <LandingPage handleStartPayment={handleStartPayment} />
      ) : (
        <PaymentForm
          PAYMENT_PACKAGES={PAYMENT_PACKAGES}
          SCHOOLS={SCHOOLS}
          STEPS={STEPS}
          currentStep={currentStep}
          errors={errors}
          getFinalAmount={getFinalAmount}
          getSelectedPackageDetails={getSelectedPackageDetails}
          getTotalAmount={getTotalAmount}
          handleBackToLanding={handleBackToLanding}
          handleCustomAmountChange={handleCustomAmountChange}
          handleCustomReferenceChange={handleCustomReferenceChange}
          handleNextStep={handleNextStep}
          handlePackageToggle={handlePackageToggle}
          handlePayerDetailsChange={handlePayerDetailsChange}
          handlePreviousStep={handlePreviousStep}
          handleProceedToCheckout={handleProceedToCheckout}
          handleSchoolChange={handleSchoolChange}
          paymentData={paymentData}
          setShowRedirectMessage={setShowRedirectMessage}
          showRedirectMessage={showRedirectMessage}
        />
      )}
    </div>
  );
}
