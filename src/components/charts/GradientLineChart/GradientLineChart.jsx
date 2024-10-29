'use client'
import { useRef, useEffect, useState, useMemo } from 'react'
import configs from './configs'
import gradientChartLine from '../functions/gradientChartLine'
import { Line } from 'react-chartjs-2'
import { cn } from '@/lib/utils'
import Card from '@/components/base/Card'

const chart = {
  labels: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  datasets: [
    {
      label: 'Income',
      color: '#3172d4',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      label: 'Payments',
      color: '#eb7a2e',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ],
}

function GradientLineChart({ title, description, height, chart_ }) {
  // props.chart is the chartData required to render the chart.
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({})
  const { data, options } = chartData

  const chartDatasets = useMemo(() => {
    return chart.datasets?.map((dataset) => ({
      ...dataset,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 3,
      borderColor: dataset?.color,
      fill: true,
      maxBarThickness: 6,
      // backgroundColor: gradientChartLine(
      //   chartRef.current?.children[0],
      //   dataset?.color || '#00000000',
      // ),
    }))
  }, [chart.datasets])

  const renderChart = useMemo(() => {
    return (
      <div ref={chartRef} style={{ height }}>
        {data && options && <Line data={data} options={options} />}
      </div>
    )
  }, [chartData, height])

  useEffect(() => {
    setChartData(configs(chart.labels, chartDatasets))
  }, [chart.labels, chartDatasets])

  return (
    <Card>
      {(title || description) && (
        <div
          className={cn(`px-${description ? 1 : 0} pt-${description ? 1 : 0}`)}
        >
          {title && <h6 className="mb-1 text-lg font-semibold">{title}</h6>}
          {description && (
            <p className="mb-2 text-sm font-normal text-gray-700">
              {description}
            </p>
          )}
        </div>
      )}
      {renderChart}
    </Card>
  )
}

export default GradientLineChart
