//BUSINESS REGISTRATION STATUS
'use client'
import React from 'react'
import { Input } from '@/components/ui/InputField'
import { motion } from 'framer-motion'
import { staggerContainerItemVariants } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { STEPS } from '../SignupForm'
import { CardHeader } from '@/components/base'
import useAuthStore from '@/context/authStore'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@nextui-org/react'

export default function Step1_TPIN({ updateDetails }) {
  const step = useAuthStore((state) => state.businessInfo)
  const isValidTPIN = useAuthStore((state) => state.isValidTPIN)
  const setIsValidTPIN = useAuthStore((state) => state.setIsValidTPIN)
  const [loading, setLoading] = React.useState(false)

  const TPINError = step?.tpin?.length < 3 || step?.tpin?.length > 10

  function validateTPIN() {
    const tpin = step?.tpin
    if (tpin.length === 10 && !TPINError) {
      // TODO => GET MERCHANT DETAILS
      // TODO =>  PRE FILL THE INPUT FIELDS
      // TODO => SET VALID TPIN FLAG
    }
  }

  return (
    <>
      <CardHeader
        className={'py-0'}
        classNames={{
          infoClasses: 'mb-0',
          innerWrapper: 'gap-0',
        }}
        title="Verify your identity"
        infoText={'Enter your TPIN to retrieve your business information.'}
      />
      <div className="flex w-full flex-col items-center justify-center gap-6">
        {loading ? (
          <Spinner siz></Spinner>
        ) : (
          <div className="flex w-full flex-1 flex-col gap-2 md:flex-row">
            <motion.div
              key={'step-1-2'}
              className="flex w-full flex-col items-end justify-center gap-2 md:flex-row"
              variants={staggerContainerItemVariants}
            >
              <Input
                type="number"
                label="TPIN"
                name="tpin"
                maxLength={10}
                value={step?.tpin}
                onError={TPINError}
                errorText="Invalid TPIN"
                onChange={(e) => {
                  updateDetails(STEPS[0], { tpin: e.target.value })
                }}
              />
              <Button
                className={cn('', { 'mb-4': TPINError })}
                isDisabled={TPINError}
              >
                Retrieve Business Information
              </Button>
            </motion.div>
          </div>
        )}

        {!loading && step?.tpin && (
          <div className="flex w-[90%] flex-col gap-4 rounded-lg bg-slate-50 p-4">
            <ul>
              <li className="heading-5">Business Name</li>
              <li className="paragraph">TPIN</li>
              <li className="paragraph">Email</li>
            </ul>
            <Checkbox
              className="text-xs sm:text-sm"
              isSelected={isValidTPIN}
              onValueChange={setIsValidTPIN}
            >
              Yes, this is my Business.
            </Checkbox>
          </div>
        )}
      </div>
    </>
  )
}
