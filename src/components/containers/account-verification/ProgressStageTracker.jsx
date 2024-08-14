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

function ProgressStageTracker() {
  const fullDate = new Date(now(getLocalTimeZone()).toString().split('T')[0])
  const date = formatDate(fullDate).replaceAll('-', ' ')
  const time = fullDate.toLocaleTimeString()


  const [currentStage, setCurrentStage] = useState(0)

  const STAGES = [
    {
      ID: 1,
      name: 'Account Details & Document Submission',
      Icon: ClipboardDocumentCheckIcon,
      status: 'done',
      current: 0,
      date: formatDate(date).replaceAll('-', ' '),
      time,
    },
    {
      ID: 2,
      name: 'Account Screening Pending Approval',
      status: 'pending',
      Icon: ShieldExclamationIcon,
      current: 2,
      date: formatDate(date).replaceAll('-', ' '),
      time,
    },
    {
      ID: 3,
      name: 'Review & Negotiation',
      Icon: ChatBubbleOvalLeftEllipsisIcon,
      status: 'pending',
      current: 0,
      date: formatDate(date).replaceAll('-', ' '),
      time,
    },
    {
      ID: 3,
      name: 'Account Approved',
      status: 'pending',
      current: 0,
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
                isPending={stage?.ID == stage?.current}
                isCompleted={stage?.status == 'done'}
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
              {STAGES[currentStage]?.name || 'Account Approval Process'}
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

export default ProgressStageTracker
