"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Tooltip = ({ children, content }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            ref={tooltipRef}
            animate={{ opacity: 1, y: -68 }}
            className="whitespace-no-wrap absolute z-10 min-w-[250px] overflow-hidden rounded-lg bg-primary p-2 text-xs text-white shadow-lg"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            style={{ top: "-20", right: "100%", transform: "translateX(-50%)" }}
            transition={{ duration: 0.2 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
