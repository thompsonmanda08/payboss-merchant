"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import CardHeader from "@/components/base/card-header";

const modalVariants = {
  hidden: { opacity: 0, y: "-50%", scale: 0.8 },
  visible: { opacity: 1, y: "0%", scale: 1 },
  exit: { opacity: 0, y: "-50%", scale: 0.8 },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

function Modal({
  show,
  onConfirm,
  onClose,
  confirmText,
  cancelText,
  children,
  width,
  height,
  title,
  infoText,
  loading,
  disableAction,
  removeCallToAction,
  isDismissible = true,
  className,
  classNames,
}) {
  const [isOpen, setIsOpen] = useState(show || false);
  const [noCallToAction, setNoCallToAction] = useState(
    removeCallToAction || false
  );

  useEffect(() => {
    setIsOpen(show);
  }, [show]);

  const handleClose = (e) => {
    e?.stopPropagation();
    setIsOpen(false);
    setTimeout(onClose, 250); // Match the duration of the exit animation
  };

  function dismissModal() {
    if (isDismissible) {
      handleClose();
    }
  }

  const { overlay, base, card, container } = classNames || "";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate="visible"
          className={cn(
            "absolute inset-0 z-50 flex h-screen w-full items-center justify-center backdrop-blur-sm bg-foreground-800/5",
            overlay
          )}
          exit="exit"
          initial="hidden"
          transition={{ duration: 0.25 }}
          variants={overlayVariants}
          onClick={dismissModal}
        >
          <motion.div
            animate="visible"
            className={cn(
              "z-50 flex w-full flex-col items-center justify-start gap-1 rounded-lg bg-[#ffffff] p-4",
              className,
              base,
              card
            )}
            exit="exit"
            initial="hidden"
            style={{
              maxWidth: width ? `${width}px` : "380px",
              minHeight: height ? `${height}px` : "180px",
              // height: height ? `${height}px` : 'auto',
            }}
            transition={{ duration: 0.25 }}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader
              handleClose={handleClose}
              infoText={infoText}
              title={title}
            />
            {/* MODAL CONTENT */}
            <div
              className={cn(
                "mb-2 mt-5 flex h-full w-full flex-grow flex-col",
                container
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
            {!noCallToAction && (
              <div className="mt-auto flex w-full justify-end gap-3">
                <Button className="" color="danger" onClick={handleClose}>
                  {cancelText || "Cancel"}
                </Button>
                <Button
                  className=" px-6"
                  disabled={loading || disableAction}
                  isLoading={loading}
                  onClick={onConfirm}
                >
                  {confirmText || "Done"}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
