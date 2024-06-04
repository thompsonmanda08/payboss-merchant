'use client'
import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import ReportsBarChartItem from './ReportsBarChartItem'
import configs from './configs'
import { Card } from '@/components/base'

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
              className={`bg-gradient-to-r from-black to-black/90 mb-3  rounded-lg py-2 pr-1 h-48`}
            >
              <Bar data={data} options={options} />
            </div>
          ),
          [chart, color],
        )}
        <div className="px-2">
          <div className="mb-2">
            <h6 className="text-lg font-medium capitalize">{title}</h6>
            <div className="text-sm font-normal text-gray-600">
              {description}
            </div>
          </div>
          <div className="px-1 py-1">
            <div className="-mx-2 flex flex-wrap">{renderItems}</div>
          </div>
        </div>
      </Card>
  )
}

export default ReportsBarChart
