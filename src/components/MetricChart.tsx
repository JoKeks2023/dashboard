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
 * MetricChart - Cyberpunk-styled chart component for metrics
 */
export default function MetricChart({ data, title, color, unit = '%', max = 100 }: MetricChartProps) {
  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString(),
    value: d.value
  }));

  const latestValue = data.length > 0 ? data[data.length - 1].value : 0;

  return (
    <div className="card p-3" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold tracking-widest" style={{ color: 'var(--cyber-magenta)', textShadow: '0 0 4px var(--cyber-magenta)' }}>
          &gt; {title}
        </h3>
        <div className="text-xl font-bold" style={{ color, textShadow: `0 0 8px ${color}` }}>
          {latestValue.toFixed(1)}{unit}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.6} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="var(--cyber-dim)"
            fontSize={10}
            fontFamily="'Share Tech Mono', monospace"
            tickFormatter={(value) => value.split(':').slice(0, 2).join(':')}
          />
          <YAxis 
            stroke="var(--cyber-dim)"
            fontSize={10}
            fontFamily="'Share Tech Mono', monospace"
            domain={[0, max]}
            tickFormatter={(value) => `${value}${unit}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--cyber-bg)',
              border: `1px solid ${color}`,
              borderRadius: '0',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '11px',
              color: color,
              boxShadow: `0 0 8px ${color}`,
            }}
            labelStyle={{ color: 'var(--cyber-dim)' }}
            formatter={(value: number) => [`${value.toFixed(1)}${unit}`, title]}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#gradient-${title})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
