import { Select, SelectItem } from "@heroui/react";

import { cn } from "@/lib/utils";

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  listItemName,
  name,
  label,
  type,
  selectedItem,
  defaultValue,
  className,
  classNames,
  wrapperClassName,

  onError,
  prefilled = false,
  ...props
}) {
  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col items-start",
        wrapperClassName,
        classNames?.wrapper
      )}
    >
      {label && (
        <label
          className={cn(
            "ml-1 text-sm font-medium text-foreground/70",
            {
              "opacity-50": props?.isDisabled,
            },
            classNames?.label
          )}
          htmlFor={name}
        >
          {label}{" "}
          {props?.required && <span className="font-bold text-red-500">*</span>}
        </label>
      )}
      <div
        className={`group relative flex w-full flex-col items-start justify-start gap-1`}
      >
        <Select
          className={cn("font-medium", className)}
          classNames={{
            base: cn(
              "text-lg shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium text-foreground placeholder:text-muted-foreground",
              classNames?.base
            ),
            value: cn(
              "text-foreground group-data-[has-value=true]:text-foreground font-inter tracking-tight capitalize",
              classNames?.value
            ),
            trigger: cn(
              cn(
                "focus:border-1 focus:border-primary/70 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 flex h-10 w-full rounded-md border border-input focus-active:border-primary bg-transparent data-[focus=true]:border-primary data-[open=true]:border-primary capitalize data-[hover=true]:border-primary/70",
                classNames?.trigger
              )
              // {
              //   'border-red-500 focus:border-red-500/70 focus-visible:ring-red-500/30':
              //     onError,
              // },
            ),
            placeholder: cn("text-muted-foreground", classNames?.placeholder),
            listbox: "font-medium",
            popoverContent: "rounded-md text-foreground-700 font-medium",
            selectorIcon: "w-4 h-4",
          }}
          defaultValue={defaultValue}
          id={name}
          isInvalid={onError}
          isRequired={props?.required}
          name={name}
          placeholder={placeholder || "Choose an option"}
          selectedKeys={Boolean(prefilled) ? [value] : undefined}
          value={value}
          variant="bordered"
          onChange={onChange}
          {...props}
        >
          {/* OPTIONS ARRAY MUST BE AN ARRAY OF OBJECTS WITH ID, NAME AND VALUE PROPERTIES. */}
          {options &&
            options.map((item) => {
              let ItemValue =
                item?.key ||
                item?.id ||
                item?.ID ||
                item?.index?.toString() ||
                item;

              let ItemLabel =
                item?.name || item?.label || item?.[listItemName] || item;

              return (
                <SelectItem
                  key={ItemValue}
                  className="font-medium"
                  classNames={{
                    base: "data-[hover=true]:bg-primary/10 data-[selected=true]:text-white data-[selected=true]:bg-primary data-[selected=true]:font-semibold data-[selectable=true]:focus:text-primary data-[selectable=true]:focus:bg-primary/20 data-[selectable=true]:hover:text-primary data-[selected=true]:focus:text-white data-[selectable=true]:hover:bg-primary/20 data-[selectable=true]:font-[600] data-[selected=true]:focus:bg-primary data-[hover=true]:hover:text-white capitalize",
                  }}
                  value={ItemValue}
                >
                  {ItemLabel}
                </SelectItem>
              );
            })}
        </Select>
      </div>
    </div>
  );
}

export default SelectField;
