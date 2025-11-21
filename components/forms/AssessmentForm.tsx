import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Slider from "@/components/ui/Slider";
import SettingsModal from "@/components/settings/SettingsModal";
import { Save, RotateCcw, Settings } from "lucide-react";

interface AssessmentFormProps {
  categories: string[];
  onAssessmentAdded: () => void;
  onCategoriesUpdated: () => void;
  onScoresChange: (scores: Record<string, number>) => void;
}

export default function AssessmentForm({ 
  categories, 
  onAssessmentAdded, 
  onCategoriesUpdated,
  onScoresChange
}: AssessmentFormProps) {
  const router = useRouter();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize/Update scores when categories change
  useEffect(() => {
    setScores(prev => {
      const newScores = { ...prev };
      let changed = false;
      categories.forEach((cat) => {
        if (newScores[cat] === undefined) {
          newScores[cat] = 5;
          changed = true;
        }
      });
      return changed ? newScores : prev;
    });
  }, [categories]);

  // Sync scores with parent whenever they change
  useEffect(() => {
    onScoresChange(scores);
  }, [scores, onScoresChange]);

  const handleScoreChange = (category: string, value: number) => {
    const newScores = { ...scores, [category]: value };
    setScores(newScores);
  };

  const handleReset = () => {
    const resetScores: Record<string, number> = {};
    categories.forEach((cat) => {
      resetScores[cat] = 5;
    });
    setScores(resetScores);
    setName("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter an assessment name");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, scores }),
      });

      if (res.ok) {
        toast.success("Assessment saved successfully!");
        handleReset();
        onAssessmentAdded();
      } else {
        toast.error("Failed to save assessment");
      }
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast.error("Error saving assessment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">New Assessment</h2>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Assessment Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          placeholder="e.g., Q1 2024 Review"
        />
      </div>

      <div className="space-y-6 mb-8">
        {categories.map((category) => (
          <Slider
            key={category}
            label={category}
            value={scores[category] || 0}
            onChange={(val) => handleScoreChange(category, val)}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleReset}
          className="btn btn-secondary flex-1"
          disabled={loading}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={handleSubmit}
          className="btn btn-primary flex-1"
          disabled={loading}
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Assessment"}
        </button>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onCategoriesUpdated={onCategoriesUpdated}
      />
    </div>
  );
}
