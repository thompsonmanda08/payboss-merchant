import React from 'react'
import Spinner from './Spinner'
import { cn } from '@/lib/utils'

function Loader({ size = 50, loadingText, color, classNames }) {
  const { container, wrapper, spinner, text } = classNames || ''
  return (
    <div
      className={cn(
        'grid min-h-80 flex-1 flex-grow place-items-center py-8',
        wrapper,
      )}
    >
      <div
        className={cn(
          'flex w-fit flex-col items-center justify-center gap-4',
          container,
        )}
      >
        <Spinner size={size} color={color} className={spinner} />
        {loadingText && (
          <p
            className={cn(
              'mt-8 max-w-sm break-words font-bold text-slate-800',
              text,
            )}
          >
            {loadingText}
          </p>
        )}
      </div>
    </div>
  )
}

export default Loader
