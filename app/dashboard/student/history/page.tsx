// Server Component for History
import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { ExamAttempt } from "@/models/ExamAttempt";
import { redirect } from "next/navigation";

export default async function ExamHistoryPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  await dbConnect();

  const attempts = await ExamAttempt.find({ userId: session.userId })
    .populate("examId", "title") // Populate exam title
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Attempt History</h1>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-600">
            <tr>
              <th className="px-6 py-4">Exam</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {attempts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              attempts.map((attempt: any) => (
                <tr key={attempt._id}>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {attempt.examId?.title || "Unknown Exam"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(attempt.startTime).toLocaleDateString()}{" "}
                    {new Date(attempt.startTime).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">
                    {attempt.completedAt ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        Completed
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                        In Progress
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {attempt.score !== undefined ? attempt.score : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
