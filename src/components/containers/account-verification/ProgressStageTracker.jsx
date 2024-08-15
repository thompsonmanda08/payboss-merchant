import React, { useState } from 'react'
import Image from 'next/image'
import approvalIllustration from '@/images/illustrations/approval.svg'
import { Card, CardHeader, TimelineItem } from '@/components/base'
import { now, getLocalTimeZone } from '@internationalized/date'
import { formatDate } from '@/lib/utils'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  ClipboardDocumentCheckIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline'
import useAccountProfile from '@/hooks/useProfileDetails'

function ProgressStageTracker() {
  const fullDate = new Date(now(getLocalTimeZone()).toString().split('T')[0])
  const date = formatDate(fullDate).replaceAll('-', ' ')
  const time = fullDate.toLocaleTimeString()
  const { KYCStageID, KYCApprovalStatus } = useAccountProfile()

  const STAGES = [
    {
      ID: 1,
      name: 'Account Details & Document Submission',
      infoText:
        'Documents as well as business information was submitted. This process usually takes up to 24 hours, try reloading the page or come back later for a status update.',
      Icon: ClipboardDocumentCheckIcon,
      date: formatDate(date).replaceAll('-', ' '),
      time,
    },
    {
      ID: 2,
      name: 'Account Screening Pending Approval',
      infoText:
        'Your account and your KYC data is being reviewed by the PayBoss support team. This process usually takes up to 24 hours, You will receive an email notification when your application has been reviewed',
      Icon: ShieldExclamationIcon,
      date: formatDate(date).replaceAll('-', ' '),
      time,
    },
    {
      ID: 3,
      name: 'Review & Negotiation',
      infoText:
        'Review & Negotiation all you to reach an understanding with the PayBoss team, on the PayBoss services and pricing as well as commission information',
      Icon: ChatBubbleOvalLeftEllipsisIcon,
      date: formatDate(date).replaceAll('-', ' '),
      time,
    },
    {
      ID: 4,
      name: 'Account Approved',
      infoText:
        'Congratulations! Your account has been approved, enjoy the PayBoss services to the fullest',
      date: formatDate(date).replaceAll('-', ' '),
      time,
    },
  ]
  return (
    <Card className={'w-full gap-5 pb-5'}>
      <CardHeader
        title="Account Verification Status"
        infoText={
          'Your account is under review! We will notify you when your account is approved.'
        }
      />
      <div className="flex w-full items-center  lg:px-10">
        <div className="flex w-full flex-col gap-4">
          {STAGES.map((stage, index) => {
            return (
              <TimelineItem
                Icon={stage.Icon}
                stage={stage}
                isPending={KYCStageID === stage?.ID}
                isCompleted={KYCStageID > stage?.ID || KYCStageID == 4}
                isLastItem={index == STAGES.length - 1}
              />
            )
          })}
        </div>
        <div className="flex w-full min-w-80 select-none flex-col items-center gap-9 rounded-2xl bg-primary-50/70 p-9">
          <Image
            className="aspect-square max-w-80 object-contain"
            src={approvalIllustration}
            width={200}
            height={200}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <h3 className="leading-0 m-0 font-bold">
              {STAGES[KYCStageID - 1]?.name || 'Account Approval Process'}
            </h3>
            <p className="text-center text-sm tracking-tight text-slate-600">
              {STAGES[KYCStageID - 1]?.infoText ||
                ' This process usually takes up to 24 hours, try reloading the page or come back later for a status update.'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProgressStageTracker
