import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="glass-card p-6 flex flex-col items-center gap-4 text-center border border-red-500/20">
      <AlertTriangle className="w-10 h-10 text-red-400" />
      <div>
        <p className="font-semibold dark:text-white text-gray-900">Something went wrong</p>
        <p className="text-sm dark:text-slate-400 text-gray-500 mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}
