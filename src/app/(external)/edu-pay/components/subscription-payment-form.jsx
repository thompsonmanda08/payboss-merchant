import { Button } from "@/components/ui/button";
import ProgressStep from "@/components/elements/progress-step";
import { Card, CardBody } from "@heroui/react";
import { Check, ArrowLeft } from "lucide-react";
import { useCallback, useState } from "react";
import useCustomTabsHook from "@/hooks/use-custom-tabs";
import EntityUserDetails from "./entity-user-details";
import SelectPaymentPackage from "./select-package";

export const SCHOOLS = [
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

export const PAYMENT_PACKAGES = [
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

export default function SubscriptionPaymentForm({ navigateTo }) {
  // Validation state
  const [errors, setErrors] = useState({});
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    institution: "",
    user_id: "",
    fullName: "",

    selectedPackages: [],
    customAmount: 0,
    customReference: "",
  });

  function updateFormData(fields) {
    setFormData((prev) => ({ ...prev, ...fields }));
  }

  const validateStep1 = useCallback(() => {
    const newErrors = {};

    if (!formData.institution) newErrors.institution = "Please select a school";
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.user_id.trim()) newErrors.user_id = "Valid ID is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [formData.institution, formData.fullName, formData.user_id]);

  const { activeTab, currentTabIndex, navigateForward, navigateBackwards } =
    useCustomTabsHook([
      <EntityUserDetails
        key={"entity-user-details"}
        formData={formData}
        updateFormData={updateFormData}
        setErrors={setErrors}
        errors={errors}
        handleNextStep={handleNextStep}
      />,
      <SelectPaymentPackage
        key={"payment"}
        formData={formData}
        setFormData={setFormData}
        updateFormData={updateFormData}
        setErrors={setErrors}
        errors={errors}
        handleNextStep={handleNextStep}
        handlePreviousStep={handlePreviousStep}
      />,
    ]);

  function handleNextStep() {
    if (validateStep1()) {
      navigateForward();
      setErrors({});
    }
  }

  function handlePreviousStep() {
    navigateBackwards();
    setErrors({});
  }

  //************ STEPS TO CREATE A PAYMENT ACTION *****************/
  return (
    <div>
      {!showRedirectMessage ? (
        <>
          <div className="flex justify-between w-full lg:container mb-8 lg:mb-1">
            <Button
              variant="light"
              onPress={() => navigateTo(0)}
              className="text-gray-600  hover:text-gray-900"
            >
              ← Back to Home
            </Button>
            <Button
              variant="light"
              onPress={() => navigateTo(2)}
              className="text-gray-600  hover:text-gray-900"
            >
              See How It Works →
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {STEPS[currentTabIndex].title}
            </h2>
            <p className="text-gray-600">{STEPS[currentTabIndex].infoText}</p>
          </div>
          <div className="mx-auto w-full lg:container lg:mx-w-xl lg:px-36">
            <ProgressStep
              STEPS={STEPS}
              activeTab={activeTab}
              currentTabIndex={currentTabIndex}
            />
          </div>
          {/* FORM FIELDS */}
          {activeTab}
        </>
      ) : (
        <Card className="shadow-lg border-0 border-t-4 border-t-primary-600 max-w-2xl mx-auto">
          <CardBody className="p-8 text-center">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Redirecting to Payment Gateway
            </h3>
            <p className="text-gray-600 mb-6">
              You would now be redirected to our secure external payment
              processor to complete your transaction.
            </p>

            <div className="bg-primary-50 p-4 rounded-lg mb-6 text-left">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Payment URL:
              </p>
              <p className="text-xs text-primary-600 break-all font-mono bg-white/10 p-2 rounded border">
                https://payment-gateway.example.com/checkout?school_id=
                {formData.institution}&school_name=
                {encodeURIComponent(
                  SCHOOLS.find((s) => s.id === formData.institution)?.name || ""
                )}
                &payer_name=
                {encodeURIComponent(formData.payerDetails.fullName)}
                &payment_amount={formData?.amount}...
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigateTo(0)}
                className="bg-primary-600 hover:bg-primary-700 text-white w-full"
              >
                Return to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRedirectMessage(false)}
                className="w-full"
              >
                Back to Payment Form
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
