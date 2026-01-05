import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";

export default function create({uuid}) {
    const { props } = usePage();
    
    const urlUuid = props.uuid.package; 
    
    const { data, setData, put, post, processing, errors } = useForm({
        client_uuid: urlUuid,
        package_name: "",
        payment_date: "",
        payment_status: "paid",
        total_installment: "",
        payment_phase: [{ installment: "", date: "" }],
        add_ons: "",
    });

    useEffect(() => {
        const jumlah = parseInt(data.total_installment || 0);

        if (data.payment_status === "installment" && jumlah > 0) {
            // Hanya update jika panjang fase_pembayaran tidak sama
            if (data.payment_phase.length !== jumlah) {
                const phase = Array.from({ length: jumlah }, (_, i) => ({
                    installment: `Installment ${i + 1}`,
                    date: data.payment_phase[i]?.date || "",
                }));

                setData("payment_phase", phase);
            }
        }

        if (data.payment_status !== "installment") {
            if (data.payment_phase.length > 0) {
                setData("payment_phase", []);
            }
        }
    }, [data.total_installment, data.payment_status]);

        const textAreaAdjust = (element) => {
        element.style.height = "1px";
        element.style.height = `${3 + element.scrollHeight}px`;
    };

    const add_ons_ref= useRef();

      useEffect(() => {
        if (add_ons_ref.current) {
            textAreaAdjust(add_ons_ref.current);
        }
    }, [data.add_ons]);

    const add_ons_change = (e) => {
        setData("add_ons", e.target.value);
    };


    const submit = (e) => {
        e.preventDefault();
        post(route("package.store", data), {
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h1 className="text-6xl flex justify-center mt-8 font-semibold leading-tight text-[#1c1c1c] mb-2 dark:text-white">
                        Yeah! They Buy New Package 🥳
                    </h1>
                    <p className="flex justify-center text-2xl dark:text-gray-300">
                        The more client we get the better, so add our client
                        now!
                    </p>
                </>
            }
        >
            <div className="py-6">
                <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/30">
                        <div className="p-6 md:p-8">
                            <form onSubmit={submit}>
                                <div className="mb-6">
                                    <InputLabel
                                        htmlFor="package"
                                        value="Package"
                                        className="dark:text-gray-300"
                                    />

                                    <select
                                        id="package"
                                        name="package"
                                        value={data.package_name}
                                        className="block w-full mt-1 bg-transparent border-0 border-b border-gray-700 outline-none focus:ring-0 focus:border-black dark:border-gray-700 dark:text-white dark:focus:border-blue-400"
                                        autoComplete="package"
                                        onChange={(e) =>
                                            setData(
                                                "package_name",
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option
                                            value=""
                                            disabled
                                            hidden
                                            className="dark:text-gray-400"
                                        >
                                            Select Package
                                        </option>

                                        <optgroup
                                            label="Social Media Management"
                                            className="dark:text-gray-300 dark:bg-gray-700"
                                        >
                                            <option value="Protall">
                                                PROTALL
                                            </option>
                                            <option value="Progrand">
                                                PROGRAND
                                            </option>
                                            <option value="Proventi">
                                                PROVENTI
                                            </option>
                                            <option value="Promax">
                                                PROMAX
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
                                            className="dark:text-gray-300 dark:bg-gray-700"
                                        >
                                            <option value="Management System">
                                                Management System
                                            </option>
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
                                            className="dark:text-gray-300 dark:bg-gray-700"
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
                                        message={errors.package_name}
                                        className="mt-2 dark:text-red-400"
                                    />
                                </div>
                                <div className="mb-6">
                                    <InputLabel
                                        htmlFor="status"
                                        value="Status"
                                        className="dark:text-gray-300"
                                    />

                                    <div className="flex items-center gap-10">
                                        <select
                                            id="status"
                                            name="status"
                                            value={data.payment_status}
                                            className="block w-full mt-1 bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                                            autoComplete="status"
                                            onChange={(e) =>
                                                setData(
                                                    "payment_status",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option
                                                value="paid"
                                                className="dark:bg-gray-700"
                                            >
                                                Paid
                                            </option>
                                            <option
                                                value="installment"
                                                className="dark:bg-gray-700"
                                            >
                                                Installments
                                            </option>
                                            <option
                                                value="unpaid"
                                                className="dark:bg-gray-700"
                                            >
                                                Unpaid
                                            </option>
                                        </select>
                                        <div
                                            className={`${
                                                data.payment_status ===
                                                "installment"
                                                    ? ""
                                                    : "hidden"
                                            } flex items-center dark:text-gray-300`}
                                        >
                                            <input
                                                id="installment"
                                                name="installment"
                                                value={data.total_installment}
                                                className={`mt-1 block bg-transparent shadow-sm border-0 border-b border-gray-400 focus:border-black focus:ring-0 outline-none active:border-b dark:border-gray-600 dark:text-white dark:focus:border-blue-400`}
                                                type="number"
                                                min="1"
                                                max="10"
                                                onChange={(e) =>
                                                    setData(
                                                        "total_installment",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            X
                                        </div>
                                    </div>

                                    <InputError
                                        message={errors.payment_status}
                                        className="mt-2 dark:text-red-400"
                                    />
                                </div>
                                {data.payment_status === "paid" && (
                                    <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Date Paid
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <TextInput
                                                type="date"
                                                id="paid"
                                                name="paid"
                                                value={data.payment_date}
                                                className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                onChange={(e) =>
                                                    setData(
                                                        "payment_date",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-5 mb-4">
                                    {data.payment_status === "installment" &&
                                        Array.isArray(data.payment_phase) &&
                                        data.payment_phase.map(
                                            (phase, index) => (
                                                <div key={index}>
                                                    <InputLabel
                                                        htmlFor={`phase-${index}`}
                                                        value={`Date: ${phase.installment}`}
                                                        className="dark:text-gray-300"
                                                    />
                                                    <TextInput
                                                        type="date"
                                                        id={`phase-${index}`}
                                                        name={`phase-${index}`}
                                                        className="block w-full bg-transparent border-0 border-b border-gray-400 outline-none focus:ring-0 focus:border-black dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                                                        value={phase.date || ""}
                                                        onChange={(e) => {
                                                            const updatedPhase =
                                                                [
                                                                    ...data.payment_phase,
                                                                ];
                                                            updatedPhase[
                                                                index
                                                            ] = {
                                                                ...updatedPhase[
                                                                    index
                                                                ],
                                                                date: e.target
                                                                    .value,
                                                            };
                                                            setData(
                                                                "payment_phase",
                                                                updatedPhase
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            )
                                        )}
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="add_ons"
                                        value="Add Ons"
                                        className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                    />
                                    <div className="relative">
                                        <textarea
                                            ref={add_ons_ref}
                                            value={data.add_ons}
                                            onChange={add_ons_change}
                                            id="add_ons"
                                            name="add_ons"
                                            placeholder="Enter task add ons"
                                            className="w-full rounded-[0.5rem] text-sm border border-gray-300 dark:border-gray-600 px-4 py-2 
                                                focus:ring-0 focus:ring-none focus:border-gray-400 dark:focus:border-gray-500 shadow-sm
                                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                                            rows={4}
                                        />
                                    </div>
                                    {errors.add_ons && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.add_ons}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-end pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center px-8 py-3 font-medium text-white transition-all duration-300 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 hover:shadow-lg disabled:opacity-50"
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
                                            Create Package...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
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
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            Add Package
                                        </span>
                                    )}
                                </button>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
