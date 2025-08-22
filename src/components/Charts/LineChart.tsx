import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface LineChartProps {
  data: any[];
  dataKeys: { key: string; color: string; name: string }[];
  xAxisKey: string;
  title?: string;
}

const CustomLineChart: React.FC<LineChartProps> = ({ data, dataKeys, xAxisKey, title }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">Time: {label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="mb-1">
              <p className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.name}: {entry.value}
                {entry.dataKey === 'heartRate' && ' bpm'}
                {entry.dataKey === 'systolicBP' && ' mmHg'}
                {entry.dataKey === 'oxygenSat' && '%'}
              </p>
              {/* Add reference ranges for medical context */}
              {entry.dataKey === 'heartRate' && (
                <p className="text-xs text-gray-500">Normal: 60-100 bpm</p>
              )}
              {entry.dataKey === 'systolicBP' && (
                <p className="text-xs text-gray-500">Normal: &lt;120 mmHg</p>
              )}
              {entry.dataKey === 'oxygenSat' && (
                <p className="text-xs text-gray-500">Normal: 95-100%</p>
              )}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey={xAxisKey} 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {/* Add reference lines for medical ranges */}
          <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.3} />
          <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.3} />
          <ReferenceLine y={120} stroke="#3b82f6" strokeDasharray="3 3" strokeOpacity={0.3} />
          <ReferenceLine y={95} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.3} />
          {dataKeys.map((item) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              stroke={item.color}
              strokeWidth={2}
              dot={{ fill: item.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name={item.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;