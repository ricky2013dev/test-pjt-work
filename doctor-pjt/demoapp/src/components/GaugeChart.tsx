import { useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

interface GaugeChartProps {
  value: number;
  total: number;
  color: string;
  label: string;
  sub: string;
}

export default function GaugeChart({ value, total, color, label, sub }: GaugeChartProps) {
  const chartRef = useRef<ChartJS<'doughnut'> | null>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const data = {
    datasets: [
      {
        data: [value, Math.max(total - value, 0)],
        backgroundColor: [color, '#e2e8ec'],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    rotation: -90,
    circumference: 180,
    cutout: '72%' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    animation: {
      animateRotate: true,
      duration: 700,
    },
  };

  const displayLabel = `${value} / ${total}`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[110px] h-[62px] overflow-hidden">
        <Doughnut
          ref={chartRef as React.RefObject<ChartJS<'doughnut'>>}
          data={data}
          options={options}
          width={110}
          height={62}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <div className="text-sm font-bold leading-none" style={{ color }}>
            {displayLabel}
          </div>
          <div className="text-[9px] text-text3 mt-0.5">{sub}</div>
        </div>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.6px] text-text3 mt-1">{label}</div>
    </div>
  );
}
