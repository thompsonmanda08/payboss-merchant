'use client';
import { Progress } from '@heroui/react';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

import configs from './configs';

function ReportsBarChart({
  color,
  title,
  description,
  chart,
  items,
}: {
  color?: string;
  title?: string;
  description?: string;
  chart: {
    labels: { [x: string]: any };
    datasets: any;
  };
  items?: {
    icon: { color: string; component: React.ReactNode };
    label: string;
    progress: {
      content: string;
      percentage: number;
    };
  }[];
}) {
  const { data, options } = configs(chart.labels || [], chart.datasets || {});

  const renderItems = useMemo(
    () =>
      items
        ? items.map(({ icon, label, progress }) => (
            <div key={label} className="w-1/2 p-2 sm:w-1/4">
              <ReportsBarChartItem
                icon={{ color: icon.color, component: icon.component }}
                label={label}
                progress={{
                  content: progress.content,
                  percentage: progress.percentage,
                }}
              />
            </div>
          ))
        : [],
    [items, color],
  );

  const renderBarChart = useMemo(
    () => (
      <div
        className={`mb-3 h-48 rounded-lg bg-gradient-to-b from-primary-800 to-primary-900 py-2 pr-1`}
      >
        <Bar data={data as any} options={options as any} />
      </div>
    ),
    [chart, color],
  );

  return (
    <div className="flex w-full flex-col gap-4">
      {renderBarChart}
      {items && <div className="-mx-2 flex flex-wrap">{renderItems}</div>}
    </div>
  );
}

function ReportsBarChartItem({
  icon,
  label,
  progress,
}: {
  icon: { color: string; component: React.ReactNode };
  label: string;
  progress: {
    content: string;
    percentage: number;
  };
}) {
  return (
    <div className="mt-4 flex w-full flex-col gap-2">
      <div className="flex items-center gap-1">
        <div
          className={`bg-${icon.color} mr-1 flex items-center justify-center rounded-sm p-2 text-sm text-white shadow-md`}
        >
          {icon.component}
        </div>
        <span className="text-nowrap text-xs font-medium capitalize text-foreground/80">
          {label}
        </span>
      </div>
      <div className="w-full">
        <span className="text-sm font-medium text-primary-900" />
        <div className="mt-1 w-3/4">
          <Progress
            className="w-full"
            classNames={{
              base: 'w-full',
              track: 'drop-shadow-sm border border-slate-300',
              indicator: 'bg-gradient-to-r !h-4 from-primary-300 to-primary',
              label: 'font-bold text-primary-900 text-nowrap',
            }}
            color="primary"
            label={progress.content}
            size="md"
            value={progress.percentage}
          />
        </div>
      </div>
    </div>
  );
}

export default ReportsBarChart;
