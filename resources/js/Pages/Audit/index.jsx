import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Fragment, useState, useRef, useEffect } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComponent = ({currentPage, lastPage}) => {
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
}

export default function ClientIndex({ clients, cicilans }) {
    const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(false);

    const dropdownRefs = useRef([]);

    // Security: Handle click outside dropdown
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

    // Flash messages with auto-dismiss
    const { success: successMessage, deleted: deletedMessage } =
        usePage().props.flash;

    useEffect(() => {
        if (successMessage || deletedMessage) {
            const timer = setTimeout(() => {
                // Clear flash messages after 5 seconds
                router.get(
                    route("new_client.index"),
                    {},
                    { preserveState: true }
                );
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, deletedMessage]);

    // const pageSized = [1,2,3,5,10,15,30,40,50,100];
    // const pagination = ref({
    //     pageIndex: props.data.current_page - 1,
    //     pageSize: props.data.per_page,
    // }) 
    
    return (
        <AuthenticatedLayout
            header={
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 rounded-3xl text-white shadow-2xl dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900">
                    {/* Animated background elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-lg"></div>

                    <div className="relative z-10">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            Audit Management
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl">
                            Manage your client relationships, track contracts,
                            and monitor payments in one beautiful interface
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Client Management" />

            <div className="max-w-[2000px] mx-auto px-4 py-8">
                {/* Enhanced Flash Messages */}
                <div className="mb-8 space-y-4">
                    {successMessage && (
                        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-2xl shadow-2xl border-l-4 border-emerald-400 flex items-center transform transition-all duration-500 hover:scale-[1.02]">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
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
                                <h4 className="font-bold text-lg">Success!</h4>
                                <p>{successMessage}</p>
                            </div>
                        </div>
                    )}
                    {deletedMessage && (
                        <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white p-6 rounded-2xl shadow-2xl border-l-4 border-rose-400 flex items-center transform transition-all duration-500 hover:scale-[1.02]">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
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
                                <h4 className="font-bold text-lg">Deleted</h4>
                                <p>{deletedMessage}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Enhanced Clients Table */}
                <div className="bg-white shadow-2xl rounded-3xl overflow-hidden dark:bg-gray-800 dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Audit
                                </h2>
                                <p className="text-blue-100 mt-1">
                                    Manage and monitor all your client
                                    relationships
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-fullxl p-5">
                        <div className="px-10 py-8 rounded-xl bg-yellow-50 text-black flex gap-8 items-center">
                            <div className="w-16 aspect-square rounded-full bg-cyan-400"></div>
                            <div>
                                <div className="text-2xl">Apin delete <b>1 Task</b> from IT Task</div>
                                <div>Tuesday, 31 Oktober 2025 at 10.25.</div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto"></div>
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
