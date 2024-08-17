import React from 'react'
import { Button } from '../ui/Button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import useAccountProfile from '@/hooks/useProfileDetails'

function InfoBanner({
  buttonText,
  infoText,
  onButtonPress,
  href,
  classNames,
  className,
  children,
}) {
  const { infoTextClasses, buttonClasses } = classNames || ''

  const { isCompleteKYC, allowUserToSubmitKYC } = useAccountProfile()

  return (
    !isCompleteKYC &&
    allowUserToSubmitKYC && (
      <div
        className={cn(
          'flex max-h-16 flex-1 items-center justify-between rounded-lg bg-primary/10 p-2 pl-5',
          className,
        )}
      >
        {children ? (
          //IF CHILDREN ARE PROVIDED
          <>{children}</>
        ) : (
          <>
            <p
              className={cn(
                'select-none text-xs font-semibold tracking-tight text-primary md:text-sm',
                infoTextClasses,
              )}
            >
              {infoText}
            </p>
            {!href ? (
              <Button
                size="sm"
                className={cn('text-xs', buttonClasses)}
                onClick={onButtonPress}
              >
                {buttonText}
              </Button>
            ) : (
              <Button
                as={Link}
                href={href}
                size="sm"
                className={cn('text-xs', buttonClasses)}
              >
                {buttonText}
              </Button>
            )}
          </>
        )}
      </div>
    )
  )
}

export default InfoBanner
