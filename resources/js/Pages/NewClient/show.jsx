import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ client }) {
    console.log(client);
    return (
        <AuthenticatedLayout
            header={
                <div className="text-center py-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg dark:from-indigo-800 dark:to-purple-900">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Client Information 📄
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                        Viewing {client?.company_name}'s details and contract
                        information
                    </p>
                </div>
            }
        >
            <Head title={`Client - ${client?.company_name}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/30">
                        <div className="p-6 md:p-8">
                            {/* Header */}
                            <div className="mb-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 dark:from-indigo-900/20 dark:to-purple-900/20 dark:border-indigo-800">
                                <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">
                                    {client?.company_name}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Client Code: <span className="font-semibold">{client?.code}</span>
                                </p>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <InfoField label="Company Name" value={client.company_name} />
                                <InfoField label="Code" value={client.code} />
                                <InfoField label="Type" value={client.type} />
                                <InfoField label="Package" value={client.package} />
                                <InfoField label="Person In Charge (PIC)" value={client.pic} />
                                <InfoField
                                    label="Location"
                                    value={client.location}
                                    colSpan="md:col-span-2"
                                />
                            </div>

                            {/* Contract Duration */}
                            <SectionTitle title="Contract Duration" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <InfoField label="Years" value={client.contract_tahun} />
                                <InfoField label="Months" value={client.contract_bulan} />
                                <InfoField label="Days" value={client.contract_hari} />
                            </div>

                            {/* Payment Info */}
                            <SectionTitle title="Payment Information" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <InfoField label="Payment Status" value={client.status} />
                                {client.status === "Cicil" && (
                                    <InfoField
                                        label="Number of Installments"
                                        value={client.cicil}
                                    />
                                )}
                            </div>

                            {/* Installment Schedule */}
                            {client.status === "Cicil" &&
                                client.fase_pembayaran?.length > 0 && (
                                    <div className="mb-8">
                                        <SectionTitle title="Installment Schedule" />
                                        <div className="space-y-4">
                                            {client.fase_pembayaran.map(
                                                (fase, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-gray-800 dark:text-gray-200">
                                                                <span className="font-semibold">
                                                                    Installment {index + 1} Date:
                                                                </span>{" "}
                                                                {fase.tanggal || "—"}
                                                            </p>
                                                            <p
                                                                className={`font-semibold ${
                                                                    fase.status_cicilan
                                                                        ? "text-green-600"
                                                                        : "text-yellow-600"
                                                                }`}
                                                            >
                                                                {fase.status_cicilan
                                                                    ? "Paid"
                                                                    : "Pending"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* Back Button */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route("new_client.index")}
                                    className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/* Helper Components */
function InfoField({ label, value, colSpan }) {
    return (
        <div className={colSpan}>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {label}
            </p>
            <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                {value || "—"}
            </p>
        </div>
    );
}

function SectionTitle({ title }) {
    return (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {title}
        </h3>
    );
}
