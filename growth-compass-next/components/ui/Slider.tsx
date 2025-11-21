"use client";

import { cn } from "@/lib/utils";

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  colorClass?: string;
}

export default function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  colorClass = "accent-primary",
}: SliderProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <span className="text-sm font-bold text-primary">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer",
          colorClass
        )}
      />
    </div>
  );
}
