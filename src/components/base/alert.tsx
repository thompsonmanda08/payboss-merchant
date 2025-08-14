import { Alert, cn, AlertProps } from '@heroui/react';
import React from 'react';

const CustomAlert = React.forwardRef<
  AlertProps,
  {
    title: string;
    children: React.ReactNode;
    variant?: 'faded' | 'solid';
    color?:
      | 'default'
      | 'primary'
      | 'secondary'
      | 'success'
      | 'warning'
      | 'danger';
    className?: string;
    classNames?: {
      base?: string;
      mainWrapper?: string;
      iconWrapper?: string;
    };
  }
>(
  (
    {
      title,
      children,
      variant = 'faded',
      color = 'secondary',
      className,
      classNames = {},
      ...props
    },
    ref,
  ) => {
    const colorClass = React.useMemo(() => {
      switch (color) {
        case 'default':
          return 'before:bg-default-300';

        case 'primary':
          return 'before:bg-primary';

        case 'secondary':
          return 'before:bg-secondary';

        case 'success':
          return 'before:bg-success';

        case 'warning':
          return 'before:bg-warning';

        case 'danger':
          return 'before:bg-danger';

        default:
          return 'before:bg-default-200';
      }
    }, []);

    return (
      <Alert
        ref={ref as any}
        classNames={{
          ...classNames,
          base: cn(
            [
              'bg-default-50 dark:bg-background shadow-sm',
              'border-1 border-default-200 dark:border-default-100',
              "relative before:content-[''] before:absolute before:z-10",
              'before:left-0 before:top-[-1px] before:bottom-[-1px] before:w-1',
              'rounded-l-none border-l-0',
              colorClass,
            ],
            classNames.base,
            className,
          ),
          mainWrapper: cn('pt-1', classNames.mainWrapper),
          iconWrapper: cn('dark:bg-transparent', classNames.iconWrapper),
        }}
        color={color}
        title={title}
        variant={variant}
        {...props}
      >
        {children}
      </Alert>
    );
  },
);

CustomAlert.displayName = 'CustomAlert';

export default CustomAlert;
