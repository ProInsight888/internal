import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Fragment, useState, useRef, useEffect } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComponent = ({ currentPage, lastPage }) => {
    const windowSize = 5;
    const halfWindow = Math.floor(windowSize / 2);

    let start = Math.max(1, currentPage - halfWindow);
    let end = Math.min(lastPage, start + windowSize - 1);

    if (end - start + 1 < windowSize) {
        start = Math.max(1, end - windowSize + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <Pagination>
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious href={`?page=${currentPage - 1}`} />
                    </PaginationItem>
                )}

                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={`?page=${page}`}
                            isActive={page === currentPage}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {currentPage < lastPage && (
                    <PaginationItem>
                        <PaginationNext href={`?page=${currentPage + 1}`} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
};

export default function AuditIndex({ audits }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [userFilter, setUserFilter] = useState("all");
    const [actionFilter, setActionFilter] = useState("all");

    // Get unique users for filter dropdown - FIXED
    const uniqueUsers = [
        ...new Set(audits.data.map((audit) => audit.created_by)),
    ];

    // Filter data based on search and filters - FIXED: Only filter current page data
    const filteredAudits = audits.data.filter((audit) => {
        const matchesSearch =
            searchTerm === "" ||
            audit.created_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
            audit.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            audit.change_section
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesUser =
            userFilter === "all" || audit.created_by === userFilter;
        const matchesAction =
            actionFilter === "all" || audit.action === actionFilter;

        return matchesSearch && matchesUser && matchesAction;
    });

    const getActionColor = (action) => {
        switch (action) {
            case "Created":
                return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800";
            case "Updated":
                return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800";
            case "Deleted":
                return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800";
            case "Submitted":
                return "bg-yellow-100 text-yellow-800 border-yellow-400 dark:bg-yellow-500 dark:text-yellow-700 dark:border-yellow-800";
            case "Checked":
                return "bg-purple-400 text-purple-800 border-yellow-400 dark:bg-purple-400 dark:text-purple-700 dark:border-purple-800";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800";
        }
    };

    // Format date properly - FIXED
    const formatDateTime = (dateString) => {
        try {
            const date = new Date(dateString);
            return {
                date: date.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
                time: date.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }),
            };
        } catch (error) {
            return {
                date: "Invalid Date",
                time: "",
            };
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 rounded-3xl text-white shadow-2xl dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-lg"></div>

                    <div className="relative z-10">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                            Audit Logs
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl">
                            Track all system activities, user actions, and
                            security events in real-time
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Audit Logs" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Search and Filters */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div>
                                <InputLabel
                                    htmlFor="search"
                                    value="Search Logs"
                                    className="dark:text-white"
                                />
                                <TextInput
                                    id="search"
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    placeholder="Search users, actions, subjects..."
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="userFilter"
                                    value="Filter by User"
                                    className="dark:text-white"
                                />
                                <select
                                    id="userFilter"
                                    value={userFilter}
                                    onChange={(e) =>
                                        setUserFilter(e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                >
                                    <option value="all">All Users</option>
                                    {uniqueUsers.map((userName) => (
                                        <option key={userName} value={userName}>
                                            {userName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Action Filter */}
                            <div>
                                <InputLabel
                                    htmlFor="actionFilter"
                                    value="Filter by Action"
                                    className="dark:text-white"
                                />
                                <select
                                    id="actionFilter"
                                    value={actionFilter}
                                    onChange={(e) =>
                                        setActionFilter(e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                >
                                    <option value="all">All Actions</option>
                                    <option value="Created">Created</option>
                                    <option value="Updated">Updated</option>
                                    <option value="Deleted">Deleted</option>
                                    <option value="Submitted">Submitted</option>
                                </select>
                            </div>

                            {/* Reset Filters */}
                            <div className="flex items-end">
                                <PrimaryButton
                                    onClick={() => {
                                        setSearchTerm("");
                                        setUserFilter("all");
                                        setActionFilter("all");
                                    }}
                                    className="w-full"
                                >
                                    Clear Filters
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>

                    {/* Audit Logs Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Action
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredAudits.map((audit) => {
                                        const formattedDate = formatDateTime(
                                            audit.created_at
                                        );
                                        return (
                                            <tr
                                                key={audit.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                                            {audit.created_by?.charAt(
                                                                0
                                                            ) || "U"}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {
                                                                    audit.created_by
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {
                                                                    audit.change_section
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <span
                                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getActionColor(
                                                                audit.action
                                                            )}`}
                                                        >
                                                            {audit.action
                                                                ?.charAt(0)
                                                                ?.toUpperCase() +
                                                                audit.action?.slice(
                                                                    1
                                                                ) || "Unknown"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {formattedDate.date}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formattedDate.time}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* No results message */}
                            {filteredAudits.length === 0 && (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 dark:text-gray-400">
                                        No audit logs found matching your
                                        filters.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <PaginationComponent
                                currentPage={audits.current_page}
                                lastPage={audits.last_page}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
