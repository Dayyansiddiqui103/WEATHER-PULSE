import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Current Weather Hero Skeleton */}
      <div className="h-72 rounded-3xl bg-slate-900/80 border border-slate-800 p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-slate-800 rounded-xl" />
            <div className="h-4 w-32 bg-slate-800 rounded-lg" />
          </div>
          <div className="h-10 w-10 bg-slate-800 rounded-2xl" />
        </div>
        <div className="flex justify-between items-end">
          <div className="h-20 w-44 bg-slate-800 rounded-2xl" />
          <div className="h-32 w-32 bg-slate-800 rounded-full" />
        </div>
      </div>

      {/* Details Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-slate-800 rounded" />
              <div className="h-6 w-6 bg-slate-800 rounded-lg" />
            </div>
            <div className="h-6 w-24 bg-slate-800 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Forecast & Chart Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 rounded-3xl bg-slate-900/60 border border-slate-800 p-6" />
        <div className="h-80 rounded-3xl bg-slate-900/60 border border-slate-800 p-6" />
      </div>
    </div>
  );
};
