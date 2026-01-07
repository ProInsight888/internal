import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function edit({ clients }) {
    const contractParts =
        typeof clients?.contract === "string"
            ? clients.contract.split(" - ")
            : [];

    const safeDate = (value) => {
        if (!value) return "";

        const date = new Date(value);
        if (isNaN(date.getTime())) return "";

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // function normalizeDate(str) {
    //     if (!str) return "";
    //     const parts = str.replace(/\//g, "-").split("-");
    //     if (parts.length !== 3) return "";
    //     const [d, m, y] = parts;
    //     const fullYear = y.length === 2 ? "20" + y : y;
    //     return `${fullYear}-${m}-${d}`;
    // }

    // const formatted = normalizeDate(clients?.paid);

    // console.log(formatted)

    

    const { data, setData, put, post, processing, errors, reset } = useForm({
        company_name: clients?.company_name || "",
        code: clients?.code || "",
        type: clients?.type || "",
        location: clients?.location || "",
        contract_start: safeDate(contractParts[0]) || "",
        contract_end: safeDate(contractParts[1]) || "",
        package: clients?.package || "",
        status: clients?.status || "",
        cicil: clients?.cicilans.length || "",
        paid: clients?.paid || null,
        fase_pembayaran: clients?.cicilans?.map((c, i) => ({
            cicilan: c.cicilan || "",
            tanggal: c.tanggal || "",
            status_cicilan: c.status_cicilan || "false",
        })) || [{ cicilan: "", tanggal: "", checked: "false" }],
        add_ons_drone: (clients?.add_ons_drone !== 1 ? false : true) || false,
        add_ons_production:
            (clients?.add_ons_production !== 1 ? false : true) || false,
        });
        
        console.log(data, clients.cicilans);

    useEffect(() => {
        const jumlah = parseInt(data.cicil || 0);
        if (data.status === "Cicil" && jumlah > 0) {
            if (data.fase_pembayaran.length !== jumlah) {
                const fase = Array.from({ length: jumlah }, (_, i) => ({
                    cicilan: `Cicilan ${i + 1}`,
                    tanggal: data.fase_pembayaran[i]?.tanggal || "",
                    status_cicilan:
                        data.fase_pembayaran[i]?.status_cicilan || "false",
                }));
                setData("fase_pembayaran", fase);
            }
        } else if (data.status !== "Cicil" && data.fase_pembayaran.length > 0) {
            setData("fase_pembayaran", []);
        }
    }, [data.cicil, data.status]);

    const submit = (e) => {
        e.preventDefault();

        put(route("new_client.update", clients.uuid), {
            preserveScroll: true,
            onError: (errors) => console.error(errors),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="py-8 text-center text-white rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-900">
                    <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                        Edit Client Information ✏️
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl opacity-90">
                        Update {clients?.company_name}'s details and contract
                        information
                    </p>
                </div>
            }
        >
            <Head title={`Edit ${clients?.company_name}`} />

            <div className="py-6">
                <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/30">
                        <div className="p-6 md:p-8">
                            {/* Client Info Header */}
                            <div className="p-5 mb-8 border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl dark:from-indigo-900/20 dark:to-purple-900/20 dark:border-indigo-800">
                                <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">
                                    Editing: {clients?.company_name}
                                </h2>
                                <p className="mt-1 text-indigo-600 dark:text-indigo-400">
                                    Update client details and contract
                                    information below
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                                        Code: {clients?.code}
                                    </span>
                                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
                                        Package: {clients?.package}
                                    </span>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                        Status: {clients?.status}
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Company Name - Full Width */}
                                    <div className="md:col-span-2">
                                        <InputLabel
                                            htmlFor="company_name"
                                            value="Company Name"
                                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        />

                                        <TextInput
                                            id="company_name"
                                            name="company_name"
                                            value={data.company_name}
                                            className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                            autoComplete="company_name"
                                            onChange={(e) =>
                                                setData(
                                                    "company_name",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />

                                        <InputError
                                            message={errors.company_name}
                                            className="mt-2 dark:text-red-400"
                                        />
                                    </div>

                                    {/* Client Code - Left Column */}
                                    <div>
                                        <InputLabel
                                            htmlFor="code"
                                            value="Client Code"
                                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        />

                                        <TextInput
                                            id="code"
                                            name="code"
                                            value={data.code}
                                            maxLength={4}
                                            className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                            onChange={(e) =>
                                                setData(
                                                    "code",
                                                    e.target.value.toUpperCase()
                                                )
                                            }
                                            required
                                        />

                                        <InputError
                                            message={errors.code}
                                            className="mt-2 dark:text-red-400"
                                        />
                                        
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="type"
                                            value="Type Of Business"
                                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        />

                                        <TextInput
                                            id="type"
                                            name="type"
                                            value={data.type}
                                            className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                            autoComplete="type"
                                            onChange={(e) =>
                                                setData("type", e.target.value)
                                            }
                                            required
                                        />

                                        <InputError
                                            message={errors.type}
                                            className="mt-2 dark:text-red-400"
                                        />
                                    </div>  

                                    {/* Example: Location field - also full width if needed */}
                                    <div className="md:col-span-2">
                                        <InputLabel
                                            htmlFor="location"
                                            value="Location"
                                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        />

                                        <TextInput
                                            id="location"
                                            name="location"
                                            value={data.location}
                                            className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                            autoComplete="location"
                                            onChange={(e) =>
                                                setData(
                                                    "location",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <InputError
                                            message={errors.location}
                                            className="mt-2 dark:text-red-400"
                                        />
                                    </div>

                                </div>
                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
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

                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                        className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-medium py-2.5 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50 dark:from-blue-700 dark:to-purple-800 dark:hover:from-blue-800 dark:hover:to-purple-900"
                                    >
                                        {processing ? (
                                            <span className="flex items-center">
                                                <svg
                                                    className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
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
                                                Updating Client...
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
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
                                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                    />
                                                </svg>
                                                Update Client Data
                                            </span>
                                        )}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
