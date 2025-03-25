//BUSINESS REGISTRATION STATUS
"use client";
import React, { useMemo } from "react";
import { Input } from "@/components/ui/input-field";
import { motion } from "framer-motion";
import { staggerContainerItemVariants } from "@/lib/constants";
import { cn, formatDate, isValidZambianMobileNumber } from "@/lib/utils";
import { STEPS } from "../signup-form";
import DateSelectField from "@/components/ui/date-select-field";
import useAuthStore from "@/context/auth-store";
import { getLocalTimeZone, today } from "@internationalized/date";
import SelectField from "@/components/ui/select-field";
import useConfigOptions from "@/hooks/useConfigOptions";
import CardHeader from "@/components/base/CardHeader";
import { Switch, Tooltip } from "@heroui/react";

export default function Step1({ updateDetails, backToStart }) {
  const { companyTypes, provinces } = useConfigOptions();
  const formData = useAuthStore((state) => state.businessInfo);

  const TPINError = formData?.tpin?.length > 10;
  const phoneNoError =
    !isValidZambianMobileNumber(formData?.contact) &&
    formData?.contact?.length > 9;

  const cities = useMemo(() => {
    if (formData?.provinceID) {
      return (
        provinces?.find((province) => province?.ID === formData?.provinceID)
          ?.cities || provinces[0]?.cities
      );
    }
    return [];
  }, [formData?.provinceID, provinces]);

  return (
    <>
      <CardHeader
        title="Business Details"
        infoText={
          "Information about your business to help us verify your identity."
        }
        handleClose={() => backToStart()}
      />

      <div className="flex w-full flex-col items-center justify-center gap-6 lg:flex-row">
        <div className="flex w-full flex-1 flex-col gap-2">
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              type="text"
              label="Business Name"
              name="businessName"
              placeholder="Enter business name"
              value={formData?.name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { name: e.target.value });
              }}
            />
          </motion.div>

          <motion.div
            variants={staggerContainerItemVariants}
            className="flex w-full gap-4"
          >
            <SelectField
              options={companyTypes}
              label="Company Type"
              name="companyTypeID"
              listItemName={"type"}
              value={formData?.companyTypeID}
              prefilled={true}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { companyTypeID: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            variants={staggerContainerItemVariants}
            className="flex w-full gap-4"
          >
            <Input
              type="number"
              label="TPIN"
              placeholder="Enter TPIN"
              name="tpin"
              maxLength={10}
              value={formData?.tpin}
              onError={TPINError}
              errorText="Invalid TPIN"
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { tpin: e.target.value });
              }}
            />
          </motion.div>

          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              type="email"
              label="Company Email"
              name="company_email"
              value={formData?.company_email}
              placeholder="Enter company email"
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { company_email: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <DateSelectField
              label={"Date of Incorporation"}
              className="max-w-sm"
              description={"Date the company was registered"}
              defaultValue={formData?.date_of_incorporation}
              value={
                formData?.date_of_incorporation?.split("").length > 9
                  ? formData?.date_of_incorporation
                  : ""
              }
              labelPlacement={"outside"}
              required={true}
              maxValue={today(getLocalTimeZone())}
              onChange={(date) => {
                updateDetails(STEPS[0], {
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
            <SelectField
              options={provinces}
              label="Province"
              name="provinceID"
              defaultValue={provinces[0]?.ID}
              listItemName={"province"}
              value={formData?.provinceID}
              prefilled={true}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { provinceID: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <SelectField
              options={cities}
              label="City/Town"
              name="cityID"
              listItemName={"city"}
              defaultValue={cities[0]?.ID}
              value={formData?.cityID}
              prefilled={true}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { cityID: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            variants={staggerContainerItemVariants}
            className="flex w-full gap-4"
          >
            <Input
              label="Physical Address"
              name="physical_address"
              value={formData?.physical_address}
              placeholder="Enter physical address"
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { physical_address: e.target.value });
              }}
            />
          </motion.div>

          <motion.div
            variants={staggerContainerItemVariants}
            className="flex w-full gap-4"
          >
            <Input
              type="number"
              label="Mobile Number"
              placeholder="Enter mobile number (start with 0977/66/55)"
              name="contact"
              maxLength={12}
              pattern="[0-9]{12}"
              onError={phoneNoError}
              errorText="Invalid Mobile Number"
              value={formData?.contact}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { contact: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            variants={staggerContainerItemVariants}
            className="flex w-full gap-4"
          >
            <Input
              label="Website / Social Media"
              name="website"
              value={formData?.website}
              required={true}
              pattern="https?://.+"
              title="https://www.domain-name.com"
              placeholder="Enter website / social media link"
              onChange={(e) => {
                updateDetails(STEPS[0], { website: e.target.value });
              }}
            />
          </motion.div>
        </div>
      </div>

      <motion.div className="w-full" variants={staggerContainerItemVariants}>
        <Tooltip
          color="default"
          content="As a super merchant, you can manage multiple merchant collection workspaces and oversee your business operations and transactions"
          classNames={{
            content: "max-w-md",
          }}
        >
          <Switch
            isSelected={formData?.merchant_type === "super"}
            onValueChange={(isSelected) => {
              updateDetails(STEPS[0], {
                merchant_type: isSelected ? "super" : "ordinary",
              });
            }}
            classNames={{
              base: cn(
                "inline-flex flex-row-reverse w-full bg-primary/5 max-w-full hover:bg-primary-50 items-center",
                "justify-between cursor-pointer rounded-lg gap-2 p-4 pl-2 border-2 border-transparent",
                "data-[selected=true]:border-primary"
              ),
              wrapper: "p-0 h-6 overflow-visible",
              thumb: cn(
                "w-8 h-8 border-2 shadow-lg",
                "group-data-[hover=true]:border-primary",
                //selected
                "group-data-[selected=true]:ms-5",
                // pressed
                "group-data-[pressed=true]:w-8",
                "group-data-[selected]:group-data-[pressed]:ms-4"
              ),
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
            variants={staggerContainerItemVariants}
            className="flex w-full flex-1 flex-col gap-2"
          >
            <Input
              label="Signatory Full Name"
              name="signatory_full_name"
              placeholder="Enter Full Name"
              value={formData?.signatory_name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], {
                  signatory_name: e.target.value,
                });
              }}
            />
            <Input
              type="text"
              label="CFO Phone"
              placeholder="0989 XXX XXX"
              name="signatory_contact"
              maxLength={12}
              pattern="[0-9]{12}"
              onError={phoneNoError}
              errorText="Invalid Mobile Number"
              value={formData?.signatory_contact}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { signatory_contact: e.target.value });
              }}
            />
            <Input
              type="email"
              label="Signatory Email"
              name="signatory_email"
              value={formData?.signatory_email}
              placeholder="Enter Email"
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { signatory_email: e.target.value });
              }}
            />
          </motion.div>

          {/* CFO DETAILS */}
          <motion.div
            variants={staggerContainerItemVariants}
            className="flex w-full flex-1 flex-col gap-2"
          >
            <Input
              label="CFO Full Name"
              name="cfo_full_name"
              placeholder="Enter Full Name"
              value={formData?.cfo_name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { cfo_name: e.target.value });
              }}
            />
            <Input
              type="text"
              label="CFO Phone"
              placeholder="0989 XXX XXX"
              name="cfo_contact"
              maxLength={12}
              pattern="[0-9]{12}"
              onError={phoneNoError}
              errorText="Invalid Mobile Number"
              value={formData?.cfo_contact}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { cfo_contact: e.target.value });
              }}
            />
            <Input
              type="email"
              label="CFO Email"
              name="cfo_email"
              value={formData?.cfo_email}
              placeholder="Enter Email"
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { cfo_email: e.target.value });
              }}
            />
          </motion.div>
        </div>
      )}
    </>
  );
}
