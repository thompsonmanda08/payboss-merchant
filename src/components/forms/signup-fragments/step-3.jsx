//BUSINESS REGISTRATION STATUS
"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input-field";
import { motion } from "framer-motion";
import { staggerContainerItemVariants } from "@/lib/constants";
import useAuthStore from "@/context/auth-store";
import { STEPS } from "../signup-form";
import Image from "next/image";
import CardHeader from "@/components/base/CardHeader";

// CREATE NEW ADMIN USER
export default function Step4({ updateDetails, backToStart }) {
  const { newAdminUser, error, setError } = useAuthStore();

  useEffect(() => {
    updateDetails(STEPS[4], { role: "owner", changePassword: false });
  }, []);

  return (
    <>
      <CardHeader
        handleClose={() => backToStart()}
        title="Create New Admin User"
        infoText={"Create a new admin user to manage your business on PayBoss."}
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
                src={"/images/auth-img.png"}
                alt={"image"}
                width={440}
                height={320}
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
              type="text"
              label="First Name"
              name="firstName"
              placeholder="Enter first name"
              autoFocus
              value={newAdminUser?.first_name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[4], { first_name: e.target.value });
              }}
            />
            <Input
              type="text"
              label="Last Name"
              placeholder="Enter last name"
              name="lastName"
              value={newAdminUser?.last_name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[4], { last_name: e.target.value });
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
              name="new-email"
              placeholder="Enter user email address"
              required={true}
              value={newAdminUser?.email}
              onChange={(e) => {
                updateDetails(STEPS[4], { email: e.target.value });
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
              placeholder="Enter mobile number"
              value={newAdminUser?.phone_number}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[4], { phone_number: e.target.value });
              }}
            />
            <Input
              type="text"
              label="Username"
              name="username"
              placeholder="Create username"
              value={newAdminUser?.username}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[4], { username: e.target.value });
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
              name="new-password"
              placeholder="Create New password"
              value={newAdminUser?.password}
              onError={error?.onPassword}
              error={error}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[4], { password: e.target.value });
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
              placeholder="Confirm New password"
              type="password"
              name="password2"
              value={newAdminUser?.confirmPassword}
              onError={error?.onPassword}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[4], { confirmPassword: e.target.value });
              }}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}
