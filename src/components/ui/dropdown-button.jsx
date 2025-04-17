"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  Button,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

import { capitalize, cn } from "@/lib/utils";

const buttonClasses =
  "items-center justify-between gap-2 rounded-lg font-medium capitalize text-primary shadow-sm dark:bg-primary-400/5 bg-primary/10";

export default function DropdownButton({
  className,
  classNames,
  dropDownItems,
  isIconOnly,
  backdropBlur,
  selectedValue,
  variant,
  children,
  ...props
}) {
  const { trigger, wrapper, innerWrapper, dropdownItem } = classNames || "";

  const iconClasses =
    "text-foreground/50 pointer-events-none hover:text-primary data-[hover=true]:text-primary data-[focus=true]:text-primary flex-shrink-0 w-5 aspect-square";

  return (
    <Dropdown
      backdrop={backdropBlur ? "blur" : ""}
      className={cn("z-10", wrapper, className)}
    >
      <DropdownTrigger>
        <Button
          className={cn(
            "border-[1px]] mb-1 h-auto max-h-[60px] w-full items-center justify-start border-border border hover:border-primary bg-transparent p-2 capitalize",
            trigger,
          )}
          isIconOnly={isIconOnly}
          variant="bordered"
        >
          {children || selectedValue || (
            <EllipsisHorizontalIcon className="h-6 w-6 text-foreground/50" />
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dynamic Actions"
        className={innerWrapper}
        classNames={{
          base: "overflow-visible", // REQUIRED FOR SUB MENU ITEMS
        }}
        items={dropDownItems}
        variant={variant || "faded"}
        onClose
        {...props}
      >
        {(item) => (
          <DropdownItem
            key={item?.key}
            className={cn(
              "group w-[260px] hover:bg-primary/10 hover:text-primary dark:hover:bg-default focus:bg-primary/10 dark:data-[hover=true]:border-primary/10 data-[hover=true]:border-border data-[hover=true]:bg-primary/10 data-[hover=true]:text-primary overflow-visible",
              {
                "text-danger": item?.key === "delete",
              },
              dropdownItem,
            )}
            color={item?.key === "new" ? "primary" : "default"}
            description={item?.description}
            endContent={
              item?.subMenuItems?.length > 0 ? (
                <ChevronRightIcon className="aspect-square h-5 w-5" />
              ) : (
                item?.endContent || undefined
              )
            }
            href={item?.href}
            shortcut={item.shortcut}
            showDivider={item?.showDivider}
            startContent={
              item?.Icon ? <item.Icon className={cn(iconClasses)} /> : undefined
            }
            onPress={() => {
              if (item?.href) {
                if (item?.href?.includes("http")) {
                  window.open(item?.href, "_blank");
                } else {
                  window.location.href = item?.href;
                }

                return;
              }
            }}
          >
            {item?.label || item?.name || ""}

            {item?.subMenuItems && (
              <motion.div
                animate={{
                  opacity: [0, 1],
                }}
                className={cn(
                  "absolute -top-1 left-0 group-hover:left-[100%] z-50 hidden max-h-96 w-full min-w-[200px] p-2 transition-all duration-300 ease-in-out group-hover:flex",
                )}
              >
                <Card className="no-scrollbar w-full overflow-y-auto p-2">
                  <motion.ul className="flex w-full flex-col text-sm font-semibold transition-all duration-300 ease-in-out">
                    {item.subMenuItems.map((subItem, index) => (
                      <Button
                        key={subItem.key || index}
                        // as={Link}
                        // href={subItem?.href}
                        className="group my-auto h-14 items-start justify-start gap-2 rounded-md bg-transparent p-2 text-medium text-foreground/70 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[hover=true]:border-border data-[hover=true]:bg-primary/10 data-[hover=true]:text-primary dark:hover:bg-default dark:data-[hover=true]:border-primary/10"
                        startContent={
                          subItem?.Icon ? (
                            <subItem.Icon className={cn(iconClasses, "mt-1")} />
                          ) : undefined
                        }
                        onPress={(e) => {
                          subItem?.onSelect();
                          e.continuePropagation();
                        }}
                      >
                        <div className="flex flex-col items-start justify-start font-medium">
                          {subItem.label}
                          {subItem?.description && (
                            <p className="mr-auto max-w-[170px] truncate text-[11px] font-normal">
                              {subItem.description}
                            </p>
                          )}
                        </div>
                      </Button>
                    ))}
                  </motion.ul>
                </Card>
              </motion.div>
            )}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

export function SingleSelectionDropdown({
  dropdownItems,
  selectedKeys,
  setSelectedKeys,
  selectedValue,
  name,
  selectionMode = "single",
  disallowEmptySelection = false,
  className,
  classNames,
  buttonVariant = "bordered",
  startContent,
  listItemName,
  ...props
}) {
  const { trigger, innerWrapper, dropdownItem, chevronIcon, base } =
    classNames || "";

  return (
    <Dropdown
      className={cn("min-w-max", className)}
      classNames={{
        base: cn("min-w-max", base),
      }}
    >
      <DropdownTrigger>
        <Button
          className={cn(buttonClasses, trigger)}
          startContent={startContent}
          endContent={
            <ChevronDownIcon
              className={cn(
                "h-4 w-4  focus-within:rotate-180 focus:rotate-180 ",
                chevronIcon,
              )}
            />
          }
          variant={buttonVariant}
        >
          {`${name || selectedValue}`}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        className={innerWrapper}
        disallowEmptySelection={disallowEmptySelection}
        items={dropdownItems}
        selectedKeys={selectedKeys}
        selectionMode={selectionMode}
        variant="flat"
        onSelectionChange={setSelectedKeys}
        {...props}
      >
        {dropdownItems.map((item) => {
          let ItemLabel = capitalize(
            item.name || item.label || item?.[listItemName] || item,
          );
          let itemValue =
            item.value ||
            item?.uid ||
            item?.ID ||
            item?.id ||
            item?.key ||
            item;

          return (
            <DropdownItem
              key={itemValue}
              className={cn(
                "!focus-within:bg-primary-100 !hover:bg-primary-100 !focus:bg-primary-100 !data-[hover=true]:border-primary-200 !data-[selectable=true]:focus:bg-primary-100 !data-[focus=true]:bg-primary-100 !data-[hover=true]:bg-primary-100 !data-[hover=true]:text-primary !data-[selected=true]:text-primary group min-w-max capitalize !data-[hover=true]:text-primary",

                dropdownItem,
              )}
              description={item?.description}
            >
              {ItemLabel}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
}

export function SimpleDropdown({
  dropdownItems,
  selectedKeys,
  setSelectedKeys,
  name,
  selectionMode = "single",
  disallowEmptySelection = false,
  closeOnSelect = true,
  className,
  classNames,
  variant = "flat",
  color = "primary",
  isIconOnly,

  listItemName,
  ...props
}) {
  const { trigger, innerWrapper, dropdownItem, chevronIcon } = classNames || "";

  return (
    <Dropdown className={cn("relative min-w-max", className)}>
      <DropdownTrigger className="hidden sm:flex">
        <Button
          className={cn(buttonClasses, trigger)}
          color={color}
          endContent={
            <ChevronDownIcon
              className={cn(
                "h-4 w-4 focus-within:rotate-180 focus:rotate-180 ",
                chevronIcon,
              )}
            />
          }
          isIconOnly={isIconOnly}
          variant={variant}
        >
          {name}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={"Simple Dropdown - " + name}
        className={innerWrapper}
        closeOnSelect={closeOnSelect}
        disallowEmptySelection={disallowEmptySelection}
        selectedKeys={selectedKeys}
        selectionMode={selectionMode}
        onSelectionChange={setSelectedKeys}
        {...props}
      >
        {dropdownItems.map((item) => (
          <DropdownItem
            key={item?.uid || item?.ID || item?.id || item?.key || item}
            className={cn(
              "!focus-within:bg-primary-100 !hover:bg-primary-100 !focus:bg-primary-100 !data-[hover=true]:border-primary-200 !data-[selectable=true]:focus:bg-primary-100 !data-[focus=true]:bg-primary-100 !data-[hover=true]:bg-primary-100 !data-[hover=true]:text-primary !data-[selected=true]:text-primary group min-w-max capitalize",

              dropdownItem,
            )}
            href={item?.href || ""}
          >
            {capitalize(
              item.name || item.label || item?.[listItemName] || item,
            )}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
