//BUSINESS REGISTRATION STATUS
'use client'
import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { CardHeader, SelectField } from '@/components/base'
import { staggerContainerItemVariants } from '@/lib/constants'
import useConfigStore from '@/context/configStore'
import useAuthStore from '@/context/authStore'
import { STEPS } from '../SignupForm'

// CREATE NEW ADMIN USER
export default function Step4({ updateDetails }) {
  const { newAdminUser, error, setError } = useAuthStore()

  const userRoles = useConfigStore((state) => state.userRoles)

  const ADMIN_ROLE =
    userRoles.find((item) => item.role == 'Admin')?.ID || userRoles[0]?.ID

  useEffect(() => {
    updateDetails(STEPS[4], { roleID: ADMIN_ROLE })
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
        <div className="flex w-full flex-1 flex-col gap-y-2">
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <SelectField
              options={userRoles}
              placeholder={'ADMIN USER'}
              name="user_role"
              label="User Role"
              isDisabled={true}
              value={ADMIN_ROLE}
              defaultValue={ADMIN_ROLE}
              listItemName={'role'}
            />
          </motion.div>
          <motion.div
            className="w-full"
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
          </motion.div>

          <motion.div
            variants={staggerContainerItemVariants}
            className="flex w-full gap-4"
          >
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
              type="number"
              label="Mobile Number"
              name="phone_number"
              value={newAdminUser?.phone_number}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[4], { phone_number: e.target.value })
              }}
            />
          </motion.div>
        </div>

        <div className="flex w-full flex-1 flex-col gap-y-2">
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
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
