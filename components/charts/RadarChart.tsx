"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  data: ChartData<"radar">;
}

export default function RadarChart({ data }: RadarChartProps) {
  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        pointLabels: {
          color: "#94a3b8",
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
        ticks: {
          display: false,
          stepSize: 2,
          maxTicksLimit: 6,
        },
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#e2e8f0",
          font: {
            family: "'Inter', sans-serif",
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
  };

  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Radar data={data} options={options} />
    </div>
  );
}
