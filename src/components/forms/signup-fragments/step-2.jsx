//BUSINESS REGISTRATION STATUS
"use client";
import React from "react";
import { Input } from "@/components/ui/input-field";
import { motion } from "framer-motion";
import { staggerContainerItemVariants } from "@/lib/constants";
import { STEPS } from "../signup-form";
import useAuthStore from "@/context/auth-store";
import SelectField from "@/components/ui/select-field";
import useConfigOptions from "@/hooks/useConfigOptions";
import CardHeader from "@/components/base/CardHeader";

// BUSINESS BANKING DETAILS
export default function Step2({ updateDetails, backToStart }) {
  const { banks, currencies } = useConfigOptions();
  const step = useAuthStore((state) => state.businessInfo);
  const branchCodeError =
    (step?.branch_code?.length > 1 && step?.branch_code?.length < 6) ||
    step?.branch_code?.length > 8;
  const accountNumberError = step?.account_number?.length > 16;

  return (
    <>
      <CardHeader
        title="Banking Details"
        infoText={
          "Please provide your banking details to receive your payments."
        }
        handleClose={() => backToStart()}
      />
      <div className="flex w-full flex-col items-start justify-start gap-6 md:flex-row">
        <div className="flex w-full flex-1 flex-col gap-2">
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Account Holder Name"
              plaaceholder="Enter your account holder name"
              name="account_name"
              value={step?.account_name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { account_name: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Account Number"
              name="account_number"
              plaaceholder="Enter your account number"
              value={step?.account_number}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { account_number: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <SelectField
              options={banks}
              label="Bank"
              name="bankID"
              value={step?.bankID}
              prefilled={true}
              listItemName={"bank_name"}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { bankID: e.target.value });
              }}
            />
          </motion.div>
        </div>

        <div className="flex w-full flex-1 flex-col gap-2 ">
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Branch Name"
              name="branch_name"
              plaaceholder="Enter the branch name"
              value={step?.branch_name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { branch_name: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Branch Code"
              name="branch_code"
              plaaceholder="Enter branch code"
              value={step?.branch_code}
              onError={branchCodeError}
              errorText={"Valid Code is required"}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { branch_code: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <SelectField
              options={currencies}
              label="Currency"
              name="currencyID"
              value={step?.currencyID}
              listItemName={"currency"}
              required={true}
              prefilled={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { currencyID: e.target.value });
              }}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}
