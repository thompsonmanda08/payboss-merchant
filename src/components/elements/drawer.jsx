"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardHeader } from "../base";
import { cn } from "@/lib/utils";

const drawerVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 300,
      damping: 30,
      ease: "easeInOut",
    },
  },
  exit: { x: "100%", opacity: 0 },
};

const Drawer = ({ isOpen, onClose, title, infoText, className, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-y-0 right-0 z-50 flex max-w-full bg-foreground-500/20"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={drawerVariants}
          >
            <div
              className={cn(
                "flex h-full w-full max-w-md flex-col overflow-y-auto rounded-lg bg-background p-4 shadow-xl",
                className
              )}
            >
              <CardHeader
                title={title}
                infoText={infoText}
                handleClose={onClose}
              />

              <div className="mt-4 w-full flex-1 sm:px-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
