//BUSINESS REGISTRATION STATUS
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';

import CardHeader from '@/components/base/card-header';
import { Input } from '@/components/ui/input-field';
import useAuthStore from '@/context/auth-store';
import { staggerContainerItemVariants } from '@/lib/constants';

import { STEPS } from '../signup-form';

// CREATE NEW ADMIN USER
export default function Step4({ updateDetails, backToStart }: any) {
  const { newAdminUser, error, setError } = useAuthStore();

  useEffect(() => {
    updateDetails(STEPS[3], { role: 'owner', changePassword: false });
  }, []);

  return (
    <>
      <CardHeader
        handleClose={() => backToStart()}
        infoText={'Create a new admin user to manage your business on PayBoss.'}
        title="Create New Admin User"
      />

      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="hidden w-full flex-1 flex-col gap-y-2 lg:flex">
          <motion.div
            className="flex w-full flex-col gap-5"
            variants={staggerContainerItemVariants}
          >
            <div className="mx-auto aspect-square w-60 ">
              <Image
                alt={'image'}
                className="w-fit object-contain"
                height={320}
                src={'/images/auth-img.png'}
                width={440}
              />
            </div>
            <div className="mx-auto flex flex-col items-center justify-center">
              <h2 className="heading-5 ">Account Approval</h2>
              <p className="text-center text-sm  text-foreground/50">
                Gain unrestricted access by submitting the additional required
                KYC documentation.
              </p>
            </div>
          </motion.div>
        </div>
        <div className="flex w-full flex-1 flex-col gap-y-2">
          <motion.div
            className="flex w-full gap-2"
            variants={staggerContainerItemVariants}
          >
            <Input
              autoFocus
              label="First Name"
              name="firstName"
              placeholder="Enter first name"
              required={true}
              type="text"
              value={newAdminUser?.first_name}
              onChange={(e) => {
                updateDetails(STEPS[3], { first_name: e.target.value });
              }}
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Enter last name"
              required={true}
              type="text"
              value={newAdminUser?.last_name}
              onChange={(e) => {
                updateDetails(STEPS[3], { last_name: e.target.value });
              }}
            />
          </motion.div>

          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Email"
              name="new-email"
              placeholder="Enter user email address"
              required={true}
              type="text"
              value={newAdminUser?.email}
              onChange={(e) => {
                updateDetails(STEPS[3], { email: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            className="flex w-full gap-2"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Mobile Number"
              name="phone_number"
              placeholder="Enter mobile number"
              required={true}
              type="number"
              value={newAdminUser?.phone_number}
              onChange={(e) => {
                updateDetails(STEPS[3], { phone_number: e.target.value });
              }}
            />
            <Input
              label="Username"
              name="username"
              placeholder="Create username"
              required={true}
              type="text"
              value={newAdminUser?.username}
              onChange={(e) => {
                updateDetails(STEPS[3], { username: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              isInvalid={error?.onPassword}
              label="Password"
              name="new-password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              placeholder="Create New password"
              required={true}
              title="Must contain at least 8 characters, including uppercase letters, lowercase letters, and numbers"
              type="password"
              value={newAdminUser?.password}
              onChange={(e) => {
                updateDetails(STEPS[3], { password: e.target.value });
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              isInvalid={error?.onPassword}
              label="Confirm Password"
              name="password2"
              placeholder="Confirm New password"
              required={true}
              type="password"
              value={newAdminUser?.confirmPassword}
              onChange={(e) => {
                updateDetails(STEPS[3], { confirmPassword: e.target.value });
              }}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}
