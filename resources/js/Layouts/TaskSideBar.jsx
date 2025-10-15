import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    ChevronDown,
    Users,
    Filter,
    LayoutDashboard,
    X,
    Circle,
    CheckCircle,
    Clock,
    Slash,
    RefreshCw,
} from "lucide-react";

export default function TaskSideBar({
    header,
    children,
    users,
    tasks,
    selectedFilter,
    setSelectedFilter,
    selectedUser,
    setSelectedUser,
    sortDeadline,
    setSortDeadline,
    selectedCompany,
    setSelectedCompany,
}) {
    const [activeTeam, setActiveTeam] = useState("media");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { url } = usePage();

    // Determine active team from URL
    useEffect(() => {
        if (url.includes("creative")) setActiveTeam("creative");
        else if (url.includes("marketing")) setActiveTeam("marketing");
        else if (url.includes("it")) setActiveTeam("it");
        else setActiveTeam("media");
    }, [url]);

    // Count tasks by status
    const taskCounts = tasks.reduce(
        (acc, t) => {
            acc.all++; // Count all tasks
            if (t.status === "In Review") acc.inReview++;
            else if (t.status === "Rejected") acc.rejected++;
            else if (t.status === "Approved") acc.approved++;
            else if (t.status === "Cancel") acc.cancel++;
            else if (t.status === "Idle") acc.idle++;
            else if (t.status === "On Progress") acc.onProgress++;
            else if (t.status === "Pending") acc.pending++;
            return acc;
        },
        { 
            all: 0, 
            inReview: 0, 
            rejected: 0, 
            approved: 0, 
            cancel: 0,
            idle: 0,
            onProgress: 0,
            pending: 0
        }
    );

    const task_status = [
        {
            key: "All",
            label: "All Tasks",
            count: taskCounts.all,
            color: "bg-gray-100 text-gray-800",
            icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
            key: "",
            label: "Active Task",
            count: taskCounts.all - taskCounts.cancel - taskCounts.approved, // Only active tasks
            color: "bg-blue-100 text-blue-800",
            icon: <Circle className="h-4 w-4" />,
        },
        {
            key: "In Review",
            label: "In Review",
            count: taskCounts.inReview,
            color: "bg-amber-100 text-amber-800",
            icon: <Clock className="h-4 w-4" />,
        },
        {
            key: "Rejected",
            label: "Rejected",
            count: taskCounts.rejected,
            color: "bg-red-100 text-red-800",
            icon: <X className="h-4 w-4" />,
        },
        {
            key: "Approved",
            label: "Approved",
            count: taskCounts.approved,
            color: "bg-green-100 text-green-800",
            icon: <CheckCircle className="h-4 w-4" />,
        },
        {
            key: "Cancel",
            label: "Cancelled",
            count: taskCounts.cancel,
            color: "bg-gray-100 text-gray-800",
            icon: <Slash className="h-4 w-4" />,
        },
    ];

    const teams = [
        {
            key: "media",
            label: "Media Team",
            description: "Editor, Video & Photographer",
            route: route("media.index"),
            color: "bg-purple-500",
        },
        {
            key: "creative",
            label: "Creative Team",
            description: "Design",
            route: route("creative.index"),
            color: "bg-pink-500",
        },
        {
            key: "marketing",
            label: "Marketing",
            description: "Marketing campaigns",
            route: route("marketing.index"),
            color: "bg-blue-500",
        },
        {
            key: "it",
            label: "IT Team",
            description: "Technical support",
            route: route("it.index"),
            color: "bg-green-500",
        },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`relative transition-all duration-300 ease-in-out 
          ${isCollapsed ? "w-20" : "w-64"} 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 bg-white shadow-lg md:shadow-none`}
            >
                <div className="absolute inset-0 bg-white border-r border-gray-200">
                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                                isCollapsed ? "rotate-90" : "-rotate-90"
                            }`}
                        />
                    </button>

                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden absolute top-4 right-4 p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {/* Sidebar Content */}
                    <div className="overflow-y-auto h-[calc(100vh-4rem)] py-4 scrollbar-hide">
                        {/* Team Navigation */}
                        <div className="px-4 mb-6">
                            <div
                                className={`flex items-center ${
                                    isCollapsed ? "justify-center" : ""
                                } text-gray-500 mb-3`}
                            >
                                <Users className="h-4 w-4" />
                                {!isCollapsed && (
                                    <span className="ml-2 text-xs font-semibold uppercase tracking-wider">
                                        TEAMS
                                    </span>
                                )}
                            </div>

                            {teams.map((team) => (
                                <Link
                                    key={team.key}
                                    href={team.route}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center p-3 rounded-lg mb-2 transition-all duration-200 ${
                                        activeTeam === team.key
                                            ? "bg-blue-50 text-blue-700 border-l-4 -ml-1 border-blue-500"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <div
                                        className={`flex-shrink-0 h-3 w-3 rounded-full ${team.color}`}
                                    />
                                    {!isCollapsed && (
                                        <div className="ml-3">
                                            <div className="text-sm font-medium">
                                                {team.label}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {team.description}
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Task Status Filters */}
                        <div className="px-4">
                            <div
                                className={`flex items-center ${
                                    isCollapsed ? "justify-center" : ""
                                } text-gray-500 mb-3`}
                            >
                                <Filter className="h-4 w-4" />
                                {!isCollapsed && (
                                    <span className="ml-2 text-xs font-semibold uppercase tracking-wider">
                                        TASK STATUS
                                    </span>
                                )}
                            </div>

                            {task_status.map((filter) => (
                                <button
                                    key={filter.key}
                                    onClick={() => {
                                        setSelectedFilter(filter.key);
                                        setIsMobileOpen(false);
                                    }}
                                    className={`flex items-center w-full p-3 rounded-lg mb-2 transition-all duration-200 ${
                                        selectedFilter === filter.key
                                            ? "bg-blue-50 text-blue-700 border-r-4 border-blue-500"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            <span
                                                className={`p-1 rounded-md ${filter.color} mr-3`}
                                            >
                                                {filter.icon}
                                            </span>
                                            {!isCollapsed && (
                                                <span className="text-sm">
                                                    {filter.label}
                                                </span>
                                            )}
                                        </div>
                                        {!isCollapsed && (
                                            <span
                                                className={`py-1 px-2 rounded-full text-xs font-bold min-w-[2rem] flex items-center justify-center ${
                                                    selectedFilter ===
                                                    filter.key
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {filter.count}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Sort / Filters */}
                        <div className="px-4">
                            <div
                                className={`flex items-center ${
                                    isCollapsed ? "justify-center" : ""
                                } text-gray-500 mb-3`}
                            >
                                <Filter className="h-4 w-4" />
                                {!isCollapsed && (
                                    <span className="ml-2 text-xs font-semibold uppercase tracking-wider">
                                        SORT / FILTERS
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col space-y-3">
                                {/* User Filter */}
                                <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-3">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                        Filter by User
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        value={selectedUser}
                                        onChange={(e) =>
                                            setSelectedUser(e.target.value)
                                        }
                                    >
                                        <option value="">All Users</option>
                                        {Array.from(
                                            new Set(
                                                users.map((user) => user.name)
                                            )
                                        ).map((user, idx) => (
                                            <option key={idx} value={user}>
                                                {user}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Company Filter */}
                                <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-3">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                        Filter by Company
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        value={selectedCompany}
                                        onChange={(e) =>
                                            setSelectedCompany(e.target.value)
                                        }
                                    >
                                        <option value="">All Companies</option>
                                        {Array.from(
                                            new Set(
                                                tasks.map(
                                                    (task) => task.company
                                                )
                                            )
                                        ).map((company, idx) => (
                                            <option key={idx} value={company}>
                                                {company}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Deadline Sort */}
                                <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-3">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                        Sort by Deadline
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        value={sortDeadline}
                                        onChange={(e) =>
                                            setSortDeadline(e.target.value)
                                        }
                                    >
                                        <option value="Desc">
                                            ⏰ Urgent First
                                        </option>
                                        <option value="Asc">
                                            ⏰ Not Urgent First
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto md:ml-0 transition-margin duration-300">
                <div className="p-6">{children}</div>
            </div>

            {/* Add custom CSS to hide scrollbar */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;  /* Internet Explorer 10+ */
                    scrollbar-width: none;  /* Firefox */
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;  /* Safari and Chrome */
                }
            `}</style>
        </div>
    );
}