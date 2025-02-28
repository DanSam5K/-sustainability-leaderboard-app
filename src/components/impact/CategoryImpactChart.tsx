'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { format } from 'date-fns';

export interface ImpactMetric {
  id: string;
  userId: string;
  category: string;
  value: number;
  description?: string;
  date: Date;
}

interface CategoryImpactChartProps {
  metrics: ImpactMetric[];
  category: string;
  color: string;
  unit: string;
}

export default function CategoryImpactChart({ metrics, category, color, unit }: CategoryImpactChartProps) {
  const chartData = useMemo(() => {
    // Filter metrics by category
    const filteredMetrics = metrics.filter(metric => metric.category === category);

    // Group by date (day)
    const groupedByDate = filteredMetrics.reduce((acc, metric) => {
      const dateStr = format(metric.date, 'yyyy-MM-dd');
      if (!acc[dateStr]) {
        acc[dateStr] = {
          date: dateStr,
          total: 0,
          count: 0,
        };
      }
      acc[dateStr].total += metric.value;
      acc[dateStr].count += 1;
      return acc;
    }, {} as Record<string, { date: string; total: number; count: number }>);

    // Convert to array and sort by date
    return Object.values(groupedByDate)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(item => ({
        date: item.date,
        value: item.total,
        average: item.total / item.count,
      }));
  }, [metrics, category]);

  // Calculate cumulative data
  const cumulativeData = useMemo(() => {
    let cumulative = 0;
    return chartData.map(item => ({
      ...item,
      cumulative: (cumulative += item.value),
    }));
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-sm">No data available for this category yet.</p>
        <p className="text-gray-400 text-xs mt-1">Log your first impact to see your progress!</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={cumulativeData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), 'MMM d')}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => `${value} ${unit}`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, 'Total']}
            labelFormatter={(date) => format(new Date(date), 'MMMM d, yyyy')}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="cumulative"
            name={`Total ${category} impact`}
            stroke={`var(--color-${color}-600)`}
            fill={`var(--color-${color}-100)`}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="value"
            name={`Daily ${category} impact`}
            stroke={`var(--color-${color}-400)`}
            fill={`var(--color-${color}-50)`}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
} 