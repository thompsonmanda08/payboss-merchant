//BUSINESS REGISTRATION STATUS
'use client'
import React, { useEffect } from 'react'
import { Input } from '@/components/ui/InputField'
import { motion } from 'framer-motion'
import { CardHeader } from '@/components/base'
import { staggerContainerItemVariants } from '@/lib/constants'
import useAuthStore from '@/context/authStore'
import { STEPS } from '../SignupForm'
import SelectField from '@/components/ui/SelectField'
import IMG from '@/images/auth-img.png'
import Image from 'next/image'

// CREATE NEW ADMIN USER
export default function Step4({ updateDetails }) {
  const { newAdminUser, error, setError } = useAuthStore()

  useEffect(() => {
    updateDetails(STEPS[4], { role: 'owner', changePassword: false })
  }, [])

  return (
    <>
      <CardHeader
        className={'py-0'}
        classNames={{
          infoClasses: 'mb-0',
          innerWrapper: 'gap-0',
        }}
        title="Create New Admin User"
        infoText={'Create a new admin user to manage your business on PayBoss.'}
      />

      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="hidden w-full flex-1 flex-col gap-y-2 lg:flex">
          <motion.div
            className="flex w-full flex-col gap-5"
            variants={staggerContainerItemVariants}
          >
            <div className="mx-auto aspect-square w-60 ">
              <Image
                className="w-fit object-contain"
                src={IMG}
                alt={''}
                width={440}
                height={320}
              />
            </div>
            <div className="mx-auto flex flex-col items-center justify-center">
              <h2 className="heading-5 ">Account Approval</h2>
              <p className="text-center text-sm  text-slate-500">
                Gain unrestricted access by submitting the additional required
                KYC documentation.
              </p>
            </div>
          </motion.div>
        </div>
        <div className="flex w-full flex-1 flex-col gap-y-2">
          {/* <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <SelectField
              placeholder={'SUPER ADMIN'}
              name="user_role"
              label="User Role"
              isDisabled={true}
              value={'owner'}
              defaultValue={'owner'}
            />
          </motion.div> */}
          <motion.div
            className="flex w-full gap-2"
            variants={staggerContainerItemVariants}
          >
            <Input
              type="text"
              label="First Name"
              name="firstName"
              value={newAdminUser?.first_name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[4], { first_name: e.target.value })
              }}
            />
            <Input
              type="text"
              label="Last Name"
              name="lastName"
              value={newAdminUser?.last_name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[4], { last_name: e.target.value })
              }}
            />
          </motion.div>

          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              type="text"
              label="Email"
              name="email"
              required={true}
              value={newAdminUser?.email}
              onChange={(e) => {
                updateDetails(STEPS[4], { email: e.target.value })
              }}
            />
          </motion.div>
          <motion.div
            className="flex w-full gap-2"
            variants={staggerContainerItemVariants}
          >
            <Input
              type="number"
              label="Mobile Number"
              name="phone_number"
              value={newAdminUser?.phone_number}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[4], { phone_number: e.target.value })
              }}
            />
            <Input
              type="text"
              label="Username"
              name="username"
              value={newAdminUser?.username}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[4], { username: e.target.value })
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Password"
              type="password"
              name="password"
              value={newAdminUser?.password}
              onError={error?.onPassword}
              error={error}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[4], { password: e.target.value })
              }}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least 8 characters, including uppercase letters, lowercase letters, and numbers"
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Confirm Password"
              type="password"
              name="password2"
              value={newAdminUser?.confirmPassword}
              onError={error?.onPassword}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[4], { confirmPassword: e.target.value })
              }}
            />
          </motion.div>
        </div>
      </div>
    </>
  )
}
