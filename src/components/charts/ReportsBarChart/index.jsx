'use client'
import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
// import ReportsBarChartItem from './ReportsBarChartItem'
import configs from './configs'
import { Card } from '@/components/base'
import { Progress } from '@nextui-org/react'

function ReportsBarChartItem({ icon, label, progress }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <div
          className={`bg-${icon.color} mr-1 flex items-center justify-center rounded-sm p-2 text-xs text-white shadow-md`}
        >
          <span>{icon.component}</span>
        </div>
        <span className="text-caption font-medium capitalize text-slate-800">
          {label}
        </span>
      </div>
      <div className="">
        <span className="text-sm font-medium text-primary-900">
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

function ReportsBarChart({ color, title, description, chart, items }) {
  const { data, options } = configs(chart.labels || [], chart.datasets || {})

  const renderItems = items.map(({ icon, label, progress }) => (
    <div className="w-1/2 p-2 sm:w-1/4" key={label}>
      <ReportsBarChartItem
        color={color}
        icon={{ color: icon.color, component: icon.component }}
        label={label}
        progress={{
          content: progress.content,
          percentage: progress.percentage,
        }}
      />
    </div>
  ))

  return (
    <Card>
      {useMemo(
        () => (
          <div
            className={`mb-3 h-48 rounded-lg bg-gradient-to-b  from-primary-800 to-primary-900 py-2 pr-1`}
          >
            <Bar data={data} options={options} />
          </div>
        ),
        [chart, color],
      )}
      <div className="px-2">
        <div className="mb-2">
          <h6 className="text-lg font-medium capitalize">{title}</h6>
          <div className="text-sm font-normal text-gray-600">{description}</div>
        </div>
        <div className="px-1 py-1">
          <div className="-mx-2 flex flex-wrap">{renderItems}</div>
        </div>
      </div>
    </Card>
  )
}

export default ReportsBarChart
