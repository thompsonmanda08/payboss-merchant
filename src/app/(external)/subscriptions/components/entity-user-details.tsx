import { Button } from "@/components/ui/button";
import AutoCompleteField from "@/components/base/auto-complete";
import { School, User } from "lucide-react";
import { Input } from "@/components/ui/input-field";
import { AnimatePresence, motion } from "framer-motion";
import {
  addToast,
  Alert,
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
import React, { Dispatch, SetStateAction, useCallback } from "react";
import EmptyLogs from "@/components/base/empty-logs";
import { validateSubscriptionMember } from "@/app/_actions/subscription-actions";
import {
  containerVariants,
  staggerContainerItemVariants,
} from "@/lib/constants";
export default function EntityUserDetails({
  formData,
  updateFormData,
  errors,
  setErrors,
  handleNextStep,
  institutions,
}: {
  formData: any;
  updateFormData: any;
  errors: any;
  setErrors: Dispatch<SetStateAction<any>>;
  handleNextStep: any;
  institutions: any;
}) {
  const [selected, setSelected] = React.useState("EXISTING");
  const [responseError, setResponseError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const existingUserFound = formData?.member_details?.member_id;
  const pendingTransaction = formData?.transaction?.id;

  const handleSelectInstitution = (value: string) => {
    updateFormData({
      institution: institutions?.find(
        (x: any) => x.ID == value || x.id == value,
      ),
    });

    setErrors((prev: any) => {
      if (prev.institution) {
        const newErrors = { ...prev };
        delete newErrors.institution;
        return newErrors;
      }
      return prev;
    });
  };

  const changeApplicantType = useCallback((value: string) => {
    setSelected(value);
    setErrors({});
  }, []);

  function createNewPayment() {
    const newErrors = {} as any;

    if (!formData.institution) newErrors.institution = "Please select a school";
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.user_id.trim()) newErrors.user_id = "Valid ID is required";

    setErrors(newErrors);

    /* IF ERROR EXIST RETURN */
    if (Object.keys(newErrors).length !== 0) return;

    handleNextStep();
  }

  async function validateExistingUser() {
    const newErrors = {} as any;

    if (!formData.institution) newErrors.institution = "Please select a school";
    if (!formData.user_id.trim()) newErrors.user_id = "Valid ID is required";
    setErrors(newErrors);

    /* IF ERROR EXIST RETURN */
    if (Object.keys(newErrors).length !== 0) return;

    setIsLoading(true);
    const workspaceID = formData?.institution?.workspaceID;
    const memberID = formData?.user_id;
    const response = await validateSubscriptionMember(workspaceID, memberID);

    if (response?.success) {
      addToast({
        title: "Success",
        description: "Member validation completed",
        color: "success",
      });

      updateFormData({ ...response.data });
    } else {
      addToast({
        title: "Error",
        description: response.message,
        color: "danger",
      });
      setResponseError(response.message);
    }

    setIsLoading(false);
  }

  return (
    <Card className="shadow-none no-scrollbar border-gray-200 p-4 border max-w-lg mx-auto">
      <CardHeader>
        <h3 className="flex items-center text-lg font-bold">
          <School className="w-5 h-5 mr-2 text-primary-600" />
          Institution/Organization
        </h3>
      </CardHeader>
      <CardBody className="space-y-6 no-scrollbar">
        {/* School Selection */}
        <div className="grid gap-6 mb-2">
          <AutoCompleteField
            label={"Select an Institution/Organization"}
            options={institutions}
            listItemName={"name"}
            value={formData.institution?.id || ""}
            onChange={handleSelectInstitution}
            onError={errors.institution}
            errorText={errors.institution}
          />

          {formData.institution?.name && (
            <motion.div whileInView={staggerContainerItemVariants}>
              <RadioGroup
                color="primary"
                label="Are you a new applicant or Existing Applicant"
                value={selected}
                onValueChange={changeApplicantType}
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
            </motion.div>
          )}
        </div>
        {/* Personal Details Grid */}

        {
          <div className="flex flex-col gap-4">
            {formData.institution?.name && (
              <h3 className="flex items-center text-lg font-bold">
                <User className="w-5 h-5 mr-2 text-primary-600" />
                User ID Information
              </h3>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                animate={"show"}
                exit={"exit"}
                initial={"hidden"}
                transition={{ duration: 0.3 }}
                variants={containerVariants}
                className="grid gap-4"
              >
                {selected === "NEW" && formData.institution?.name ? (
                  <motion.div
                    variants={staggerContainerItemVariants}
                    className="space-y-2"
                  >
                    <Input
                      id="fullName"
                      label="Full Names"
                      placeholder="Enter your full names"
                      type="text"
                      onError={errors.fullName}
                      errorText={errors.fullName}
                      value={formData.fullName}
                      onChange={(e) =>
                        updateFormData({ fullName: e.target.value })
                      }
                    />
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
                    <div className="flex justify-end pt-4">
                      <Button className={"w-full"} onClick={createNewPayment}>
                        Next
                      </Button>
                    </div>
                  </motion.div>
                ) : selected === "EXISTING" && formData.institution?.name ? (
                  <motion.div
                    className="flex flex-col gap-4"
                    variants={staggerContainerItemVariants}
                  >
                    {existingUserFound ? (
                      <>
                        <Card className="max-w-[400px] shadow-none">
                          <CardHeader className="flex gap-2">
                            <Image
                              alt="Logo"
                              height={40}
                              radius="sm"
                              src={
                                formData?.institution?.logo ||
                                "/images/logos/logo-icon.svg"
                              }
                              className="aspect-square w-20 object-cover"
                              width={40}
                            />
                            <div className="flex flex-col">
                              <p className="text-md">
                                {formData.formData?.member_details?.name}
                              </p>
                              <p className="text-sm text-default-500">
                                {formData?.member_details?.member_id}
                              </p>
                            </div>
                          </CardHeader>
                          <Divider />
                          <CardBody>
                            <p className="text-xs">
                              You are a registered member at{" "}
                              {formData?.institution?.name}
                            </p>
                          </CardBody>
                          <Divider />
                          <CardFooter>
                            <Link
                              className="text-md"
                              isExternal
                              showAnchorIcon
                              href={
                                formData?.institution?.website ||
                                formData?.institution?.redirect_url ||
                                "#"
                              }
                              target="_blank"
                            >
                              Visit Website
                            </Link>
                          </CardFooter>
                        </Card>
                        <div className="flex justify-end">
                          <Button className={"w-full"} onClick={handleNextStep}>
                            Next
                          </Button>
                        </div>
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
                        {responseError && (
                          <Alert color="danger">{responseError}</Alert>
                        )}
                        <div className="flex justify-end">
                          <Button
                            className={"w-full"}
                            isLoading={isLoading}
                            isDisabled={!formData.user_id || isLoading}
                            onClick={validateExistingUser}
                          >
                            Validate
                          </Button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  /* NO SCHOOL HAS BEEN SELECTED */
                  <motion.div
                    whileInView={{
                      opacity: [0, 1],
                      y: [-20, 0],
                      transition: {
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        duration: 0.3,
                      },
                    }}
                    className="flex flex-col gap-4"
                  >
                    <EmptyLogs
                      className={"my-auto"}
                      subTitle={
                        "You have not selected an entity/institution to make payments for."
                      }
                      title={"Choose an entity"}
                    />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        }
      </CardBody>
    </Card>
  );
}
