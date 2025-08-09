"use client";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@heroui/react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type AutoCompleteFieldProps = Omit<
  AutocompleteProps,
  "children" | "onChange"
> & {
  options: {
    ID?: string;
    name: string;
    label?: string;
    [key: string]: any;
  }[];
  label?: string;
  listItemName: string;
  selector?: string;
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  classNames?: any;
  onErrorMessage?: any;
  placeholder?: string;
  errorText?: string;
};

function AutoCompleteField({
  options,
  label,
  listItemName, // CHOOSE THE VALUE TO BE DISPLAYED
  selector, // CHOOSE THE VALUE TO BE SELECTED
  value,
  onChange,
  className,
  classNames,
  onErrorMessage,
  placeholder = "Search...",

  errorText,
  ...props
}: AutoCompleteFieldProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col items-start",
        classNames?.wrapper,
      )}
    >
      {label && (
        <label
          className={cn(
            "ml-1 text-sm font-medium text-foreground/70",
            {
              "opacity-50": props?.isDisabled,
            },
            classNames?.label,
          )}
          htmlFor={label}
        >
          {label}{" "}
          {props?.required && <span className="font-bold text-red-500">*</span>}
        </label>
      )}
      <Autocomplete
        // label={label}
        // labelPlacement="outside"
        classNames={{
          base: cn("outline-none border-none", classNames?.base),
          listbox: "",
          popoverContent: "rounded-md text-foreground-700 font-medium",
          // selectorIcon: "w-4 h-4",
        }}
        defaultItems={options}
        inputProps={{
          classNames: {
            input: cn(
              "-ml-2 focus:ring-none border-none outline-none focus:border-none focus:outline-none focus-visible:ring-none px-2 data-[focus=true]:border-none focus:ring-transparent",
              {
                "cursor-not-allowed": props?.isDisabled,
              },
            ),

            inputWrapper: cn(
              "focus:border-1 focus:border-primary/70 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 flex h-10 w-full rounded-md border border-input focus-active:border-primary bg-transparent data-[focus=true]:border-primary data-[open=true]:border-primary data-[hover=true]:border-primary/70",
              {
                "cursor-not-allowed": props?.isDisabled,
                "border-red-500": onErrorMessage && props?.isInvalid,
              },
              classNames?.trigger,
            ),
          },
        }}
        placeholder={placeholder}
        selectedKey={value}
        variant="bordered"
        onSelectionChange={(key) => onChange?.(String(key))}
        {...props}
      >
        {(item: any) => (
          <AutocompleteItem
            key={
              item?.[String(selector)] ||
              item.key ||
              item?.id ||
              item?.ID ||
              item?.value ||
              item
            }
          >
            {item?.[listItemName] || item.label || item?.name || item}
          </AutocompleteItem>
        )}
      </Autocomplete>

      {errorText && props.isInvalid && (
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

export default AutoCompleteField;
