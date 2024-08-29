import { cn } from '@/lib/utils'
import React from 'react'
import { Select, SelectItem } from '@nextui-org/react'

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
  wrapperClassName,
  prefilled = false,
  ...props
}) {
  return (
    <div
      className={cn(
        'flex w-full max-w-md flex-col items-start',
        wrapperClassName,
      )}
    >
      {label && (
        <label
          htmlFor={name}
          className={cn('ml-1 text-sm font-medium text-slate-700', {
            'opacity-50': props?.isDisabled,
          })}
        >
          {label}{' '}
          {props?.required && <span className="font-bold text-red-500">*</span>}
        </label>
      )}
      <div
        className={`group relative flex w-full flex-col items-start justify-start gap-1`}
      >
        <Select
          className={cn('font-medium', className)}
          classNames={{
            base: 'text-lg shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground ',
            value: 'font-semibold text-slate-700 capitalize',
            trigger:
              'focus:border-1 focus:border-primary/70 focus:outline-none focus-visible:outline-none focus-visible:ring-1  focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 flex h-10 w-full rounded-md border border-input focus-active:border-primary bg-transparent data-[focus=true]:border-primary data-[open=true]:border-primary data-[hover=true]:border-primary/70',
            listbox: 'font-medium',
            popoverContent:
              'font-medium rounded-md text-neutral-7000 font-medium',
            selectorIcon: 'w-4 h-4',
          }}
          variant="bordered"
          placeholder={placeholder || 'Select'}
          selectedKeys={prefilled ? [value] : undefined}
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
          name={name}
          id={name}
          isRequired={props?.required}
          {...props}
        >
          {/* OPTIONS ARRAY MUST BE AN ARRAY OF OBJECTS WITH ID, NAME AND VALUE PROPERTIES. */}
          {options &&
            options.map((item, idx) => {
              let ItemValue =
                item?.key ||
                item?.id ||
                item?.ID ||
                item?.index?.toString() ||
                item
              let ItemLabel =
                item?.name || item?.label || item?.[listItemName] || item
              return (
                <SelectItem
                  className="font-medium"
                  classNames={{
                    base: '__OPTION__  bg-transparent data-[hover=true]:bg-primary/20 data-[selected=true]:text-white data-[selected=true]:bg-primary data-[selected=true]:font-semibold data-[selectable=true]:focus:text-primary data-[selectable=true]:focus:bg-primary/20 data-[selectable=true]:hover:text-primary data-[selected=true]:focus:text-white data-[selectable=true]:hover:bg-primary/20 data-[selectable=true]:font-[600] data-[selected=true]:focus:bg-primary data-[hover=true]:hover:text-white ',
                  }}
                  key={ItemValue}
                  value={ItemValue}
                >
                  {ItemLabel}
                </SelectItem>
              )
            })}
        </Select>
      </div>
    </div>
  )
}

export default SelectField
