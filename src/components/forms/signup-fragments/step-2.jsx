//BUSINESS REGISTRATION STATUS
"use client";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input-field";
import { staggerContainerItemVariants } from "@/lib/constants";
import useAuthStore from "@/context/auth-store";
import SelectField from "@/components/ui/select-field";
import useConfigOptions from "@/hooks/useConfigOptions";
import CardHeader from "@/components/base/card-header";

import { STEPS } from "../signup-form";

// BUSINESS BANKING DETAILS
export default function Step2({ updateDetails, backToStart }) {
  const { banks, currencies } = useConfigOptions();
  const formData = useAuthStore((state) => state.bankDetails);
  const branchCodeError =
    (formData?.branch_code?.length > 1 && formData?.branch_code?.length < 6) ||
    formData?.branch_code?.length > 8;
  const accountNumberError = formData?.account_number?.length > 16;

  return (
    <>
      <CardHeader
        handleClose={() => backToStart()}
        infoText={
          "Please provide your banking details to receive your payments."
        }
        title="Banking Details"
      />
      <div className="flex w-full flex-col items-start justify-start gap-6 md:flex-row">
        <div className="flex w-full flex-1 flex-col gap-2">
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Account Holder Name"
              name="account_name"
              placeholder="Enter your account holder name"
              required={true}
              value={formData?.account_name}
              onChange={(e) => {
                updateDetails(STEPS[2], { account_name: e.target.value });
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
              placeholder="Enter your account number"
              required={true}
              value={formData?.account_number}
              onChange={(e) => {
                updateDetails(STEPS[2], { account_number: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <SelectField
              label="Bank"
              listItemName={"bank_name"}
              name="bankID"
              options={banks}
              prefilled={true}
              required={true}
              value={formData?.bankID}
              onChange={(e) => {
                updateDetails(STEPS[2], { bankID: e.target.value });
              }}
            />
          </motion.div>
        </div>

        <div className="flex w-full flex-1 flex-col gap-2">
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Branch Name"
              name="branch_name"
              placeholder="Enter the branch name"
              required={true}
              value={formData?.branch_name}
              onChange={(e) => {
                updateDetails(STEPS[2], { branch_name: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              errorText={"Valid Code is required"}
              label="Branch Code"
              name="branch_code"
              placeholder="Enter branch code"
              required={true}
              value={formData?.branch_code}
              onChange={(e) => {
                updateDetails(STEPS[2], { branch_code: e.target.value });
              }}
              onError={branchCodeError}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <SelectField
              label="Currency"
              listItemName={"currency"}
              name="currencyID"
              options={currencies}
              prefilled={true}
              required={true}
              value={formData?.currencyID}
              onChange={(e) => {
                updateDetails(STEPS[2], { currencyID: e.target.value });
              }}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}
