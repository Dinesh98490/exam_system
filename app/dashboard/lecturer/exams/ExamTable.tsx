"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Edit3, Trash2, BarChart2, MoreVertical, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Exam {
    _id: string;
    title: string;
    description: string;
    durationMinutes: number;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    price: number;
    createdAt: string;
}

export default function ExamTable({ initialExams }: { initialExams: Exam[] }) {
    const [exams, setExams] = useState(initialExams);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const router = useRouter();

    const filteredExams = exams.filter((exam) => {
        const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || exam.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (examId: string) => {
        try {
            const res = await fetch(`/api/exams/${examId}`, { method: "DELETE" });
            if (res.ok) {
                setExams(exams.filter((e) => e._id !== examId));
                setIsDeleting(null);
                router.refresh();
            } else {
                alert("Failed to delete exam");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting the exam");
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search examinations..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Examination</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Duration</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Price</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredExams.length > 0 ? (
                                filteredExams.map((exam) => (
                                    <tr key={exam._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{exam.title}</div>
                                            <div className="text-gray-500 text-xs truncate max-w-xs">{exam.description}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${exam.status === "PUBLISHED"
                                                        ? "bg-green-50 text-green-700 border-green-100"
                                                        : exam.status === "DRAFT"
                                                            ? "bg-blue-50 text-blue-700 border-blue-100"
                                                            : "bg-gray-50 text-gray-700 border-gray-100"
                                                    }`}
                                            >
                                                {exam.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{exam.durationMinutes} mins</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">
                                            {exam.price === 0 ? (
                                                <span className="text-green-600 font-bold uppercase text-[10px]">Free</span>
                                            ) : (
                                                `Rs. ${exam.price}`
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/lecturer/exams/${exam._id}/edit`}
                                                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/lecturer/exams/${exam._id}/results`}
                                                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                                                    title="Results"
                                                >
                                                    <BarChart2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setIsDeleting(exam._id)}
                                                    className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-md transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                        No examinations found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleting && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-4 border-b pb-4">
                            <h3 className="text-lg font-bold text-gray-900">Delete Examination</h3>
                            <button onClick={() => setIsDeleting(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            Are you sure you want to delete this examination? This action will permanently remove all associated questions and student attempt data.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsDeleting(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(isDeleting)}
                                className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-md shadow-sm transition-colors"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
