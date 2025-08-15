import {
  Card as HerouiCard,
  CardBody,
  CardFooter,
  Checkbox,
  Divider,
  Image,
  Link,
} from '@heroui/react';
import { CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dispatch, SetStateAction, useCallback } from 'react';

import CustomCardHeader from '@/components/base/card-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';

import { PAYMENT_PACKAGES, SCHOOLS } from './subscription-payment-form';

export default function SelectPaymentPackage({
  formData,
  setFormData,
  updateFormData,
  setErrors,
  errors,
  handleNextStep,
  handlePreviousStep,
}: {
  formData: any;
  setFormData: Dispatch<SetStateAction<any>>;
  updateFormData: any;
  setErrors: Dispatch<SetStateAction<any>>;
  errors: any;
  handleNextStep?: () => void;
  handlePreviousStep?: () => void;
}) {
  const validateStep2 = useCallback(() => {
    const newErrors = {} as any;

    if (formData.selectedPackages.length === 0) {
      newErrors.paymentPackage = 'Please select at least one payment option';
    } else if (
      formData.selectedPackages.includes('custom') &&
      (formData.customAmount <= 0 || !formData.customReference.trim())
    ) {
      if (formData.customAmount <= 0) {
        newErrors.customAmount = 'Please enter a valid amount';
      }
      if (!formData.customReference.trim()) {
        newErrors.customReference = 'Please enter a payment reference';
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [
    formData.selectedPackages,
    formData.customAmount,
    formData.customReference,
  ]);

  const getSelectedPackageDetails = useCallback(() => {
    return formData.selectedPackages
      .map((packageId: string) => {
        if (packageId === 'custom') {
          return {
            id: 'custom',
            name: `Custom Payment - ${formData.customReference}`,
            amount: formData.customAmount,
          };
        }

        return PAYMENT_PACKAGES.find((p) => p.id === packageId);
      })
      .filter(Boolean);
  }, [
    formData.selectedPackages,
    // formData.customAmount,
    // formData.customReference,
  ]);

  // const handleCustomAmountChange = (value: string) => {
  //   updateFormData({ customAmount: Number.parseFloat(value) || 0 });
  //   setErrors((prev: any) => {
  //     if (prev.customAmount) {
  //       const newErrors = { ...prev };

  //       delete newErrors.customAmount;

  //       return newErrors;
  //     }

  //     return prev;
  //   });
  // };

  // const handleCustomReferenceChange = (value: string) => {
  //   updateFormData({ customReference: value });
  //   setErrors((prev: any) => {
  //     if (prev.customReference) {
  //       const newErrors = { ...prev };

  //       delete newErrors.customReference;

  //       return newErrors;
  //     }

  //     return prev;
  //   });
  // };

  // // Replace the getFinalAmount function with:
  // const getFinalAmount = () => {
  //   return getTotalAmount();
  // };

  // Add these helper functions after the validation functions

  const handlePackageToggle = useCallback((packageId: string) => {
    setFormData((prev: any) => {
      const isSelected = prev.selectedPackages.includes(packageId);
      const newSelectedPackages = isSelected
        ? prev.selectedPackages.filter((id: string) => id !== packageId)
        : [...prev.selectedPackages, packageId];

      return {
        ...prev,
        selectedPackages: newSelectedPackages,
      };
    });

    // Clear errors when user makes selection
    setErrors((prev: any) => {
      if (prev.paymentPackage) {
        const newErrors = { ...prev };

        delete newErrors.paymentPackage;

        return newErrors;
      }

      return prev;
    });
  }, []);

  const getTotalAmount = () => {
    return formData?.selectedPackages?.reduce(
      (total: number, packageId: string) => {
        if (packageId === 'custom') {
          total += formData?.customAmount;
        } else {
          const pkg = PAYMENT_PACKAGES.find((p) => p.id === packageId);

          if (pkg) {
            total += pkg.amount;
          }
        }

        return total;
      },
      0,
    ); // Initialize total with 0
  };

  const handleProceedToCheckout = useCallback(() => {
    if (validateStep2()) {
      // Construct dummy URL with all collected data
      const selectedSchool = SCHOOLS.find((s) => s.id === formData.institution);
      const selectedPackageDetails = getSelectedPackageDetails();
      const finalAmount = getTotalAmount();

      const queryParams = new URLSearchParams({
        school_id: formData.institution,
        school_name: selectedSchool?.name || '',
        payer_name: formData.payerDetails.fullName,
        payer_nrc: formData.payerDetails.nrc,
        payer_address: formData.payerDetails.address,
        payer_email: formData.payerDetails.email,
        payer_phone: formData.payerDetails.phone,
        selected_packages: JSON.stringify(selectedPackageDetails),
        total_amount: finalAmount.toString(),
        custom_reference: formData.customReference,
        timestamp: new Date().toISOString(),
      });

      const dummyUrl = `https://payment-gateway.example.com/checkout?${queryParams.toString()}`;

      // Show redirect message instead of actual navigation
      // setShowRedirectMessage(true);
    }
  }, [formData, validateStep2, getSelectedPackageDetails, getTotalAmount]);

  return (
    <Card className="shadow-none border border-gray-200 max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
          Payment Package Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <HerouiCard className="shadow-none border rounded-lg border-gray-200">
          <CardBody className="flex flex-row items-center gap-2">
            <Image
              alt="Logo"
              className="aspect-square w-20 object-cover bg-primary-50"
              height={60}
              radius="sm"
              src={
                formData?.institution?.logo || '/images/logos/payboss-icon.svg'
              }
              width={60}
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">
                {formData.formData?.member_details?.name || formData?.fullName}
              </p>
              <p className="text-sm text-default-500">
                ID: {formData?.member_details?.member_id || formData?.user_id}
              </p>
            </div>
          </CardBody>

          <Divider />
          <CardFooter>
            <p className="text-sm font-bold flex items-center gap-2 w-full justify-between">
              Institution: {formData?.institution?.name}{' '}
              <Link
                isExternal
                showAnchorIcon
                className="text-md"
                href={
                  formData?.institution?.website ||
                  formData?.institution?.redirect_url ||
                  '#'
                }
                target="_blank"
              >
                Visit Website
              </Link>
            </p>
          </CardFooter>
        </HerouiCard>

        {/* Payment Packages */}
        <div className="space-y-3">
          <CustomCardHeader
            infoText={
              'Select one or more payment packages and/or add a custom payment'
            }
            title={'Payment Packages'}
          />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-3">
            {PAYMENT_PACKAGES.filter((pkg) => pkg.id !== 'custom').map(
              (pkg) => (
                <button
                  key={pkg.id}
                  className={cn(
                    `border rounded-lg p-4 cursor-pointer transition-all duration-200 border-gray-200 hover:border-gray-300 `,
                    {
                      'border-primary-300 bg-primary-50/50':
                        formData.selectedPackages.includes(pkg.id),
                    },
                  )}
                  type="button"
                  onClick={() => handlePackageToggle(pkg.id)}
                >
                  <div className="flex items-start space-x-1 ">
                    <Checkbox
                      className="mt-0.25"
                      isSelected={formData.selectedPackages.includes(pkg.id)}
                      size="lg"
                      onValueChange={(v) => handlePackageToggle(pkg.id)}
                    />
                    <div className="flex-1 justify-start items-start">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{pkg.name}</p>
                        <p className="text-lg font-semibold text-primary-600">
                          {formatCurrency(pkg?.amount)}
                        </p>
                      </div>
                      <p className="text-sm text-foreground/60 mb-2 text-left">
                        {pkg.key}
                      </p>
                      {/* <div className="flex">
                        <p className="text-lg font-semibold text-primary-600">
                          {formatCurrency(pkg?.amount)}
                        </p>
                      </div> */}
                    </div>
                  </div>
                </button>
              ),
            )}
          </div>
          {errors.paymentPackage && (
            <p className="text-sm text-red-600">{errors.paymentPackage}</p>
          )}
        </div>
        {/* Custom Payment Option */}
        {/* <div className="space-y-3">
          <button
            className={cn(
              `border flex gap-2 rounded-lg w-full p-4 cursor-pointer transition-all duration-200 border-gray-200 hover:border-gray-300`,
              {
                "border-primary-500 bg-primary-50":
                  formData.selectedPackages.includes("custom"),
              }
            )}
            onClick={() => handlePackageToggle("custom")}
          >
            <Checkbox
              size="lg"
              isSelected={formData.selectedPackages.includes("custom")}
              className="-mt-4"
              onValueChange={(v) => handlePackageToggle("custom")}
            />
            <div className="flex flex-col text-left justify-start">
              <p className="font-medium text-gray-900">Add Custom Amount</p>
              <p className="text-sm text-gray-500">
                Enter a custom amount with reference
              </p>
            </div>
          </button>

          {formData.selectedPackages.includes("custom") && (
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-primary-50/50 rounded-lg">
              <Input
                className={` `}
                variant="underlined"
                errorText={errors.customAmount}
                isInvalid={errors.customAmount}
                label="Custom Amount (ZMW)"
                min="1"
                placeholder="0.00"
                step="0.01"
                type="number"
                value={formData.customAmount || ""}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
              />
              <Input
                required
                variant="underlined"
                errorText={errors.customReference}
                id="customReference"
                isInvalid={errors.customReference}
                label="Payment Reference"
                placeholder="e.g., Lab Equipment, Field Trip"
                type="text"
                value={formData.customReference}
                onChange={(e) => handleCustomReferenceChange(e.target.value)}
              />
            </div>
          )}
        </div> */}

        {/* Payment Summary */}
        {formData.selectedPackages.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
            <div className="space-y-2 mb-3">
              {getSelectedPackageDetails().map((pkg: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600">{pkg?.name}</span>
                  <span className="font-medium">
                    {formatCurrency(pkg?.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(getTotalAmount())}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            className="px-6 py-2"
            variant="bordered"
            onClick={handlePreviousStep}
          >
            <ChevronLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
          <Button
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2"
            disabled={
              formData.selectedPackages.length === 0 ||
              (formData.selectedPackages.includes('custom') &&
                (formData.customAmount <= 0 ||
                  !formData.customReference.trim()))
            }
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
