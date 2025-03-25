"use client";
import { cn } from "@/lib/utils";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React from "react";

function AutoCompleteField({
  options,
  label,
  listItemName,
  value,
  onChange,
  className,
  classNames,
  onErrorMessage,
  placeholder = "Search...",
  ...props
}) {
  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col items-start",
        classNames?.wrapper
      )}
    >
      {label && (
        <label
          htmlFor={label}
          className={cn(
            "ml-1 text-sm font-medium text-foreground/70",
            {
              "opacity-50": props?.isDisabled,
            },
            classNames?.label
          )}
        >
          {label}{" "}
          {props?.required && <span className="font-bold text-red-500">*</span>}
        </label>
      )}
      <Autocomplete
        // label={label}
        // labelPlacement="outside"
        placeholder={placeholder}
        selectedKey={value}
        onSelectionChange={onChange}
        defaultItems={options}
        variant="bordered"
        classNames={{
          base: cn("outline-none border-none", classNames?.base),
          listbox: "",
          popoverContent: "rounded-md text-foreground-700 font-medium",
          selectorIcon: "w-4 h-4",
        }}
        inputProps={{
          classNames: {
            input:
              "-ml-2 focus:ring-none border-none outline-none focus:border-none focus:outline-none focus-visible:ring-none data-[focus=true]:border-none focus:ring-transparent",

            inputWrapper: cn(
              "focus:border-1 focus:border-primary/70 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 flex h-10 w-full rounded-md border border-input focus-active:border-primary bg-transparent data-[focus=true]:border-primary data-[open=true]:border-primary data-[hover=true]:border-primary/70",
              classNames?.trigger
            ),
          },
        }}
        {...props}
      >
        {(item) => (
          <AutocompleteItem
            key={item.key || item?.id || item?.ID || item?.value || item}
          >
            {item.label || item?.name || item[listItemName] || item}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}

export default AutoCompleteField;
