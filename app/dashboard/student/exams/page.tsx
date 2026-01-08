import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { Exam } from "@/models/Exam";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  CheckCircle,
  Lock,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

import { ExamAccess } from "@/models/ExamAccess";

export default async function StudentDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");

  await dbConnect();

  // Fetch Exams via Mongoose
  // Using lean() for plain JS objects
  const exams = await Exam.find({ status: "PUBLISHED" })
    .sort({ createdAt: -1 })
    .lean();

  // Placeholder for Access/Attempts since we haven't migrated those tables to Mongoose models yet.
  // For the purpose of the demo "fast", we will treat:
  // - Free exams as accessible.
  // - Paid exams as locked (until we wire up payment/access in Mongoose).
  // Fetch Exam Access
  const accessList = await ExamAccess.find({ userId: session.userId }).lean();
  const accessSet = new Set(accessList.map((a: any) => a.examId.toString()));

  const attemptMap = new Map(); // Still placeholder for attempts until migrated

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Examinations</h1>
          <p className="text-gray-500 text-sm">
            View and manage your upcoming assessments.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
          <Clock className="h-4 w-4" />
          <span>
            Server Time:{" "}
            {new Date().toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Topic / Exam Title</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {exams.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No exams available at this time.
                  </td>
                </tr>
              ) : (
                exams.map((exam: any) => {
                  const examId = exam._id.toString(); // Mongoose _id
                  const hasAccess = accessSet.has(examId) || exam.price === 0;
                  const attempt = attemptMap.get(examId);
                  const isCompleted = !!attempt?.completedAt;
                  const inProgress = !!attempt && !attempt.completedAt;

                  return (
                    <tr
                      key={examId}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {exam.title}
                        </div>
                        {exam.description && (
                          <div className="text-xs text-gray-500 mt-1 max-w-xs">
                            {exam.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {exam.durationMinutes} mins
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                            <CheckCircle className="h-3 w-3" />
                            Completed
                          </span>
                        ) : inProgress ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            <Clock className="h-3 w-3" />
                            In Progress
                          </span>
                        ) : !hasAccess ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
                            <Lock className="h-3 w-3" />
                            Pay to Unlock (Rs. {exam.price})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            <ArrowRight className="h-3 w-3" />
                            Available
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isCompleted ? (
                          <span className="text-gray-400 text-xs">
                            Score: {attempt.score ?? "Pending"}
                          </span>
                        ) : !hasAccess ? (
                          <Link
                            href={`/payment/initiate?examId=${examId}`}
                            className="inline-flex items-center gap-1 bg-primary text-white text-xs px-3 py-1.5 rounded hover:bg-primary/90 transition-colors shadow-sm"
                          >
                            <Lock className="h-3 w-3" />
                            Unlock Access
                          </Link>
                        ) : (
                          <Link
                            href={`/exam/${examId}/start`}
                            className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded transition-colors shadow-sm ${
                              inProgress
                                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                                : "bg-primary text-white hover:bg-primary/90"
                            }`}
                          >
                            {inProgress ? "Resume Exam" : "Start Exam"}
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-md flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-blue-700 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">Examination Rules</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Ensure you have a stable internet connection.</li>
            <li>Once started, the timer cannot be paused.</li>
            <li>
              Switching tabs or minimizing the browser may be logged as
              suspicious activity.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
