//BUSINESS REGISTRATION STATUS
'use client';
import { RadioGroup } from '@heroui/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

import CustomRadioButton from '@/components/ui/radio-button';
import { staggerContainerItemVariants } from '@/lib/constants';

import { STEPS } from '../signup-form';
export default function Step0({
  updateDetails,
}: {
  updateDetails: (step: string, fields: any) => void;
}) {
  useEffect(() => {
    // Set Default  Registration STAGE
    updateDetails(STEPS[0], {
      registration: 'NEW',
    });
  }, []);

  return (
    <div className="">
      <RadioGroup
        className="flex w-full"
        defaultValue={'NEW'}
        description={
          <p className="text-sm">
            <span className="font-bold text-primary">Important Notice:</span>{' '}
            Registration information will not be editable after registration and
            KYC is completed. Ensure to double-check all entries for accuracy
            before proceeding.
          </p>
        }
        label="How would you like to proceed?"
        onChange={(e) =>
          updateDetails(STEPS[0], {
            registration: e.target.value,
          })
        }
      >
        <div className="mt-2 flex flex-col items-center gap-2 sm:flex-row md:gap-5">
          <motion.div
            key={'step-0-1'}
            className="my-2 w-full"
            variants={staggerContainerItemVariants}
          >
            <CustomRadioButton
              description="Take control of your business and it's financial operations"
              value="NEW"
            >
              <p className="mb-1 font-semibold">New Account</p>
            </CustomRadioButton>
          </motion.div>

          <motion.div
            key={'step-0-2'}
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <CustomRadioButton
              description="Pick up from where you left off creating your account."
              disabled={true}
              value="CONTINUE"
            >
              <p className="mb-1 font-semibold">Continue Registration</p>
            </CustomRadioButton>
          </motion.div>
        </div>
      </RadioGroup>
    </div>
  );
}
