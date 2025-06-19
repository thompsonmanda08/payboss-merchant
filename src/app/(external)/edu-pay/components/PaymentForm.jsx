import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressStep from "@/components/elements/progress-step";
import AutoCompleteField from "@/components/base/auto-complete";
import CustomCardHeader from "@/components/base/card-header";
import { Input, Textarea } from "@heroui/react";
import {
  CreditCard,
  School,
  Check,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function PaymentForm({
  STEPS,
  currentStep,
  paymentData,
  errors,
  showRedirectMessage,
  SCHOOLS,
  PAYMENT_PACKAGES,
  handleBackToLanding,
  handleNextStep,
  handlePreviousStep,
  handleSchoolChange,
  handlePayerDetailsChange,
  handlePackageToggle,
  handleCustomAmountChange,
  handleCustomReferenceChange,
  handleProceedToCheckout,
  getSelectedPackageDetails,
  getTotalAmount,
  getFinalAmount,
  setShowRedirectMessage,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EduPay</span>
          </div>
          <Button
            className="text-gray-600 hover:text-gray-900"
            variant="ghost"
            onClick={handleBackToLanding}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Button>
        </div>
      </header>
      {/* Progress Indicator */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <ProgressStep STEPS={STEPS} currentTabIndex={currentStep} />
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStep === 0
                ? "School & Personal Details"
                : "Payment Selection"}
            </h2>
            <p className="text-gray-600">
              {currentStep === 0
                ? "Select your school and provide your personal information"
                : "Choose your payment package and proceed to checkout"}
            </p>
          </div>
          {/* Step 1: School Selection & Personal Details */}
          {currentStep === 0 && (
            <Card className="shadow-none ">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <School className="w-5 h-5 mr-2 text-emerald-600" />
                  School & Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* School Selection */}
                <div className="space-y-2">
                  <AutoCompleteField
                    label={"Select School/Institution"}
                    options={SCHOOLS}
                    value={paymentData.school}
                    onChange={handleSchoolChange}
                  />
                  {errors.school && (
                    <p className="text-sm text-red-600">{errors.school}</p>
                  )}
                </div>
                {/* Personal Details Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      className={errors.fullName ? "border-red-500" : ""}
                      id="fullName"
                      label="Full Names"
                      placeholder="Enter your full names"
                      startContent={<User className="w-4 h-4 mr-1" />}
                      type="text"
                      value={paymentData.payerDetails.fullName}
                      onChange={(e) =>
                        handlePayerDetailsChange("fullName", e.target.value)
                      }
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      className={errors.nrc ? "border-red-500" : ""}
                      id="nrc"
                      label="National ID"
                      placeholder="Enter your NRC number"
                      type="text"
                      value={paymentData.payerDetails.nrc}
                      onChange={(e) =>
                        handlePayerDetailsChange("nrc", e.target.value)
                      }
                    />
                    {errors.nrc && (
                      <p className="text-sm text-red-600">{errors.nrc}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      className={errors.email ? "border-red-500" : ""}
                      id="email"
                      label="Email Address"
                      placeholder="Enter your email address"
                      type="email"
                      value={paymentData.payerDetails.email}
                      onChange={(e) =>
                        handlePayerDetailsChange("email", e.target.value)
                      }
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      className={errors.phone ? "border-red-500" : ""}
                      id="phone"
                      label="Phone Number"
                      placeholder="Enter your phone number"
                      type="tel"
                      value={paymentData.payerDetails.phone}
                      onChange={(e) =>
                        handlePayerDetailsChange("phone", e.target.value)
                      }
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Textarea
                    className={`min-h-[80px] ${errors.address ? "border-red-500" : ""}`}
                    id="address"
                    label="Address"
                    placeholder="Enter your full address"
                    value={paymentData.payerDetails.address}
                    onChange={(e) =>
                      handlePayerDetailsChange("address", e.target.value)
                    }
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600">{errors.address}</p>
                  )}
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    className="text-white px-6 py-2"
                    endContent={<ChevronRight className="ml-2 w-4 h-4" />}
                    variant="success"
                    onClick={handleNextStep}
                  >
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Step 2: Payment Selection */}
          {currentStep === 1 && !showRedirectMessage && (
            <Card className="shadow-none ">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CreditCard className="w-5 h-5 mr-2 text-emerald-600" />
                  Payment Package Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected School Display */}
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-sm text-emerald-700 mb-1">
                    Selected Institution:
                  </p>
                  <p className="font-semibold text-emerald-900">
                    {SCHOOLS.find((s) => s.id === paymentData.school)?.name}
                  </p>
                </div>
                {/* Payment Packages */}
                <div className="space-y-3">
                  <CustomCardHeader
                    infoText={
                      "Select one or more payment packages and/or add a custom payment"
                    }
                    title={"Payment Packages"}
                  />
                  <div className="grid md:grid-cols-2 gap-3">
                    {PAYMENT_PACKAGES.filter((pkg) => pkg.id !== "custom").map(
                      (pkg) => (
                        <button
                          key={pkg.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            paymentData.selectedPackages.includes(pkg.id)
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          type="button"
                          onClick={() => handlePackageToggle(pkg.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <input
                              checked={paymentData.selectedPackages.includes(
                                pkg.id
                              )}
                              className="w-4 h-4 text-emerald-600 mt-1"
                              type="checkbox"
                              onChange={() => {}}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-gray-900">
                                  {pkg.name}
                                </p>
                                <p className="text-lg font-semibold text-emerald-600">
                                  {formatCurrency(pkg?.amount)}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {pkg.name.includes("Annual")
                                  ? "Annual tuition fee for secondary education"
                                  : pkg.name.includes("Enrollment")
                                    ? "One-time enrollment fee for university admission"
                                    : pkg.name.includes("Sports")
                                      ? "Annual sports club membership fee"
                                      : pkg.name.includes("Materials")
                                        ? "Books, lab materials, and digital resources"
                                        : "Voluntary contribution to school development"}
                              </p>
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                {pkg.category}
                              </span>
                            </div>
                          </div>
                        </button>
                      )
                    )}
                  </div>
                  {errors.paymentPackage && (
                    <p className="text-sm text-red-600">
                      {errors.paymentPackage}
                    </p>
                  )}
                </div>
                {/* Custom Payment Option */}
                <div className="space-y-3">
                  <button
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      paymentData.selectedPackages.includes("custom")
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePackageToggle("custom")}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        checked={paymentData.selectedPackages.includes(
                          "custom"
                        )}
                        className="w-4 h-4 text-emerald-600"
                        type="checkbox"
                        onChange={() => {}}
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          Add Custom Payment
                        </p>
                        <p className="text-sm text-gray-500">
                          Enter a custom amount with reference
                        </p>
                      </div>
                    </div>
                  </button>
                  {/* Custom Amount and Reference Inputs */}
                  {paymentData.selectedPackages.includes("custom") && (
                    <div className="ml-7 space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              className={`pl-10 `}
                              errorText={errors.customAmount}
                              id="customAmount"
                              isInvalid={errors.customAmount}
                              label="Custom Amount"
                              min="1"
                              placeholder="0.00"
                              step="0.01"
                              type="number"
                              value={paymentData.customAmount || ""}
                              onChange={(e) =>
                                handleCustomAmountChange(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Input
                            required
                            errorText={errors.customReference}
                            id="customReference"
                            isInvalid={errors.customReference}
                            label="Payment Reference"
                            placeholder="e.g., Lab Equipment, Field Trip"
                            type="text"
                            value={paymentData.customReference}
                            onChange={(e) =>
                              handleCustomReferenceChange(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Payment Summary */}
                {paymentData.selectedPackages.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Payment Summary
                    </h4>
                    <div className="space-y-2 mb-3">
                      {getSelectedPackageDetails().map((pkg, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-600">{pkg?.name}</span>
                          <span className="font-medium">${pkg?.amount}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">
                          Total Amount:
                        </span>
                        <span className="text-2xl font-bold text-emerald-600">
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
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    <ChevronLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2"
                    disabled={
                      paymentData.selectedPackages.length === 0 ||
                      (paymentData.selectedPackages.includes("custom") &&
                        (paymentData.customAmount <= 0 ||
                          !paymentData.customReference.trim()))
                    }
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Redirect Message */}
          {showRedirectMessage && (
            <Card className="shadow-lg border-0 border-t-4 border-t-emerald-600">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Redirecting to Payment Gateway
                </h3>
                <p className="text-gray-600 mb-6">
                  You would now be redirected to our secure external payment
                  processor to complete your transaction.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Constructed Payment URL:
                  </p>
                  <p className="text-xs text-gray-600 break-all font-mono bg-white p-2 rounded border">
                    https://payment-gateway.example.com/checkout?school_id=
                    {paymentData.school}&school_name=
                    {encodeURIComponent(
                      SCHOOLS.find((s) => s.id === paymentData.school)?.name ||
                        ""
                    )}
                    &payer_name=
                    {encodeURIComponent(paymentData.payerDetails.fullName)}
                    &payment_amount={getFinalAmount()}...
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
                    onClick={handleBackToLanding}
                  >
                    Return to Home
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setShowRedirectMessage(false)}
                  >
                    Back to Payment Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
