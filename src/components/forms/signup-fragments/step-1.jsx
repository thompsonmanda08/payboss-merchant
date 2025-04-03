//BUSINESS REGISTRATION STATUS
"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Switch, Tooltip } from "@heroui/react";

import { Input } from "@/components/ui/input-field";
import { staggerContainerItemVariants } from "@/lib/constants";
import { cn, formatDate, isValidZambianMobileNumber } from "@/lib/utils";
import DateSelectField from "@/components/ui/date-select-field";
import useAuthStore from "@/context/auth-store";
import SelectField from "@/components/ui/select-field";
import useConfigOptions from "@/hooks/useConfigOptions";
import CardHeader from "@/components/base/card-header";
import AutoCompleteField from "@/components/base/auto-complete";

import { STEPS } from "../signup-form";

export default function Step1({ updateDetails, backToStart }) {
  const { companyTypes, provinces } = useConfigOptions();
  const formData = useAuthStore((state) => state.businessInfo);

  const TPINError = formData?.tpin?.length > 10;
  const phoneNoError =
    !isValidZambianMobileNumber(formData?.contact) &&
    formData?.contact?.length > 9;

  const cities = useMemo(() => {
    const selectedProvince = provinces?.find(
      (province) => province?.id == formData?.provinceID,
    );

    return selectedProvince?.cities || [];
  }, [formData?.provinceID]);

  return (
    <>
      <CardHeader
        handleClose={() => backToStart()}
        infoText={
          "Information about your business to help us verify your identity."
        }
        title="Business Details"
      />

      <div className="flex w-full flex-col items-center justify-center gap-6 lg:flex-row">
        <div className="flex w-full flex-1 flex-col gap-2">
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Business Name"
              name="businessName"
              placeholder="Enter business name"
              required={true}
              type="text"
              value={formData?.name}
              onChange={(e) => {
                updateDetails(STEPS[1], { name: e.target.value });
              }}
            />
          </motion.div>

          <motion.div
            className="flex w-full gap-4"
            variants={staggerContainerItemVariants}
          >
            <SelectField
              label="Company Type"
              listItemName={"type"}
              name="companyTypeID"
              options={companyTypes}
              prefilled={true}
              required={true}
              value={formData?.companyTypeID}
              onChange={(e) => {
                updateDetails(STEPS[1], { companyTypeID: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            className="flex w-full gap-4"
            variants={staggerContainerItemVariants}
          >
            <Input
              errorText="Invalid TPIN"
              label="TPIN"
              maxLength={10}
              name="tpin"
              placeholder="Enter TPIN"
              required={true}
              type="number"
              value={formData?.tpin}
              onChange={(e) => {
                updateDetails(STEPS[1], { tpin: e.target.value });
              }}
              onError={TPINError}
            />
          </motion.div>

          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Company Email"
              name="company_email"
              placeholder="Enter company email"
              required={true}
              type="email"
              value={formData?.company_email}
              onChange={(e) => {
                updateDetails(STEPS[1], { company_email: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <DateSelectField
              className="max-w-sm"
              defaultValue={formData?.date_of_incorporation}
              description={"Date the company was registered"}
              label={"Date of Incorporation"}
              labelPlacement={"outside"}
              maxValue={today(getLocalTimeZone())}
              required={true}
              value={
                formData?.date_of_incorporation?.split("").length > 9
                  ? formData?.date_of_incorporation
                  : ""
              }
              onChange={(date) => {
                updateDetails(STEPS[1], {
                  date_of_incorporation: formatDate(date, "YYYY-MM-DD"),
                });
              }}
            />
          </motion.div>
        </div>

        <div className="mb-5 flex w-full flex-1 flex-col gap-2">
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <AutoCompleteField
              defaultValue={provinces[0]?.id}
              label="Province"
              listItemName={"province"}
              name="provinceID"
              options={provinces}
              required={true}
              value={formData?.provinceID}
              onChange={(selected) => {
                updateDetails(STEPS[1], { provinceID: selected });
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <AutoCompleteField
              defaultValue={cities[0]?.id}
              label="City/Town"
              listItemName={"city"}
              name="cityID"
              options={cities}
              placeholder={
                formData?.provinceID ? "Select city" : "Select a province first"
              }
              prefilled={true}
              required={true}
              value={formData?.cityID}
              onChange={(selected) => {
                updateDetails(STEPS[1], { cityID: selected });
              }}
            />
          </motion.div>
          <motion.div
            className="flex w-full gap-4"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Physical Address"
              name="physical_address"
              placeholder="Enter physical address"
              required={true}
              value={formData?.physical_address}
              onChange={(e) => {
                updateDetails(STEPS[1], { physical_address: e.target.value });
              }}
            />
          </motion.div>

          <motion.div
            className="flex w-full gap-4"
            variants={staggerContainerItemVariants}
          >
            <Input
              errorText="Invalid Mobile Number"
              label="Mobile Number"
              maxLength={12}
              name="contact"
              pattern="[0-9]{12}"
              placeholder="Enter mobile number (start with 0977/66/55)"
              required={true}
              type="number"
              value={formData?.contact}
              onChange={(e) => {
                updateDetails(STEPS[1], { contact: e.target.value });
              }}
              onError={phoneNoError}
            />
          </motion.div>
          <motion.div
            className="flex w-full gap-4"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Website / Social Media"
              name="website"
              pattern="https?://.+"
              placeholder="Enter website / social media link"
              required={true}
              title="https://www.domain-name.com"
              value={formData?.website}
              onChange={(e) => {
                updateDetails(STEPS[1], { website: e.target.value });
              }}
            />
          </motion.div>
        </div>
      </div>

      <motion.div className="w-full" variants={staggerContainerItemVariants}>
        <Tooltip
          classNames={{
            content: "max-w-md",
          }}
          color="default"
          content="As a super merchant, you can manage multiple merchant collection workspaces and oversee your business operations and transactions"
        >
          <Switch
            classNames={{
              base: cn(
                "inline-flex flex-row-reverse w-full bg-primary/5 max-w-full hover:bg-primary-50 items-center",
                "justify-between cursor-pointer rounded-lg gap-2 p-4 pl-2 border-2 border-transparent",
                "data-[selected=true]:border-primary",
              ),
              wrapper: "p-0 h-6 overflow-visible",
              thumb: cn(
                "w-8 h-8 border-2 shadow-lg",
                "group-data-[hover=true]:border-primary",
                //selected
                "group-data-[selected=true]:ms-5",
                // pressed
                "group-data-[pressed=true]:w-8",
                "group-data-[selected]:group-data-[pressed]:ms-4",
              ),
            }}
            isSelected={formData?.merchant_type === "super"}
            onValueChange={(isSelected) => {
              updateDetails(STEPS[1], {
                merchant_type: isSelected ? "super" : "ordinary",
              });
            }}
          >
            <div className="flex flex-col gap-1">
              <p className="text-medium font-semibold text-foreground">
                Super Merchant
              </p>
              <p className="text-sm text-default-500">
                Do you manage multiple other merchants/businesses?
              </p>
            </div>
          </Switch>
        </Tooltip>
      </motion.div>

      {formData?.merchant_type === "super" && (
        <div className="flex w-full flex-col items-center justify-center gap-6 lg:flex-row">
          {/* SIGNATORY DETAILS */}
          <motion.div
            className="flex w-full flex-1 flex-col gap-2"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Signatory Full Name"
              name="signatory_full_name"
              placeholder="Enter Full Name"
              required={true}
              value={formData?.signatory_name}
              onChange={(e) => {
                updateDetails(STEPS[1], {
                  signatory_name: e.target.value,
                });
              }}
            />
            <Input
              errorText="Invalid Mobile Number"
              label="CFO Phone"
              maxLength={12}
              name="signatory_contact"
              placeholder="0989 XXX XXX"
              required={true}
              type="text"
              value={formData?.signatory_contact}
              onChange={(e) => {
                updateDetails(STEPS[1], { signatory_contact: e.target.value });
              }}
              onError={phoneNoError}
            />
            <Input
              label="Signatory Email"
              name="signatory_email"
              placeholder="Enter Email"
              required={true}
              type="email"
              value={formData?.signatory_email}
              onChange={(e) => {
                updateDetails(STEPS[1], { signatory_email: e.target.value });
              }}
            />
          </motion.div>

          {/* CFO DETAILS */}
          <motion.div
            className="flex w-full flex-1 flex-col gap-2"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="CFO Full Name"
              name="cfo_full_name"
              placeholder="Enter Full Name"
              required={true}
              value={formData?.cfo_name}
              onChange={(e) => {
                updateDetails(STEPS[1], { cfo_name: e.target.value });
              }}
            />
            <Input
              errorText="Invalid Mobile Number"
              label="CFO Phone"
              maxLength={12}
              name="cfo_contact"
              placeholder="0989 XXX XXX"
              required={true}
              type="text"
              value={formData?.cfo_contact}
              onChange={(e) => {
                updateDetails(STEPS[1], { cfo_contact: e.target.value });
              }}
              onError={phoneNoError}
            />
            <Input
              label="CFO Email"
              name="cfo_email"
              placeholder="Enter Email"
              required={true}
              type="email"
              value={formData?.cfo_email}
              onChange={(e) => {
                updateDetails(STEPS[1], { cfo_email: e.target.value });
              }}
            />
          </motion.div>
        </div>
      )}
    </>
  );
}
