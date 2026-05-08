import { Users, AlertCircle } from 'lucide-react';
import type { PeopleInSpaceData } from '../../types';
import { Skeleton } from '../ui/Skeleton';

interface PeopleInSpaceProps {
  data: PeopleInSpaceData;
}

const craftColors: Record<string, string> = {
  ISS: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Tiangong': 'bg-red-500/20 text-red-400 border-red-500/30',
};

function getCraftColor(craft: string) {
  return craftColors[craft] || 'bg-violet-500/20 text-violet-400 border-violet-500/30';
}

export function PeopleInSpace({ data }: PeopleInSpaceProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-violet-500/10">
          <Users className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold dark:text-white text-gray-900 text-sm">People in Space</h3>
          {!data.loading && !data.error && (
            <p className="text-xs dark:text-slate-400 text-gray-500">
              {data.number} astronaut{data.number !== 1 ? 's' : ''} currently in orbit
            </p>
          )}
        </div>
        {!data.loading && !data.error && (
          <span className="ml-auto text-3xl font-bold text-violet-400 font-mono">
            {data.number}
          </span>
        )}
      </div>

      {data.loading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      )}

      {data.error && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {data.error}
        </div>
      )}

      {!data.loading && !data.error && (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scroll">
          {data.people.map((person) => (
            <div
              key={`${person.name}-${person.craft}`}
              className="flex items-center justify-between p-2.5 rounded-lg dark:bg-white/5 bg-gray-50"
            >
              <span className="text-sm dark:text-slate-200 text-gray-800 font-medium truncate mr-2">
                👨‍🚀 {person.name}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${getCraftColor(person.craft)}`}
              >
                {person.craft}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
