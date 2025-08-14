//BUSINESS REGISTRATION STATUS
'use client';
import { getLocalTimeZone, today } from '@internationalized/date';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

import AutoCompleteField from '@/components/base/auto-complete';
import CardHeader from '@/components/base/card-header';
import DateSelectField from '@/components/ui/date-select-field';
import { Input } from '@/components/ui/input-field';
import SelectField from '@/components/ui/select-field';
import useAuthStore from '@/context/auth-store';
import useConfigOptions from '@/hooks/use-config-options';
import { staggerContainerItemVariants } from '@/lib/constants';
import { formatDate, isValidZambianMobileNumber } from '@/lib/utils';

import { STEPS } from '../signup-form';

export default function Step1({
  updateDetails,
  backToStart,
}: {
  updateDetails: (step: any, fields: any) => void;
  backToStart: () => void;
}) {
  const { companyTypes, provinces } = useConfigOptions();
  const formData = useAuthStore((state) => state.businessInfo);

  const TPINError = formData?.tpin?.length > 10;
  const phoneNoError =
    !isValidZambianMobileNumber(formData?.contact) &&
    formData?.contact?.length > 9;

  const cities = useMemo(() => {
    const selectedProvince = provinces?.find(
      (province: any) => province?.id == formData?.provinceID,
    );

    return selectedProvince?.cities || [];
  }, [formData?.provinceID]);

  return (
    <>
      <CardHeader
        handleClose={() => backToStart()}
        infoText={
          'Information about your business to help us verify your identity.'
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
              listItemName={'type'}
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
              isInvalid={TPINError}
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
              defaultValue={formData?.date_of_incorporation as any}
              description={'Date the company was registered'}
              label={'Date of Incorporation'}
              labelPlacement={'outside'}
              maxValue={today(getLocalTimeZone())}
              required={true}
              value={
                (formData?.date_of_incorporation?.split('').length > 9
                  ? formData?.date_of_incorporation
                  : '') as any
              }
              onChange={(date) => {
                updateDetails(STEPS[1], {
                  date_of_incorporation: formatDate(String(date), 'YYYY-MM-DD'),
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
              label="Province"
              listItemName={'province'}
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
              label="City/Town"
              listItemName={'city'}
              name="cityID"
              options={cities}
              placeholder={
                formData?.provinceID ? 'Select city' : 'Select a province first'
              }
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
              isInvalid={phoneNoError}
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
    </>
  );
}
