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
    Menu,
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
            acc.all++;
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
            pending: 0,
        }
    );

    const task_status = [
        {
            key: "",
            label: "Active Task",
            count: taskCounts.all - taskCounts.cancel - taskCounts.approved,
            color: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
            icon: <Circle className="h-4 w-4" />,
        },
        {
            key: "In Review",
            label: "In Review",
            count: taskCounts.inReview,
            color: "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
            icon: <Clock className="h-4 w-4" />,
        },
        {
            key: "Rejected",
            label: "Rejected",
            count: taskCounts.rejected,
            color: "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
            icon: <X className="h-4 w-4" />,
        },
        {
            key: "Approved",
            label: "Approved",
            count: taskCounts.approved,
            color: "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
            icon: <CheckCircle className="h-4 w-4" />,
        },
        {
            key: "Cancel",
            label: "Cancelled",
            count: taskCounts.cancel,
            color: "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
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
            label: "Marketing Team",
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
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700"
            >
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`relative transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 scrollbar-hide
                    ${isCollapsed ? "w-20" : "w-80"} 
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 flex flex-col`}
            >
                {/* Sidebar Header */}
                <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        {!isCollapsed && (
                            <div className="flex items-center space-x-3"></div>
                        )}

                        {/* Collapse Toggle */}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden md:flex items-center justify-center h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <ChevronDown
                                className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform ${
                                    isCollapsed ? "rotate-90" : "-rotate-90"
                                }`}
                            />
                        </button>

                        {/* Close button for mobile */}
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="md:hidden flex items-center justify-center h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                            <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Sidebar Content */}
                <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                    {/* Team Navigation */}
                    <div className="px-4 mb-8">
                        <div
                            className={`flex items-center ${
                                isCollapsed ? "justify-center" : ""
                            } text-gray-500 dark:text-gray-400 mb-4`}
                        >
                            <Users className="h-4 w-4" />
                            {!isCollapsed && (
                                <span className="ml-2 text-xs font-semibold uppercase tracking-wider">
                                    TEAMS
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            {teams.map((team) => (
                                <Link
                                    key={team.key}
                                    href={team.route}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                                        activeTeam === team.key
                                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                                    }`}
                                >
                                    <div
                                        className={`flex-shrink-0 h-3 w-3 rounded-full ${team.color}`}
                                    />
                                    {!isCollapsed && (
                                        <div className="ml-3 flex-1 min-w-0">
                                            <div className="text-sm font-medium truncate">
                                                {team.label}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {team.description}
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Task Status Filters */}
                    <div className="px-4 mb-8">
                        <div
                            className={`flex items-center ${
                                isCollapsed ? "justify-center" : ""
                            } text-gray-500 dark:text-gray-400 mb-4`}
                        >
                            <Filter className="h-4 w-4" />
                            {!isCollapsed && (
                                <span className="ml-2 text-xs font-semibold uppercase tracking-wider">
                                    TASK STATUS
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            {task_status.map((filter) => (
                                <button
                                    key={filter.key}
                                    onClick={() => {
                                        setSelectedFilter(filter.key);
                                        setIsMobileOpen(false);
                                    }}
                                    className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 group ${
                                        selectedFilter === filter.key
                                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                                    }`}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center min-w-0">
                                            <span
                                                className={`p-2 rounded-lg ${filter.color} mr-3`}
                                            >
                                                {filter.icon}
                                            </span>
                                            {!isCollapsed && (
                                                <span className="text-sm font-medium truncate">
                                                    {filter.label}
                                                </span>
                                            )}
                                        </div>
                                        {!isCollapsed && (
                                            <span
                                                className={`py-1 px-2 rounded-full text-xs font-bold min-w-[2rem] flex items-center justify-center ${
                                                    selectedFilter ===
                                                    filter.key
                                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                                }`}
                                            >
                                                {filter.count}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort / Filters */}
                    {!isCollapsed && (
                        <div className="px-4">
                            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
                                <RefreshCw className="h-4 w-4" />
                                <span className="ml-2 text-xs font-semibold uppercase tracking-wider">
                                    SORT & FILTERS
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* User Filter */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Filter by User
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all"
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
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Filter by Company
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all"
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
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Sort by Deadline
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all"
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
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Optional Header */}
                {header && (
                    <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                        {header}
                    </div>
                )}

                {/* Scrollable Main Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6 max-w-7xl mx-auto">{children}</div>
                </div>
            </div>
        </div>
    );
}