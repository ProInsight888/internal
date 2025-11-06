import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { Fragment, use, useState } from "react";

// Status Card Component
const StatusCard = ({
    title,
    count,
    total,
    bgColor,
    textColor = "text-white",
}) => (
    <div
        className={`${bgColor} ${textColor} p-6 flex flex-col gap-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] dark:shadow-gray-800/50`}
    >
        <div className="text-lg font-bold">{title}</div>
        <div className="text-4xl text-right font-bold">
            {count}/{total}
        </div>
        <div className="w-full bg-white/20 rounded-full h-2.5 dark:bg-gray-800/30">
            <div
                className="bg-white h-2.5 rounded-full dark:bg-gray-200"
                style={{ width: `${(count / total) * 100}%` }}
            ></div>
        </div>
    </div>
);

// Attendance Form Component
const AttendanceForm = ({
    onSubmit,
    data,
    setData,
    errors,
    sortDate,
    setSortDate,
}) => (
    <div className="text-gray-800 dark:text-gray-200 mt-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 border border-blue-100 dark:border-blue-800 rounded-2xl shadow-sm">
        <div className="pb-3 flex flex-col gap-3 justify-between">
            <div className="flex flex-col md:flex-row justify-between gap-3">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                    <input
                        type="date"
                        value={sortDate}
                        onChange={(e) => setSortDate(e.target.value)}
                        className="pl-10 p-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 focus:border-transparent shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>
                <form onSubmit={onSubmit} className="flex gap-3 flex-1">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                        <select
                            value={data.absence}
                            onChange={(e) => setData("absence", e.target.value)}
                            className="flex justify-center pl-10 p-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 focus:border-transparent shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="Hadir">Hadir</option>
                            <option value="Balek">Pulang</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        Submit
                    </button>
                </form>
            </div>
            {errors.absence && (
                <div className="text-red-500 dark:text-red-400 font-semibold text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-100 dark:border-red-800">
                    {errors.absence}
                </div>
            )}
        </div>
    </div>
);

// Attendance Table Component
const AttendanceTable = ({ absens }) => {
    const dayNames = (inputDate) => {
        const date = new Date(inputDate);
        return date.toLocaleDateString("id-ID", { weekday: "long" });
    };

    return (
        <div className="overflow-x-auto w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="w-full border-collapse">
                <thead className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white">
                    <tr className="text-xs md:text-sm text-center lg:table-fixed sm:table-auto">
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3">Nama</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Hari</th>
                        <th className="px-4 py-3">Datang</th>
                        <th className="px-4 py-3">Pulang</th>
                    </tr>
                </thead>
                <tbody className="w-full">
                    {absens.map((absen, index) => (
                        <tr
                            key={absen.id}
                            className="text-xs md:text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 even:bg-gray-50/30 dark:even:bg-gray-700/50 transition-colors duration-150 dark:text-gray-300"
                        >
                            <td className="px-4 py-3 font-medium">
                                {index + 1}
                            </td>
                            <td className="px-4 py-3 font-semibold">
                                {absen.user}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className="px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
                                    style={{
                                        backgroundColor: `${getAttendanceStatusColor(
                                            absen.status
                                        )}20`,
                                        color: getAttendanceStatusColor(
                                            absen.status
                                        ),
                                    }}
                                >
                                    {absen.status}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                {dayNames(absen.tanggal)}
                            </td>
                            <td className="px-4 py-3 font-semibold">
                                {absen.jam_datang || "-"}
                            </td>
                            <td className="px-4 py-3 font-semibold">
                                {absen.jam_balek || "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Client Table Component
const ClientTable = ({ clients }) => (
    <div className="overflow-x-auto h-64 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="w-full text-left border-collapse min-w-[800px] md:min-w-full">
            <thead>
                <tr className="sticky top-0 text-xs md:text-sm bg-gradient-to-r from-pink-500 to-pink-400 text-white text-center">
                    <th className="p-4 sticky top-0">No</th>
                    <th className="p-4 sticky top-0">Nama</th>
                    <th className="p-4 sticky top-0">Type</th>
                    <th className="p-4 sticky top-0">Location</th>
                    <th className="p-4 sticky top-0">Contract</th>
                    <th className="p-4 sticky top-0">Product</th>
                    <th className="p-4 sticky top-0">Status</th>
                    <th className="p-4 sticky top-0">Code</th>
                </tr>
            </thead>
            <tbody>
                {clients.map((client, index) => (
                    <tr
                        key={client.id}
                        className="text-xs md:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 even:bg-gray-50/30 dark:even:bg-gray-700/50 transition-colors duration-150 dark:text-gray-300"
                    >
                        <td className="p-4 font-medium">{index + 1}</td>
                        <td className="p-4 font-semibold">
                            {client.company_name}
                        </td>
                        <td className="p-4">
                            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {client.type}
                            </span>
                        </td>
                        <td className="p-4">{client.location}</td>
                        <td className="p-4 font-medium">{client.contract}</td>
                        <td className="p-4">
                            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {client.package}
                            </span>
                        </td>
                        <td className="p-4">
                            <span
                                className="px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
                                style={{
                                    backgroundColor: `${getClientStatusColor(
                                        client.status
                                    )}50`,
                                    color: getClientStatusColor(client.status),
                                }}
                            >
                                {client.status === "Belum Bayar" ? 'Unpaid' : client.status === 'Cicil' ? 'Installment' : 'Paid'}
                            </span>
                        </td>
                        <td>
                            <span
                                className="px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
                                style={{
                                    backgroundColor: `${getClientStatusColor(
                                        client.status
                                    )}50`,
                                }}
                            >
                                {client.code}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// Helper functions for status colors
const getStatusColor = (status) => {
    const statusColors = {
        "On Progress": "#3B82F6", // blue
        Pending: "#F59E0B", // amber
        Approved: "#10B981", // emerald
        "In Review": "#8B5CF6", // violet
        Rejected: "#EF4444", // red
        Revision: "#F97316", // orange
        Idle: "#6B7280", // gray
        Lunas: "#EC4899", // pink
        Cicil: "#14B8A6", // teal
    };
    return statusColors[status] || "#6B7280";
};

const getAttendanceStatusColor = (status) => {
    const statusColors = {
        Hadir: "#10B981", // emerald
        Sakit: "#F59E0B", // amber
        Izin: "#3B82F6", // blue
        Cuti: "#8B5CF6", // violet
        "Ketemu Client": "#EC4899", // pink
        Lembur: "#F97316", // orange
        "Pulang Lembur": "#14B8A6", // teal
        Balek: "#06B6D4", // cyan
    };
    return statusColors[status] || "#6B7280";
};

const getClientStatusColor = (status) => {
    const statusColors = {
        Lunas: "#10B981", // emerald
        Cicil: "#3B82F6", // blue: "#00ffff"
    };
    return statusColors[status] || "#ff6868";
};

const TaskCard = ({ task }) => {
    const deadline = new Date(task.deadline);
    const today = new Date();

    deadline.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = deadline - today;
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Get task status information
    const { status, bgColor, textColor, borderColor, statusText } =
        getTaskStatus(remainingDays);

    // Format date for display
    const formattedDate = new Date(task.deadline).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });

    return (
        <div
            className={`flex-none w-full rounded-xl border-2 ${borderColor} ${bgColor} p-4 m-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] dark:shadow-gray-800`}
        >
            <TaskStatusBadge status={status} remainingDays={remainingDays} />
            <TaskTitle title={task.task_title} />
            <TaskCompany company={task.company} />
            <TaskDeadline date={formattedDate} />
            {task.description && (
                <TaskDescription description={task.description} />
            )}
            <TaskAssignee assignee={task.penanggung_jawab} />
        </div>
    );
};

const getTaskStatus = (remainingDays) => {
    if (remainingDays < 0) {
        return {
            status: "overdue",
            bgColor: "bg-red-50 dark:bg-red-900/20",
            textColor: "text-red-700 dark:text-red-300",
            borderColor: "border-red-300 dark:border-red-700",
            statusText: `Overdue by ${Math.abs(remainingDays)} day${
                Math.abs(remainingDays) !== 1 ? "s" : ""
            }`,
        };
    } else if (remainingDays === 0) {
        return {
            status: "due-today",
            bgColor: "bg-amber-50 dark:bg-amber-900/20",
            textColor: "text-amber-700 dark:text-amber-300",
            borderColor: "border-amber-300 dark:border-amber-700",
            statusText: "Due today",
        };
    } else if (remainingDays <= 3) {
        return {
            status: "urgent",
            bgColor: "bg-orange-50 dark:bg-orange-900/20",
            textColor: "text-orange-700 dark:text-orange-300",
            borderColor: "border-orange-300 dark:border-orange-700",
            statusText: `${remainingDays} day${
                remainingDays !== 1 ? "s" : ""
            } left`,
        };
    } else if (remainingDays <= 7) {
        return {
            status: "approaching",
            bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
            textColor: "text-yellow-700 dark:text-yellow-300",
            borderColor: "border-yellow-300 dark:border-yellow-700",
            statusText: `${remainingDays} day${
                remainingDays !== 1 ? "s" : ""
            } left`,
        };
    } else {
        return {
            status: "on-track",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            textColor: "text-green-700 dark:text-green-300",
            borderColor: "border-green-300 dark:border-green-700",
            statusText: `${remainingDays} day${
                remainingDays !== 1 ? "s" : ""
            } left`,
        };
    }
};

const TaskStatusBadge = ({ status, remainingDays }) => {
    const statusColors = {
        overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        "due-today":
            "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
        urgent: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        approaching:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        "on-track":
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };

    return (
        <div className="flex justify-between items-start mb-3">
            <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[status]} shadow-sm`}
            >
                {status === "overdue"
                    ? `Overdue by ${Math.abs(remainingDays)} day${
                          Math.abs(remainingDays) !== 1 ? "s" : ""
                      }`
                    : status === "due-today"
                    ? "Due today"
                    : `${remainingDays} day${
                          remainingDays !== 1 ? "s" : ""
                      } left`}
            </span>
            <div
                className={`w-3 h-3 rounded-full ${
                    status === "overdue"
                        ? "bg-red-500"
                        : status === "due-today"
                        ? "bg-amber-500"
                        : status === "urgent"
                        ? "bg-orange-500"
                        : status === "approaching"
                        ? "bg-yellow-400"
                        : "bg-green-500"
                }`}
            ></div>
        </div>
    );
};

const TaskTitle = ({ title }) => (
    <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800 dark:text-gray-200">
        {title}
    </h3>
);

const TaskCompany = ({ company }) => (
    <div className="flex items-center mb-3 text-sm text-gray-600 dark:text-gray-400">
        <svg
            className="w-4 h-4 mr-1.5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
        </svg>
        <span className="truncate">{company}</span>
    </div>
);

const TaskDeadline = ({ date }) => (
    <div className="flex items-center mb-4 text-sm">
        <svg
            className="w-4 h-4 mr-1.5 text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        </svg>
        <span className="font-semibold text-gray-700 dark:text-gray-300">
            {date}
        </span>
    </div>
);

const TaskDescription = ({ description }) => (
    <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {description}
        </p>
    </div>
);

const TaskAssignee = ({ assignee }) => (
    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <svg
                className="w-4 h-4 mr-1.5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
            <span className="truncate">{assignee}</span>
        </div>
    </div>
);

// Main Dashboard Component
export default function Dashboard({ userName, absens, clients, tasks }) {
    // State management
    const user = usePage().props.auth.user;
    // console.log(tasks.it)
    const { data, setData, post, errors } = useForm({ absence: "Hadir" });
    const date = new Date();
    const today = date.toISOString().slice(0, 10);
    const [sortDate, setSortDate] = useState(today);
    const [showDescriptionIndex, setShowDescriptionIndex] = useState(null);
    const [hiddenSections, setHiddenSections] = useState({
        "on-progress": true,
        pending: true,
        approved: true,
        "in-review": true,
        rejected: true,
        revision: true,
        idle: true,
    });

    let taskUserArray = [];
    const urgent = [];
    const soon = [];
    const up_coming = [];

    let countTask = 0;

    const teams = ["it", "marketing", "media", "creative"];

    const checkUrgentTask = (task) => {
        const deadline = new Date(task.deadline);
        const today = new Date();

        deadline.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = deadline - today;
        const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (remainingDays < 0 && remainingDays <= 3) {
            urgent.push(task);
        } else if (remainingDays >= 4 && remainingDays <= 7) {
            soon.push(task);
        } else if (remainingDays >= 8) {
            up_coming.push(task);
        }
    };

    teams.forEach((team) => {
        if (!tasks[team]) return;
        tasks[team].forEach((task) => {
            // console.log(task);
            if (!task.penanggung_jawab) return;

            // Split by comma and check if userName is in the list
            const assignees = task.penanggung_jawab
                .split(",")
                .map((name) => name.trim());
            const isAssignedToUser = assignees.includes(userName);
            const isNotApproved = task.status !== "Approved";
            const isNotCancle = task.status !== "Cancel";
            const isNotInReview = task.status !== "inReview";

            if (
                isAssignedToUser &&
                isNotApproved &&
                isNotCancle &&
                isNotInReview
            ) {
                taskUserArray.push(task);
                checkUrgentTask(task);
                countTask += 1;
            }
        });
    });

    // Filtered data
    const filteredAbsens = absens.filter((absen) => absen.tanggal === sortDate);

    // Handlers
    const submit = (e) => {
        e.preventDefault();
        post(route("absen.store"), {
            onSuccess: () => window.location.reload(),
        });
    };

    const toggleSection = (section) => {
        setHiddenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 rounded-2xl border border-white shadow-lg mb-6 text-white">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                        Hi, {userName}! 👋
                    </h1>
                    <p className="text-lg opacity-90">
                        Another day to chase your goals! We're here to make sure
                        your stay is smooth, smart, and stress-free. You've got
                        this 😊
                    </p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-2 sm:py-3">
                <div className="mx-auto w-full px-2 sm:px-3">
                    {/* PARENT GRID: make both columns equal height */}
                    <div className="grid grid-cols-3 gap-6 items-stretch">
                        {/* LEFT COLUMN */}
                        <div className="flex flex-col gap-6 col-span-2 h-full">
                            {/* Status Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <StatusCard
                                    title="Urgent Task"
                                    count={urgent.length}
                                    total={countTask}
                                    bgColor="bg-gradient-to-br from-red-500 to-orange-500"
                                />
                                <StatusCard
                                    title="Soon"
                                    count={soon.length}
                                    total={countTask}
                                    bgColor="bg-gradient-to-br from-amber-500 to-yellow-500"
                                />
                                <StatusCard
                                    title="Up Coming"
                                    count={up_coming.length}
                                    total={countTask}
                                    bgColor="bg-gradient-to-br from-green-500 to-emerald-500"
                                />
                            </div>

                            {/* Attendance */}
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md flex-1">
                                <div className="text-xl font-bold pb-3 border-b border-gray-200 dark:border-gray-600 flex items-center gap-2 mb-4">
                                    <span className="text-white p-2 rounded-lg">
                                        📅
                                    </span>
                                    Attendance
                                </div>
                                <div className="space-y-3">
                                    <AttendanceForm
                                        onSubmit={submit}
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        sortDate={sortDate}
                                        setSortDate={setSortDate}
                                    />
                                    <div className="max-h-64 overflow-y-auto">
                                        <AttendanceTable
                                            absens={filteredAbsens}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN (Your Upcoming Tasks) */}
                        <div className="flex flex-col h-full">
                            {taskUserArray.length > 0 && (
                                <div className="flex flex-col flex-1 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-700 shadow-sm overflow-y-auto overflow-x-hidden">
                                    {/* Header */}
                                    <div className="flex items-center mb-3 flex-shrink-0">
                                        <div className="bg-amber-500 p-2 rounded-lg mr-3">
                                            <svg
                                                className="w-6 h-6 text-white"
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
                                        </div>
                                        <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-300">
                                            Your Upcoming Tasks
                                        </h2>
                                    </div>

                                    {/* Scrollable content */}
                                    <div className="flex-1 overflow-y-auto">
                                        <div className="flex h-96 flex-col gap-4 pr-9">
                                            {taskUserArray.map((task) => (
                                                <div
                                                    key={task.id}
                                                    className="min-w-[200px] sm:min-w-[240px] w-full"
                                                >
                                                    <TaskCard task={task} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Client Table (below everything) */}
                    {user.role !== "member" && (
                        <div className="mt-6 text-gray-800 dark:text-gray-200 w-full bg-white dark:bg-gray-800 dark:border-gray-600 p-5 flex flex-col gap-3 border border-gray-200 rounded-2xl shadow-md">
                            <div className="text-xl font-bold pb-3 border-b border-gray-200 dark:border-gray-600 flex items-center gap-2">
                                <span className="text-white p-2 rounded-lg">
                                    👥
                                </span>
                                Client Management
                            </div>
                            <ClientTable clients={clients} />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// THROWABLES
{
    /* Tasks Section */
}
{
    /* <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-md">
                        <div className="text-xl font-bold pb-3 border-b border-gray-200 dark:border-gray-600 flex items-center gap-2 mb-4">
                            <span className=" text-white p-2 rounded-lg">
                                ✅
                            </span>
                            Task Management
                        </div>
                        <div className="w-full flex flex-col gap-4">
                            <TaskSection
                                title="On Progress"
                                tasks={onProgressStatus}
                                borderColor="#3B82F6"
                                bgColor="#3B82F6"
                                textColor="#FFFFFF"
                                isHidden={hiddenSections["on-progress"]}
                                toggleHidden={() =>
                                    toggleSection("on-progress")
                                }
                                showDescriptionIndex={showDescriptionIndex}
                                setShowDescriptionIndex={
                                    setShowDescriptionIndex
                                }
                                icon="🚀"
                            />

                            <TaskSection
                                title="Pending"
                                tasks={pendingStatus}
                                borderColor="#F59E0B"
                                bgColor="#F59E0B"
                                textColor="#FFFFFF"
                                isHidden={hiddenSections["pending"]}
                                toggleHidden={() => toggleSection("pending")}
                                showDescriptionIndex={showDescriptionIndex}
                                setShowDescriptionIndex={
                                    setShowDescriptionIndex
                                }
                                icon="⏳"
                            />

                            <TaskSection
                                title="Approved"
                                tasks={approvedStatus}
                                borderColor="#10B981"
                                bgColor="#10B981"
                                textColor="#FFFFFF"
                                isHidden={hiddenSections["approved"]}
                                toggleHidden={() => toggleSection("approved")}
                                showDescriptionIndex={showDescriptionIndex}
                                setShowDescriptionIndex={
                                    setShowDescriptionIndex
                                }
                                icon="✅"
                            />

                            <TaskSection
                                title="In Review"
                                tasks={inReviewStatus}
                                borderColor="#8B5CF6"
                                bgColor="#8B5CF6"
                                textColor="#FFFFFF"
                                isHidden={hiddenSections["in-review"]}
                                toggleHidden={() => toggleSection("in-review")}
                                showDescriptionIndex={showDescriptionIndex}
                                setShowDescriptionIndex={
                                    setShowDescriptionIndex
                                }
                                icon="🔍"
                            />

                            <TaskSection
                                title="Rejected"
                                tasks={rejectedStatus}
                                borderColor="#EF4444"
                                bgColor="#EF4444"
                                textColor="#FFFFFF"
                                isHidden={hiddenSections["rejected"]}
                                toggleHidden={() => toggleSection("rejected")}
                                showDescriptionIndex={showDescriptionIndex}
                                setShowDescriptionIndex={
                                    setShowDescriptionIndex
                                }
                                icon="❌"
                            />

                            <TaskSection
                                title="Revision"
                                tasks={revisionStatus}
                                borderColor="#F97316"
                                bgColor="#F97316"
                                textColor="#FFFFFF"
                                isHidden={hiddenSections["revision"]}
                                toggleHidden={() => toggleSection("revision")}
                                showDescriptionIndex={showDescriptionIndex}
                                setShowDescriptionIndex={
                                    setShowDescriptionIndex
                                }
                                icon="📝"
                            />

                            <TaskSection
                                title="Idle"
                                tasks={idleStatus}
                                borderColor="#6B7280"
                                bgColor="#6B7280"
                                textColor="#FFFFFF"
                                isHidden={hiddenSections["idle"]}
                                toggleHidden={() => toggleSection("idle")}
                                showDescriptionIndex={showDescriptionIndex}
                                setShowDescriptionIndex={
                                    setShowDescriptionIndex
                                }
                                icon="💤"
                            />
                        </div>
                    </div> */
}

// Task categorization
// const categorizeTasks = () => {

// const teams = ["it", "marketing", "media", "creative"];

// teams.forEach((team) => {
//     tasks[team].forEach((task) => {
//         const deadline = new Date(task.deadline);
//         const today = new Date();

//         deadline.setHours(0, 0, 0, 0);
//         today.setHours(0, 0, 0, 0);

//         const diffTime = deadline - today;
//         const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//         if (remainingDays < 0 && remainingDays <= 3) {
//             urgent.push(task);
//         } else if (remainingDays >= 4 && remainingDays <= 7) {
//             soon.push(task);
//         } else if (remainingDays >= 8) {
//             up_coming.push(task);
//         }
//     });

// console.log(urgent, soon, up_coming);

//     return { urgent, soon, up_coming };
// });
// }

// const { urgent, soon, up_coming } = categorizeTasks();

// Task status filtering

//TANYA KO FELIXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// const filterTasksByStatus = (status) =>
//     tasks.filter((task) => task.status === status);

// const onProgressStatus = filterTasksByStatus("On Progress");
// const pendingStatus = filterTasksByStatus("Pending");
// const approvedStatus = filterTasksByStatus("Approved");
// const inReviewStatus = filterTasksByStatus("In Review");
// const rejectedStatus = filterTasksByStatus("Rejected");
// const revisionStatus = filterTasksByStatus("Revision");
// const idleStatus = filterTasksByStatus("Idle");

// const task_not_include_cancle_approved =
//     idleStatus.length +
//     rejectedStatus.length +
//     pendingStatus.length +
//     inReviewStatus.length +
//     onProgressStatus.length;

