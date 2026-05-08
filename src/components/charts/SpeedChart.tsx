import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
);

interface SpeedChartProps {
  speedHistory: { time: string; speed: number }[];
}

export function SpeedChart({ speedHistory }: SpeedChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const textColor = isDark ? '#94a3b8' : '#6b7280';

  const data = {
    labels: speedHistory.map((s) => s.time),
    datasets: [
      {
        label: 'ISS Speed (km/h)',
        data: speedHistory.map((s) => s.speed),
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.08)',
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: 'transparent',
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#0f1028' : '#ffffff',
        borderColor: '#00d4ff',
        borderWidth: 1,
        titleColor: isDark ? '#e2e8f0' : '#1f2937',
        bodyColor: '#00d4ff',
        callbacks: {
          label: (ctx: any) => ` ${ctx.raw.toLocaleString()} km/h`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: textColor, maxTicksLimit: 8, font: { size: 10 } },
        grid: { color: gridColor },
        border: { display: false },
      },
      y: {
        ticks: {
          color: textColor,
          font: { size: 10 },
          callback: (v: any) => `${(v / 1000).toFixed(0)}k`,
        },
        grid: { color: gridColor },
        border: { display: false },
      },
    },
    animation: { duration: 400 },
  };

  if (speedHistory.length < 2) {
    return (
      <div className="h-[220px] flex items-center justify-center dark:text-slate-400 text-gray-500 text-sm">
        Gathering speed data... (updates every 15s)
      </div>
    );
  }

  return (
    <div className="h-[220px]">
      <Line data={data} options={options as any} />
    </div>
  );
}
