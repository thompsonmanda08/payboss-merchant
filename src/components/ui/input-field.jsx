import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(
  (
    {
      className,
      type,
      label,
      name,
      classNames,
      onError,
      error,
      maxLength,
      max,
      min,
      isDisabled,
      errorText = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          "flex w-full max-w-lg flex-col",

          classNames?.wrapper,
          {
            "cursor-not-allowed opacity-50": isDisabled,
          },
        )}
      >
        {label && (
          <label
            className={cn(
              "pl-1 text-sm font-medium text-nowrap text-foreground/70",
              {
                "text-red-500": onError,
              },
            )}
            htmlFor={name}
          >
            {label}{" "}
            {props?.required && (
              <span className="font-bold text-red-500"> *</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-1 focus:border-primary/70 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
            {
              "border-red-500 focus:border-red-500/70 focus-visible:ring-red-500/30":
                onError,
            },
            className,
            classNames?.input,
          )}
          disabled={isDisabled}
          id={name}
          maxLength={maxLength}
          max={max}
          min={min}
          name={name}
          type={type}
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
  },
);

Input.displayName = "Input";

export { Input };
