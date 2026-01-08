"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Save } from "lucide-react";

export default function CreateExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Collect form data
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      durationMinutes: formData.get("durationMinutes"),
      price: formData.get("price"),
    };

    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create exam");

      router.push("/dashboard/lecturer");
    } catch (e) {
      alert("Error creating exam");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Create New Assessment
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Title
            </label>
            <input
              name="title"
              required
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g. Advanced Network Security"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
              placeholder="Brief description of the exam content..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                name="durationMinutes"
                required
                type="number"
                min="15"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                defaultValue={60}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (NPR)
              </label>
              <input
                name="price"
                required
                type="number"
                min="0"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                defaultValue={0}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary/90 flex items-center gap-2"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Draft
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
