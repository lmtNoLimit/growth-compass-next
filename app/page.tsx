"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RadarChart from "@/components/charts/RadarChart";
import AssessmentForm from "@/components/forms/AssessmentForm";
import HistoryList from "@/components/history/HistoryList";
import { ChartData } from "chart.js";

interface Assessment {
  _id: string;
  name: string;
  date: string;
  scores: Record<string, number>;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [draftScores, setDraftScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const [assessmentsRes, categoriesRes] = await Promise.all([
        fetch("/api/assessments"),
        fetch("/api/categories"),
      ]);

      const assessmentsData = await assessmentsRes.json();
      const categoriesData = await categoriesRes.json();

      if (assessmentsData.assessments) {
        setAssessments(assessmentsData.assessments);
        // Select the most recent assessment by default if none selected
        if (assessmentsData.assessments.length > 0 && selectedIds.length === 0) {
          setSelectedIds([assessmentsData.assessments[0]._id]);
        }
      }

      if (categoriesData.categories) {
        setCategories(categoriesData.categories);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentAdded = () => {
    fetchData();
  };

  const handleDeleteAssessment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assessment?")) return;

    try {
      const res = await fetch(`/api/assessments?id=${id}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting assessment:", error);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      } else {
        if (prev.length >= 3) {
          return [...prev.slice(1), id]; // Keep max 3, remove oldest selection
        }
        return [...prev, id];
      }
    });
  };

  // Prepare Chart Data
  const getChartData = (): ChartData<"radar"> => {
    const datasets: any[] = [];

    // Add Draft Dataset (Current Input)
    if (Object.keys(draftScores).length > 0) {
      datasets.push({
        label: "Current Draft",
        data: categories.map((cat) => draftScores[cat] || 0),
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 2,
        borderDash: [5, 5], // Dashed line for draft
        pointBackgroundColor: "rgba(255, 255, 255, 1)",
        pointBorderColor: "#fff",
        order: 0, // Render on top
      });
    }

    // Add Selected Historical Datasets
    const historicalDatasets = selectedIds
      .map((id, index) => {
        const assessment = assessments.find((a) => a._id === id);
        if (!assessment) return null;

        const colors = [
          { border: "rgba(99, 102, 241, 1)", bg: "rgba(99, 102, 241, 0.2)" }, // Primary
          { border: "rgba(16, 185, 129, 1)", bg: "rgba(16, 185, 129, 0.2)" }, // Success
          { border: "rgba(245, 158, 11, 1)", bg: "rgba(245, 158, 11, 0.2)" }, // Warning
        ];

        const color = colors[index % colors.length];

        return {
          label: assessment.name,
          data: categories.map((cat) => assessment.scores[cat] || 0),
          backgroundColor: color.bg,
          borderColor: color.border,
          borderWidth: 2,
          pointBackgroundColor: color.border,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: color.border,
        };
      })
      .filter(Boolean) as any[];

    datasets.push(...historicalDatasets);

    // If no data at all, show empty chart
    if (datasets.length === 0) {
      return {
        labels: categories,
        datasets: [
          {
            label: "Empty",
            data: categories.map(() => 0),
            backgroundColor: "rgba(148, 163, 184, 0.1)",
            borderColor: "rgba(148, 163, 184, 0.2)",
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels: categories,
      datasets,
    };
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Chart & History */}
      <div className="lg:col-span-2 space-y-8">
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Skill Growth</h2>
            <div className="text-sm text-slate-400">
              {selectedIds.length > 0
                ? `Comparing ${selectedIds.length} assessment(s)`
                : "Select assessments to compare"}
            </div>
          </div>
          <RadarChart data={getChartData()} />
        </div>

        <div className="h-[400px]">
          <HistoryList
            assessments={assessments}
            selectedIds={selectedIds}
            onToggleSelection={toggleSelection}
            onDelete={handleDeleteAssessment}
          />
        </div>
      </div>

      {/* Right Column: New Assessment */}
      <div className="lg:col-span-1">
        <AssessmentForm 
          categories={categories}
          onAssessmentAdded={handleAssessmentAdded}
          onCategoriesUpdated={fetchData}
          onScoresChange={setDraftScores}
        />
      </div>
    </div>
  );
}
