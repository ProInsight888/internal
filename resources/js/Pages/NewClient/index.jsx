import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Fragment, useState, useRef, useEffect, useMemo } from "react";
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

    // Calculate start and end of window
    let start = Math.max(1, currentPage - halfWindow);
    let end = Math.min(lastPage, start + windowSize - 1);

    // Adjust if we’re near the end
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

export default function ClientIndex({ clients, cicilans, total_clients }) {
    const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(false);

    const [clickCounts, setClickCounts] = useState({});
    const timeoutRef = useRef({});

    console.log(clients, cicilans, total_clients)

    const dropdownRefs = useRef([]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                activeDropdownIndex !== null &&
                dropdownRefs.current[activeDropdownIndex] &&
                !dropdownRefs.current[activeDropdownIndex].contains(e.target)
            ) {
                setActiveDropdownIndex(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [activeDropdownIndex]);

    const { success: successMessage, deleted: deletedMessage } =
        usePage().props.flash;

    useEffect(() => {
        if (successMessage || deletedMessage) {
            const timer = setTimeout(() => {
                router.get(
                    route("new_client.index"),
                    {},
                    { preserveState: true }
                );
            }, 500000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, deletedMessage]);

    // Security: Enhanced delete confirmation
    const handleDelete = (client) => {
        if (
            !confirm(
                `Are you sure you want to delete "${client.company_name}"? This action cannot be undone and all associated data will be permanently lost.`
            )
        ) {
            return;
        }

        setIsLoading(true);
        router.delete(route("new_client.destroy", client.uuid), {
            onSuccess: () => {
                setIsLoading(false);
            },
            onError: (errors) => {
                console.error("Delete error:", errors);
                setIsLoading(false);
                alert("Failed to delete client. Please try again.");
            },
            preserveScroll: true,
        });
    };

    const formatPaymentDates = (clientUuid) => {
        if (!clientUuid || !cicilans || !clients?.data) return null;

        const client = clients.data.find((c) => c.uuid === clientUuid);
        const clientCicilans = cicilans
            .filter((c) => c.client_uuid === clientUuid)
            .slice(0, 10);
            
            const formatDate = (dateString) => {
                if (!dateString) return null;
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return null;
                
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = String(date.getFullYear()).slice(-2);
                return `${day}/${month}/${year}`;
            };
            
            console.log(clientCicilans, formatDate);

        const formattedCicilans = clientCicilans.map((cicilan, index) => {
            console.log(cicilan.client_uuid==='57ce3b9b-4ce2-4810-83c0-7f34228cc7cd', cicilan.tanggal)
            // const formattedDate = formatDate(cicilan.tanggal);
            // console.log(formattedDate)
            return (
                <div
                    key={cicilan.id || index}
                    className="flex items-center mb-1 last:mb-0 group"
                >
                    <span className="text-sm text-gray-600 transition-colors dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                        {cicilan.tanggal}
                    </span>
                    {cicilan.status_cicilan === "true" && (
                        <span className="ml-2 text-green-500 transition-transform transform dark:text-green-400 group-hover:scale-110">
                            ✅
                        </span>
                    )}
                </div>
            );
        });

        // Add paid date (if any) as the last item with ✅
        const formattedPaid = formatDate(client?.paid);
        if (formattedPaid) {
            formattedCicilans.push(
                <div
                    key="paid-date"
                    className="flex items-center mb-1 last:mb-0 group"
                >
                    <span className="text-sm text-gray-600 transition-colors dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                        {formattedPaid}
                    </span>
                    <span className="ml-2 text-green-500 transition-transform transform dark:text-green-400 group-hover:scale-110">
                        ✅
                    </span>
                </div>
            );
        }

        return formattedCicilans;
    };

    const getStatusColor = (status) => {
        const statusColors = {
            Lunas: "from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/25",
            Cicil: "from-blue-400 to-cyan-600 shadow-lg shadow-blue-500/25",
            "Belum Bayar":
                "from-rose-400 to-red-600 shadow-lg shadow-rose-500/25",
            Active: "from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/25",
            Inactive:
                "from-slate-400 to-gray-600 shadow-lg shadow-slate-500/25",
            Pending:
                "from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25",
        };

        return statusColors[status] || "from-slate-400 to-gray-600";
    };

    // const filteredClients = clients.data.filter((client) => {
    //     const matchesSearch =
    //         client.company_name
    //             ?.toLowerCase()
    //             .includes(searchTerm.toLowerCase()) ||
    //         client.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         client.code?.toLowerCase().includes(searchTerm.toLowerCase());
    //     const matchesStatus =
    //         statusFilter === "all" || client.status === statusFilter;
    //     return matchesSearch && matchesStatus;
    // });

        const filteredClients = useMemo(() => {
            const search = searchTerm.toLowerCase();

            return clients.filter((client) => {
                const matchesSearch =
                    client.company_name?.toLowerCase().includes(search) ||
                    client.location?.toLowerCase().includes(search) ||
                    client.code?.toLowerCase().includes(search);

                const matchesStatus =
                    statusFilter === "all" || client.status === statusFilter;
                return matchesStatus && matchesSearch;
            });
        }, [clients, searchTerm, statusFilter]);

    // Enhanced Client Actions Component
    const ClientActionsDropDown = ({ client, index }) => {
        return (
            <div className="flex space-x-1">
                {/* View Button */}
                <Link
                    href={route("new_client.show", client.uuid)}
                    className="p-2 text-gray-600 transition-all duration-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl hover:scale-110 hover:shadow-lg dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 group"
                    title="View Client Details"
                >
                    <svg
                        className="w-4 h-4 transition-transform group-hover:rotate-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                </Link>

                {/* Edit Button */}
                <Link
                    href={route("new_client.edit", client.uuid)}
                    className="p-2 text-gray-600 transition-all duration-300 hover:text-green-600 hover:bg-green-50 rounded-xl hover:scale-110 hover:shadow-lg dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-900/30 group"
                    title="Edit Client"
                >
                    <svg
                        className="w-4 h-4 transition-transform group-hover:rotate-12"
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

                {/* Delete Button */}
                <button
                    onClick={() => handleDelete(client)}
                    disabled={isLoading}
                    className="p-2 text-gray-600 transition-all duration-300 hover:text-red-600 hover:bg-red-50 rounded-xl hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/30 group"
                    title="Delete Client"
                >
                    <svg
                        className="w-4 h-4 transition-transform group-hover:shake"
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
        );
    };

    // Enhanced table columns with icons
    const tableColumns = [
        {
            header: "No",
            render: (_, index) => (
                <div className="flex items-center">
                    <span className="flex items-center justify-center w-6 h-6 mr-2 text-xs font-bold text-black rounded-full dark:text-white">
                        {index + 1}
                    </span>
                </div>
            ),
            className: "w-16",
        },

        {
            header: "Code",
            render: (client) => (
                <code className="px-2 py-1 font-mono text-xs text-gray-800 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300">
                    {client.code}
                </code>
            ),
            className: "",
        },
        {
            header: "Company",
            render: (client) => (
                <div className="flex items-center space-x-3">
                    <div>
                        <div className="font-semibold text-gray-800 transition-colors dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                            {client.company_name}
                        </div>
                    </div>
                </div>
            ),
            className: "min-w-[200px]",
        },
        {
            header: "Type",
            render: (client) => (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                    {client.type}
                </div>
            ),
            className: "min-w-[150px]",
        },
        {
            header: "Location",
            render: (client) => (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                    {client.location}
                </div>
            ),
            className: "",
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="relative p-8 overflow-hidden text-white shadow-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900">
                    {/* Animated background elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 translate-x-1/2 translate-y-1/2 rounded-full bg-white/10 blur-lg"></div>

                    <div className="relative z-10">
                        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                            Client Management
                        </h1>
                        <p className="max-w-2xl text-xl opacity-90">
                            Manage your client relationships, track contracts,
                            and monitor payments in one beautiful interface
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Client Management" />

            <div className="max-w-[2000px] mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col items-center justify-between gap-6 mb-8 lg:flex-row">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg w-full max-w-[300px]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-100">
                                    Total Clients
                                </p>
                                <p className="text-3xl font-bold">
                                    {total_clients}
                                </p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
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
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Flash Messages */}
                <div className="mb-8 space-y-4">
                    {successMessage && (
                        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-2xl shadow-2xl border-l-4 border-emerald-400 flex items-center transform transition-all duration-500 hover:scale-[1.02]">
                            <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-white/20">
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-bold">Success!</h4>
                                <p>{successMessage}</p>
                            </div>
                        </div>
                    )}
                    {deletedMessage && (
                        <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white p-6 rounded-2xl shadow-2xl border-l-4 border-rose-400 flex items-center transform transition-all duration-500 hover:scale-[1.02]">
                            <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-white/20">
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-bold">Deleted</h4>
                                <p>{deletedMessage}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Enhanced Search and Filter Section */}
                <div className="p-8 mb-8 border border-blue-100 shadow-2xl bg-gradient-to-br from-white to-blue-50 rounded-3xl dark:from-gray-800 dark:to-blue-900/20 dark:border-blue-800/30">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-blue-500 pointer-events-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-search"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search for clients"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full py-4 pl-12 pr-4 transition-all duration-300 border-2 border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/80 backdrop-blur-sm group-hover:border-blue-200 dark:bg-gray-700/80 dark:border-blue-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900 dark:focus:border-blue-400"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-purple-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                                    />
                                </svg>
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="block w-full py-4 pl-12 pr-4 transition-all duration-300 border-2 border-purple-100 appearance-none rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 bg-white/80 backdrop-blur-sm group-hover:border-purple-200 dark:bg-gray-700/80 dark:border-purple-800 dark:text-white dark:focus:ring-purple-900 dark:focus:border-purple-400"
                            >
                                <option value="all">All Statuses</option>
                                <option value="Lunas">Paid</option>
                                <option value="Cicil">Installments</option>
                                <option value="Belum Bayar">Unpaid</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>

                        {/* Stats Card */}
                        <Link
                            href={route("new_client.create")}
                            className="relative px-8 py-4 overflow-hidden font-semibold text-white transition-all duration-500 shadow-2xl group bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 rounded-2xl hover:shadow-3xl hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <div className="relative z-10 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 mr-3 transition-transform transform group-hover:rotate-90"
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
                                Add New Client
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Enhanced Clients Table */}
                <div className="overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-3xl dark:bg-gray-800 dark:shadow-gray-900/30 dark:border-gray-700">
                    <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-700">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Client Portfolio
                                </h2>
                                <p className="mt-1 text-blue-100">
                                    Manage and monitor all your client
                                    relationships
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="px-4 py-2 text-sm font-semibold text-white bg-white/20 rounded-xl backdrop-blur-sm">
                                    {filteredClients.length}{" "}
                                    {filteredClients.length === 1
                                        ? "client"
                                        : "clients"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20">
                                <tr>
                                    {tableColumns.map((column, index) => (
                                        <th
                                            key={index}
                                            className={`px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300 ${column.className}`}
                                        >
                                            {column.header}
                                        </th>
                                    ))}
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredClients
                                    .map((client, index) => (
                                        <tr
                                            key={client.uuid}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => {
                                                setClickCounts((prev) => {
                                                    const now = Date.now();
                                                    // console.log(now);
                                                    const last =
                                                        prev[client.uuid]
                                                            ?.time || 0;
                                                    // console.log(last);
                                                    if (now - last < 500)
                                                        return (
                                                            router.get(
                                                                route(
                                                                    "new_client.show",
                                                                    client.uuid
                                                                )
                                                            ),
                                                            {
                                                                ...prev,
                                                                [client.uuid]: {
                                                                    time: 0,
                                                                },
                                                            }
                                                        );
                                                    return {
                                                        ...prev,
                                                        [client.uuid]: {
                                                            time: now,
                                                        },
                                                    };
                                                });
                                            }}
                                            className="transition-all duration-300 cursor-pointer group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            {tableColumns.map(
                                                (column, colIndex) => (
                                                    <td
                                                        key={colIndex}
                                                        className="px-6 py-4 text-sm text-gray-700 transition-colors dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                                                    >
                                                        {column.render
                                                            ? column.render(
                                                                  client,
                                                                  index
                                                              )
                                                            : client[
                                                                  column
                                                                      .accessor
                                                              ]}
                                                    </td>
                                                )
                                            )}

                                            <td
                                                className="px-6 py-4 text-sm font-medium"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <ClientActionsDropDown
                                                    client={client}
                                                    index={index}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <PaginationComponent
                            currentPage={clients.current_page}
                            lastPage={clients.last_page}
                        />

                        {filteredClients.length === 0 && (
                            <div className="py-16 text-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/10">
                                <div className="max-w-md mx-auto">
                                    <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl dark:from-blue-900/30 dark:to-purple-900/30">
                                        <svg
                                            className="w-12 h-12 text-blue-500 dark:text-blue-400"
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
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-gray-700 dark:text-gray-300">
                                        No clients found
                                    </h3>
                                    <p className="mb-6 text-gray-500 dark:text-gray-400">
                                        {searchTerm || statusFilter !== "all"
                                            ? "Try adjusting your search or filter criteria"
                                            : "Get started by adding your first client"}
                                    </p>
                                    <Link
                                        href={route("new_client.create")}
                                        className="inline-flex items-center px-6 py-3 font-medium text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 rounded-2xl hover:shadow-xl hover:scale-105"
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
                                        Add Your First Client
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom CSS for additional animations */}
            <style jsx>{`
                @keyframes shake {
                    0%,
                    100% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(-2px);
                    }
                    75% {
                        transform: translateX(2px);
                    }
                }
                .hover\\:shake:hover {
                    animation: shake 0.5s ease-in-out;
                }
                .shadow-3xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
