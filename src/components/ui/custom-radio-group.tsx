import { useState } from "react";

import { cn } from "@/lib/utils";

const Option = (props: any) => {
  const isSelected = props.index === props.selectedIndex;

  return (
    <div
      className={cn(
        `mx-1 flex w-full min-w-fit flex-1 cursor-pointer  items-center gap-2 rounded-md p-2  py-3 text-xs font-bold text-slate-600 transition duration-300 hover:shadow-md lg:text-sm lg:font-normal `,
        props.className,
        { "bg-sky-100/20": isSelected },
        `${isSelected && props?.selected}`,
      )}
      onClick={() => props.onSelect(Number(props.index))}
    >
      {/* OUTLINE CIRCLE */}
      <div
        className={cn(
          `flex h-6 w-6 items-center justify-center rounded-full border transition`,
          { "border-2 border-primary": isSelected },
        )}
      >
        {/* SOLID CIRCLE */}
        <div
          className={cn(
            `aspect-square h-[80%] w-[80%] rounded-full border transition`,
            { "bg-primary": isSelected },
          )}
        />
      </div>
      {props.children}
    </div>
  );
};

function CustomRadioGroup({
  options,
  onChange,
  value = 0,
  labelText,
  className,
  classNames,
}: {
  options: string[];
  onChange?: any;
  value?: number;
  labelText?: string;
  className?: string;
  classNames?: {
    base?: string;
    wrapper?: string;
    label?: string;
    selected?: string;
  };
}) {
  const [selectedIndex, setSelectedIndex] = useState(value);

  function onSelect(index: number) {
    setSelectedIndex(index);
    onChange && onChange(index);
  }

  const { base, wrapper, label, selected } = classNames || {};

  return (
    <div className={cn("flex w-full flex-col gap-y-1", wrapper)}>
      {labelText && (
        <label
          className={cn(
            "-mb-1 ml-1.5 text-sm font-medium tracking-wide text-foreground/50",
            label,
          )}
        >
          {labelText}
        </label>
      )}
      <div
        className={cn(
          "flex min-w-full flex-1 flex-row justify-between py-2",
          base,
        )}
      >
        {options.map((el, index) => (
          <Option
            key={index}
            className={className}
            index={index}
            selected={selected}
            selectedIndex={selectedIndex}
            onSelect={(index: number) => onSelect(index)}
          >
            {el}
          </Option>
        ))}
      </div>
    </div>
  );
}

export default CustomRadioGroup;
