import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
  title?: string;
  secondaryDataKey?: string;
  secondaryColor?: string;
}

const CustomBarChart: React.FC<BarChartProps> = ({ 
  data, 
  dataKey, 
  xAxisKey, 
  color = '#2563eb',
  title,
  secondaryDataKey,
  secondaryColor = '#f59e0b'
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'avgConditions' && ' conditions'}
              {entry.dataKey === 'criticalRate' && '% critical'}
            </p>
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
        <BarChart data={data}>
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
          <Bar 
            dataKey={dataKey} 
            fill={color}
            radius={[4, 4, 0, 0]}
            name="Patient Count"
          />
          {secondaryDataKey && (
            <Bar 
              dataKey={secondaryDataKey} 
              fill={secondaryColor}
              radius={[4, 4, 0, 0]}
              name={secondaryDataKey === 'avgConditions' ? 'Avg Conditions' : 'Critical Rate'}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;