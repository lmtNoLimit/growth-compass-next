"use client";

export function ChartSkeleton() {
  return (
    <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full border-4 border-slate-700/30 animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/2 h-1/2 rounded-full border-4 border-slate-700/30 animate-pulse delay-75" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/4 h-1/4 rounded-full border-4 border-slate-700/30 animate-pulse delay-150" />
        </div>
      </div>
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="h-5 w-32 bg-slate-700 rounded mb-2" />
          <div className="h-3 w-24 bg-slate-700 rounded" />
        </div>
        <div className="text-right">
          <div className="h-6 w-12 bg-slate-700 rounded mb-1" />
          <div className="h-3 w-16 bg-slate-700 rounded" />
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="glass-panel p-6 animate-pulse">
      <div className="h-7 w-40 bg-slate-700 rounded mb-6" />
      
      <div className="mb-6">
        <div className="h-4 w-32 bg-slate-700 rounded mb-2" />
        <div className="h-10 w-full bg-slate-700 rounded" />
      </div>

      <div className="space-y-6 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <div className="h-4 w-24 bg-slate-700 rounded mb-2" />
            <div className="h-2 w-full bg-slate-700 rounded" />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="h-10 flex-1 bg-slate-700 rounded-lg" />
        <div className="h-10 flex-1 bg-slate-700 rounded-lg" />
      </div>
    </div>
  );
}

export function HistoryListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  );
}
