import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const Input = React.forwardRef(
  (
    {
      className,
      type,
      label,
      name,
      containerClasses,
      onError,
      error,
      maxLength,
      max,
      min,
      errorText = '',
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn('flex w-full max-w-md flex-col', containerClasses)}>
        {label && (
          <label
            htmlFor={name}
            className="mb-1 ml-1 text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <input
          id={name}
          type={type}
          max={max}
          min={min}
          maxLength={maxLength}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-1 focus:border-primary/70 focus:outline-none focus-visible:outline-none focus-visible:ring-1  focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
            {
              'border-red-500 focus:border-red-500/70 focus-visible:ring-red-500/30':
                onError,
            },
            className,
          )}
          ref={ref}
          name={name}
          {...props}
        />
        {errorText && onError && (
          <motion.span
            whileInView={{
              scale: [0, 1],
              opacity: [0, 1],
              transition: { duration: 0.3 },
            }}
            className="ml-1 text-xs font-semibold text-red-600 "
          >
            {errorText}
          </motion.span>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
