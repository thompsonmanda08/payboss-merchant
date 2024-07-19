'use client'
import { cn, formatDate } from '@/lib/utils'

import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/base'
import { CreditCardIcon } from '@heroicons/react/24/outline'
import { now, getLocalTimeZone } from '@internationalized/date'
import { useDateFormatter } from '@react-aria/i18n'

export function SoftBoxIcon({ className, children }) {
  return (
    <div
      className={cn(
        'grid aspect-square h-12 w-12 place-items-center rounded-lg bg-gradient-to-tr from-primary to-blue-300 p-3 text-white',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const InfoBanner = ({
  buttonText,
  infoText,
  onButtonPress,
  href,
  classNames,
  className,
  children,
}) => {
  const { infoTextClasses, buttonClasses } = classNames || ''

  return (
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
              'select-none text-xs font-semibold tracking-tight text-primary md:text-base',
              infoTextClasses,
            )}
          >
            {infoText}
          </p>
          {!href ? (
            <Button
              className={cn('text-xs md:text-base', buttonClasses)}
              onClick={onButtonPress}
            >
              {buttonText}
            </Button>
          ) : (
            <Button
              as={Link}
              href={href}
              className={cn('text-xs md:text-base', buttonClasses)}
            >
              {buttonText}
            </Button>
          )}
        </>
      )}
    </div>
  )
}

export const TransactionStatusTag = ({ status, className }) => {
  return (
    <span
      className={cn(
        'mx-auto cursor-pointer select-none rounded-md bg-gradient-to-tr p-1 px-2 text-xs font-medium text-white',
        className,
        {
          'from-gray-400 to-gray-600': 'Scheduled' == status,
          'from-orange-400 to-orange-600': 'Pending' == status,
          'from-blue-600 to-blue-500': 'In Progress' == status,
          'from-green-500 to-green-700': 'Completed' == status,
        },
      )}
    >
      {status}
    </span>
  )
}

export const ProgressStageTracker = () => {
  const date = new Date(now(getLocalTimeZone()).toString().split('T')[0])

  let formatter = useDateFormatter({ dateStyle: 'full' })
  return (
    <Card>
      <div className="flex gap-4">
        <SoftBoxIcon>
          <CreditCardIcon />
        </SoftBoxIcon>

        <div className="flex flex-col">
          <p className="text-slate-600 font-medium">Account Details Submitted</p>
          <span className="text-xs font-medium uppercase leading-5 text-slate-400">
            {formatDate(date).replaceAll('-', ' ')}
          </span>
        </div>
      </div>
    </Card>
  )
}
