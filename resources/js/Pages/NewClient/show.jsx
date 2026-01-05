import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { PackageSearch } from "lucide-react";
import { useState } from "react";

// Single, consistent InfoField component
function InfoField({ label, value, colSpan = "col-span-1" }) {
    return (
        <div className={`${colSpan} space-y-1`}>
            {/* Label */}
            <p className="text-sm font-medium tracking-wide text-gray-600 dark:text-gray-400">
                {label}
            </p>

            {/* Card-like container */}
            <div className="p-4 transition-all duration-200 bg-white border border-gray-200 shadow-sm dark:border-gray-600 dark:bg-gray-700 rounded-xl backdrop-blur-sm hover:shadow-md">
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {value || "—"}
                </p>
            </div>
        </div>
    );
}

// SectionTitle component
function SectionTitle({ title }) {
    return (
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {title}
        </h3>
    );
}

export default function Show({ client, contracts, clientPackages, cicilan_package}) {
        
    cicilan_package.map((e)=>{
        console.log(e)
    }
    )

    
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = (contract_del_uuid) => {
            if (
                !confirm(
                    `Are you sure you want to delete "${contract_del_uuid}"? This action cannot be undone and all associated data will be permanently lost.`
                )
            ) {
                return;
            }
    
            setIsLoading(true);
            router.delete(route("contract.destroy", contract_del_uuid), {
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

    

    // console.log(client)
    return (
        <AuthenticatedLayout
            header={
                <div className="py-8 text-center text-white rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-900">
                    <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                        Client Information 📄
                    </h1>
                    <p className="mx-auto text-lg max-w-7xl md:text-xl opacity-90">
                        Viewing {client?.company_name}'s details and contract
                        information
                    </p>
                </div>
            }
        >
            <Head title={`Client - ${client?.company_name}`} />

            <div className="py-6">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/30">
                        <div className="p-6 md:p-8">
                            {/* Header */}

                            <div className="p-5 mb-8 border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl dark:from-indigo-900/20 dark:to-purple-900/20 dark:border-indigo-800">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">
                                            {client?.company_name}
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Code:{" "}
                                            <span className="font-semibold">
                                                {client?.code}
                                            </span>
                                        </p>
                                    </div>

                                    <Link
                                        href={route(
                                            "new_client.edit",
                                            client.uuid
                                        )}
                                        className="inline-flex items-center px-4 py-2 font-medium transition-all duration-200 rounded-lg dark:text-white"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
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
                                </div>
                            </div>

                            {/* Basic Info */}
                            <SectionTitle title="Basic Information" />
                            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
                                <InfoField label="Type" value={client.type} />
                                <InfoField
                                    label="Location"
                                    value={client.location}
                                />
                            </div>

                            {/* Package Info */}

                            {/* Installment Schedule */}
                            

                            {/* Table Data Package */}
                            <SectionTitle title="Package Details" />
                            <div className="mb-8">
                                <div className="overflow-hidden bg-white border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 dark:bg-gray-800">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-12 bg-gray-100 border-b border-gray-300 dark:bg-gray-700 dark:border-gray-600">
                                        <div className="col-span-2 px-4 py-3 text-sm font-semibold text-center text-gray-700 border-r border-gray-300 dark:text-gray-300 dark:border-gray-600">
                                            Package
                                        </div>
                                        <div className="col-span-2 px-4 py-3 text-sm font-semibold text-center text-gray-700 border-r border-gray-300 dark:text-gray-300 dark:border-gray-600">
                                            Payment Date
                                        </div>
                                        <div className="col-span-2 px-4 py-3 text-sm font-semibold text-center text-gray-700 border-r border-gray-300 dark:text-gray-300 dark:border-gray-600">
                                            Payment Status
                                        </div>
                                        <div className="col-span-1 px-4 py-3 text-sm font-semibold text-center text-gray-700 border-r border-gray-300 dark:text-gray-300 dark:border-gray-600">
                                            Ins Total
                                        </div>
                                        <div className="col-span-2 px-4 py-3 text-sm font-semibold text-center text-gray-700 border-r border-gray-300 dark:text-gray-300 dark:border-gray-600">
                                            Installment.S
                                        </div>
                                        <div className="col-span-2 px-4 py-3 text-sm font-semibold text-center text-gray-700 border-r border-gray-300 dark:text-gray-300 dark:border-gray-600">
                                            Add Ons
                                        </div>
                                    </div>

                                    {/* Table Row */}
                                    {clientPackages.map((packages, index) => {
                                        const cicilan_per_package = 
                                        console.log(packages.uuid)
                                        return(
                                        <div className="grid grid-cols-12 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                                            {/* Package Cell */}
                                            <div className="flex items-center justify-center col-span-2 px-4 py-3 text-center text-gray-900 border-r border-gray-300 dark:text-white dark:border-gray-600">
                                                {packages.package_name || "—"}
                                            </div>

                                            {/* Contract Duration Cell */}
                                            <div className="col-span-2 px-4 py-3 border-r border-gray-300 dark:border-gray-600">
                                                <div className="">
                                                    {packages.payment_date || "-"}
                                                </div>
                                            </div>
                                            <div className="col-span-2 px-4 py-3 border-r border-gray-300 dark:border-gray-600">
                                                <div className="">
                                                    {packages.payment_status || "-"}
                                                </div>
                                            </div>
                                            <div className="col-span-1 px-4 py-3 border-r border-gray-300 dark:border-gray-600">
                                                <div className="">
                                                    {packages.total_installment || "-"}
                                                </div>
                                            </div>
                                            <div className="col-span-2 px-4 py-3 border-r border-gray-300 dark:border-gray-600">
                                                {cicilan_package.map((e, index)=>{
                                                    // console.log(e)
                                                    return(
                                                        <div>{e?.client_uuid === packages?.uuid ? e.tanggal : ""} {e.status_cicilan === "true" ? "✅" : ""}</div>
                                                    )
                                                })}
                                            </div>
                                            
                                            <div className="col-span-2 px-4 py-3 border-r border-gray-300 dark:border-gray-600">
                                                <div className="">
                                                    {packages.add_ons || "-"}
                                                </div>
                                            </div>

                                            <div className="inline-flex items-center justify-center w-full col-span-1 gap-5 px-4 py-2 text-sm font-medium text-black transition-all duration-200 rounded-lg dark:text-white">
                                                <Link
                                                    href={
                                                        route("package.edit", packages.uuid)
                                                    }
                                                    className=""
                                                >
                                                    <svg
                                                        className="w-4 h-4 mr-2"
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
                                                    onClick={() =>
                                                        handleDelete(
                                                            contract.uuid
                                                        )
                                                    }
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
                                        </div>
)})}
                                </div>
                            </div>
                            
                            {/* Table Data Contract */}
                            <SectionTitle title="Contract Details" />
                            <div className="mb-8">
                                <div className="overflow-hidden bg-white border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 dark:bg-gray-800">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-12 bg-gray-100 border-b border-gray-300 dark:bg-gray-700 dark:border-gray-600">
                                        <div className="col-span-3 px-4 py-3 text-sm font-semibold text-center text-gray-700 border-r border-gray-300 dark:text-gray-300 dark:border-gray-600">
                                            Reference Number
                                        </div>
                                        <div className="col-span-2 px-4 py-3 text-sm font-semibold text-center text-gray-700 border-r border-gray-300 dark:text-gray-300 dark:border-gray-600">
                                            Package
                                        </div>
                                        <div className="col-span-5 px-4 py-3 text-sm font-semibold text-center text-gray-700 border-r border-gray-300 dark:text-gray-300 dark:border-gray-600">
                                            Contract Duration
                                        </div>
                                        <div className="col-span-2 px-4 py-3 text-sm font-semibold text-center text-gray-700 dark:text-gray-300">
                                            Actions
                                        </div>
                                    </div>

                                    {/* Table Row */}
                                    {contracts.map((contract, index) => (
                                        <div className="grid grid-cols-12 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                                            {/* Reference Number Cell */}
                                            <div className="flex items-center justify-center col-span-3 px-4 py-3 text-center text-gray-900 border-r border-gray-300 dark:text-white dark:border-gray-600">
                                                {contract.reference_num || "—"}
                                            </div>

                                            {/* Package Cell */}
                                            <div className="flex items-center justify-center col-span-2 px-4 py-3 text-center text-gray-900 border-r border-gray-300 dark:text-white dark:border-gray-600">
                                                {contract.package || "—"}
                                            </div>

                                            {/* Contract Duration Cell */}
                                            <div className="col-span-5 px-4 py-3 border-r border-gray-300 dark:border-gray-600">
                                                <div className="">
                                                    {client.contract}
                                                </div>
                                            </div>

                                            <div className="inline-flex items-center justify-center w-full col-span-2 gap-5 px-4 py-2 text-sm font-medium text-black transition-all duration-200 rounded-lg dark:text-white">
                                                <button
                                                    onClick={(e) => {
                                                        const clientsUuid =
                                                            contract.uuid;
                                                        // console.log(clientsUuid)
                                                        window.open(
                                                            `/newClient/${clientsUuid}/contract`,
                                                            "_blank"
                                                        );
                                                    }}
                                                    className=""
                                                >
                                                    <svg
                                                        className="w-4 h-4 "
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        class="bi bi-eye"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path
                                                            d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 
                                                                        1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 
                                                                        14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 
                                                                        12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"
                                                        />
                                                        <path
                                                            d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 
                                                                        0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 
                                                                        1-7 0"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            contract.uuid
                                                        )
                                                    }
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
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="inline-flex items-center justify-between w-full">
                                <div className="w-full pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={route("new_client.index")}
                                            className="inline-flex items-center px-4 py-2 text-sm text-gray-600 transition-colors duration-200 rounded-lg hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                                        >
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                                />
                                            </svg>
                                            Back to Clients
                                        </Link>
                                        <div className="flex items-center">
                                            <Link
                                                href={route("package.create", {
                                                    package: client.uuid
                                                })}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-black transition-all duration-200 rounded-lg dark:text-gray-200 dark:hover:scale-105 dark:hover:text-white"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-2"
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
                                                New Package
                                            </Link>
                                            <Link
                                                href={route("contract.edit", {
                                                    contract: client.uuid,
                                                })}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-black transition-all duration-200 rounded-lg dark:text-gray-200 dark:hover:scale-105 dark:hover:text-white"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className="w-4 h-4 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                                Create New Contract
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
