'use client';

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { formatCurrency } from '@/lib/utils';
import CardHeader from '../base/card-header';
import Card from '../base/custom-card';

interface TransactionData {
  value: string;
  count: number;
  month: string;
}

interface TransactionBarChartProps {
  data: TransactionData[];
  title?: string;
  description?: string;
}

function ensureSixMonthsData(data: TransactionData[]): TransactionData[] {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const currentDate = new Date();
  const sixMonthsData: TransactionData[] = [];

  // Generate 6 months starting from current month going back
  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1,
    );
    const monthName = months[monthDate.getMonth()];

    // Check if data exists for this month
    const existingData = data?.find((item) => item.month === monthName);

    if (existingData) {
      sixMonthsData.unshift(existingData);
    } else {
      // Create default data for missing month
      sixMonthsData.unshift({
        month: monthName,
        count: 0,
        value: '0.00',
      });
    }
  }

  return sixMonthsData;
}

export default function TransactionBarChart({
  data = [],
  title = 'Transactions Overview',
  description = 'Transaction count and value by month',
}: TransactionBarChartProps) {
  const sixMonthsData = ensureSixMonthsData(data);

  const processedData = sixMonthsData.map((item) => ({
    ...item,
    value: Number.parseFloat(item.value),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border-1 border-primary-100 bg-card p-3 shadow-sm">
          <div className="mb-2">
            <span className="text-sm font-medium">{label}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs text-muted-foreground">
                Transaction Count:
              </span>
              <span className="font-semibold">{data.count}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs text-muted-foreground">
                Transaction Value:
              </span>
              <span className="font-semibold">
                {formatCurrency(data.value)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 lg:col-span-4 px-6 py-4 shadow-none">
      <CardHeader
        classNames={{
          infoClasses: 'text-sm -mt-1',
        }}
        infoText={description}
        title={title}
      />

      <ChartContainer
        config={{
          count: {
            label: 'Transaction Count',
            color: 'hsl(var(--chart-1))',
          },
        }}
        className="h-[400px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <ChartTooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  );
}
