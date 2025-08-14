'use client';
import {
  DatePicker,
  DateRangePicker,
  DateRangePickerProps,
  DatePickerProps,
} from '@heroui/react';
import {
  parseDate,
  today,
  getLocalTimeZone,
  CalendarDate,
} from '@internationalized/date';
import { useDateFormatter } from '@react-aria/i18n';
import React, { useEffect } from 'react';

import { cn, formatDate } from '@/lib/utils';

export const dateInputClassNames = {
  label: 'ml-1 text-sm font-medium text-foreground/70 mb-0',
  base: 'gap-0',
  inputWrapper: cn(
    'focus:border-1 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-primary/70 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[focus=true]:border-primary hover:border-primary/60 focus-within:hover:border-primary/60 focus-within:border-primary/60',
  ),
};

export const datePickerClasses = {
  calendar: 'rounded-md !text-primary',
  calendarContent: 'text-primary',
};

function DateSelectField({
  label,
  className,
  classNames,
  description,
  labelPlacement,
  onError,
  onChange,
  defaultValue,
  value,
  disabled,
  required,
  ...props
}: DatePickerProps & {
  label?: string;
  className?: string;
  classNames?: any;
  description?: string;
  labelPlacement?: string;
  onError?: boolean;
  disabled?: boolean;
  required?: boolean;
  onChange?: any;
  defaultValue?: any;
  value?: any;
}) {
  return (
    <div
      className={cn('flex w-full max-w-md flex-col', classNames?.wrapper, {
        'cursor-not-allowed opacity-50': disabled || props?.isDisabled,
      })}
    >
      {label && (
        <label
          className={cn('pl-1 text-sm font-medium text-foreground/70', {
            'text-red-500': onError,
          })}
        >
          {label}{' '}
          {required && <span className="font-bold text-red-500"> *</span>}
        </label>
      )}
      <DatePicker
        // label={label}
        key={label}
        className={cn('max-w-sm', className)}
        classNames={{
          label: cn(classNames?.label),
          inputWrapper: cn(
            'focus:border-1 gap-0 bg-red-500 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-primary/70 focus:outline-none focus-visible:outline-primary/10 focus-visible:ring-1 focus:ring-primary/10 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[focus=true]:border-primary hover:border-primary/60 focus-within:hover:border-primary/60 focus-within:border-primary/60',
          ),
        }}
        defaultValue={defaultValue}
        description={description}
        inert={false}
        isRequired={props?.isRequired || required}
        labelPlacement={labelPlacement || 'outside'}
        variant="bordered"
        onChange={onChange}
        value={value ? parseDate(value) : undefined}
        // hideTimeZone
        showMonthAndYearPickers
        {...props}
      />
    </div>
  );
}

export function DateRangePickerField({
  dateRange,
  setDateRange,
  className,
  label,
  defaultValue,
  description,
  labelPlacement,
  required,
  visibleMonths = 1,
  ...props
}: DateRangePickerProps & {
  dateRange: any;
  setDateRange: any;
  required?: boolean;
  className?: string;
  label?: string;
  defaultValue?: any;
  description?: string;
  labelPlacement?: string;
  visibleMonths?: number;
}) {
  const thisMonth = formatDate(new Date(), 'YYYY-MM-DD');
  const thirtyDaysAgoDate = new Date();

  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  const thirtyDaysAgo = formatDate(thirtyDaysAgoDate, 'YYYY-MM-DD');

  const [value, setValue] = React.useState<{
    start: CalendarDate;
    end: CalendarDate;
  }>({
    start: parseDate(thirtyDaysAgo),
    end: parseDate(thisMonth),
  });

  const formatter = useDateFormatter({ dateStyle: 'long' });

  useEffect(() => {
    if (value?.start && value?.end) {
      const start_date = formatDate(
        value?.start.toDate(getLocalTimeZone()),
        'YYYY-MM-DD',
      );

      const end_date = formatDate(
        value?.end.toDate(getLocalTimeZone()),
        'YYYY-MM-DD',
      );

      setDateRange({
        start_date,
        end_date,
        range: formatter.formatRange(
          value?.start.toDate(getLocalTimeZone()),
          value?.end.toDate(getLocalTimeZone()),
        ),
      });
    }
  }, [value]);

  return (
    // <HeroUIProvider locale="es-GB">
    // {/* </HeroUIProvider> */}
    <DateRangePicker
      showMonthAndYearPickers
      calendarProps={{
        classNames: {
          base: 'bg-background',
          headerWrapper: 'pt-4 bg-background',
          prevButton: 'border-1 border-default-200 rounded-small',
          nextButton: 'border-1 border-default-200 rounded-small',
          gridHeader: 'bg-background shadow-none border-b-1 border-default-100',
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
      className={cn('max-w-sm ', className)}
      classNames={{
        ...datePickerClasses,
        ...dateInputClassNames,
      }}
      defaultValue={defaultValue}
      description={description}
      isRequired={required || props.isRequired}
      label={label}
      labelPlacement={labelPlacement || 'outside'}
      maxValue={today(getLocalTimeZone())}
      radius="md"
      value={value}
      variant="bordered"
      visibleMonths={visibleMonths}
      onChange={setValue as any}
      {...props}
    />
  );
}

export default DateSelectField;
