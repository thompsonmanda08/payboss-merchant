'use client'
import { cn, formatDate } from '@/lib/utils'
import approvalIllustration from '@/images/illustrations/approval.svg'

import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/base'
import { CreditCardIcon } from '@heroicons/react/24/outline'
import { now, getLocalTimeZone } from '@internationalized/date'
import { useDateFormatter } from '@react-aria/i18n'
import { CardBody } from '@nextui-org/react'
import Image from 'next/image'

export function SoftBoxIcon({ className, children }) {
  return (
    <div
      className={cn(
        'z-10 grid aspect-square h-12 w-12 place-items-center rounded-lg bg-gradient-to-tr from-primary to-blue-300 p-3 text-white transition-all duration-300 ease-in-out',
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

export const TimelineItem = ({ isLastItem, isCompleted }) => {
  const fullDate = new Date(now(getLocalTimeZone()).toString().split('T')[0])

  const date = formatDate(fullDate).replaceAll('-', ' ')
  const time = fullDate.toLocaleTimeString()
  console.log(time)

  return (
    <div
      className={cn(
        "relative flex gap-4 bg-gradient-to-r from-card to-primary-50 p-2 before:absolute before:left-7 before:top-[110%] before:z-0 before:h-[40px] before:w-1 before:bg-slate-500/10 before:content-['']",
        {
          'before:bg-primary/20': isCompleted,
          'before:hidden': isLastItem,
        },
      )}
    >
      <SoftBoxIcon
        className={{
          'border border-slate-300 from-transparent to-transparent text-slate-400':
            !isCompleted,
        }}
      >
        <CreditCardIcon />
      </SoftBoxIcon>

      <div className="flex flex-col">
        <p className="font-medium text-slate-600">Account Details Submitted</p>
        <span className="text-xs font-medium uppercase leading-5 text-slate-400">
          {formatDate(date).replaceAll('-', ' ')}
        </span>
      </div>
    </div>
  )
}

export const ProgressStageTracker = ({}) => {
  return (
    <Card className={'w-full gap-5 pb-5'}>
      <CardHeader
        title="Account Verification Status"
        infoText={
          'Your account is under review! We will notify you when your account is approved.'
        }
      />
      <div className="flex w-full items-center  lg:px-10">
        <div className="flex w-full flex-col gap-9">
          <TimelineItem isCompleted />
          <TimelineItem />
          <TimelineItem />
          {/* <TimelineItem /> */}
          <TimelineItem isLastItem />
        </div>
        <div className="flex w-full min-w-80 flex-col items-center gap-9 rounded-2xl bg-primary-50 p-9">
          <Image
            className="aspect-square max-w-80 object-contain"
            src={approvalIllustration}
            width={200}
            height={200}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <h3 className="leading-0 m-0 font-bold">
              Account Pending Approval
            </h3>
            <p className="text-center text-sm tracking-tight text-slate-600">
              This process usually takes up to 24 hours, try reloading the page
              or come back later for a status update.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
