import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ResultSideBar from "@/Layouts/ResultSideBar";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";

export default function TaskResult({ tasks, users, userName }) {
    // State management
    const user = usePage().props.auth.user;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("");
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [statusFilter, setStatusFilter] = useState("In Review");
    const revisionRef = useRef(null);
    // console.log(user);

    // Form handling
    const { data, setData, put, post, processing, errors, reset } = useForm({
        uuid: "",
        status: "",
        revision: "",
        checked_by: user.name,
        link: "",
    });

    // Filter tasks based on status and search term
    const filteredTasks = tasks
        .filter((task) => task.status === statusFilter)
        .filter(
            (task) =>
                task.task_title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                task.penanggung_jawab
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                task.company.toLowerCase().includes(searchTerm.toLowerCase())
        );

    // Handle textarea auto-resize
    const adjustTextareaHeight = (element) => {
        element.style.height = "auto";
        element.style.height = `${element.scrollHeight}px`;
    };

    useEffect(() => {
        if (revisionRef.current) {
            adjustTextareaHeight(revisionRef.current);
        }
    }, [data.revision]);

    // Open review modal
    const openReviewModal = (task) => {
        console.log(task);

        setSelectedTask(task);
        setData("uuid", task.uuid);
        setData("link", task.result_link || "");
        setIsReviewModalOpen(true);
    };

    // Close review modal
    const closeReviewModal = () => {
        setIsReviewModalOpen(false);
        setSelectedTask(null);
        reset();
    };

    // Get status color
    const getStatusColor = (status) => {
        const statusColors = {
            Approved: "bg-gradient-to-r from-green-500 to-emerald-600",
            Rejected: "bg-gradient-to-r from-red-500 to-rose-600",
            Cancel: "bg-gradient-to-r from-gray-500 to-slate-600",
            "In Review": "bg-gradient-to-r from-blue-500 to-cyan-600",
        };
        return (
            statusColors[status] ||
            "bg-gradient-to-r from-gray-500 to-slate-600"
        );
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    // Calculate days until deadline
    const getDaysUntilDeadline = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        put(route("media_review.update", { media_review: data.uuid }), {
            onSuccess: () => {
                window.location.reload();
            },
            onError: (errors) => console.error(errors),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg mb-8 dark:from-blue-800 dark:to-purple-900">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                        Media Task Results Review 🎯
                    </h1>
                    <p className="text-lg opacity-90">
                        Review completed tasks and provide feedback to your team
                        members
                    </p>
                </div>
            }
        >
            <Head title="Task Results" />
            <ResultSideBar
                users={users}
                tasks={tasks}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
            >
                <div className="max-w-[2000px] mx-auto dark:bg-gray-900">
                    {/* Search and Stats Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 dark:bg-gray-800 dark:shadow-gray-900/30">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search tasks by title, assignee, or company..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                                    <span className="text-blue-700 font-semibold dark:text-blue-300">
                                        {filteredTasks.length} task
                                        {filteredTasks.length !== 1
                                            ? "s"
                                            : ""}{" "}
                                        awaiting review
                                    </span>
                                </div>
                                <button
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    onClick={() => setSearchTerm("")}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    Clear filters
                                </button>
                            </div>
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            {[
                                "In Review",
                                "Approved",
                                "Rejected",
                                "Cancel",
                            ].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        statusFilter === status
                                            ? `${getStatusColor(
                                                  status
                                              )} text-white shadow-md`
                                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tasks Cards Grid */}
                    <div className="bg-white shadow-lg rounded-2xl overflow-hidden dark:bg-gray-800 dark:shadow-gray-900/30">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                {statusFilter} Tasks
                            </h2>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Sorted by: Deadline (soonest first)
                            </span>
                        </div>

                        {filteredTasks.length === 0 ? (
                            <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
                                <svg
                                    className="w-16 h-16 mx-auto text-gray-400 mb-4 dark:text-gray-500"
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
                                <h3 className="text-lg font-medium text-gray-700 mb-2 dark:text-gray-300">
                                    No {statusFilter.toLowerCase()} tasks
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {statusFilter === "In Review"
                                        ? "All tasks have been reviewed or no tasks match your search criteria"
                                        : `No tasks with status "${statusFilter}" found`}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {filteredTasks.map((task, index) => (
                                    <div
                                        key={task.uuid}
                                        className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 dark:bg-gray-700 dark:border-gray-600"
                                    >
                                        {/* Card Header */}
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-600">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-gray-800 break-all text-lg line-clamp-1 dark:text-gray-200 w-[10rem]">
                                                    {task.task_title}
                                                </h3>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                        task.status
                                                    )} text-white`}
                                                >
                                                    {task.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                                                {task.category}
                                            </p>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4">
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                                                        Assignee
                                                    </p>
                                                    <p className="font-medium text-gray-800 dark:text-gray-200">
                                                        {task.penanggung_jawab
                                                            .split(",")
                                                            .map(
                                                                (id) =>
                                                                    users.find(
                                                                        (u) =>
                                                                            u.id ===
                                                                            parseInt(
                                                                                id
                                                                            )
                                                                    )?.name
                                                            )
                                                            .join(", ") ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                                                        Company
                                                    </p>
                                                    <p className="font-medium text-gray-800 dark:text-gray-200">
                                                        {task.company}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                                                        Format
                                                    </p>
                                                    <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                                                        {task.task_format}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                                                        Deadline
                                                    </p>
                                                    <p className="font-medium text-gray-800 dark:text-gray-200">
                                                        {formatDate(
                                                            task.deadline
                                                        )}
                                                    </p>
                                                    <p
                                                        className={`text-xs ${
                                                            getDaysUntilDeadline(
                                                                task.deadline
                                                            ) < 3
                                                                ? "text-red-500 dark:text-red-400"
                                                                : "text-gray-500 dark:text-gray-400"
                                                        }`}
                                                    >
                                                        {getDaysUntilDeadline(
                                                            task.deadline
                                                        ) > 0
                                                            ? `${getDaysUntilDeadline(
                                                                  task.deadline
                                                              )} days left`
                                                            : "Deadline passed"}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* 
                                            <div className="bg-blue-50 p-3 rounded-lg mb-4 dark:bg-blue-900/20">
                                                <p className="text-xs text-blue-700 uppercase font-medium mb-1 dark:text-blue-300">
                                                    Submission Link
                                                </p>
                                                <a
                                                    href={task.result?.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 text-sm break-all inline-flex items-center dark:text-blue-400"
                                                >
                                                    <svg
                                                        className="w-4 h-4 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                        />
                                                    </svg>
                                                    View Submission
                                                </a>
                                            </div> */}
                                        </div>

                                        {/* Card Footer */}
                                        <div className="p-4 bg-gray-50 border-t border-gray-100 dark:bg-gray-600 dark:border-gray-500">
                                            {task.status === "In Review" ? (
                                                <button
                                                    onClick={() =>
                                                        openReviewModal(task)
                                                    }
                                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-md"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                        />
                                                    </svg>
                                                    Review Task
                                                </button>
                                            ) : (
                                                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                                                    Reviewed on{" "}
                                                    {formatDate(
                                                        task.updated_at
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Review Modal */}
                {isReviewModalOpen && selectedTask && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:shadow-gray-900/30">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl flex justify-between items-center dark:bg-gray-800 dark:border-gray-700">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                    Review Submission
                                </h3>

                                <button
                                    onClick={closeReviewModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors dark:hover:text-gray-300"
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

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                                        <h4 className="font-semibold text-gray-700 mb-2 dark:text-gray-300">
                                            Task Details
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                                            {selectedTask.task_title}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                                        <h4 className="font-semibold text-gray-700 mb-2 dark:text-gray-300">
                                            Assignee
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedTask.penanggung_jawab
                                                .split(",")
                                                .map(
                                                    (id) =>
                                                        users.find(
                                                            (u) =>
                                                                u.id ===
                                                                parseInt(id)
                                                        )?.name
                                                )
                                                .join(", ") || "N/A"}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                                        <h4 className="font-semibold text-gray-700 mb-2 dark:text-gray-300">
                                            Company
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedTask.company}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                                        <h4 className="font-semibold text-gray-700 mb-2 dark:text-gray-300">
                                            Deadline
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(selectedTask.deadline)}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                                        <h4 className="font-semibold text-gray-700 mb-2 dark:text-gray-300">
                                            Submitter
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedTask?.sended_by ||
                                                "Unknown Sender"}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                                        <h4 className="font-semibold text-gray-700 mb-2 dark:text-gray-300">
                                            Date Submitted
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedTask.send_date} {selectedTask.send_time}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                                    <a
                                        href={selectedTask.result_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline break-all inline-flex items-center justiify-center dark:text-blue-400"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                        {selectedTask.result_link ||
                                            "No Link Provided"}
                                    </a>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-4 dark:text-gray-300">
                                            Review Decision
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {[
                                                "Approved",
                                                "Rejected",
                                                "Cancel",
                                            ].map((status) => (
                                                <label
                                                    key={status}
                                                    className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                                        data.status === status
                                                            ? `${getStatusColor(
                                                                  status
                                                              )} text-white shadow-md border-transparent`
                                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-sm dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:border-gray-500"
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="task-status"
                                                        value={status}
                                                        checked={
                                                            data.status ===
                                                            status
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "status",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="sr-only"
                                                    />
                                                    <span className="font-medium">
                                                        {status}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {data.status === "Rejected" && (
                                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                                            <label
                                                htmlFor="revision-comments"
                                                className="block text-sm font-medium text-amber-800 mb-2 items-center dark:text-amber-300"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                    />
                                                </svg>
                                                Revision Comments Required
                                            </label>
                                            <textarea
                                                ref={revisionRef}
                                                value={data.revision}
                                                onChange={(e) =>
                                                    setData(
                                                        "revision",
                                                        e.target.value
                                                    )
                                                }
                                                id="revision-comments"
                                                placeholder="Please provide detailed feedback on what needs to be improved..."
                                                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none bg-white dark:bg-gray-600 dark:border-amber-600 dark:text-white"
                                                rows={4}
                                            />
                                            <p className="text-xs text-amber-600 mt-1 dark:text-amber-400">
                                                Please be specific about what
                                                needs to be revised
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            type="button"
                                            onClick={closeReviewModal}
                                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={
                                                processing || !data.status
                                            }
                                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center dark:from-blue-700 dark:to-purple-800 dark:hover:from-blue-800 dark:hover:to-purple-900"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg
                                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                "Submit Review"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </ResultSideBar>
        </AuthenticatedLayout>
    );
}
