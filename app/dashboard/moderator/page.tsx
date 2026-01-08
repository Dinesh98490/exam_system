import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { ActivityLog } from "@/models/ActivityLog";
import { redirect } from "next/navigation";
import { Role } from "@/lib/rbac-definitions";
import { Shield, AlertTriangle, Eye } from "lucide-react";

export default async function ModeratorDashboard() {
  const session = await getSession();
  if (
    !session ||
    (session.role !== Role.MODERATOR && session.role !== Role.ADMIN)
  )
    redirect("/login");

  await dbConnect();

  // Fetch Activity Logs
  const logs = await ActivityLog.find({})
    .sort({ timestamp: -1 })
    .limit(20)
    .populate("userId", "email role")
    .lean();

  // Map Mongoose result to match generic structure expected by UI
  const formattedLogs = logs.map((log: any) => ({
    ...log,
    user: log.userId, // Rename populated userId to user for UI compatibility
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-red-50 rounded-full text-red-700">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            System Moderation & Audit
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor activity and respond to security alerts.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
          <span className="font-semibold text-gray-700 text-sm">
            Recent System Activity
          </span>
          <span className="text-xs text-gray-500">Live Feed</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Timestamp</th>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Resource</th>
                <th className="px-6 py-3 font-medium">IP Addr</th>
                <th className="px-6 py-3 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {formattedLogs.map((log: any) => {
                const isRisk =
                  log.action.includes("FAILED") ||
                  log.action.includes("DELETE");
                return (
                  <tr key={log.id} className={isRisk ? "bg-red-50/30" : ""}>
                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("en-GB")}
                    </td>
                    <td className="px-6 py-3 text-gray-900">
                      {log.user?.email || "System/Unknown"}
                      <div className="text-xs text-gray-400">
                        {log.user?.role}
                      </div>
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {log.action}
                    </td>
                    <td className="px-6 py-3 text-gray-500 font-mono text-xs">
                      {log.resource || "-"}
                    </td>
                    <td className="px-6 py-3 text-gray-500 font-mono text-xs">
                      {log.ipAddress || "127.0.0.1"}
                    </td>
                    <td className="px-6 py-3">
                      {isRisk ? (
                        <span className="inline-flex items-center gap-1 text-red-600 text-xs font-bold uppercase">
                          <AlertTriangle className="h-3 w-3" /> High
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Low</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
