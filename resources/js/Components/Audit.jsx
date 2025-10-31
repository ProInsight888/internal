import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";

export default function Audit({ audits }) {
    const [activeFilter, setActiveFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    const filteredAudits =
        activeFilter === "All"
            ? audits.data
            : audits.data.filter((audit) =>
                  activeFilter === "Unread"
                      ? !audit.read
                      : audit.type === activeFilter
              );

    const handleauditClick = (auditId) => {
        setaudits((prevaudits) =>
            prevaudits.map((audit) =>
                audit.id === auditId
                    ? { ...audit, read: true }
                    : audit
            )
        );

        router.get(route("audit.index"));
    };

    return (
        <div className="mt-10 fixed top-1/2 right-0 transform -translate-y-1/2 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 rounded-l-xl shadow-2xl p-6 w-80 z-50 h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Audit Log
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Recent activities
                    </p>
                </div>
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {audits.data.filter((n) => !n.read).length} unread
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 space-y-4">
                {/* Quick Filters */}
                <div className="flex space-x-1">
                    {["All", "Unread"].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                activeFilter === filter
                                    ? "bg-blue-500 text-white shadow-sm"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {filteredAudits.map((audit) => (
                    <div
                        key={audit.id}
                        onClick={() => handleauditClick(audit.id)}
                        className={`p-4 rounded-lg border-l-4 transition-all hover:shadow-md ${
                            !audit.read
                                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-sm"
                                : "bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span
                                className={`font-semibold text-sm ${
                                    !audit.read
                                        ? "text-blue-800 dark:text-blue-200"
                                        : "text-gray-700 dark:text-gray-300"
                                }`}
                            >
                                {audit.created_by}
                            </span>
                            {!audit.read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                            )}
                        </div>
                        <p
                            className={`text-sm mb-2 ${
                                !audit.read
                                    ? "text-blue-700 dark:text-blue-300"
                                    : "text-gray-600 dark:text-gray-400"
                            }`}
                        >
                            {audit.change_section}
                        </p>
                        <div className="flex justify-between items-center">
                            <span
                                className={`text-xs ${
                                    !audit.read
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-500 dark:text-gray-500"
                                }`}
                            >
                                {new Date(audit.date).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </span>
                            <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                    audit.type === "system"
                                        ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300"
                                        : audit.type === "comment"
                                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                                        : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                                }`}
                            >
                                {audit.action}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Link
                    href="/audit"
                    className="block w-full py-2 text-sm text-center text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                    View all activities
                </Link>
            </div>
        </div>
    );
}
