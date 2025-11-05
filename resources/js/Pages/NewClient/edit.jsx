import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function edit({ clients }) {
    const contractParts = (clients?.contract || "").split(" ---- ");
    const formattedDates = contractParts.map((dateStr) => {
        const date = new Date(dateStr);
        // Convert to YYYY-MM-DD
        return date.toISOString().split("T")[0];
    });

    console.log(formattedDates);

    const { data, setData, put, post, processing, errors, reset } = useForm({
        company_name: clients?.company_name || "",
        code: clients?.code || "",
        type: clients?.type || "",
        location: clients?.location || "",
        contract_start: formattedDates[0] || "",
        contract_end: formattedDates[1] || "",
        package: clients?.package || "",
        status: clients?.status || "",
        cicil: clients?.cicilans.length || "",
        fase_pembayaran: clients?.cicilans?.map((c, i) => ({
            cicilan: c.cicilan || "",
            tanggal: c.tanggal || "",
            status_cicilan: c.status_cicilan || "false",
        })) || [{ cicilan: "", tanggal: "", checked: "false" }],
    });

    console.log(data);

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

    console.log(data.status);

    const submit = (e) => {
        e.preventDefault();

        put(route("new_client.update", clients.uuid), {
            preserveScroll: true,
            onSuccess: () => {
                // window.location.reload();
            },
            onError: (errors) => console.error(errors),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="text-center py-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg dark:from-indigo-800 dark:to-purple-900">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Edit Client Information ✏️
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                        Update {clients?.company_name}'s details and contract
                        information
                    </p>
                </div>
            }
        >
            <Head title={`Edit ${clients?.company_name}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/30">
                        <div className="p-6 md:p-8">
                            {/* Client Info Header */}
                            <div className="mb-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 dark:from-indigo-900/20 dark:to-purple-900/20 dark:border-indigo-800">
                                <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">
                                    Editing: {clients?.company_name}
                                </h2>
                                <p className="text-indigo-600 mt-1 dark:text-indigo-400">
                                    Update client details and contract
                                    information below
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Company Information */}
                                    <div className="space-y-6">
                                        <div>
                                            <InputLabel
                                                htmlFor="company_name"
                                                value="Company Name"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            />

                                            <TextInput
                                                id="company_name"
                                                name="company_name"
                                                value={data.company_name}
                                                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
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

                                        <div>
                                            <InputLabel
                                                htmlFor="code"
                                                value="Client Code"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            />

                                            <TextInput
                                                id="code"
                                                name="code"
                                                value={data.code}
                                                maxLength={4}
                                                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
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
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            />

                                            <TextInput
                                                id="type"
                                                name="type"
                                                value={data.type}
                                                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                autoComplete="type"
                                                onChange={(e) =>
                                                    setData(
                                                        "type",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />

                                            <InputError
                                                message={errors.type}
                                                className="mt-2 dark:text-red-400"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="location"
                                                value="Business Location"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            />

                                            <TextInput
                                                id="location"
                                                name="location"
                                                value={data.location}
                                                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                autoComplete="location"
                                                onChange={(e) =>
                                                    setData(
                                                        "location",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />

                                            <InputError
                                                message={errors.location}
                                                className="mt-2 dark:text-red-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Contract & Package Information */}
                                    <div className="space-y-6">
                                        <div>
                                            <InputLabel
                                                htmlFor="package"
                                                value="Package"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            />

                                            <select
                                                id="package"
                                                name="package"
                                                value={data.package}
                                                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                autoComplete="package"
                                                onChange={(e) =>
                                                    setData(
                                                        "package",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            >
                                                <optgroup
                                                    label="Social Media Management"
                                                    className="dark:text-gray-300"
                                                >
                                                    <option value="Protall">
                                                        Protall
                                                    </option>
                                                    <option value="Progrand">
                                                        Progrand
                                                    </option>
                                                    <option value="Proventi">
                                                        Proventi
                                                    </option>
                                                    <option value="Promax">
                                                        Promax
                                                    </option>
                                                    <option value="Feeds">
                                                        Add Ons Feeds
                                                    </option>
                                                    <option value="Reels">
                                                        Add Ons Reels
                                                    </option>
                                                </optgroup>

                                                <optgroup
                                                    label="Digital Branding"
                                                    className="dark:text-gray-300"
                                                >
                                                    <option value="Company Profile">
                                                        Company Profile
                                                    </option>
                                                    <option value="HR System">
                                                        HR System
                                                    </option>
                                                    <option value="Invitation Link">
                                                        Invitation Link
                                                    </option>
                                                    <option value="Application">
                                                        Application
                                                    </option>
                                                    <option value="Design">
                                                        Package Design
                                                    </option>
                                                </optgroup>

                                                <optgroup
                                                    label="Event Documentation"
                                                    className="dark:text-gray-300"
                                                >
                                                    <option value="Photo & Video">
                                                        Photo & Video
                                                    </option>
                                                    <option value="Drone">
                                                        Add Ons Drone
                                                    </option>
                                                    <option value="Production">
                                                        Add Ons Production
                                                    </option>
                                                </optgroup>
                                            </select>

                                            <InputError
                                                message={errors.package}
                                                className="mt-2 dark:text-red-400"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="contract"
                                                value="Contract Duration"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            />

                                            <div className="flex flex-col gap-4 mt-1">
                                                <input
                                                    type="date"
                                                    onChange={(e) =>
                                                        setData(
                                                            "contract_start",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 "
                                                    value={data.contract_start}
                                                />
                                                <input
                                                    type="date"
                                                    onChange={(e) =>
                                                        setData(
                                                            "contract_end",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 "
                                                    value={data.contract_end}
                                                />
                                            </div>

                                            <InputError
                                                message={errors.contract}
                                                className="mt-2 dark:text-red-400"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="status"
                                                value="Payment Status"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            />
                                            <div className="flex items-center gap-4">
                                                <select
                                                    id="status"
                                                    name="status"
                                                    value={data.status}
                                                    className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                    autoComplete="status"
                                                    onChange={(e) =>
                                                        setData(
                                                            "status",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="Lunas">
                                                        Paid
                                                    </option>
                                                    <option value="Cicil">
                                                        Installments
                                                    </option>
                                                    <option value="Belum Bayar">
                                                        Unpaid
                                                    </option>
                                                </select>
                                            </div>
                                            {data.status === "Cicil" && (
                                                <div>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        installments
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <TextInput
                                                            id="cicil"
                                                            name="cicil"
                                                            value={data.cicil}
                                                            type="number"
                                                            min="1"
                                                            max="12"
                                                            placeholder="1"
                                                            className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                            onChange={(e) =>
                                                                setData(
                                                                    "cicil",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <InputError
                                                message={errors.status}
                                                className="mt-2 dark:text-red-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Schedule Section */}
                                {data.status === "Cicil" &&
                                    Array.isArray(data.fase_pembayaran) &&
                                    data.fase_pembayaran.length > 0 && (
                                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-200">
                                                Payment Schedule
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {data.fase_pembayaran.map(
                                                    (fase, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-gray-50 p-4 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
                                                        >
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <input
                                                                    type="checkbox"
                                                                    name={`fase-${index}`}
                                                                    id={`fase-${index}`}
                                                                    checked={
                                                                        fase.status_cicilan ===
                                                                            "true" ||
                                                                        fase.status_cicilan ===
                                                                            true
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const updatedCheck =
                                                                            [
                                                                                ...data.fase_pembayaran,
                                                                            ];
                                                                        updatedCheck[
                                                                            index
                                                                        ] = {
                                                                            ...updatedCheck[
                                                                                index
                                                                            ],
                                                                            status_cicilan:
                                                                                e
                                                                                    .target
                                                                                    .checked
                                                                                    ? "true"
                                                                                    : "false",
                                                                        };
                                                                        setData(
                                                                            "fase_pembayaran",
                                                                            updatedCheck
                                                                        );
                                                                    }}
                                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                                />
                                                                <InputLabel
                                                                    htmlFor={`fase-${index}`}
                                                                    value={`Installment ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                                                />
                                                            </div>
                                                            <TextInput
                                                                type="date"
                                                                id={`fase-${index}-input`}
                                                                name={`fase-${index}-input`}
                                                                className="block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                                value={
                                                                    fase.tanggal
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const updatedFase =
                                                                        [
                                                                            ...data.fase_pembayaran,
                                                                        ];
                                                                    updatedFase[
                                                                        index
                                                                    ] = {
                                                                        ...updatedFase[
                                                                            index
                                                                        ],
                                                                        tanggal:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    };
                                                                    setData(
                                                                        "fase_pembayaran",
                                                                        updatedFase
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Action Buttons */}
                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
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

                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                        className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-medium py-2.5 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50 dark:from-blue-700 dark:to-purple-800 dark:hover:from-blue-800 dark:hover:to-purple-900"
                                    >
                                        {processing ? (
                                            <span className="flex items-center">
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
