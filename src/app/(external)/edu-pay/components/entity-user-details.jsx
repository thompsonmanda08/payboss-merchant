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
import { SCHOOLS } from "./subscription-payment-form";
import { Input } from "@/components/ui/input-field";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Link,
  Radio,
  RadioGroup,
} from "@heroui/react";
import React from "react";
import EmptyLogs from "@/components/base/empty-logs";
import { validateSubscriptionMember } from "@/app/_actions/subscription-actions";
export default function EntityUserDetails({
  formData,
  updateFormData,
  errors,
  setErrors,
  handleNextStep,
  institutions,
}) {
  const [selected, setSelected] = React.useState("EXISTING");
  const [isValidating, setIsValidating] = React.useState(false);
  const workspaceID = formData?.institution?.workspaceID;

  const handleSelectInstitution = (value) => {
    updateFormData({ institution: institutions?.find((x) => x.ID == value) });
    setErrors((prev) => {
      if (prev.institution) {
        const newErrors = { ...prev };
        delete newErrors.institution;
        return newErrors;
      }
      return prev;
    });
  };

  async function validateUser() {
    setIsValidating(true);
    console.log("validating user: ", formData?.user_id);

    const response = await validateSubscriptionMember();

    setIsValidating(false);
  }
  return (
    <Card className="shadow-none border-gray-200 p-4 border max-w-lg mx-auto">
      <CardHeader>
        <h3 className="flex items-center text-lg font-bold">
          <School className="w-5 h-5 mr-2 text-primary-600" />
          School Information
        </h3>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* School Selection */}
        <div className="grid gap-6 mb-2">
          <div>
            <AutoCompleteField
              label={"Select School/Institution"}
              options={[...SCHOOLS, ...institutions]}
              value={formData.institution}
              onChange={handleSelectInstitution}
              onError={errors.institution}
              errorText={errors.institution}
            />
          </div>
          <RadioGroup
            color="primary"
            label="Are you a new applicant or Existing Applicant"
            value={selected}
            onValueChange={setSelected}
          >
            <Radio
              description="Existing membership/application"
              value="EXISTING"
            >
              Existing
            </Radio>
            <Radio description="New membership/application" value="NEW">
              New
            </Radio>
          </RadioGroup>
        </div>
        {/* Personal Details Grid */}

        <div className="flex flex-col gap-4">
          <h3 className="flex items-center text-lg font-bold">
            <User className="w-5 h-5 mr-2 text-primary-600" />
            ID Information
          </h3>
          <div className="grid gap-4">
            {selected === "NEW" && formData?.institution ? (
              <div className="space-y-2">
                <Input
                  id="fullName"
                  label="Full Names"
                  placeholder="Enter your full names"
                  type="text"
                  onError={errors.fullName}
                  errorText={errors.fullName}
                  value={formData.fullName}
                  onChange={(e) => updateFormData({ fullName: e.target.value })}
                />
                <Input
                  id="user_id"
                  label="Registration/ National ID"
                  placeholder="Enter your Registration/NRC/Passport number"
                  type="text"
                  onError={errors.user_id}
                  errorText={errors.user_id}
                  value={formData.user_id}
                  onChange={(e) => updateFormData({ user_id: e.target.value })}
                />
                <div className="flex justify-end pt-4">
                  <Button
                    className={"w-full"}
                    // endContent={<ChevronRight className="ml-2 w-4 h-4" />}
                    onClick={handleNextStep}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : selected === "EXISTING" && formData?.institution ? (
              <>
                {false ? (
                  /* USER LOOK UP COMPLETED  */
                  <>
                    <Card className="max-w-[400px] shadow-none">
                      <CardHeader className="flex gap-2">
                        <Image
                          alt="heroui logo"
                          height={40}
                          radius="sm"
                          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                          className="aspect-square w-20 object-cover"
                          width={40}
                        />
                        {
                          /* USER FOUND */
                          false ? (
                            <div className="flex flex-col">
                              <p className="text-md">
                                {formData.payerDetails.fullName}
                              </p>
                              <p className="text-sm text-default-500">
                                {formData?.user_id}
                              </p>
                            </div>
                          ) : (
                            /* USER NOT FOUND */
                            <div className="flex flex-col rounded-sm bg-slate-100 w-full p-2 py-2.5">
                              <p className="text-md text-primary/80 font-semibold">
                                RECORD NOT FOUND
                              </p>
                            </div>
                          )
                        }
                      </CardHeader>
                      {false && (
                        /* USER FOUND */
                        <>
                          <Divider />
                          <CardBody>
                            <p className="text-xs">
                              <span className="text-primary-600 font-semibold">
                                Note:
                              </span>
                              You are registered to pay for{" "}
                              {formData?.institution?.name}
                            </p>
                          </CardBody>
                        </>
                      )}
                      <Divider />
                      <CardFooter>
                        <Link
                          className="text-md"
                          isExternal
                          showAnchorIcon
                          href="https://github.com"
                        >
                          Visit Website
                        </Link>
                      </CardFooter>
                    </Card>
                    {
                      /* USER FOUND */
                      false && (
                        <div className="flex justify-end">
                          <Button
                            className={"w-full"}
                            // endContent={<ChevronRight className="ml-2 w-4 h-4" />}
                            onClick={handleNextStep}
                          >
                            Next
                          </Button>
                        </div>
                      )
                    }
                  </>
                ) : (
                  /* USER: ENTERS THEIR ID NUMBER ==> TO BE VALIDATED AND LOOKED UP */
                  <>
                    <Input
                      id="user_id"
                      label="Registration/ National ID"
                      placeholder="Enter your Registration/NRC/Passport number"
                      type="text"
                      onError={errors.user_id}
                      errorText={errors.user_id}
                      value={formData.user_id}
                      onChange={(e) =>
                        updateFormData({ user_id: e.target.value })
                      }
                    />
                    <div className="flex justify-end">
                      <Button className={"w-full"} onClick={validateUser}>
                        Validate
                      </Button>
                    </div>
                  </>
                )}
              </>
            ) : (
              /* NO SCHOOL HAS BEEN SELECTED */
              <EmptyLogs
                className={"my-auto"}
                subTitle={
                  "You have not selected an entity/institution to make payments for."
                }
                title={"Choose an entity"}
              />
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
