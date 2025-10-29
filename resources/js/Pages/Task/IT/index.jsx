import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TaskSideBar from "@/Layouts/TaskSideBar";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

// Status Badge Component
const StatusBadge = ({ status }) => {
    const statusColors = {
        "On Progress": "#3B82F6", // blue
        Pending: "#F59E0B", // amber
        Approved: "#10B981", // emerald
        "In Review": "#8B5CF6", // violet
        Rejected: "#EF4444", // red
        Revision: "#F97316", // orange
        Idle: "#6B7280", // gray
        Lunas: "#EC4899", // pink
        Lunas: "#14B8A6", // teal
    };

    return (
        <div
            className={`${
                statusColors[status] ||
                "bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
            } font-medium py-1.5 px-3 rounded-full text-center text-xs shadow-sm dark:shadow-gray-800`}
        >
            {status}
        </div>
    );
};

// Priority Badge Component
const PriorityBadge = ({ deadline }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate - today;
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let priority = "";
    let bgColor = "";

    if (remainingDays < 0) {
        priority = "Overdue";
        bgColor = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    } else if (remainingDays === 0) {
        priority = "Due Today";
        bgColor =
            "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    } else if (remainingDays <= 3) {
        priority = "High";
        bgColor =
            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    } else if (remainingDays <= 7) {
        priority = "Medium";
        bgColor =
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    } else {
        priority = "Low";
        bgColor =
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }

    return (
        <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${bgColor}`}
        >
            {priority}
        </span>
    );
};

// Task Card Component
const TaskCard = ({ task, onOpenDetails, index, user_role, users }) => {
    // Assign different pastel colors based on task status
    const getCardColor = (status) => {
        const colorMap = {
            "In Review":
                "bg-[#8B5CF6]/10 border-[#8B5CF6] shadow-xl dark:bg-[#8B5CF6]/20 dark:border-[#8B5CF6]/80",
            Rejected:
                "bg-[#EF4444]/10 border-[#EF4444] shadow-xl dark:bg-[#EF4444]/20 dark:border-[#EF4444]/80",
            Approved:
                "bg-[#10B981]/10 border-[#10B981] shadow-xl dark:bg-[#10B981]/20 dark:border-[#10B981]/80",
            Cancel: "bg-slate-100 border-slate-800 dark:bg-slate-800 dark:border-slate-600",
            Idle: "bg-[#d141b7]/10 border-[#d141b7] shadow-xl dark:bg-[#d141b7]/20 dark:border-[#d141b7]/80",
            Revision:
                "bg-[#F97316]/10 border-[#F97316] shadow-xl dark:bg-[#F97316]/20 dark:border-[#F97316]/80",
            Pending:
                "bg-[#F59E0B]/10 border-[#F59E0B] shadow-xl dark:bg-[#F59E0B]/20 dark:border-[#F59E0B]/80",
            "On Progress":
                "bg-[#3B82F6]/10 border-[#3B82F6] shadow-xl dark:bg-[#3B82F6]/20 dark:border-[#3B82F6]/80",
            default:
                "bg-purple-100 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700",
        };

        return colorMap[status] || colorMap.default;
    };

    return (
        <div
            className={`rounded-xl border-2 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1 mb-5 cursor-pointer dark:shadow-gray-800 ${getCardColor(
                task.status
            )}`}
            onClick={() => onOpenDetails(task, index)}
        >
            <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                        <PriorityBadge deadline={task.deadline} />
                    </div>
                    <StatusBadge status={task.status} />
                </div>

                {/* Task Company Name */}
                <h3 className="flex text-xl font-semibold text-black dark:text-white tracking-wide -mb-0.5 line-clamp-1 border-b border-black dark:border-white pb-0.5 justify-center">
                    {task.company}
                </h3>

                {/* Code */}
                <h1 className="font-black text-2xl text-gray-900 dark:text-white -mb-0.5 leading-tight pt-3">
                    {task?.company_code?.code || "N/A"}
                </h1>

                {/* Task Title */}
                <h3 className="text-md text-black dark:text-white font-medium mb-1 line-clamp-2 break-words">
                    {task.task_title}
                </h3>

                {/* Assignee and Format */}
                <div className="flex items-center justify-between mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                        <div className="flex -space-x-3 mr-3">
                            {task.penanggung_jawab
                                ?.split(",")
                                .map((assignee, index) => {
                                    const trimmed = assignee.trim();
                                    const user = users?.find(
                                        (u) =>
                                            u.name.toLowerCase() ===
                                            trimmed.toLowerCase()
                                    );

                                    // DEBUG: Check what we're working with
                                    console.log("Assignee:", trimmed);
                                    console.log("Found user:", user);
                                    console.log({
                                        user_avatar_url: user?.avatar_url,
                                    });

                                    return (
                                        <div
                                            key={index}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 font-bold border-[1px] border-black dark:border-white shadow-sm overflow-hidden relative"
                                            title={trimmed}
                                        >
                                            {user?.avatar_url ? (
                                                <img
                                                    src={user.avatar_url}
                                                    alt={user.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                    onError={(e) => {
                                                        console.log(
                                                            "Image failed to load:",
                                                            user.avatar_url
                                                        );
                                                        e.target.style.display =
                                                            "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    {trimmed
                                                        .substring(0, 2)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <span className="font-medium text-black dark:text-white text-xs line-clamp-2 break-words">
                        {task.task_format}
                    </span>
                </div>

                {/* Deadline */}
                <div className="flex items-center justify-between mb-4">
                    <div className="text-xs text-black dark:text-white">
                        Deadline:{" "}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {task.deadline}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center pt-3 border-t border-black dark:border-white">
                    {!["Cancel", "In Review"].includes(task.status) &&
                        user_role !== "member" &&
                        user_role !== "intern" && (
                            <div className="flex space-x-2">
                                <Link
                                    href={route("it.edit", task.uuid)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 text-black dark:text-white hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors duration-200"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // This prevents the card click
                                        if (
                                            confirm(
                                                "Are you sure you want to delete this task?"
                                            )
                                        ) {
                                            router.delete(
                                                route("it.destroy", task.uuid),
                                                {
                                                    onSuccess: () =>
                                                        alert(
                                                            "Task deleted successfully!"
                                                        ),
                                                    onError: (errors) =>
                                                        console.error(errors),
                                                }
                                            );
                                        }
                                    }}
                                    className="p-2 text-black dark:text-white hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

// Task Modal Component
const TaskModal = ({
    task,
    isOpen,
    onClose,
    data,
    setData,
    onSubmit,
    userName,
    processing,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose} // Add this to close when clicking overlay
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // Add this to prevent closing when clicking inside
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-t-2xl text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-2 max-w-xl break-words">
                                {task.task_title}
                            </h2>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={task.status} />
                                <span className="text-blue-100">
                                    {task.company}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-blue-200 transition-colors"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Task Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 dark:text-gray-400">
                                Assignee:
                            </span>
                            <p className="font-medium dark:text-white">
                                {task.penanggung_jawab}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-500 dark:text-gray-400">
                                Format:
                            </span>
                            <p className="font-medium line-clamp-3 break-words dark:text-white">
                                {task.task_format}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-500 dark:text-gray-400">
                                Category:
                            </span>
                            <p className="font-medium dark:text-white">
                                {task.category}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-500 dark:text-gray-400">
                                Deadline:
                            </span>
                            <p className="font-medium text-red-600 dark:text-red-400">
                                {task.deadline}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center dark:text-white">
                            <svg
                                className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            Description
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                            {task.description}
                        </p>
                    </div>

                    {/* Revision Notice (if rejected) */}
                    {task.status === "Rejected" &&
                        task.rejected_revision?.revision && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <h4 className="text-red-800 dark:text-red-300 font-semibold mb-2 flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    Revision Required
                                </h4>
                                <p className="text-red-700 dark:text-red-300">
                                    {task.rejected_revision.revision}
                                </p>
                            </div>
                        )}

                    {/* Submission Form */}
                    {task.status !== "Cancel" && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center dark:text-white">
                                <svg
                                    className="w-5 h-5 mr-2 text-green-600 dark:text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Submit Your Work
                            </h3>

                            {["In Review", "Approved"].includes(task.status) ? (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <p className="text-green-800 dark:text-green-300 font-medium">
                                        {task.status === "Approved"
                                            ? "Approved"
                                            : "Under Review"}{" "}
                                        - {task.result?.link}
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={onSubmit}>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-10 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            value={data.link}
                                            onChange={(e) =>
                                                setData("link", e.target.value)
                                            }
                                            placeholder="https://example.com/your-work"
                                            required
                                            disabled={
                                                !(task.penanggung_jawab ?? "")
                                                    ?.split(",")
                                                    .map((s) =>
                                                        s.trim().toLowerCase()
                                                    )
                                                    .includes(
                                                        userName
                                                            .trim()
                                                            .toLowerCase()
                                                    )
                                            }
                                        />
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 disabled:opacity-50"
                                            disabled={processing}
                                        >
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                                />
                                            </svg>
                                            Submit Task
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function TaskIndex({ tasks, userName, users, auth }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, put, processing, errors } = useForm({
        uuid: "",
        link: "",
        sended_by: user.name || "User Name Not Found",
        name: auth.user.name || "",
        avatar: null,
    });

    const [selectedFilter, setSelectedFilter] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [sortDeadline, setSortDeadline] = useState("Desc");
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const successMessage = usePage().props?.flash?.success;

    console.log(user);

    // Filter and sort tasks
    const filteredTasks = tasks
        .filter((task) => {
            const matchesFilter =
                selectedFilter === ""
                    ? !["Rejected", "Approved", "In Review", "Cancel"].includes(
                          task.status
                      )
                    : task.status === selectedFilter;

            // Case-insensitive matching for multiple assignees
            const matchesUser =
                selectedUser === "" ||
                (task.penanggung_jawab &&
                    task.penanggung_jawab
                        .split(",")
                        .map((name) => name.trim().toLowerCase())
                        .includes(selectedUser.toLowerCase()));

            const matchesCompany =
                selectedCompany === "" || task.company === selectedCompany;
            return matchesFilter && matchesUser && matchesCompany;
        })
        .sort((a, b) => {
            const dateA = new Date(a.deadline);
            const dateB = new Date(b.deadline);
            return sortDeadline === "Desc" ? dateA - dateB : dateB - dateA;
        });

    // Open task details modal
    const openTaskDetails = (task, index) => {
        setSelectedTask(task);
        setData("uuid", task.uuid);
        setData("link", task.result?.link || "");
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    // Submit task
    const submitTask = (e) => {
        e.preventDefault();
        console.log(data.uuid);
        put(route("it_submit.update", { it: data.uuid }), {
            onSuccess: () => window.location.reload(),
            onError: (e) => console.error("PUT error", e),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <AuthenticatedLayout>
                <Head title="Media Team Task Management" />
                <TaskSideBar
                    users={users}
                    tasks={tasks}
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    sortDeadline={sortDeadline}
                    setSortDeadline={setSortDeadline}
                    selectedCompany={selectedCompany}
                    setSelectedCompany={setSelectedCompany}
                >
                    <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 overflow-y-auto h-[calc(100vh-4rem)] py-4 scrollbar-hide">
                        {/* Success Message */}
                        {successMessage && (
                            <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 text-green-800 dark:text-green-300 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-6 flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                {successMessage}
                            </div>
                        )}

                        <div className="flex justify-end mb-6">
                            {user.role !== "intern" &&
                                user.role !== "member" && (
                                    <Link
                                        href={route("it.create")}
                                        className="flex items-center justify-center px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                        Add New Task
                                    </Link>
                                )}
                        </div>

                        {/* Tasks Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedFilter === "" ? (
                                <>
                                    <div className="col-span-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                            <div className="gap-5 flex-flex-col">
                                                <div className="w-full p-3 pl-0 flex gap-2">
                                                    <div className="h-[1.7rem] bg-[#d141b7] w-2"></div>
                                                    <p className="font-extrabold dark:text-white">
                                                        Idle
                                                    </p>
                                                </div>
                                                {filteredTasks
                                                    .filter(
                                                        (task) =>
                                                            task.status ===
                                                            "Idle"
                                                    )
                                                    .map((task, index) => {
                                                        return (
                                                            <TaskCard
                                                                key={task.uuid}
                                                                task={task}
                                                                onOpenDetails={
                                                                    openTaskDetails
                                                                }
                                                                index={index}
                                                                user_role={
                                                                    user.role
                                                                }
                                                                users={users} // Pass users data here
                                                            />
                                                        );
                                                    })}
                                            </div>
                                            <div className="gap-5 flex-flex-col">
                                                <div className="w-full p-3 pl-0 flex gap-2">
                                                    <div className="h-[1.7rem] bg-[#3B82F6] w-2"></div>
                                                    <p className="font-extrabold dark:text-white">
                                                        On Progress
                                                    </p>
                                                </div>
                                                {filteredTasks
                                                    .filter(
                                                        (task) =>
                                                            task.status ===
                                                            "On Progress"
                                                    )
                                                    .map((task, index) => {
                                                        return (
                                                            <TaskCard
                                                                key={task.uuid}
                                                                task={task}
                                                                onOpenDetails={
                                                                    openTaskDetails
                                                                }
                                                                index={index}
                                                                user_role={
                                                                    user.role
                                                                }
                                                                users={users} // Pass users data here
                                                            />
                                                        );
                                                    })}
                                            </div>
                                            <div className="gap-5 flex-flex-col">
                                                <div className="w-full p-3 pl-0 flex gap-2">
                                                    <div className="h-[1.7rem] bg-[#F59E0B] w-2"></div>
                                                    <p className="font-extrabold dark:text-white">
                                                        Pending
                                                    </p>
                                                </div>
                                                {filteredTasks
                                                    .filter(
                                                        (task) =>
                                                            task.status ===
                                                            "Pending"
                                                    )
                                                    .map((task, index) => {
                                                        return (
                                                            <TaskCard
                                                                key={task.uuid}
                                                                task={task}
                                                                onOpenDetails={
                                                                    openTaskDetails
                                                                }
                                                                index={index}
                                                                user_role={
                                                                    user.role
                                                                }
                                                                users={users} // Pass users data here
                                                            />
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                filteredTasks.map((task, index) => {
                                    return (
                                        <TaskCard
                                            key={task.uuid}
                                            task={task}
                                            onOpenDetails={openTaskDetails}
                                            index={index}
                                            user_role={user.role}
                                            users={users} // Pass users data here
                                        />
                                    );
                                })
                            )}
                        </div>

                        {/* Empty State */}
                        {filteredTasks.length === 0 && (
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center">
                                <svg
                                    className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No tasks found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    Try adjusting your filters or create a new
                                    task.
                                </p>
                                {user.role !== "intern" &&
                                    user.role !== "member" && (
                                        <Link
                                            href={route("it.create")}
                                            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                                        >
                                            Create New Task
                                        </Link>
                                    )}
                            </div>
                        )}
                    </div>
                </TaskSideBar>
                {/* Task Modal */}
                {selectedTask && (
                    <TaskModal
                        task={selectedTask}
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        data={data}
                        userName={userName}
                        setData={setData}
                        onSubmit={submitTask}
                        processing={processing}
                    />
                )}
            </AuthenticatedLayout>
        </div>
    );
}
