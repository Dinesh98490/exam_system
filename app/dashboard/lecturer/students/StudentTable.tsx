"use client";

import { useState } from "react";
import { Search, User as UserIcon, Mail, GraduationCap, BarChart2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Student {
    _id: string;
    name: string;
    email: string;
    totalAttempts: number;
    avgScore: string;
    lastAttemptAt: string | null;
}

export default function StudentTable({ students }: { students: Student[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 p-4 bg-white border rounded-lg shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-gray-500">
                    Showing {filteredStudents.length} of {students.length} students
                </div>
            </div>

            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Student Info</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Total Attempts</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Avg. Score</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Last Activity</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Profile</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <UserIcon className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{student.name}</div>
                                                    <div className="text-gray-500 text-xs flex items-center gap-1">
                                                        <Mail className="h-3 w-3" /> {student.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <BarChart2 className="h-4 w-4 text-blue-500" />
                                                <span className="font-medium text-gray-700">{student.totalAttempts}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="h-4 w-4 text-green-500" />
                                                <span className="font-medium text-gray-700">{student.avgScore}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {student.lastAttemptAt ? (
                                                <span>{new Date(student.lastAttemptAt).toLocaleDateString()} at {new Date(student.lastAttemptAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            ) : (
                                                "No activity"
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/dashboard/lecturer/students/${student._id}`}
                                                className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all inline-flex list-none"
                                                title="View Details"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                        No students found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
