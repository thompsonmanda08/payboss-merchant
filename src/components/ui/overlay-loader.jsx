"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

import Spinner from "./custom-spinner";

const modalVariants = {
  hidden: { opacity: 0, y: "-20%", scale: 0.5 },
  visible: { opacity: 1, y: "0%", scale: 1 },
  exit: { opacity: 0, y: "-20%", scale: 0.5 },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

function OverlayLoader({ show, className, classNames }) {
  const [isOpen, setIsOpen] = useState(show || false);

  useEffect(() => {
    setIsOpen(show);

    return () => {
      setIsOpen(false);
    };
  }, [show]);

  const { wrapper, conatiner, spinner } = classNames || "";

  return (
    isOpen && (
      <AnimatePresence>
        <motion.div
          animate="visible"
          className={cn(
            "absolute inset-0 z-[9999999] flex h-screen w-full items-center justify-center bg-black/50 backdrop-blur-sm",
            wrapper
          )}
          exit="exit"
          initial="hidden"
          transition={{ duration: 0.25 }}
          variants={overlayVariants}
        >
          <motion.div
            animate="visible"
            className={cn(
              "grid h-full w-full place-content-center place-items-center",
              className,
              conatiner
            )}
            exit="exit"
            initial="hidden"
            transition={{ duration: 0.2 }}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <Spinner className={spinner} color="#ffffff" size={150} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  );
}

export default OverlayLoader;
