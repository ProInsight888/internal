import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function create({}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        company_name: "",
        type: "",
        location: "",
        contract_start: "",
        contract_end: "",
        package: "",
        status: "Lunas",
        cicil: "",
        code: "", // Add code field
        fase_pembayaran: [{ cicilan: "", tanggal: "" }],
        add_ons_drone: false,
        add_ons_production: false,
    });

    // console.log(data)

    useEffect(() => {
        const jumlah = parseInt(data.cicil || 0);

        if (data.status === "Cicil" && jumlah > 0) {
            // Hanya update jika panjang fase_pembayaran tidak sama
            if (data.fase_pembayaran.length !== jumlah) {
                const fase = Array.from({ length: jumlah }, (_, i) => ({
                    cicilan: `Cicilan ${i + 1}`,
                    tanggal: data.fase_pembayaran[i]?.tanggal || "",
                }));

                setData("fase_pembayaran", fase);
            }
        }

        if (data.status !== "Cicil") {
            if (data.fase_pembayaran.length > 0) {
                setData("fase_pembayaran", []);
            }
        }
    }, [data.cicil, data.status]);

    // Optional: Auto-generate code when company name changes
    useEffect(() => {
        console.log(data.company_name);
        // const companyName = data.company_name

        // console.log(companyName[randomIndex])
        const companyName = data.company_name.replace(/[^A-Za-z]/g, "");
        let code = "";
        if (data.company_name) {
            code += companyName[0];
            for (let i = 1; i < 4; i++) {
                const randomIndex = Math.floor(
                    Math.random() * companyName.length
                );
                code += companyName[randomIndex];
            }
            console.log(code);
        }
        setData("code", code.toUpperCase());
    }, [data.company_name]);

    const submit = (e) => {
        e.preventDefault();

        post(route("new_client.store"), {
            onFinish: () =>
                reset("password", "password_confirmation", "name", "email"),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h1 className="text-6xl flex justify-center mt-8 font-semibold leading-tight text-[#1c1c1c] mb-2 dark:text-white">
                        Yeah! We Have a New Client 🥳🎉✨
                    </h1>
                    <p className="flex justify-center text-2xl dark:text-gray-300">
                        The more client we get the better, so add our client
                        now!
                    </p>
                </>
            }
        >
            <div className="flex flex-col items-center pt-6 w-7xl sm:justify-center sm:pt-0 dark:bg-gray-900">
                <div className="flex justify-center w-full gap-5 mt-6 max-w-7xl">
                    <div className="w-full px-6 py-4 overflow-hidden shadow-md sm:max-w-xl sm:rounded-lg dark:bg-gray-800 dark:shadow-gray-900/30">
                        <Head title="New Client" />

                        <form onSubmit={submit}>
                            <div className="mt-3 mb-6">
                                <InputLabel
                                    htmlFor="company_name"
                                    value="Company Name"
                                    className="dark:text-gray-300"
                                />

                                <TextInput
                                    id="company_name"
                                    name="company_name"
                                    value={data.company_name}
                                    className="block w-full mt-1 bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                                    autoComplete="off"
                                    onChange={(e) =>
                                        setData("company_name", e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.company_name}
                                    className="mt-2 dark:text-red-400"
                                />
                            </div>

                            {/* Add Code Input Field */}
                            <div className="mb-6">
                                <InputLabel
                                    htmlFor="code"
                                    value="Client Code"
                                    className="dark:text-gray-300"
                                />
                                <div className="flex items-center gap-2">
                                    <TextInput
                                        id="code"
                                        name="code"
                                        value={data.code}
                                        className="block w-full mt-1 font-mono bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                                        autoComplete="code"
                                        onChange={(e) =>
                                            setData(
                                                "code",
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        placeholder="e.g., EYCA"
                                        maxLength={4}
                                        required
                                    />
                                    <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
                                        (4 characters)
                                    </span>
                                </div>
                                <InputError
                                    message={errors.code}
                                    className="mt-2 dark:text-red-400"
                                />
                            </div>

                            <div className="mb-6">
                                <InputLabel
                                    htmlFor="location"
                                    value="Business Location"
                                    className="dark:text-gray-300"
                                />

                                <TextInput
                                    id="location"
                                    name="location"
                                    value={data.location}
                                    className="block w-full mt-1 bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                                    autoComplete="location"
                                    onChange={(e) =>
                                        setData("location", e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.location}
                                    className="mt-2 dark:text-red-400"
                                />
                            </div>
                            
                            <div className="mb-6">
                                <InputLabel
                                    htmlFor="type"
                                    value="Type Of Business"
                                    className="dark:text-gray-300"
                                />

                                <TextInput
                                    id="type"
                                    name="type"
                                    value={data.type}
                                    className="block w-full mt-1 bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
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
                                        value={data.status}
                                        className="block w-full mt-1 bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                                        autoComplete="status"
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                    >
                                        <option
                                            value="Lunas"
                                            className="dark:bg-gray-700"
                                        >
                                            Paid
                                        </option>
                                        <option
                                            value="Cicil"
                                            className="dark:bg-gray-700"
                                        >
                                            Installments
                                        </option>
                                        <option
                                            value="Belum Bayar"
                                            className="dark:bg-gray-700"
                                        >
                                            Unpaid
                                        </option>
                                    </select>
                                    <div
                                        className={`${
                                            data.status === "Cicil"
                                                ? ""
                                                : "hidden"
                                        } flex items-center dark:text-gray-300`}
                                    >
                                        <input
                                            id="cicil"
                                            name="cicil"
                                            value={data.cicil}
                                            className={`mt-1 block bg-transparent shadow-sm border-0 border-b border-gray-400 focus:border-black focus:ring-0 outline-none active:border-b dark:border-gray-600 dark:text-white dark:focus:border-blue-400`}
                                            type="number"
                                            min="1"
                                            max="10"
                                            onChange={(e) =>
                                                setData("cicil", e.target.value)
                                            }
                                        />
                                        X
                                    </div>
                                </div>

                                <InputError
                                    message={errors.status}
                                    className="mt-2 dark:text-red-400"
                                />
                            </div>
                            {data.status === "Lunas" && (
                                <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Date Paid
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <TextInput
                                            type="date"
                                            id="paid"
                                            name="paid"
                                            value={data.paid}
                                            className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                            onChange={(e) =>
                                                setData("paid", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-5 mb-4">
                                {data.status === "Cicil" &&
                                    Array.isArray(data.fase_pembayaran) &&
                                    data.fase_pembayaran.map((fase, index) => (
                                        <div key={index}>
                                            <InputLabel
                                                htmlFor={`fase-${index}`}
                                                value={`Tanggal ${fase.cicilan}`}
                                                className="dark:text-gray-300"
                                            />
                                            <TextInput
                                                type="date"
                                                id={`fase-${index}`}
                                                name={`fase-${index}`}
                                                className="block w-full bg-transparent border-0 border-b border-gray-400 outline-none focus:ring-0 focus:border-black dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                                                value={fase.tanggal || ""}
                                                onChange={(e) => {
                                                    const updatedFase = [
                                                        ...data.fase_pembayaran,
                                                    ];
                                                    updatedFase[index] = {
                                                        ...updatedFase[index],
                                                        tanggal: e.target.value,
                                                    };
                                                    setData(
                                                        "fase_pembayaran",
                                                        updatedFase
                                                    );
                                                }}
                                            />
                                        </div>
                                    ))}
                            </div>
                            <div className="flex items-center justify-end mt-4">
                                <PrimaryButton
                                    className="ms-4 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                                    onSubmit={(e) => submit(e)}
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Creating..."
                                        : "Add New Client"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
