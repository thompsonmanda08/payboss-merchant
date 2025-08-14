//BUSINESS REGISTRATION STATUS
'use client';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import { Checkbox } from '@heroui/react';
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';

import { validateTPIN } from '@/app/_actions/auth-actions';
import CardHeader from '@/components/base/card-header';
import SoftBoxIcon from '@/components/base/soft-box-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input-field';
import useAuthStore from '@/context/auth-store';
import { staggerContainerItemVariants } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { BusinessDetails } from '@/types/account';

import { STEPS } from '../signup-form';

export default function Step1_TPIN({
  updateDetails,
  backToStart,
}: {
  updateDetails: any;
  backToStart: any;
}) {
  const {
    businessInfo: step,
    setMerchantID,
    setBusinessInfo,
  } = useAuthStore((state) => state);
  const isValidTPIN = useAuthStore((state) => state.isValidTPIN);
  const setIsValidTPIN = useAuthStore((state) => state.setIsValidTPIN);
  const error = useAuthStore((state) => state.error);
  const updateErrorStatus = useAuthStore((state) => state.updateErrorStatus);
  const [loading, setLoading] = React.useState(false);

  const [merchant, setMerchant] = React.useState<BusinessDetails | null>(null);
  const TPINError = step?.tpin?.length > 10;

  async function handleTPINValidation() {
    setLoading(true);
    setMerchant(null);
    setMerchantID('');
    setIsValidTPIN(false);
    const tpin = step?.tpin;

    if (!tpin || tpin?.length > 10) {
      updateErrorStatus({ onTPIN: true, message: 'Invalid TPIN' });
      setLoading(false);

      return;
    }

    const response = await validateTPIN(tpin);

    if (!response?.success) {
      updateErrorStatus({
        status: true,
        onTPIN: true,
        message: response?.message,
      });
      setLoading(false);

      return;
    }

    if (response?.success) {
      setMerchant(response?.data);
      setBusinessInfo({ ...step, ...response?.data });
      setMerchantID(response?.data?.ID);
      setIsValidTPIN(response?.success);
      setLoading(false);

      return;
    }
  }

  // Clean out TPIN from state at first rendering
  useEffect(() => {
    updateDetails(STEPS[0], { tpin: '' });
  }, []);

  return (
    <>
      <CardHeader
        handleClose={() => backToStart()}
        infoText={'Enter your TPIN to retrieve your business information.'}
        title="Verify your identity"
      />
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <div className="flex w-full flex-1 flex-col gap-2 md:flex-row">
          <motion.div
            className="flex w-full flex-col items-end justify-center gap-2 md:flex-row"
            variants={staggerContainerItemVariants}
          >
            <Input
              errorText="Invalid TPIN"
              isDisabled={loading}
              isInvalid={TPINError || error?.onTPIN}
              label="TPIN"
              maxLength={10}
              name="tpin"
              type="number"
              value={step?.tpin}
              onChange={(e) => {
                updateDetails(STEPS[0], { tpin: e.target.value });
              }}
            />
            <Button
              className={cn('flex-[1]', { 'mb-4': TPINError || error?.status })}
              isDisabled={TPINError || loading || step?.tpin?.length < 10}
              isLoading={loading}
              loadingText={'Validating...'}
              onPress={handleTPINValidation}
            >
              Validate TPIN
            </Button>
          </motion.div>
        </div>

        {merchant && (
          <motion.div
            className="flex w-full flex-col gap-4 rounded-lg dark:bg-foreground/5 bg-slate-50 p-4"
            whileInView={{
              y: [-100, 0],
              opacity: [0, 1],
              transition: {
                duration: 0.3,
                ease: 'easeInOut',
              },
            }}
          >
            <div className="flex items-start gap-4">
              <SoftBoxIcon>
                <BriefcaseIcon className="aspect-square w-6" />
              </SoftBoxIcon>
              <ul>
                <li className="heading-5 -mt-1 uppercase">{merchant.name}</li>
                <li className="text-xs font-medium text-slate-600 sm:text-sm">
                  {merchant.company_email}
                </li>
              </ul>

              <div className="ml-5">
                <li className="text-xs font-medium text-slate-600 sm:text-sm">
                  Contact NO.: {merchant.contact}
                </li>
                <li className="text-xs font-medium text-slate-600 sm:text-sm">
                  TPIN: {merchant.tpin}
                </li>
              </div>
            </div>

            <Checkbox
              className="mx-auto mt-2 items-start text-xs sm:text-sm"
              classNames={{
                label: 'flex flex-col items-start -mt-1',
              }}
              isSelected={isValidTPIN}
              onValueChange={setIsValidTPIN}
            >
              <span className="text-xs font-medium italic text-foreground/70 md:text-sm">
                Yes, I confirm that the details provided accurately represent my
                business. I understand that any misrepresentation of my business
                may result in the rejection of my application.
              </span>
            </Checkbox>
          </motion.div>
        )}
      </div>
    </>
  );
}
