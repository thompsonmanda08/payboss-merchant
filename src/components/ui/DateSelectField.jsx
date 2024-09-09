import { cn, formatDate } from '@/lib/utils'
import { DatePicker, DateRangePicker } from '@nextui-org/react'
import React, { useEffect } from 'react'
import {
  parseDate,
  today,
  now,
  getLocalTimeZone,
} from '@internationalized/date'
import { useDateFormatter } from '@react-aria/i18n'

const dateInputClassNames = {
  label: 'ml-1 text-sm font-medium text-slate-700 mb-0',
  base: 'gap-0',
  inputWrapper: cn(
    'focus:border-1 bg-red-500 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-primary/70 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[focus=true]:border-primary hover:border-primary/60 focus-within:hover:border-primary/60 focus-within:border-primary/60',
  ),
  input: 'focus:border-none',
}

const datePickerClasses = {
  calendar: 'rounded-md !text-primary',
  calendarContent: 'text-primary',
}

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
      classNames={datePickerClasses}
      dateInputClassNames={{ ...dateInputClassNames }}
      description={description}
      labelPlacement={labelPlacement || 'outside'}
      isRequired={props?.required}
      {...props}
    />
  )
}

export function DateRangePickerField({
  dateRange,
  setDateRange,
  className,
  label,
  defaultValue,
  description,
  labelPlacement,
  visibleMonths = 2,
  ...props
}) {
  const thisMonth = formatDate(new Date(), 'YYYY-MM-DD')
  const thirtyDaysAgoDate = new Date()
  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30)
  const thirtyDaysAgo = formatDate(thirtyDaysAgoDate, 'YYYY-MM-DD')

  const [value, setValue] = React.useState({
    start_date: parseDate(thirtyDaysAgo),
    end_date: parseDate(thisMonth),
  })

  let formatter = useDateFormatter({ dateStyle: 'long' })

  useEffect(() => {
    setDateRange({
      start_date: formatDate(
        value?.start_date.toDate(getLocalTimeZone()),
        'YYYY-MM-DD',
      ),
      end_date: formatDate(
        value?.end_date.toDate(getLocalTimeZone()),
        'YYYY-MM-DD',
      ),
      range: formatter.formatRange(
        value?.start_date.toDate(getLocalTimeZone()),
        value?.end_date.toDate(getLocalTimeZone()),
      ),
    })
  }, [value])

  return (
    <div className="flex w-full flex-col gap-y-2">
      <DateRangePicker
        label={label}
        showMonthAndYearPickers
        defaultValue={defaultValue}
        visibleMonths={visibleMonths}
        value={value}
        radius="md"
        description={description}
        labelPlacement={labelPlacement || 'outside'}
        isRequired={props?.required || props.isRequired}
        maxValue={today(getLocalTimeZone())}
        // minValue={today(getLocalTimeZone())} TODO: DATE ACCOUNT CREATED
        onChange={setValue}
        variant="bordered"
        className={cn('max-w-sm ', className)}
        classNames={{
          ...datePickerClasses,
          ...dateInputClassNames,
        }}
        calendarProps={{
          classNames: {
            base: 'bg-background',
            headerWrapper: 'pt-4 bg-background',
            prevButton: 'border-1 border-default-200 rounded-small',
            nextButton: 'border-1 border-default-200 rounded-small',
            gridHeader:
              'bg-background shadow-none border-b-1 border-default-100',
            cellButton: [
              'data-[today=true]:bg-default-100 data-[selected=true]:bg-transparent rounded-small',
              // start (pseudo)
              'data-[range-start=true]:before:rounded-l-small',
              'data-[selection-start=true]:before:rounded-l-small',
              // end (pseudo)
              'data-[range-end=true]:before:rounded-r-small',
              'data-[selection-end=true]:before:rounded-r-small',
              // start (selected)
              'data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:rounded-small',
              // end (selected)
              'data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:rounded-small',
            ],
          },
        }}
        {...props}
      />
      {/* <p className="text-sm text-default-500">
        Selected date:{' '}
        {value
          ? formatter.formatRange(
              value?.start_date?.toDate(getLocalTimeZone()),
              value?.end_date?.toDate(getLocalTimeZone()),
            )
          : '--'}
      </p> */}
    </div>
  )
}

export default DateSelectField
