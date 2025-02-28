'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { ImpactMetric } from '@/types';

interface ImpactChartProps {
  metrics: ImpactMetric[];
}

export default function ImpactChart({ metrics }: ImpactChartProps) {
  const chartData = metrics
    .map(metric => ({
      date: format(new Date(metric.date), 'MMM dd'),
      value: metric.value,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Impact Over Time</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#4B5563' }}
            tickLine={{ stroke: '#4B5563' }}
          />
          <YAxis
            tick={{ fill: '#4B5563' }}
            tickLine={{ stroke: '#4B5563' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFF',
              border: '1px solid #E5E7EB',
              borderRadius: '0.375rem',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: '#10B981', stroke: '#FFF', strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 