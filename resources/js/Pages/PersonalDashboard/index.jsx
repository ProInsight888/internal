import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Fragment, useState } from "react";

export default function Dashboard({ absens, userName, users, tasks }) {
    // Filter user's absences
    const filteredAbsens = absens.filter((absen) => absen.user === userName);

    // Categorize tasks
    const [urgent, soon, upComing] = categorizeTasks(tasks, userName);

    // State for toggling task sections
    const [expandedSections, setExpandedSections] = useState({
        urgent: false,
        soon: false,
        upComing: false,
    });

    // Toggle section visibility
    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="max-w-[2000px] mx-auto px-4 py-6 space-y-8">
                {/* User Profile and Absence Table */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <UserProfileCard userName={userName} users={users} />

                    <div className="lg:w-3/4">
                        <AbsenceTable absens={filteredAbsens} />
                    </div>
                </div>

                {/* Task Overview and Details */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <TaskOverview
                        urgent={urgent}
                        soon={soon}
                        upComing={upComing}
                    />

                    <div className="lg:w-3/4 space-y-8">
                        <TaskSection
                            title="Urgent Task"
                            tasks={urgent}
                            color="red"
                            isExpanded={expandedSections.urgent}
                            onToggle={() => toggleSection("urgent")}
                        />

                        <TaskSection
                            title="Soon Task"
                            tasks={soon}
                            color="yellow"
                            isExpanded={expandedSections.soon}
                            onToggle={() => toggleSection("soon")}
                        />

                        <TaskSection
                            title="Up Coming Task"
                            tasks={upComing}
                            color="emerald"
                            isExpanded={expandedSections.upComing}
                            onToggle={() => toggleSection("upComing")}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Helper function to categorize tasks
function categorizeTasks(tasks, userName) {
    const urgent = [];
    const soon = [];
    const upComing = [];

    tasks.forEach((task) => {
        if (task.penanggung_jawab !== userName) return;

        const deadline = new Date(task.deadline);
        const today = new Date();
        deadline.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = deadline - today;
        const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (remainingDays >= 0 && remainingDays <= 3) {
            urgent.push(task);
        } else if (remainingDays >= 4 && remainingDays <= 7) {
            soon.push(task);
        } else if (remainingDays >= 8) {
            upComing.push(task);
        }
    });

    return [urgent, soon, upComing];
}

// User Profile Card Component
function UserProfileCard({ userName, users }) {
    return (
        <div className="lg:w-1/4 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
                Hi, {userName}! 👋
            </h1>
            <p
                className={`text-xl font-extrabold w-fit px-6 py-2 mb-3 rounded-lg tracking-widest 
                ${
                    users.role === "admin"
                        ? "bg-purple-500"
                        : users.role === "manager"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                }`}
            >
                {users.role.toUpperCase()}
            </p>
            <p className="text-lg md:text-xl font-medium text-gray-700">
                {users.email}
            </p>
        </div>
    );
}

// Absence Table Component
function AbsenceTable({ absens }) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            {["No", "Nama", "Status", "Datang", "Pulang"].map(
                                (header, index) => (
                                    <th
                                        key={index}
                                        className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                                    >
                                        {header}
                                    </th>
                                ),
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {absens.map((absen, index) => (
                            <tr key={absen.id}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                    {absen.user}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                    {absen.status}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                    {absen.jam_datang}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                    {absen.jam_balek}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Task Overview Component
function TaskOverview({ urgent, soon, upComing }) {
    const stats = [
        {
            title: "Urgent Task",
            count: urgent.length,
            bgColor: "bg-red-600",
            borderColor: "border-red-800",
        },
        {
            title: "Soon Task",
            count: soon.length,
            bgColor: "bg-yellow-500",
            borderColor: "border-yellow-600",
        },
        {
            title: "Up Coming Task",
            count: upComing.length,
            bgColor: "bg-emerald-600",
            borderColor: "border-emerald-700",
        },
    ];

    return (
        <div className="lg:w-1/4 space-y-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className={`p-6 rounded-lg border-4 ${stat.borderColor} ${stat.bgColor} text-white`}
                >
                    <div className="font-bold text-xl">{stat.title}</div>
                    <div className="text-4xl font-extrabold text-right mt-4">
                        {stat.count}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Task Section Component
function TaskSection({ title, tasks, color, isExpanded, onToggle }) {
    const colorClasses = {
        red: {
            bg: "bg-red-800",
            border: "border-red-800",
            text: "text-red-800",
        },
        yellow: {
            bg: "bg-yellow-500",
            border: "border-yellow-500",
            text: "text-yellow-500",
        },
        emerald: {
            bg: "bg-emerald-500",
            border: "border-emerald-500",
            text: "text-emerald-500",
        },
    };

    return (
        <div className={`border-b-2 ${colorClasses[color].border}`}>
            <div
                className="flex items-center p-4 cursor-pointer hover:bg-gray-50 rounded-lg"
                onClick={onToggle}
            >
                <div
                    className={`w-10 h-10 flex items-center justify-center rounded-lg mr-3 ${colorClasses[color].bg} text-white transition-transform ${isExpanded ? "rotate-90" : "rotate-0"}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        className="fill-white"
                    >
                        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold">{title}</h2>
            </div>

            {!isExpanded && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 mt-2">
                    {tasks.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        {[
                                            "No",
                                            "Task",
                                            "Responsible",
                                            "Format",
                                            "Status",
                                            "Company",
                                            "Category",
                                            "Deadline",
                                        ].map((header, index) => (
                                            <th
                                                key={index}
                                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {tasks.map((task, index) => (
                                        <tr key={task.uuid}>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                                {index + 1}
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-700">
                                                {task.task_title}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                                {task.penanggung_jawab}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                                {task.task_format}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                                {task.status}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                                {task.company}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                                {task.category}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                                {task.deadline}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">
                            No {title.toLowerCase()} found
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
