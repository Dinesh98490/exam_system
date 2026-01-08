import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { ExamAttempt } from "@/models/ExamAttempt";
import { Exam } from "@/models/Exam";
import { redirect } from "next/navigation";
import { Trophy, Target, Clock, BookOpen } from "lucide-react";

export default async function StudentOverview() {
  const session = await getSession();
  if (!session) redirect("/login");

  await dbConnect();

  // Metrics
  const attempts = await ExamAttempt.find({ userId: session.userId }).sort({
    createdAt: -1,
  });
  const totalAttempts = attempts.length;
  const completedAttempts = attempts.filter((a: any) => a.completedAt).length;

  let totalScore = 0;
  let maxPossibleScore = 0; // Approximate

  // Calculate average score for completed exams
  // This is simplified as we don't strictly track max score per attempt easily without joining questions
  // We'll just show average obtained score
  if (completedAttempts > 0) {
    totalScore = attempts.reduce(
      (acc: number, curr: any) => acc + (curr.score || 0),
      0
    );
  }
  const avgScore =
    completedAttempts > 0 ? (totalScore / completedAttempts).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Attempts</p>
            <p className="text-2xl font-bold text-gray-900">{totalAttempts}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Exams Completed</p>
            <p className="text-2xl font-bold text-gray-900">
              {completedAttempts}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg. Score</p>
            <p className="text-2xl font-bold text-gray-900">{avgScore}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-full text-purple-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalAttempts - completedAttempts}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {attempts.length === 0 ? (
            <div className="p-6 text-gray-500 text-center text-sm">
              No recent activity found.
            </div>
          ) : (
            attempts.slice(0, 5).map((attempt: any) => (
              <div
                key={attempt._id}
                className="px-6 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Exam Attempt
                  </p>
                  <p className="text-xs text-gray-500">
                    Started {new Date(attempt.startTime).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm">
                  {attempt.completedAt ? (
                    <span className="text-green-600 font-medium">
                      Score: {attempt.score}
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-medium">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
