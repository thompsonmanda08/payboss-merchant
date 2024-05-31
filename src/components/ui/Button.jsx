import Link from 'next/link'
import clsx from 'clsx'

const baseStyles = {
  solid:
    'group inline-flex items-center justify-center rounded-lg py-2 px-4 h-12 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-300 ease-in-out',
  outline:
    'group inline-flex ring-1 items-center justify-center rounded-lg py-2 px-4 text-sm focus:outline-none h-12 transition-all duration-300 ease-in-out',
}

const variantStyles = {
  solid: {
    slate:
      'bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900',
    blue: 'bg-primary text-white hover:text-slate-100 hover:bg-primary/90 active:bg-primary active:text-primary/90 focus-visible:outline-primary',
    white:
      'bg-white text-slate-900 hover:bg-primary/50 active:bg-primary active:text-slate-600 focus-visible:outline-white',
  },
  outline: {
    slate:
      'ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300',
    white:
      'ring-slate-700 text-white hover:ring-slate-500 active:ring-slate-700 active:text-slate-400 focus-visible:outline-white',
  },
}

export function Button({ className, ...props }) {
  props.variant ??= 'solid'
  props.color ??= 'blue'

  className = clsx(
    baseStyles[props.variant],
    props.variant === 'outline'
      ? variantStyles.outline[props.color]
      : props.variant === 'solid'
        ? variantStyles.solid[props.color]
        : undefined,
    className,
  )

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  )
}
