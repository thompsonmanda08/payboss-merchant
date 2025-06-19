import * as React from "react";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

function Textarea({
  label,
  className,
  onError,
  errorText,
  classNames,
  isDisabled,
  ...props
}) {
  return (
    <div className={cn(classNames?.wrapper)}>
      {label && (
        <label
          className={cn(
            "pl-1 text-sm font-medium text-nowrap text-foreground/70",
            {
              "text-red-500": onError || props?.isInvalid,
              "opacity-50": props?.isDisabled || props?.disabled,
            }
          )}
          htmlFor={props?.name}
        >
          {label}{" "}
          {props?.required && (
            <span className="font-bold text-red-500"> *</span>
          )}
        </label>
      )}
      <textarea
        name={props?.name}
        data-slot="textarea"
        disabled={props?.isDisabled || props?.disabled}
        className={cn(
          "flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-1 focus:border-primary/70 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          {
            "border-red-500 focus:border-red-500/70 focus-visible:ring-red-500/30":
              onError,
            "opacity-50": props?.isDisabled || props?.disabled,
          },
          className,
          classNames?.base
        )}
        {...props}
      />
      {errorText && onError && (
        <motion.span
          className={cn("ml-1 text-xs text-red-500", classNames?.errorText)}
          whileInView={{
            scale: [0, 1],
            opacity: [0, 1],
            transition: { duration: 0.3 },
          }}
        >
          {errorText}
        </motion.span>
      )}
    </div>
  );
}

export { Textarea };
