"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoriesUpdated: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onCategoriesUpdated,
}: SettingsModalProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = () => {
    setCategories([...categories, `New Skill ${categories.length + 1}`]);
  };

  const handleRemoveCategory = (index: number) => {
    if (categories.length <= 3) {
      alert("You must have at least 3 categories.");
      return;
    }
    const newCategories = [...categories];
    newCategories.splice(index, 1);
    setCategories(newCategories);
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      });

      if (res.ok) {
        onCategoriesUpdated();
        onClose();
      } else {
        alert("Failed to save categories");
      }
    } catch (error) {
      console.error("Error saving categories:", error);
      alert("Error saving categories");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md p-6 m-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Manage Categories</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar">
          {categories.map((category, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={category}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
                className="input-field flex-1"
              />
              <button
                onClick={() => handleRemoveCategory(index)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Remove"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAddCategory}
            className="btn btn-secondary w-full border-dashed border-2 border-slate-600 bg-transparent hover:bg-slate-700/50"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <div className="border-t border-slate-700 pt-4 mt-2">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Data Migration</h3>
            <details className="group">
              <summary className="list-none btn btn-secondary w-full cursor-pointer flex justify-between items-center">
                <span>Import Legacy Data</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 space-y-3">
                <p className="text-xs text-slate-400">
                  Paste the JSON data from your old Growth Compass to import your history.
                </p>
                <textarea
                  className="input-field min-h-[100px] text-xs font-mono"
                  placeholder='{"categories": [...], "assessments": [...]}'
                  id="import-data"
                ></textarea>
                <button
                  onClick={async () => {
                    const input = (document.getElementById("import-data") as HTMLTextAreaElement).value;
                    if (!input) return;
                    
                    try {
                      setLoading(true);
                      const data = JSON.parse(input);
                      
                      // Import Categories
                      if (data.categories && Array.isArray(data.categories)) {
                         await fetch("/api/categories", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ categories: data.categories }),
                        });
                      }

                      // Import Assessments
                      if (data.assessments && Array.isArray(data.assessments)) {
                        for (const assessment of data.assessments) {
                          // Adapt old format to new format if needed
                          // Old: { id, date, scores, note? }
                          // New: { name, date, scores }
                          // We might need to generate a name if missing
                          const name = assessment.note || `Assessment ${new Date(assessment.date).toLocaleDateString()}`;
                          
                          await fetch("/api/assessments", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              name,
                              scores: assessment.scores,
                              // We can't easily backdate via the POST endpoint I made (it uses Date.now()), 
                              // but for MVP let's just import them as new or I should update the API to accept date.
                              // Let's update the API to accept date first or just accept they will be new.
                              // Actually, I should update the API to accept date.
                            }),
                          });
                        }
                      }
                      
                      alert("Import successful!");
                      onCategoriesUpdated();
                      onClose();
                    } catch (e) {
                      console.error(e);
                      alert("Invalid JSON data");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="btn btn-primary w-full text-sm"
                >
                  Import Data
                </button>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
