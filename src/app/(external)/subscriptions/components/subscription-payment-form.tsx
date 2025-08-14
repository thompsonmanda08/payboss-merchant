import { Button } from "@/components/ui/button";
import ProgressStep from "@/components/elements/progress-step";
import { Card, CardBody } from "@heroui/react";
import { Check, ArrowLeft } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import useCustomTabsHook from "@/hooks/use-custom-tabs";
import EntityUserDetails from "./entity-user-details";
import SelectPaymentPackage from "./select-package";
import { getSubscriptionInstitutions } from "@/app/_actions/subscription-actions";
import { useQuery } from "@tanstack/react-query";

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

type PaymentPackage = {
  id: string;
  name: string;
  amount: number;
  category: string;
  key: string;
};

export const PAYMENT_PACKAGES: PaymentPackage[] = [
  {
    id: "tuition-annual",
    name: "Annual Tuition Fee",
    amount: 2500,
    category: "Tuition",
    key: "tuition-annual",
  },
  {
    id: "tuition-semester",
    name: "Semester Tuition Fee",
    amount: 1250,
    category: "Tuition",
    key: "tuition-semester",
  },
  {
    id: "enrollment-fee",
    name: "Enrollment Fee",
    amount: 150,
    category: "Registration",
    key: "enrollment-fee",
  },
  {
    id: "sports-membership",
    name: "Sports Club Membership",
    amount: 75,
    category: "Activities",
    key: "sports-membership",
  },
  {
    id: "course-materials",
    name: "Course Materials",
    amount: 200,
    category: "Materials",
    key: "course-materials",
  },
  {
    id: "library-fee",
    name: "Library Access Fee",
    amount: 50,
    category: "Services",
    key: "library-fee",
  },
  {
    id: "custom",
    name: "Other (Custom Amount)",
    amount: 0,
    category: "Custom",
    key: "custom",
  },
];

const STEPS = [
  {
    title: "Institution Selection & User Details",
    infoText:
      "Choose an institution/organization and enter your user details to make a payment",
    step: "Choose Institution",
  },
  {
    title: "Payment Selection",
    infoText:
      "Select a payment option and enter payment details of what you want to pay for.",
    step: "Make Payment",
  },
];

export default function SubscriptionPaymentForm({
  navigateTo,
}: {
  navigateTo: (index: number) => void;
}) {
  // Validation state
  const [errors, setErrors] = useState({});
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  const { data: institutionsResponse } = useQuery({
    queryKey: ["subscription-entities"],
    queryFn: async () => await getSubscriptionInstitutions(),
    refetchOnMount: true,
    refetchIntervalInBackground: true,
    staleTime: Infinity,
  });

  const INSTITUTIONS = useMemo(() => {
    const all = [
      ...(institutionsResponse?.data?.institutions || []),
      // ...SCHOOLS,
    ];

    return all.map((item) => {
      return {
        id: item.ID || item.id,
        name: item.display_name || item.name,
        type: item.type || "",
        address: item.physical_address || "",
        city: item.city || "",
        redirect_url: item.redirect_url || "",
        logo: item.logo || "",
      };
    });
  }, [institutionsResponse?.data?.institutions]);

  // Form data state
  const [formData, setFormData] = useState({
    institution: {
      id: "",
      name: "",
      type: "",
      address: "",
      city: "",
      redirect_url: "",
      logo: "",
    },
    user_id: "",
    fullName: "",
    amount: "",
    selectedPackages: [],
  });

  function updateFormData(fields: Partial<typeof formData>) {
    setFormData((prev) => ({ ...prev, ...fields }));
  }

  const { activeTab, currentTabIndex, navigateForward, navigateBackwards } =
    useCustomTabsHook([
      <EntityUserDetails
        key={"entity-user-details"}
        formData={formData}
        updateFormData={updateFormData}
        setErrors={setErrors}
        errors={errors}
        handleNextStep={handleNextStep}
        institutions={INSTITUTIONS}
      />,
      <SelectPaymentPackage
        key={"payment"}
        formData={formData}
        setFormData={setFormData}
        updateFormData={updateFormData}
        setErrors={setErrors}
        errors={errors}
        handlePreviousStep={handlePreviousStep}
      />,
    ]);

  function handleNextStep() {
    navigateForward();
    setErrors({});
  }

  function handlePreviousStep() {
    navigateBackwards();
    setErrors({});
  }


  //************ STEPS TO CREATE A PAYMENT ACTION *****************/
  return (
    <div className="flex flex-col w-full container mx-auto">
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
            {/* <Button
              variant="light"
              onPress={() => navigateTo()}
              className="text-gray-600  hover:text-gray-900"
            >
              See How It Works →
            </Button> */}
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
              // activeTab={activeTab}
              currentTabIndex={currentTabIndex}
            />
          </div>
          {/* FORM FIELDS */}
          <div className="container">{activeTab}</div>
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
                https://payment-gateway.example.com/checkout?instituition_id=
                {formData.institution?.id}&school_name=
                {encodeURIComponent(
                  [...INSTITUTIONS].find((s) => s.id === formData.institution)
                    ?.name || "",
                )}
                &payer_name=
                {encodeURIComponent(formData.fullName)}
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
                variant="bordered"
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
