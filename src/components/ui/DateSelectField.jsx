import { cn } from '@/lib/utils'
import { DatePicker } from '@nextui-org/react'
import React from 'react'
import {
  parseDate,
  today,
  now,
  getLocalTimeZone,
} from '@internationalized/date'

function DateSelectField({
  label,
  className,
  description,
  labelPlacement,
  onChange,
  defaultValue,
  value,
  ...props
}) {
  return (
    <DatePicker
      label={label}
      variant="bordered"
      value={value ? parseDate(value) : undefined}
      // hideTimeZone
      showMonthAndYearPickers
      defaultValue={defaultValue}
      onChange={onChange}
      className={cn('max-w-sm ', className)}
      classNames={{
        calendar: 'rounded-md !text-primary',
        calendarContent: 'text-primary',
      }}
      dateInputClassNames={{
        label: 'ml-1 text-sm font-medium text-slate-700 mb-0',
        base: 'gap-0',
        inputWrapper: cn(
          'focus:border-1 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-primary/70 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[focus=true]:border-primary hover:border-primary/60 focus-within:hover:border-primary/60 focus-within:border-primary/60',
        ),
        input: 'focus:border-none',
      }}
      description={description}
      labelPlacement={labelPlacement || 'outside'}
      isRequired={props?.required}
      {...props}
    />
  )
}

export default DateSelectField
