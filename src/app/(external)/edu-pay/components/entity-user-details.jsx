import { Button } from "@/components/ui/button";
import ProgressStep from "@/components/elements/progress-step";
import AutoCompleteField from "@/components/base/auto-complete";
import CustomCardHeader from "@/components/base/card-header";
import {
  CreditCard,
  School,
  Check,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  User,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SCHOOLS } from "./edu-form";
import { Input } from "@/components/ui/input-field";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardBody, CardHeader } from "@heroui/react";
export default function EntityUserDetails({
  formData,
  updateFormData,
  errors,
  setErrors,
  handleNextStep,
}) {
  const handleSchoolChange = (value) => {
    updateFormData({ school: value });
    setErrors((prev) => {
      if (prev.school) {
        const newErrors = { ...prev };
        delete newErrors.school;
        return newErrors;
      }
      return prev;
    });
  };

  const updateDetails = (field, value) => {
    updateFormData({
      payerDetails: { ...formData.payerDetails, [field]: value },
    });
    // Clear error when user starts typing
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };

        delete newErrors[field];

        return newErrors;
      }

      return prev;
    });
  };
  return (
    <Card className="shadow-none max-w-4xl mx-auto">
      <CardHeader>
        <h3 className="flex items-center text-lg font-bold">
          <School className="w-5 h-5 mr-2 text-emerald-600" />
          School Information
        </h3>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* School Selection */}
        <div className="grid md:grid-cols-2 mb-2">
          <div>
            <AutoCompleteField
              label={"Select School/Institution"}
              options={SCHOOLS}
              value={formData.school}
              onChange={handleSchoolChange}
              onError={errors.school}
              errorText={errors.school}
            />
          
          </div>
        </div>
        {/* Personal Details Grid */}

        <div className="flex flex-col gap-4">
          <h3 className="flex items-center text-lg font-bold">
            <User className="w-5 h-5 mr-2 text-emerald-600" />
            Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                id="fullName"
                label="Full Names"
                placeholder="Enter your full names"
                type="text"
                onError={errors.fullName}
                errorText={errors.fullName}
                value={formData.payerDetails.fullName}
                onChange={(e) => updateDetails("fullName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="nrc"
                label="National ID"
                placeholder="Enter your NRC/Passport number"
                type="text"
                onError={errors.nrc}
                errorText={errors.nrc}
                value={formData.payerDetails.nrc}
                onChange={(e) => updateDetails("nrc", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="email"
                label="Email Address"
                placeholder="Enter your email address"
                type="email"
                onError={errors.email}
                errorText={errors.email}
                value={formData.payerDetails.email}
                onChange={(e) => updateDetails("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="phone"
                label="Phone Number"
                placeholder="Enter your phone number"
                type="tel"
                value={formData.payerDetails.phone}
                onError={errors.phone}
                errorText={errors.phone}
                onChange={(e) => updateDetails("phone", e.target.value)}
              />
            </div>
          </div>
          <div className="">
            <Textarea
              className={`min-h-[80px] `}
              id="address"
              label="Address"
              onError={errors.address}
              errorText={errors.address}
              placeholder="Enter your full address"
              value={formData.payerDetails.address}
              onChange={(e) => updateDetails("address", e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button
            endContent={<ChevronRight className="ml-2 w-4 h-4" />}
            onClick={handleNextStep}
          >
            Next Step
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
