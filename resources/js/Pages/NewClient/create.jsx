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
        code: "", 
    });

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
                                        placeholder="e.g., EYCA (4 Characters)"
                                        maxLength={4}
                                        required
                                    />
                                    {/* <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
                                        (4 characters)
                                    </span> */}
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
