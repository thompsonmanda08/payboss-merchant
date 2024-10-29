import { CheckCircleIcon } from '@heroicons/react/24/outline'
import React from 'react'

function ProgressStep({ STEPS, currentTabIndex }) {
  return (
    <div className="before:content[''] relative z-0 my-8 flex flex-row items-center justify-between gap-4 text-base before:absolute before:left-0 before:right-0  before:top-1/2 before:z-10 before:h-[2px] before:bg-foreground/10 ">
      {/* CTA STEP */}
      {STEPS.map((step, index) => {
        return (
          <div
            key={index}
            onClick={(e) => {
              e.stopPropagation()
              // NEEDS NAVIGATION VALIDATION
              // Only users completed on each step can navigate directly to the next
              // navigateTo(index);
            }}
            className="z-10 flex cursor-pointer flex-row items-center justify-center gap-4 bg-card px-6 text-sm font-medium"
          >
            <span
              className={`${
                currentTabIndex >= index
                  ? 'bg-primary before:bg-primary/20'
                  : 'bg-foreground/20 before:bg-foreground/10'
              }  before:content[''] relative grid aspect-square h-6 w-6 place-items-center rounded-full text-xs text-slate-50 before:absolute before:-inset-1.5 before:rounded-full`}
            >
              {currentTabIndex >= index + 1 ? (
                <CheckCircleIcon className="p-0.5" />
              ) : (
                `${index + 1}`
              )}
            </span>
            {step.step}
          </div>
        )
      })}
    </div>
  )
}

export default ProgressStep
