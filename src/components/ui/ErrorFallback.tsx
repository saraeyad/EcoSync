import { AlertTriangle, RefreshCw } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";

type AppError = Error & { stack?: string };

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const appError = error as AppError;
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-lg w-full glass rounded-2xl p-8 border border-red-500/20 text-center">
        <div className="inline-flex p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
          <AlertTriangle size={28} className="text-red-400" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          {appError?.message ?? "An unexpected error occurred while loading EcoSync."}
        </p>

        {appError?.stack && (
          <pre className="text-left text-xs text-red-300 bg-slate-900 rounded-xl p-4 mb-6 overflow-auto max-h-40 border border-red-500/10">
            {appError.stack}
          </pre>
        )}

        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm transition-colors"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      </div>
    </div>
  );
}
