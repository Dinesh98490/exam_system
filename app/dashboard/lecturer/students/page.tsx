import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { ExamAttempt } from "@/models/ExamAttempt";
import { redirect } from "next/navigation";
import { Role } from "@/lib/rbac-definitions";
import { Users as UsersIcon } from "lucide-react";
import StudentTable from "./StudentTable";

export const metadata = {
  title: "Enrolled Students | Lecturer Portal",
};

export default async function StudentsPage() {
  const session = await getSession();
  if (!session || session.role !== Role.LECTURER) redirect("/login");

  await dbConnect();

  // Fetch all students
  const students = await User.find({ role: "STUDENT" }).sort({ name: 1 }).lean();

  // Fetch stats for each student
  const studentData = await Promise.all(
    students.map(async (student: any) => {
      const attempts = await ExamAttempt.find({ userId: student._id }).sort({ createdAt: -1 }).lean();

      const totalAttempts = attempts.length;
      let totalScore = 0;
      let completedCount = 0;

      attempts.forEach((attempt: any) => {
        if (attempt.score !== undefined) {
          totalScore += attempt.score;
          completedCount++;
        }
      });

      const avgScore = completedCount > 0 ? (totalScore / (completedCount * 100) * 100).toFixed(1) : "0.0";
      const lastAttemptAt = attempts.length > 0 ? (attempts[0] as any).createdAt : null;

      return {
        _id: student._id.toString(),
        name: student.name,
        email: student.email,
        totalAttempts,
        avgScore,
        lastAttemptAt: lastAttemptAt ? lastAttemptAt.toISOString() : null,
      };
    })
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <UsersIcon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Enrolled Students
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Track student performance and engagement across all examinations.
            </p>
          </div>
        </div>
      </div>

      <StudentTable students={studentData} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <UsersIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Total Enrolled</div>
            <div className="text-2xl font-bold">{students.length}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <GraduationCap className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Active Performers</div>
            <div className="text-2xl font-bold">
              {studentData.filter(s => s.totalAttempts > 0).length}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4 border-l-4 border-l-primary">
          <div className="bg-primary/5 p-3 rounded-lg">
            <BarChart2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Avg. Engagement</div>
            <div className="text-2xl font-bold">
              {(studentData.reduce((acc, s) => acc + s.totalAttempts, 0) / (students.length || 1)).toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-using the types from earlier for better TS support in this file
import { GraduationCap, BarChart2 } from "lucide-react";
