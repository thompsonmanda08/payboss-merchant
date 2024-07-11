import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef(
  ({ className, type, label, name, containerClasses, ...props }, ref) => {
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
          className={cn(
            'focus:border-1 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-primary/70 focus:outline-none focus-visible:outline-none focus-visible:ring-1  focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          name={name}
          {...props}
        />
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
