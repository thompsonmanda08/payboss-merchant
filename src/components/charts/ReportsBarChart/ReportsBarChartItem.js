import Progress from '@/components/progress'
import React from 'react'

function ReportsBarChartItem({ icon, label, progress }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <div
          className={`bg-${icon.color} mr-1 flex items-center justify-center rounded-sm p-2 text-xs text-white shadow-md`}
        >
          <span>{icon.component}</span>
        </div>
        <span className="text-caption font-medium capitalize text-gray-800">
          {label}
        </span>
      </div>
      <div className="">
        <span className="text-base font-bold text-primary-900">
          {progress.content}
        </span>
        <div className="mt-1 w-3/4">
          <Progress
            value={progress.percentage}
            color="primary from-primary-300 to-primary"
          />
        </div>
      </div>
    </div>
  )
}

export default ReportsBarChartItem
