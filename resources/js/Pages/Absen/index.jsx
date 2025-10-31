import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

// Reusable Components
const MonthSelector = ({ value, onChange }) => (
    <div className="relative w-full md:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-blue-600 dark:text-blue-400">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                ></path>
            </svg>
        </div>
        <select
            className="dark:bg-gray-900 pl-10 pr-8 py-2.5 w-full rounded-lg border border-blue-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm transition-all duration-200 text-gray-900 dark:text-white appearance-none cursor-pointer text-sm md:text-base"
            value={value}
            onChange={onChange}
        >
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
        </select>
    </div>
);

const NameFilter = ({ users, value, onChange }) => (
    <div className="flex gap-1 md:gap-2 px-1 md:px-2 py-2 md:py-3 flex-wrap overflow-x-auto">
        <button
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                value === ""
                    ? "bg-blue-500 dark:bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            value=""
            onClick={onChange}
        >
            All Employees
        </button>
        {users.map((user, idx) => (
            <button
                key={idx}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    value === user
                        ? "bg-blue-500 dark:bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                value={user}
                onClick={onChange}
            >
                {user}
            </button>
        ))}
    </div>
);

const AttendanceStatusBadge = ({
    jam_datang,
    jam_balek,
    status,
    tanggal,
    index,
}) => {
    const getStatusColor = () => {
        const date = new Date(tanggal);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        if (status === "Lembur")
            return "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-md";
        if (status === "Hadir")
            return "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md";
        if (status === "Izin")
            return "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md";
        if (status === "Sakit")
            return "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md";
        if (status === "Cuti")
            return "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md";

        if (dayName !== "Saturday") {
            return jam_datang > "09:00:00"
                ? "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md";
        } else {
            return jam_datang > "08:00:00"
                ? "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md";
        }
    };

    const getStatusIcon = () => {
        if (status === "Lembur") return "⏰";
        if (status === "Hadir") return "✅";
        if (status === "Izin") return "📝";
        if (status === "Sakit") return "🤒";
        if (status === "Cuti") return "🏖️";

        const date = new Date(tanggal);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        if (dayName !== "Saturday") {
            return jam_datang > "09:00:00" ? "⚠️" : "✅";
        } else {
            return jam_datang > "08:00:00" ? "⚠️" : "✅";
        }
    };

    return (
        <div
            className={`w-10 h-6 md:w-12 md:h-8 font-bold rounded-lg flex items-center justify-center ${getStatusColor()} transition-all duration-200 hover:scale-105`}
            title={status}
        >
            {status === "Lembur" ? (
                <span className="text-xs">OT</span>
            ) : (
                <span className="text-xs">{getStatusIcon()}</span>
            )}
        </div>
    );
};

const AttendanceTable = ({ data }) => {
    const dayNames = (inputDate) => {
        const date = new Date(inputDate);
        return date.toLocaleDateString("en-US", { weekday: "long" });
    };

    const getDayStyle = (dayName) => {
        if (dayName === "Saturday" || dayName === "Sunday") {
            return "text-blue-600 dark:text-blue-400 font-semibold";
        }
        return "text-gray-700 dark:text-gray-300";
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                        <th className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Status
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Name
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Status
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Day
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Date
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Check In
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Check Out
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((absen, index) => (
                        <tr
                            key={absen.id}
                            className="text-xs md:text-sm hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150 even:bg-gray-50/50 dark:even:bg-gray-800/50"
                        >
                            <td className="px-2 md:px-4 py-2 md:py-3">
                                <AttendanceStatusBadge
                                    {...absen}
                                    index={index}
                                />
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                {absen.user}
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                                    {absen.status}
                                </span>
                            </td>
                            <td
                                className={`px-2 md:px-4 py-2 md:py-3 ${getDayStyle(
                                    dayNames(absen.tanggal)
                                )} whitespace-nowrap`}
                            >
                                {dayNames(absen.tanggal)}
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 text-gray-900 dark:text-white whitespace-nowrap">
                                {absen.tanggal}
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 font-mono text-gray-900 dark:text-white whitespace-nowrap">
                                {absen.jam_datang || "-"}
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 font-mono text-gray-900 dark:text-white whitespace-nowrap">
                                {absen.jam_balek || "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Main Component
export default function AbsenceDashboard({ absens, user }) {
    // Current month setup
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

    let userArray = [];
    {
        Array.from(new Set(user.map((user) => user.name))).map((name, idx) =>
            userArray.push(name)
        );
    }
    let personal_user = usePage().props.auth.user

    // State management
    const [sortMonth, setSortMonth] = useState(currentMonth);
    const [sortName, setSortName] = useState("");
    const { data, setData, post, errors, processing } = useForm({
        from_date: "",
        end_date: "",
    });

    // Get unique users
    const uniqueUsers = [...new Set(absens.map((absen) => absen.user))];

    // Filter and sort data
    const filteredData = absens
        .filter(
            (absen) =>
                absen.tanggal.split("-")[1] === sortMonth &&
                (sortName === "" || absen.user === sortName)
        )
        .sort((a, b) => b.tanggal.localeCompare(a.tanggal));

    const formRef = useRef();
    function submit(e) {
        e.preventDefault();

        const query = new URLSearchParams({
            date_from: data.from_date,
            date_end: data.end_date,
            users: userArray,
            sortName: sortName,
        }).toString();

        const url = `/api/export-data?${query}`;

        window.open(url, "_blank", "noopener,noreferrer");
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 md:p-6 rounded-xl md:rounded-2xl text-white shadow-lg">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3">
                        Attendance Dashboard
                    </h1>
                    <p className="text-sm md:text-lg opacity-90">
                        Track and manage employee attendance with our comprehensive dashboard.
                    </p>
                </div>
            }
        >
            <Head title="Attendance Dashboard" />

            <div className="py-4 md:py-6 lg:py-8">
                <div className="mx-auto max-w-[2000px] px-3 sm:px-4 lg:px-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 md:p-6 border-b border-blue-200 dark:border-blue-700">
                            <div className="flex flex-col gap-4 mb-4 md:mb-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <MonthSelector
                                        value={sortMonth}
                                        onChange={(e) =>
                                            setSortMonth(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="w-full">
                                    <NameFilter
                                        users={uniqueUsers}
                                        value={sortName}
                                        onChange={(e) =>
                                            setSortName(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Export Form */}
                            {personal_user.role !== "member" && (
                                <form
                                    onSubmit={submit}
                                    ref={formRef}
                                    className="bg-white dark:bg-gray-700 p-3 md:p-4 rounded-lg md:rounded-xl shadow-sm border border-blue-100 dark:border-blue-800"
                                >
                                    <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-end">
                                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 flex-1 w-full">
                                            <div className="w-full sm:flex-1">
                                                <InputLabel
                                                    htmlFor="from_date"
                                                    className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    From Date
                                                </InputLabel>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                                                        <svg
                                                            className="w-4 h-4 md:w-5 md:h-5"
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
                                                    <TextInput
                                                        name="from_date"
                                                        type="date"
                                                        value={data.from_date}
                                                        onChange={(e) =>
                                                            setData(
                                                                "from_date",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm md:text-base"
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-full sm:flex-1">
                                                <InputLabel
                                                    htmlFor="end_date"
                                                    className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    Until Date
                                                </InputLabel>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                                                        <svg
                                                            className="w-4 h-4 md:w-5 md:h-5"
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
                                                    <TextInput
                                                        name="end_date"
                                                        type="date"
                                                        value={data.end_date}
                                                        onChange={(e) =>
                                                            setData(
                                                                "end_date",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm md:text-base"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-4 md:px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg w-full md:w-auto text-sm md:text-base"
                                        >
                                            <svg
                                                className="w-4 h-4 md:w-5 md:h-5 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            Export to Google Sheet
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Table Section */}
                        <div className="p-3 md:p-4 lg:p-6">
                            {filteredData.length > 0 ? (
                                <AttendanceTable data={filteredData} />
                            ) : (
                                <div className="text-center py-8 md:py-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg md:rounded-xl border border-dashed border-blue-200 dark:border-blue-700">
                                    <svg
                                        className="w-12 h-12 md:w-16 md:h-16 mx-auto text-blue-400 dark:text-blue-500 mb-3 md:mb-4"
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
                                    <h3 className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                                        No records found
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                        No attendance records found for the selected filters
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}