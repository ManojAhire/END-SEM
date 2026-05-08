import { MapPin, Zap, Navigation, Activity, Clock } from 'lucide-react';
import type { ISSData } from '../../types';
import { StatSkeleton } from '../ui/Skeleton';

interface ISSStatsProps {
  data: ISSData;
}

const stats = [
  {
    key: 'lat',
    icon: MapPin,
    label: 'Latitude',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    format: (d: ISSData) => `${d.position.lat.toFixed(4)}°`,
  },
  {
    key: 'lng',
    icon: Navigation,
    label: 'Longitude',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    format: (d: ISSData) => `${d.position.lng.toFixed(4)}°`,
  },
  {
    key: 'speed',
    icon: Zap,
    label: 'Speed',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    format: (d: ISSData) => `${d.speed.toFixed(0)} km/h`,
  },
  {
    key: 'location',
    icon: MapPin,
    label: 'Location',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    format: (d: ISSData) => d.locationName,
  },
  {
    key: 'tracked',
    icon: Activity,
    label: 'Positions Tracked',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    format: (d: ISSData) => `${d.trajectory.length} / 15`,
  },
  {
    key: 'updated',
    icon: Clock,
    label: 'Last Updated',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    format: (d: ISSData) =>
      d.lastUpdated ? d.lastUpdated.toLocaleTimeString() : '—',
  },
];

export function ISSStats({ data }: ISSStatsProps) {
  if (data.loading && data.trajectory.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <StatSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {stats.map(({ key, icon: Icon, label, color, bg, format }) => (
        <div key={key} className="glass-card p-4 flex items-start gap-3 hover:scale-[1.02] transition-transform">
          <div className={`p-2 rounded-lg ${bg} flex-shrink-0`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs dark:text-slate-400 text-gray-500 mb-0.5">{label}</p>
            <p className={`font-mono text-sm font-semibold ${color} truncate`}>
              {format(data)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
