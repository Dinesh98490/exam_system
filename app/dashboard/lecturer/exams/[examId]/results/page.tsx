import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { Exam } from "@/models/Exam";
import { ExamAttempt } from "@/models/ExamAttempt";
import { redirect } from "next/navigation";
import { Role } from "@/lib/rbac-definitions";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import UserModel from "@/models/User"; // Ensure this import exists or is correct

export default async function ExamResultsPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const session = await getSession();
  if (!session || session.role !== Role.LECTURER) redirect("/login");

  await dbConnect();

  // Need to ensure User model is registered for populate
  // Sometimes models are not registered if not imported
  // import "@/models/User";

  const exam = await Exam.findById(examId).lean();
  if (!exam) return <div>Exam not found</div>;

  const attempts = await ExamAttempt.find({ examId: examId })
    .populate({ path: "userId", model: UserModel, select: "name email" })
    .sort({ score: -1 })
    .lean();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/lecturer"
          className="text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {exam.title} - Results
          </h1>
          <p className="text-gray-500">{attempts.length} submissions</p>
        </div>
      </div>

      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3 font-medium">Rank</th>
              <th className="px-6 py-3 font-medium">Student</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Score</th>
              <th className="px-6 py-3 font-medium">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {attempts.map((attempt: any, index: number) => {
              // Calculate max score dynamically if needed, or assume standard points
              // For now displaying raw score
              return (
                <tr key={attempt._id.toString()} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-gray-500">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {attempt.userId?.name || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {attempt.userId?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(
                      attempt.completedAt || attempt.createdAt
                    ).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {attempt.score}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {/* Placeholder for percentage logic if max points known */}
                    --
                  </td>
                </tr>
              );
            })}
            {attempts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No attempts found for this exam.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
