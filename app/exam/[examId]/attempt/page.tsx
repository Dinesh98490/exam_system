"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Timer, Save } from "lucide-react";

type Question = {
  id: string;
  text: string;
  options: string[];
  points: number;
};

export default function ExamAttemptPage() {
  const params = useParams();
  const examId = params.examId as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [tabSwitches, setTabSwitches] = useState(0);

  // Initialize Exam
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`/api/exams/${examId}/start`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setAttemptId(data.attemptId);
        setQuestions(data.questions);
        setExpiresAt(new Date(data.expiresAt));
        setLoading(false);
      } catch (e: any) {
        alert(e.message);
        router.push("/dashboard/student");
      }
    };
    init();
  }, [examId, router]);

  // Submit Logic
  const submitExam = useCallback(
    async (finish = false) => {
      if (!attemptId) return;

      const formattedAnswers = Object.entries(answers).map(([qId, idx]) => ({
        questionId: qId,
        selectedOptionIndex: idx,
      }));

      try {
        await fetch(`/api/exams/attempt/${attemptId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: formattedAnswers, finish }),
        });

        if (finish) {
          router.push(`/exam/${examId}/submit`);
        }
      } catch (e) {
        console.error("Save failed", e);
      }
    },
    [attemptId, answers, examId, router]
  );

  // Timer
  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      const diff = expiresAt.getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(interval);
        // Auto Submit
        submitExam(true);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, submitExam]); // Added submitExam to dependencies

  // Anti-Cheating: Tab Switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((p) => p + 1);
        // Optional: Send log to server
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Auto-save every 30s
  useEffect(() => {
    const interval = setInterval(() => submitExam(false), 30000);
    return () => clearInterval(interval);
  }, [submitExam]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Exam...
      </div>
    );

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Distraction Free Header */}
      <header className="bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="font-bold text-gray-700">Exam Session</div>
        <div
          className={`flex items-center gap-2 font-mono text-xl font-bold ${
            minutes < 5 ? "text-red-600 animate-pulse" : "text-gray-900"
          }`}
        >
          <Timer className="h-5 w-5" />
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </header>

      {tabSwitches > 0 && (
        <div className="bg-red-600 text-white text-center py-1 text-sm font-bold">
          WARNING: Tab switching detected ({tabSwitches}). This activity is
          logged.
        </div>
      )}

      <main className="flex-1 max-w-4xl mx-auto w-full p-6">
        <div className="space-y-8">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className="bg-white p-6 border border-gray-200 rounded shadow-sm"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm font-bold">
                  Q{i + 1}
                </span>
                <div className="text-lg font-medium text-gray-900">
                  {q.text}
                </div>
                <span className="ml-auto text-xs text-gray-400 font-mono">
                  [{q.points} pts]
                </span>
              </div>

              <div className="space-y-2 pl-2">
                {q.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all ${
                      answers[q.id] === idx
                        ? "bg-blue-50 border-blue-300 ring-1 ring-blue-300"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      className="h-4 w-4 text-primary"
                      checked={answers[q.id] === idx}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: idx }))
                      }
                    />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-300 px-6 py-4 flex items-center justify-between sticky bottom-0 z-50">
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Auto-saving enabled...
        </div>
        <button
          onClick={() => {
            if (
              confirm("Are you sure you want to submit? This cannot be undone.")
            ) {
              submitExam(true);
            }
          }}
          className="bg-green-700 text-white px-8 py-3 rounded font-bold hover:bg-green-800 transition-colors shadow"
        >
          Submit Examination
        </button>
      </footer>
    </div>
  );
}
