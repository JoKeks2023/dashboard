import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MetricDataPoint } from '../hooks/useSystemMetrics';

type MetricChartProps = {
  data: MetricDataPoint[];
  title: string;
  color: string;
  unit?: string;
  max?: number;
};

/**
 * MetricChart - Wiederverwendbare Chart-Komponente für Metriken
 */
export default function MetricChart({ data, title, color, unit = '%', max = 100 }: MetricChartProps) {
  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString(),
    value: d.value
  }));

  const latestValue = data.length > 0 ? data[data.length - 1].value : 0;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
        <div className="text-2xl font-bold" style={{ color }}>
          {latestValue.toFixed(1)}{unit}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af" 
            fontSize={12}
            tickFormatter={(value) => value.split(':').slice(0, 2).join(':')}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={12}
            domain={[0, max]}
            tickFormatter={(value) => `${value}${unit}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              borderRadius: '8px'
            }}
            formatter={(value: number) => [`${value.toFixed(1)}${unit}`, title]}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            fill={`url(#gradient-${title})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
