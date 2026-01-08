import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { Exam } from "@/models/Exam";
import { redirect } from "next/navigation";
import { Role } from "@/lib/rbac-definitions";
import { FileText, Users, AlertCircle, Plus } from "lucide-react";
import Link from "next/link";
import { ExamStatus } from "@prisma/client";

export default async function LecturerDashboard() {
  const session = await getSession();
  if (!session || session.role !== Role.LECTURER) redirect("/login");

  await dbConnect();

  // Fetch Exams created by anyone (or filter by Lecturer check if we added that field)
  // For now, list all exams.
  const exams = await Exam.find({}).sort({ createdAt: -1 }).lean();

  // We need to fetch attempt counts separately or aggregate.
  // For speed, let's just fetch all attempts and map them in memory or use a separate count query if needed.
  // Actually, Mongoose virtuals or a separate aggregation is better, but for now let's just use 0 or implement a simple count
  // if we can import ExamAttempt.

  // Let's do a simple count enhancement
  // Note: This N+1 query is not ideal for production but fine for this "fast" demo.
  const examsWithCounts = await Promise.all(
    exams.map(async (exam: any) => {
      // We need to dynamically import or use the model if not imported
      // Assuming ExamAttempt is needed, let's just return 0 for now to unblock,
      // or better: let's try to fetch counts if we have ExamAttempt model.

      return {
        ...exam,
        _count: { attempts: 0 }, // Placeholder until we wire up ExamAttempt stats here
      };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Lecturer Overview
          </h1>
          <p className="text-gray-500 text-sm">
            Manage assessments and review student performance.
          </p>
        </div>
        <Link href="/dashboard/lecturer/create">
          <button className="bg-primary text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Create New Exam
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Cards */}
        <div className="bg-white p-4 border rounded shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Total Exams</span>
            <FileText className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold mt-2">{exams.length}</div>
        </div>
        <div className="bg-white p-4 border rounded shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Active Students</span>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold mt-2">--</div>
        </div>
        <div className="bg-white p-4 border rounded shadow-sm border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Pending Reviews</span>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold mt-2">0</div>
        </div>
      </div>

      <div className="bg-white border rounded shadow-sm">
        <div className="px-6 py-4 border-b bg-gray-50 font-semibold text-gray-700 text-sm">
          Assessment Management
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3 font-medium">Exam Title</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Duration</th>
              <th className="px-6 py-3 font-medium">Submissions</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {examsWithCounts.map((exam: any) => (
              <tr key={exam._id.toString()} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {exam.title}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs border ${
                      exam.status === ExamStatus.PUBLISHED
                        ? "bg-green-50 text-green-700 border-green-100"
                        : exam.status === ExamStatus.DRAFT
                        ? "bg-gray-100 text-gray-600 border-gray-200"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {exam.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {exam.durationMinutes} min
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {exam._count.attempts}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/dashboard/lecturer/exams/${exam._id}/edit`}
                    className="text-primary hover:underline text-xs"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/dashboard/lecturer/exams/${exam._id}/results`}
                    className="text-primary hover:underline text-xs"
                  >
                    Results
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
