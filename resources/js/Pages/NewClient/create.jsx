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
        contract_tahun: "0",
        contract_bulan: "0",
        contract_hari: "0",
        package: "",
        status: "Lunas",
        cicil: "",
        code: "", // Add code field
        fase_pembayaran: [{ cicilan: "", tanggal: "" }],
    });

    useEffect(() => {
        const jumlah = parseInt(data.cicil || 0);

        if (data.status === "Cicil" && jumlah > 0) {
            // Hanya update jika panjang fase_pembayaran tidak sama
            if (data.fase_pembayaran.length !== jumlah) {
                const fase = Array.from({ length: jumlah }, (_, i) => ({
                    cicilan: `Cicilan ${i + 1}`,
                    tanggal: data.fase_pembayaran[i]?.tanggal || "",
                }));
                console.log("CICIL:", data.cicil);
                console.log("Jumlah yang akan dibuat:", jumlah);
                console.log(
                    "Sebelum Update fase_pembayaran:",
                    data.fase_pembayaran
                );
                console.log("Setelah Update fase_pembayaran:", fase);
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
        if (data.company_name && !data.code) {
            const generateCode = (companyName) => {
                if (!companyName) return "";
                const words = companyName.split(" ");
                const firstWord = words[0] || "";
                const secondWord = words[1] || "";

                let code = firstWord.charAt(0).toUpperCase();
                code += secondWord.substring(0, 3).toUpperCase().padEnd(3, "A");

                return code;
            };

            setData("code", generateCode(data.company_name));
        }
    }, [data.company_name]);

    console.log(data);

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
                    <h1 className="text-6xl flex justify-center mt-8 font-semibold leading-tight text-[#1c1c1c] mb-2">
                        Yeah! We Have a New Client 🥳🎉✨
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

                            {/* Add Code Input Field */}
                            <div className="mb-6">
                                <InputLabel
                                    htmlFor="code"
                                    value="Client Code"
                                />
                                <div className="flex items-center gap-2">
                                    <TextInput
                                        id="code"
                                        name="code"
                                        value={data.code}
                                        className="mt-1 block w-full bg-transparent border-0 border-b border-gray-400 font-mono"
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
                                    <span className="text-sm text-gray-500 font-mono">
                                        (4 characters)
                                    </span>
                                </div>
                                <InputError
                                    message={errors.code}
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
    onChange={(e) => setData("package", e.target.value)}
    required
>
    <option value="" disabled hidden>
        Select Package
    </option>

    <optgroup label="Social Media Management">
        <option value="Protall">Protall</option>
        <option value="Progrand">Progrand</option>
        <option value="Proventi">Proventi</option>
        <option value="Promax">Promax</option>
        <option value="Feeds">Add Ons Feeds</option>
        <option value="Reels">Add Ons Reels</option>
    </optgroup>

    <optgroup label="Digital Branding">
        <option value="Company Profile">Company Profile</option>
        <option value="HR System">HR System</option>
        <option value="Invitation Link">Invitation Link</option>
        <option value="Application">Application</option>
        <option value="Design">Package Design</option>
    </optgroup>

    <optgroup label="Event Documentation">
        <option value="Photo & Video">Photo & Video</option>
    </optgroup>
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
                                        className="mt-1 w-4/12 block bg-transparent shadow-sm border-0 border-b border-gray-400 focus:border-black focus:ring-0 outline-none active:border-b "
                                        type="number"
                                        onChange={(e) =>
                                            setData(
                                                "contract_tahun",
                                                e.target.value
                                            )
                                        }
                                    />
                                    Tahun
                                    <input
                                        id="contract"
                                        name="contract"
                                        value={data.contract_bulan}
                                        className="mt-1 w-4/12 block bg-transparent shadow-sm border-0 border-b border-gray-400 focus:border-black focus:ring-0 outline-none active:border-b "
                                        autoComplete="contract"
                                        type="number"
                                        max="11"
                                        onChange={(e) =>
                                            setData(
                                                "contract_bulan",
                                                e.target.value
                                            )
                                        }
                                    />
                                    Bulan
                                    <input
                                        id="contract"
                                        name="contract"
                                        value={data.contract_hari}
                                        className="mt-1 w-4/12 block bg-transparent shadow-sm border-0 border-b border-gray-400 focus:border-black focus:ring-0 outline-none active:border-b "
                                        autoComplete="contract"
                                        type="number"
                                        max="31"
                                        onChange={(e) =>
                                            setData(
                                                "contract_hari",
                                                e.target.value
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
                                        <option value="Belum Bayar">Belum Bayar</option>
                                    </select>
                                    <div
                                        className={`${
                                            data.status === "Cicil"
                                                ? ""
                                                : "hidden"
                                        } flex items-center`}
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
                                        X
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
                                            <InputLabel
                                                htmlFor={`fase-${index}`}
                                                value={`Tanggal ${fase.cicilan}`}
                                            />
                                            <TextInput
                                                type="date"
                                                id={`fase-${index}`}
                                                name={`fase-${index}`}
                                                className=" block w-full bg-transparent border-0 border-b border-gray-400 outline-none focus:ring-0 focus:border-black"
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
