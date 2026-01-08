import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import UserModel from "@/models/User";
import { redirect } from "next/navigation";
import { User, Shield, Mail, Calendar, Hash } from "lucide-react";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  await dbConnect();
  const user = await UserModel.findById(session.userId).lean();

  if (!user) return <div>User not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
        <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold uppercase">
            {user.name ? user.name.charAt(0) : "U"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user.name || "Student"}
            </h2>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4" /> {user.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="bg-white p-2 rounded shadow-sm">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">
                System Role
              </p>
              <p className="font-medium text-gray-900">{user.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="bg-white p-2 rounded shadow-sm">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">
                Account Status
              </p>
              <p className="font-medium text-green-600 flex items-center gap-1">
                Active
                {user.isLocked && (
                  <span className="text-red-500 text-xs ml-1">(Locked)</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="bg-white p-2 rounded shadow-sm">
              <Hash className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">
                User ID
              </p>
              <p className="font-medium text-gray-900 text-sm font-mono">
                {user._id.toString().substring(0, 12)}...
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="bg-white p-2 rounded shadow-sm">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">
                Joined On
              </p>
              <p className="font-medium text-gray-900">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
