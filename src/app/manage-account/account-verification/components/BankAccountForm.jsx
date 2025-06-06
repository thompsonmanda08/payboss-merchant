"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input-field";
import SelectField from "@/components/ui/select-field";
import { Button } from "@/components/ui/button";
import CardHeader from "@/components/base/card-header";
import { motion } from "framer-motion";
import { staggerContainerItemVariants } from "@/lib/constants";

function BankAccountForm({
  businessDetails: business,
  banks = [],
  currencies = [],
  onCompletionNavigateTo: navigateToPage,
}) {
  return (
    <div className="w-full lg:px-8 mx-auto p-2">
      <CardHeader
        className={"py-0 mb-6"}
        classNames={{
          infoClasses: "mb-0",
          innerWrapper: "gap-0",
        }}
        title="Provide your business bank account number"
        infoText="Ensure the name on your bank account matches the legal business name you provided."
      />
      <form onSubmit={(e) => e.preventDefault()} className="">
        <motion.div
          className="w-full max-w-md gap-4 flex flex-col"
          variants={staggerContainerItemVariants}
        >
          <SelectField
            label="Bank"
            listItemName={"bank_name"}
            name="bankID"
            options={banks}
            prefilled={true}
            required={true}
            value={business.bankID}
            isDisabled={true}
          />
          <Input
            label="Account Number"
            name="accountNumber"
            value={business.account_number}
            isDisabled={true}
            required
          />
          <Input
            label="Branch Name"
            name="branchName"
            value={business.branch_name}
            isDisabled={true}
            placeholder="Provide your branch name"
          />
          <Input
            label="Branch Code"
            name="branchCode"
            value={business.branch_code}
            isDisabled={true}
          />
          <Input
            label="Account Holder Name"
            name="accountHolderName"
            value={business.account_name}
            isDisabled={true}
            required
            placeholder="Provide your account holder name"
          />

          <SelectField
            label="Currency"
            listItemName={"currency"}
            name="currencyID"
            options={currencies}
            prefilled={true}
            required={true}
            value={business?.currencyID}
            isDisabled={true}
          />
        </motion.div>
        <div className="flex justify-between mt-8">
          <Button variant="light" onClick={() => navigateToPage("business")}>
            Back
          </Button>
          <Button onClick={() => navigateToPage("contactPerson")}>Next</Button>
        </div>
      </form>
    </div>
  );
}

export default BankAccountForm;
