import { Select, SelectItem, SelectProps } from '@heroui/react';

import { cn } from '@/lib/utils';

type SelectComProps = Partial<SelectProps> & {
  value?: any;
  // onChange?: (value: string) => void;
  options?: any;
  placeholder?: string;
  listItemName?: string; // CHOOSE THE VALUE TO BE DISPLAYED
  selector?: string; // CHOOSE THE VALUE TO BE SELECTED
  name?: string;
  label?: string;
  type?: string;
  selectedItem?: any;
  defaultValue?: any;
  className?: string;
  classNames?: any;
  wrapperClassName?: string;
  isInvalid?: boolean;
  prefilled?: boolean;
  isDisabled?: boolean;
};

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  listItemName, // CHOOSE THE VALUE TO BE DISPLAYED
  selector, // CHOOSE THE VALUE TO BE SELECTED
  name,
  label,
  type,
  selectedItem,
  defaultValue,
  className,
  classNames,
  wrapperClassName,

  isInvalid,
  prefilled = false,
  ...props
}: SelectComProps) {
  return (
    <div
      className={cn(
        'flex w-full max-w-md flex-col gap-1 items-start',
        wrapperClassName,
        classNames?.wrapper,
      )}
    >
      {label && (
        <label
          className={cn(
            'ml-1 text-sm font-medium text-foreground/70',
            {
              'opacity-50': props?.isDisabled || props?.disabled,
            },
            classNames?.label,
          )}
          htmlFor={name}
        >
          {label}{' '}
          {props?.required && <span className="font-bold text-red-500">*</span>}
        </label>
      )}
      <div
        className={`group relative flex w-full flex-col items-start justify-start gap-1`}
      >
        <Select
          size="lg"
          className={cn('font-medium', className)}
          classNames={{
            base: cn(
              'text-lg shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium text-foreground placeholder:text-muted-foreground',
              classNames?.base,
            ),
            value: cn(
              'text-foreground group-data-[has-value=true]:text-foreground font-inter tracking-tight capitalize',
              classNames?.value,
            ),
            trigger: cn(
              cn(
                'focus:border-1 focus:border-primary/70 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 flex h-10 w-full rounded-md border border-input focus-active:border-primary bg-transparent data-[focus=true]:border-primary data-[open=true]:border-primary capitalize data-[hover=true]:border-primary/70',
                classNames?.trigger,
              ),
              // {
              //   'border-red-500 focus:border-red-500/70 focus-visible:ring-red-500/30':
              //     isInvalid,
              // },
            ),

            listbox: 'font-medium',
            popoverContent: 'rounded-md text-foreground-700 font-medium',
            selectorIcon: 'w-4 h-4',
          }}
          isInvalid={isInvalid}
          isRequired={props?.required}
          name={name}
          placeholder={placeholder || 'Choose an option'}
          selectedKeys={Boolean(prefilled) ? [value] : undefined}
          value={value}
          variant="bordered"
          onChange={onChange}
          {...props}
        >
          {/* OPTIONS ARRAY MUST BE AN ARRAY OF OBJECTS WITH ID, NAME AND VALUE PROPERTIES. */}
          {options &&
            options.map((item: any) => {
              const ItemValue =
                item?.[String(selector)] ||
                item?.key ||
                item?.id ||
                item?.ID ||
                item?.index?.toString() ||
                item;

              const ItemLabel =
                item?.[String(listItemName)] ||
                item?.name ||
                item?.label ||
                item;

              return (
                <SelectItem
                  key={ItemValue}
                  className="font-medium"
                  classNames={{
                    base: 'data-[hover=true]:bg-primary/10 data-[selected=true]:text-white data-[selected=true]:bg-primary data-[selected=true]:font-semibold data-[selectable=true]:focus:text-primary data-[selectable=true]:focus:bg-primary/20 data-[selectable=true]:hover:text-primary data-[selected=true]:focus:text-white data-[selectable=true]:hover:bg-primary/20 data-[selectable=true]:font-[600] data-[selected=true]:focus:bg-primary data-[hover=true]:hover:text-white capitalize',
                  }}
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
