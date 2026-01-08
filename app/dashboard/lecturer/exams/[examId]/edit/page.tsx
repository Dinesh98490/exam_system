"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditExamPage() {
  const router = useRouter();
  const params = useParams(); // { examId: string }
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  // New Question Form State
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    points: 1,
  });

  useEffect(() => {
    // Fetch Exam Details and Questions
    const fetchData = async () => {
      try {
        // We need an API to fetch a single exam details + questions
        // Since we don't have a single GET /api/exams/[id] that returns structure,
        // We might need to implement that.
        // For now, let's assume we will build GET /api/exams/[examId]
        console.log("Fetching exam with ID:", params.examId);
        const res = await fetch(`/api/exams/${params.examId}`);
        if (!res.ok) {
          const errText = await res.text();
          console.error("Fetch failed:", res.status, errText);
          throw new Error(`Failed to load exam: ${res.status} ${errText}`);
        }
        const data = await res.json();
        setExam(data.exam);
        setQuestions(data.questions);
      } catch (e: any) {
        console.error(e);
        alert(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.examId]);

  const handleUpdateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam) return;

    try {
      const res = await fetch(`/api/exams/${params.examId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exam),
      });
      if (!res.ok) throw new Error("Failed update");
      alert("Exam details updated!");
    } catch (e) {
      alert("Error updating exam");
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/exams/${params.examId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion),
      });
      if (!res.ok) throw new Error("Failed add question");
      const addedQ = await res.json();

      setQuestions([...questions, addedQ]);
      setShowAddQuestion(false);
      setNewQuestion({
        text: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        points: 1,
      });
    } catch (e) {
      alert("Error adding question");
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      // Assuming we have this route
      const res = await fetch(`/api/questions/${qId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed delete");
      setQuestions(questions.filter((q) => q._id !== qId));
    } catch (e) {
      alert("Error deleting question");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!exam) return <div>Exam not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/lecturer"
          className="text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Exam: {exam.title}
        </h1>
      </div>

      {/* Exam Details Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Exam Details
        </h2>
        <form
          onSubmit={handleUpdateExam}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              value={exam.title}
              onChange={(e) => setExam({ ...exam, title: e.target.value })}
              type="text"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={exam.description}
              onChange={(e) =>
                setExam({ ...exam, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (min)
            </label>
            <input
              type="number"
              value={exam.durationMinutes}
              onChange={(e) =>
                setExam({ ...exam, durationMinutes: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              value={exam.price}
              onChange={(e) =>
                setExam({ ...exam, price: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> Save Details
            </button>
          </div>
        </form>
      </div>

      {/* Questions Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Questions ({questions.length})
          </h2>
          <button
            onClick={() => setShowAddQuestion(!showAddQuestion)}
            className="text-primary hover:bg-blue-50 px-3 py-1 rounded flex items-center gap-1 text-sm font-medium"
          >
            <Plus className="h-4 w-4" /> Add Question
          </button>
        </div>

        {showAddQuestion && (
          <form
            onSubmit={handleAddQuestion}
            className="bg-gray-50 p-4 rounded mb-6 border border-blue-100"
          >
            <h3 className="font-semibold text-sm mb-3">New Question</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Question text..."
                className="w-full px-3 py-2 border rounded"
                value={newQuestion.text}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, text: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-2">
                {newQuestion.options.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    className="w-full px-3 py-2 border rounded text-sm bg-white"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...newQuestion.options];
                      newOpts[idx] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: newOpts });
                    }}
                    required
                  />
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Correct Option (1-4)
                  </label>
                  <select
                    className="border rounded px-2 py-1"
                    value={newQuestion.correctOptionIndex}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        correctOptionIndex: Number(e.target.value),
                      })
                    }
                  >
                    {newQuestion.options.map((_, i) => (
                      <option key={i} value={i}>
                        Option {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Points
                  </label>
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-20"
                    value={newQuestion.points}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        points: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuestion(false)}
                  className="text-gray-500 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Save Question
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q._id}
              className="p-4 border rounded hover:border-gray-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-gray-400 mr-2">
                    Q{idx + 1}.
                  </span>
                  <span className="font-medium text-gray-900">{q.text}</span>
                  <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1">
                    {q.options.map((opt: string, i: number) => (
                      <div
                        key={i}
                        className={`text-sm ${
                          i === q.correctOptionIndex
                            ? "text-green-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteQuestion(q._id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {questions.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No questions added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
