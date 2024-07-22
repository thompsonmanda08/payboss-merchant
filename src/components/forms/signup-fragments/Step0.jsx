//BUSINESS REGISTRATION STATUS
'use client'
import React, { useEffect } from 'react'
import { RadioGroup } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { staggerContainerItemVariants } from '@/lib/constants'
import { CustomRadioButton } from '@/components/base'
import { STEPS } from '../SignupForm'
export default function Step0({ updateDetails }) {
  useEffect(() => {
    // Set Default Business Registration Status to REGISTERED_BUSINESS
    updateDetails(STEPS[0], {
      business_type: 'ORGANIZATION',
    })
  }, [])
  return (
    <div className="max-w-">
      <RadioGroup
        label="What type of business do you run?"
        className="flex w-full"
        description="Payboss gives you the tools to simplify money management and take control of your financial operations - no matter your business size or structure."
        defaultValue={'ORGANIZATION'}
        onChange={(e) =>
          updateDetails(STEPS[0], {
            business_type: e.target.value,
          })
        }
      >
        <div className="mt-2 flex flex-col items-center gap-5 sm:flex-row">
          <motion.div
            key={'step-0-1'}
            className="my-2 w-full"
            variants={staggerContainerItemVariants}
          >
            <CustomRadioButton
              description="Works for large Organizations, Limited Liability Companies, NGOs etc."
              value="ORGANIZATION"
            >
              <p className="mb-1 font-semibold">Corporate/Organization</p>
            </CustomRadioButton>
          </motion.div>

          <motion.div
            className="w-full"
            key={'step-0-2'}
            variants={staggerContainerItemVariants}
          >
            <CustomRadioButton
              description="Works for individuals, one-person business, social media vendors and stores"
              value="INDIVIDUAL"
              disabled={true}
            >
              <p className="mb-1 font-semibold">Individual/Sole Trader</p>
            </CustomRadioButton>
          </motion.div>
        </div>
      </RadioGroup>
    </div>
  )
}
