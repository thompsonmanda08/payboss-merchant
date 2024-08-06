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
    // Set Default  Registration STAGE
    updateDetails(STEPS[0], {
      registration: 'NEW',
    })
  }, [])
  return (
    <div className="max-w-">
      <RadioGroup
        label="What type of business do you run?"
        className="flex w-full"
        description="Payboss gives you the tools to simplify money management, no matter your business size or structure."
        defaultValue={'NEW'}
        onChange={(e) =>
          updateDetails(STEPS[0], {
            registration: e.target.value,
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
              description="Create a new account for your business and take control of your financial operations"
              value="NEW"
            >
              <p className="mb-1 font-semibold">Create New Account</p>
            </CustomRadioButton>
          </motion.div>

          <motion.div
            className="w-full"
            key={'step-0-2'}
            variants={staggerContainerItemVariants}
          >
            <CustomRadioButton
              description="Pick up from where you left off in the account creation process"
              value="CONTINUE"
              disabled={true}
            >
              <p className="mb-1 font-semibold">Continue Registration</p>
            </CustomRadioButton>
          </motion.div>
        </div>
      </RadioGroup>
    </div>
  )
}
