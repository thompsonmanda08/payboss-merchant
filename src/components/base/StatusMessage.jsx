"use client";
import React from "react";
import { motion } from "framer-motion";

function StatusMessage({ error = false, message = "Error Message" }) {
  return (
    <motion.div
      whileInView={{
        opacity: [0, 1],
        // scale: [0, 1],
        transition: {
          duration: 0.5,
          ease: "easeInOut",
        },
      }}
      className={`${
        error
          ? "bg-rose-500/10 text-rose-600"
          : "bg-green-500/10 text-green-600"
      } p-4 flex justify-center items-center rounded-lg my-2 min-h-[60px] w-full max-w-sm xl:max-w-md px-5`}
    >
      <p className={`text-xs md:text-sm font-semibold`}>{message}</p>
    </motion.div>
  );
}

export default StatusMessage;
