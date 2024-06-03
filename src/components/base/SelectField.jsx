import { cn } from '@/lib/utils'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import React from 'react'

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  labelClasses,
  name,
  label,
  props,
  type,
  className,
}) {
  return (
    <div className="flex w-full flex-col items-start gap-1">
      {label && (
        <label
          htmlFor={name}
          className={cn(
            'block text-sm font-medium leading-6 text-slate-500',
            labelClasses,
          )}
        >
          {label}
        </label>
      )}
      <div
        className={`group relative flex w-full flex-col items-start justify-start gap-1`}
      >
        <select
          className={cn(
            `text-primary-900 group group relative h-[48px] w-full rounded-[8px] border border-slate-300 bg-transparent px-4 py-3         leading-normal outline-none placeholder:text-sm placeholder:italic
          placeholder:text-slate-300 focus:border-primary/80 focus:ring-primary/80`,
            className,
          )}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          id={name}
          type={type}
          {...props}
        >
          {/* OPTIONS ARRAY MUST BE AN ARRAY OF OBJECTS WITH ID, NAME AND VALUE PROPERTIES. */}
          {options &&
            options.map((item, idx) => (
              <option className="" key={idx} value={item?.id || item}>
                {item?.name || item}
              </option>
            ))}
        </select>
        <ChevronDownIcon
          className={cn(
            'group-focus:rotate- absolute right-4 top-4 h-5 w-5 opacity-50 transition-all duration-300  ease-in-out group-active:rotate-180',
          )}
        />
      </div>
    </div>
  )
}

export default SelectField
