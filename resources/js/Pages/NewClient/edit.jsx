import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function edit({ clients }) {
    const contractParts = (clients?.contract || "").split(" ");
    const contract_tahun = contractParts[0] || "";
    const contract_bulan = contractParts[2] || "";
    const contract_hari = contractParts[4] || "";

    console.log(clients.cicilans.length);

    // Output: ['Hello', 'World', 'React']

    const { data, setData, put, post, processing, errors, reset } = useForm({
        company_name: clients?.company_name || "",
        type: clients?.type || "",
        location: clients?.location || "",
        contract_tahun: contract_tahun,
        contract_bulan: contract_bulan,
        contract_hari: contract_hari,
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

        // put(route('new_client.update', clients.uuid), {
        //     preserveScroll: true,
        //     onSuccess: () => alert('Client updated!')
        // });
        put(route("new_client.update", clients.uuid), {
            onSuccess: () => {
                if (data.status === "Cicil" || clients.cicilans.length !== 0) {
                    router.delete(
                        route("deleteCicilan.destroy", clients.uuid),
                        {
                            onSuccess: () => {
                                post(
                                    route("storeCicilan.store", clients.uuid),
                                    {
                                        onSuccess: () => {
                                            window.location.reload();
                                        },
                                    },
                                );
                            },
                            onError: (errors) => console.error(errors),
                        },
                    );
                } else {
                    post(route("storeCicilan.store", clients.uuid), {
                        onSuccess: () => {
                            window.location.reload();
                        },
                    });
                }
            },
            onError: (errors) => console.error(errors),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h1 className="text-6xl flex justify-center mt-8 font-semibold leading-tight text-[#1c1c1c] mb-2">
                        Wow! Let's Edit Our Client 🥳🎉✨
                    </h1>
                    <p className="text-2xl flex justify-center">
                        The more client we get the better, so add our client
                        now!
                    </p>
                </>
            }
        >
            <div className="flex flex-col items-center w-7xl pt-6 sm:justify-center sm:pt-0 ">
                <div className="max-w-7xl w-full flex mt-6 gap-5 justify-center">
                    <div className="w-full overflow-hidden px-6 py-4 shadow-md sm:max-w-xl sm:rounded-lg">
                        <Head title="New Client" />

                        <form onSubmit={submit}>
                            <div className="mb-6 mt-3">
                                <InputLabel
                                    htmlFor="company_name"
                                    value="Company Name"
                                />

                                <TextInput
                                    id="company_name"
                                    name="company_name"
                                    value={data.company_name}
                                    className="mt-1 block w-full bg-transparent border-0 border-b border-gray-400"
                                    autoComplete="company_name"
                                    onChange={(e) =>
                                        setData("company_name", e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.company_name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-6">
                                <InputLabel
                                    htmlFor="package"
                                    value="What Package"
                                />

                                <select
                                    id="package"
                                    name="package"
                                    value={data.package}
                                    className="mt-1 block w-full bg-transparent border-0 border-b border-gray-400 outline-none focus:ring-0 focus:border-black"
                                    autoComplete="package"
                                    onChange={(e) =>
                                        setData("package", e.target.value)
                                    }
                                    required
                                >
                                    <option value="Protall">Protall</option>
                                    <option value="Progrand">Progrand</option>
                                    <option value="Proventi">Proventi</option>
                                    <option value="Promax">Promax</option>
                                    <option value="Company Profile">
                                        Company Profile
                                    </option>
                                    <option value="HR System">HR System</option>
                                    <option value="Invitation Link">
                                        Invitation Link
                                    </option>
                                    <option value="Application">
                                        Application
                                    </option>
                                    <option value="Photo & Video">
                                        Photo & Video
                                    </option>
                                    <option value="Adds On">Adds On</option>
                                </select>

                                <InputError
                                    message={errors.package}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-6">
                                <InputLabel
                                    htmlFor="location"
                                    value="Business Location"
                                />

                                <TextInput
                                    id="location"
                                    name="location"
                                    value={data.location}
                                    className="mt-1 block w-full bg-transparent border-0 border-b border-gray-400"
                                    autoComplete="location"
                                    onChange={(e) =>
                                        setData("location", e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.location}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-6">
                                <InputLabel
                                    htmlFor="contract"
                                    value="Contract"
                                />

                                <div className="flex items-end justify-between">
                                    <input
                                        id="contract"
                                        name="contract"
                                        value={data.contract_tahun}
                                        className="mt-1 w-4/12 block bg-transparent shadow-sm border-0 border-b border-gray-400 focus:border-black focus:ring-0 outline-none active:border-b"
                                        type="number"
                                        onChange={(e) =>
                                            setData(
                                                "contract_tahun",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    Tahun
                                    <input
                                        id="contract"
                                        name="contract"
                                        value={data.contract_bulan}
                                        className="mt-1 block w-4/12 bg-transparent shadow-sm border-0 border-b border-gray-400 focus:border-black focus:ring-0 outline-none active:border-b "
                                        autoComplete="contract"
                                        type="number"
                                        max="11"
                                        onChange={(e) =>
                                            setData(
                                                "contract_bulan",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    Bulan
                                    <input
                                        id="contract"
                                        name="contract"
                                        value={data.contract_hari}
                                        className="mt-1 block w-4/12 bg-transparent shadow-sm border-0 border-b border-gray-400 focus:border-black focus:ring-0 outline-none active:border-b "
                                        autoComplete="contract"
                                        type="number"
                                        max="31"
                                        onChange={(e) =>
                                            setData(
                                                "contract_hari",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    Hari
                                </div>

                                <InputError
                                    message={errors.contract}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-6">
                                <InputLabel
                                    htmlFor="type"
                                    value="Type Of Business"
                                />

                                <TextInput
                                    id="type"
                                    name="type"
                                    value={data.type}
                                    className="mt-1 block w-full bg-transparent border-0 border-b border-gray-400"
                                    autoComplete="type"
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.type}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mb-6">
                                <InputLabel htmlFor="status" value="Status" />
                                <div className="flex items-center gap-10">
                                    <select
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        className="mt-1 block w-full bg-transparent border-0 border-b border-gray-400"
                                        autoComplete="status"
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                    >
                                        <option value="Lunas">Lunas</option>
                                        <option value="Cicil">Cicil</option>
                                    </select>
                                    <div
                                        className={`${data.status === "Cicil" ? "" : "hidden"} flex items-center`}
                                    >
                                        <input
                                            id="cicil"
                                            name="cicil"
                                            value={data.cicil}
                                            className={` mt-1 block bg-transparent shadow-sm border-0 border-b border-gray-400 focus:border-black focus:ring-0 outline-none active:border-b`}
                                            type="number"
                                            min="1"
                                            max="10"
                                            onChange={(e) =>
                                                setData("cicil", e.target.value)
                                            }
                                        />
                                        kali
                                    </div>
                                </div>
                                <InputError
                                    message={errors.status}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-4 grid grid-cols-2 gap-5">
                                {data.status === "Cicil" &&
                                    Array.isArray(data.fase_pembayaran) &&
                                    data.fase_pembayaran.map((fase, index) => (
                                        <div key={index}>
                                            <div className="flex gap-2">
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
                                                    onChange={(e) => {
                                                        const updatedCheck = [
                                                            ...data.fase_pembayaran,
                                                        ];
                                                        updatedCheck[index] = {
                                                            ...updatedCheck[
                                                                index
                                                            ],
                                                            status_cicilan: e
                                                                .target.checked
                                                                ? "true"
                                                                : "false",
                                                        };
                                                        setData(
                                                            "fase_pembayaran",
                                                            updatedCheck,
                                                        );
                                                    }}
                                                />
                                                <InputLabel
                                                    htmlFor={`fase-${index}`}
                                                    value={`Tanggal ${fase.cicilan}`}
                                                />
                                            </div>
                                            <TextInput
                                                type="date"
                                                id={`fase-${index}-input`}
                                                name={`fase-${index}-input`}
                                                className=" block w-full bg-transparent border-0 border-b border-gray-400 outline-none focus:ring-0 focus:border-black"
                                                value={fase.tanggal}
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
                                                        updatedFase,
                                                    );
                                                }}
                                            />
                                        </div>
                                    ))}
                            </div>

                            <div className="mt-4 flex items-center justify-end">
                                <PrimaryButton
                                    className="ms-4"
                                    onSubmit={(e) => submit(e)}
                                    disabled={processing}
                                >
                                    New Account
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
