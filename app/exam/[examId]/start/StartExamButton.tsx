"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle, Loader2 } from "lucide-react";

export default function StartExamButton({ examId }: { examId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    // The attempt logic initializes via API, but we just redirect to the attempt page
    // where the Client Component there handles the "Resume/Start" call to API.
    // Actually, calling it here helps catch payment errors early.

    try {
      const res = await fetch(`/api/exams/${examId}/start`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        setLoading(false);
        return;
      }

      // Redirect to attempt page
      router.push(`/exam/${examId}/attempt`);
    } catch {
      alert("Failed to start exam");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleStart}
      disabled={loading}
      className="bg-primary text-white px-6 py-3 rounded font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <PlayCircle className="h-5 w-5" />
      )}
      {loading ? "Initializing..." : "Begin Examination"}
    </button>
  );
}
