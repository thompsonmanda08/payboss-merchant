'use client'
import { useRef, useEffect, useState, useMemo } from 'react'
import { Card } from '@/components/base'
import configs from './configs'
import gradientChartLine from '../../functions/gradientChartLine'
import { Line } from 'react-chartjs-2'

function GradientLineChart({ title, description, height, chart }) {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({})
  const { data, options } = chartData

  useEffect(() => {
    const chartDatasets = chart.datasets?.map((dataset) => ({
      ...dataset,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 3,
      borderColor: dataset.color || '#000',
      fill: true,
      maxBarThickness: 6,
      backgroundColor: gradientChartLine(
        chartRef.current?.children[0],
        dataset.color || '#000',
      ),
    }))

    setChartData(configs(chart.labels, chartDatasets))
  }, [chart])

  const renderChart = (
    <div className="p-2">
      {title || description ? (
        <div className={`px-${description ? 1 : 0} pt-${description ? 1 : 0}`}>
          {title && (
            <div className="mb-1">
              <h6 className="text-lg font-semibold">{title}</h6>
            </div>
          )}
          <div className="mb-2">
            <div className="text-sm font-normal text-gray-700">
              {description}
            </div>
          </div>
        </div>
      ) : null}
      {useMemo(
        () => (
          <div ref={chartRef} style={{ height }}>
            {data && options && <Line data={data} options={options} />}
          </div>
        ),
        [chartData, height],
      )}
    </div>
  )

  return title || description ? <Card>{renderChart}</Card> : renderChart
}

export default GradientLineChart
