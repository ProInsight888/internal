import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Fragment, useState, useRef, useEffect } from "react";

export default function ClientIndex({ clients, cicilans }) {
    const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
    const [showDeleteEdit, setShowDeleteEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const dropdownRefs = useRef([]);

    // Handle click outside dropdown
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

    // Flash messages
    const { success: successMessage, deleted: deletedMessage } =
        usePage().props.flash;

    // Format contract duration
    const formatContractDuration = (contract) => {
        const parts = contract.split(" ");
        const [tahun, bulan, hari] = [parts[0], parts[2], parts[4]];

        return [
            tahun !== "0" && `${tahun} Tahun`,
            bulan !== "0" && `${bulan} Bulan`,
            hari !== "0" && `${hari} Hari`,
        ]
            .filter(Boolean)
            .join(" ");
    };

    // Format payment dates
    const formatPaymentDates = (clientUuid) => {
        return cicilans
            .filter((c) => c.client_uuid === clientUuid)
            .map((cicilan, index) => {
                const date = new Date(cicilan.tanggal);
                const monthNames = [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];
                const formattedDate = `${String(date.getDate()).padStart(2, "0")} 
                                     ${monthNames[date.getMonth()]} 
                                     ${date.getFullYear()}`;

                return (
                    <div key={index} className="flex items-center mb-1 last:mb-0">
                        <span className="text-sm">{formattedDate}</span>
                        {cicilan.status_cicilan === "true" && (
                            <span className="ml-2 text-green-500">✅</span>
                        )}
                    </div>
                );
            });
    };

    // Get status badge color
    const getStatusColor = (status) => {
        const statusColors = {
            'Lunsa': 'bg-gradient-to-r from-green-500 to-emerald-600',
            'Cici': 'bg-gradient-to-r from-blue-500 to-cyan-600',
            'Active': 'bg-gradient-to-r from-green-500 to-emerald-600',
            'Inactive': 'bg-gradient-to-r from-gray-500 to-slate-600',
            'Pending': 'bg-gradient-to-r from-amber-500 to-orange-500'
        };
        return statusColors[status] || 'bg-gradient-to-r from-gray-500 to-slate-600';
    };

    // Filter clients based on search and status filter
    const filteredClients = clients.filter(client => {
        const matchesSearch = client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            client.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            client.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const ClientActionsDropDown = ({
        client,
        index,
        showDeleteEdit,
        setShowDeleteEdit,
        dropdownRefs,
    }) => {
        useEffect(() => {
            function handleClickOutside(e) {
                if (
                    showDeleteEdit !== false &&
                    dropdownRefs.current[showDeleteEdit] &&
                    !dropdownRefs.current[showDeleteEdit].contains(e.target)
                ) {
                    setShowDeleteEdit(false);
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }, [showDeleteEdit]);

        return (
            <div className="relative">
                <button
                    onClick={() =>
                        setShowDeleteEdit(
                            showDeleteEdit === index ? null : index,
                        )
                    }
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        className="text-gray-600 hover:text-gray-800"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                        <path d="M12 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                        <path d="M12 14a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                        <path d="M8 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" />
                        <path d="M14 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" />
                    </svg>
                </button>

                {showDeleteEdit === index && (
                    <div
                        ref={(el) => (dropdownRefs.current[index] = el)}
                        className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl z-10 border border-gray-200 overflow-hidden"
                    >
                        <Link
                            href={route("new_client.edit", client.uuid)}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Client
                        </Link>
                        <div className="border-t border-gray-200"></div>
                        <button
                            onClick={() => {
                                if (
                                    confirm(
                                        `Are you sure you want to delete ${client.company_name}? This action cannot be undone.`,
                                    )
                                ) {
                                    router.delete(
                                        route(
                                            "new_client.destroy",
                                            client.uuid,
                                        ),
                                        {
                                            onSuccess: () => {},
                                            onError: (errors) =>
                                                console.error(errors),
                                        },
                                    );
                                }
                            }}
                            className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Client
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Table columns configuration
    const tableColumns = [
        { header: "No", render: (_, index) => index + 1, className: "w-12" },
        { header: "Company Name", accessor: "company_name", className: "font-semibold" },
        { header: "Type", accessor: "type", className: "" },
        { header: "Location", accessor: "location", className: "" },
        {
            header: "Contract Duration",
            render: (client) => formatContractDuration(client.contract),
            className: ""
        },
        { header: "Package", accessor: "package", className: "" },
        { 
            header: "Status", 
            render: (client) => (
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(client.status)}`}>
                    {client.status}
                </span>
            ),
            className: "" 
        },
        { header: "Contract Ends", accessor: "contract_end", className: "" },
        {
            header: "Payment Schedule",
            render: (client) => (
                <div className="text-sm">
                    {client.payment_month !== "-"
                        ? client.payment_month
                        : formatPaymentDates(client.uuid)}
                </div>
            ),
            className: ""
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                        Client Management
                    </h1>
                    <p className="text-lg opacity-90">
                        Manage your client relationships and contracts
                    </p>
                </div>
            }
        >
            <Head title="Client Management" />

            <div className="max-w-[2000px] mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <Link href="/" className="mb-4 md:mb-0">
                        <img
                            className="w-64 md:w-80"
                            src="/logo/Logo Pro Insight.png"
                            alt="Pro Insight Logo"
                        />
                    </Link>

                    <Link
                        href={route("new_client.create")}
                        className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New Client
                    </Link>
                </div>

                {/* Flash Messages */}
                <div className="mb-6">
                    {successMessage && (
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 p-4 rounded-lg border border-green-200 flex items-center mb-4">
                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            {successMessage}
                        </div>
                    )}
                    {deletedMessage && (
                        <div className="bg-gradient-to-r from-red-100 to-rose-100 text-red-800 p-4 rounded-lg border border-red-200 flex items-center mb-4">
                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                            </svg>
                            {deletedMessage}
                        </div>
                    )}
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search clients by name, location, or type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Statuses</option>
                                <option value="Lunsa">Lunsa</option>
                                <option value="Cici">Cici</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Clients Table */}
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Client List</h2>
                            <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                                {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    {tableColumns.map((column, index) => (
                                        <th
                                            key={index}
                                            className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${column.className}`}
                                        >
                                            {column.header}
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredClients.map((client, index) => (
                                    <tr
                                        key={client.uuid}
                                        className="hover:bg-blue-50 transition-colors duration-150"
                                    >
                                        {tableColumns.map((column, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className="px-4 py-4 text-sm text-gray-700"
                                            >
                                                {column.render
                                                    ? column.render(client, index)
                                                    : client[column.accessor]}
                                            </td>
                                        ))}
                                        <td className="px-4 py-4 text-sm font-medium">
                                            <ClientActionsDropDown
                                                client={client}
                                                index={index}
                                                showDeleteEdit={showDeleteEdit}
                                                setShowDeleteEdit={
                                                    setShowDeleteEdit
                                                }
                                                dropdownRefs={dropdownRefs}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {filteredClients.length === 0 && (
                            <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50">
                                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-700 mb-2">No clients found</h3>
                                <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                                <Link
                                    href={route("new_client.create")}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Add your first client
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}