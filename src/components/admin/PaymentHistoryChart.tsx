import React from 'react';
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { format } from 'date-fns';

interface PaymentHistoryData {
  date: string;
  amount: number;
  transactions: number;
}

interface PaymentHistoryChartProps {
  data: PaymentHistoryData[];
  filter: string;
}

export const PaymentHistoryChart: React.FC<PaymentHistoryChartProps> = ({ data, filter }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p className="text-lg font-medium">No payment data available</p>
          <p className="text-sm">Try adjusting your filter settings</p>
        </div>
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.map(item => ({
    date: format(new Date(item.date), 'MMM dd'),
    amount: item.amount,
    transactions: item.transactions,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white  p-3 border border-gray-200  rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Amount: ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-gray-600 ">
            Transactions: {payload[0].payload.transactions}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}; 