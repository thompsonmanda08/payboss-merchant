import React from 'react'
import { Card, CardHeader } from '.'
import TimelineItem from './TimelineItem'
import Image from 'next/image'
import approvalIllustration from '@/images/illustrations/approval.svg'

function ProgressStageTracker() {
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
          <TimelineItem isCompleted />
          <TimelineItem isPending />
          <TimelineItem />
          {/* <TimelineItem /> */}
          <TimelineItem isLastItem />
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

export default ProgressStageTracker
