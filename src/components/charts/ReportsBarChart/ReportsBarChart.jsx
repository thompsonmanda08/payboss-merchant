"use client";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import configs from "./configs";
import { Progress } from "@heroui/react";
import Card from "@/components/base/card";
import { cn } from "@/lib/utils";

function ReportsBarChart({ color, title, description, chart, items }) {
  const { data, options } = configs(chart.labels || [], chart.datasets || {});

  const renderItems = useMemo(() =>
    items
      ? items?.map(
          ({ icon, label, progress }) => (
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
          ),
          [items]
        )
      : []
  );

  const renderBarChart = useMemo(
    () => (
      <div
        className={`mb-3 h-48 rounded-lg bg-gradient-to-b from-primary-800 to-primary-900 py-2 pr-1`}
      >
        <Bar data={data} options={options} />
      </div>
    ),
    [chart, color]
  );

  return (
    <Card>
      <h6 className="mt-2 text-lg font-medium capitalize">{title}</h6>
      <p className={cn("text-sm text-foreground-500 mb-4")}>{description}</p>
      {renderBarChart}
      {items && <div className="-mx-2 flex flex-wrap">{renderItems}</div>}
    </Card>
  );
}

function ReportsBarChartItem({ icon, label, progress }) {
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
        <span className="text-sm font-medium text-primary-900"></span>
        <div className="mt-1 w-3/4">
          <Progress
            className="w-full"
            classNames={{
              base: "w-full",
              track: "drop-shadow-sm border border-slate-300",
              indicator: "bg-gradient-to-r !h-4 from-primary-300 to-primary",
              label: "font-bold text-primary-900 text-nowrap",
            }}
            size="md"
            label={progress.content}
            value={progress.percentage}
            color="primary from-primary-300 to-primary"
          />
        </div>
      </div>
    </div>
  );
}

export default ReportsBarChart;
