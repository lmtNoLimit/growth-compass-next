"use client";

import { useState, useEffect } from "react";
import { Trash2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Assessment {
  _id: string;
  name: string;
  date: string;
  scores: Record<string, number>;
}

interface HistoryListProps {
  assessments: Assessment[];
  selectedIds: string[];
  onToggleSelection: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HistoryList({
  assessments,
  selectedIds,
  onToggleSelection,
  onDelete,
}: HistoryListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateAverage = (scores: Record<string, number>) => {
    const values = Object.values(scores);
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return (sum / values.length).toFixed(1);
  };

  return (
    <div className="glass-panel p-6 h-full overflow-hidden flex flex-col">
      <h2 className="text-xl font-semibold mb-4">History</h2>
      
      <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
        {assessments.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            No assessments yet.
          </div>
        ) : (
          assessments.map((assessment) => (
            <div
              key={assessment._id}
              onClick={() => onToggleSelection(assessment._id)}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer group relative",
                selectedIds.includes(assessment._id)
                  ? "bg-primary/10 border-primary/50"
                  : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-slate-200">{assessment.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(assessment.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {calculateAverage(assessment.scores)}
                  </div>
                  <div className="text-xs text-slate-500">Avg Score</div>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(assessment._id);
                }}
                className="absolute top-4 right-14 opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-400 transition-all"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
