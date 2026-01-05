import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group";

export default function edit({ clients }) {
    const contractParts = (clients?.contract || "").split(" ");

    // console.log(clients);

    const { data, setData, put, post, processing, errors, reset } = useForm({
        uuid: clients.uuid ?? "",
        reference_num: clients?.reference_num ?? "",
        package: clients?.package ?? "",
        company_name: clients?.company_name ?? "",
        tlp_num: clients?.tlp_num ?? "",
        contract_start: clients?.contract_start ?? "",
        contract_end: clients?.contract_end ?? "",
        full_address: clients?.full_address ?? "",
        pic_num: 1,
        pics: [
            {
                pic_name: "",
                pic_tlp_num: "",
                pic_position: "",
            },
        ],
        price: clients?.price ?? "",
    });

    // console.log(data.pics);

    useEffect(() => {
        const jumlah = parseInt(data.pic_num || 0);
        if (data.pic_num >= 1) {
            if (data.pics.length !== jumlah) {
                const pic = Array.from({ length: jumlah }, (_, i) => ({
                    pic_name: data.pics[i]?.pic_name || "",
                    pic_tlp_num: data.pics[i]?.pic_tlp_num || "",
                    pic_position: data.pics[i]?.pic_position || "",
                }));
                setData("pics", pic);
            }
        } else if (data.pic_num <= 0) {
            setData("pics", []);
        }
    }, [data.pic_num, data.pics]);

    const submit = (e) => {
        e.preventDefault();
        console.log(clients.uuid);
        post(route("contract.store", data), {
            onSuccess: () => {
                // console.log(data.uuid);
                const clientsUuid = clients.uuid;
                window.open(`/contract/${clientsUuid}/contract`, "_blank");
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="py-8 text-center text-white rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-900">
                    <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                        Details Contract Clients
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl opacity-90">
                        Fill this {clients?.company_name}'s details and contract
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
                                    Contract: {clients?.company_name}
                                </h2>
                                <p className="mt-1 text-indigo-600 dark:text-indigo-400">
                                    Fill client details and contract information
                                    below
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
                                <div className="gap-6">
                                    {/* Company Information */}
                                    <div className="space-y-6">
                                        {/* reference Num */}
                                        <div>
                                            <InputLabel
                                                htmlFor="reference_num"
                                                value="Reference Number"
                                                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                            />

                                            <TextInput
                                                id="reference_num"
                                                name="reference_num"
                                                value={data.reference_num}
                                                className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                autoComplete="reference_num"
                                                placeholder="001/VII/2025/PRO"
                                                onChange={(e) =>
                                                    setData(
                                                        "reference_num",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />

                                            <InputError
                                                message={errors.reference_num}
                                                className="mt-2 dark:text-red-400"
                                            />
                                        </div>
                                        {/* company name & num*/}
                                        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
                                            <div>
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
                                                    message={
                                                        errors.company_name
                                                    }
                                                    className="mt-2 dark:text-red-400"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="tlp_num"
                                                    value="Company Telp Num"
                                                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                                />

                                                <TextInput
                                                    id="tlp_num"
                                                    name="tlp_num"
                                                    value={data.tlp_num}
                                                    className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                    autoComplete="tlp_num"
                                                    onChange={(e) =>
                                                        setData(
                                                            "tlp_num",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                                <InputError
                                                    message={errors.tlp_num}
                                                    className="mt-2 dark:text-red-400"
                                                />
                                            </div>
                                        </div>

                                        {/* contract term */}
                                        <div className="w-full">
                                            <InputLabel
                                                htmlFor="contract_term"
                                                value="Contract Term"
                                                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                            />

                                            <div className="flex gap-8">
                                                <TextInput
                                                    name="contract_start"
                                                    type="date"
                                                    value={data.contract_start}
                                                    onChange={(e) =>
                                                        setData(
                                                            "contract_start",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full text-gray-900 bg-white border-gray-300 rounded-lg shadow-sm dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:bg-gray-700 dark:text-white"
                                                />
                                                <TextInput
                                                    name="contract_end"
                                                    type="date"
                                                    value={data.contract_end}
                                                    onChange={(e) =>
                                                        setData(
                                                            "contract_end",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full text-gray-900 bg-white border-gray-300 rounded-lg shadow-sm dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>

                                            <InputError
                                                message={errors.code}
                                                className="mt-2 dark:text-red-400"
                                            />
                                        </div>

                                        {/* full address */}
                                        <div>
                                            <InputLabel
                                                htmlFor="full_address"
                                                value="Full Address"
                                                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                            />

                                            <TextInput
                                                id="full_address"
                                                name="full_address"
                                                value={data.full_address}
                                                className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                autoComplete="full_address"
                                                onChange={(e) =>
                                                    setData(
                                                        "full_address",
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

                                        <div className="mb-6">
                                            <InputLabel
                                                htmlFor="pic_num"
                                                value="Total PIC"
                                                className="dark:text-gray-300"
                                            />
                                            <div className="flex items-center">
                                                <input
                                                    id="pic_num"
                                                    name="pic_num"
                                                    value={data.pic_num}
                                                    className={`mt-1 block bg-transparent shadow-sm border-0 border-b border-gray-400 focus:border-black focus:ring-0 outline-none active:border-b dark:border-gray-600 dark:text-white dark:focus:border-blue-400`}
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    onChange={(e) =>
                                                        setData(
                                                            "pic_num",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <div>X</div>
                                            </div>

                                            <InputError
                                                message={errors.status}
                                                className="mt-2 dark:text-red-400"
                                            />
                                        </div>

                                        {data.pic_num >= 1 &&
                                            data.pic_num <= 10 &&
                                            data.pics.map((pic, index) => (
                                                <div className="w-full">
                                                    <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
                                                        <div className="">
                                                            <InputLabel
                                                                htmlFor={`pic_name_${index}`}
                                                                value={`PIC Name (${
                                                                    index + 1
                                                                })`}
                                                                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                                            />

                                                            <TextInput
                                                                id={`pic_name_${index}`}
                                                                name={`pic_name_${index}`}
                                                                value={
                                                                    data.pics[
                                                                        index
                                                                    ]?.pic_name
                                                                }
                                                                className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                                autoComplete="pic_name"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const updatedPics =
                                                                        [
                                                                            ...data.pics,
                                                                        ];
                                                                    updatedPics[
                                                                        index
                                                                    ] = {
                                                                        ...updatedPics[
                                                                            index
                                                                        ],
                                                                        pic_name:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    };
                                                                    setData(
                                                                        "pics",
                                                                        updatedPics
                                                                    );
                                                                }}
                                                                required
                                                            />

                                                            <InputError
                                                                message={
                                                                    errors.pics
                                                                }
                                                                className="mt-2 dark:text-red-400"
                                                            />
                                                        </div>
                                                        <div>
                                                            <InputLabel
                                                                htmlFor={`pic_tlp_num_${index}`}
                                                                value={`PIC Telp Num (${
                                                                    index + 1
                                                                })`}
                                                                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                                            />

                                                            <TextInput
                                                                id={`pic_tlp_num_${index}`}
                                                                name={`pic_tlp_num_${index}`}
                                                                value={
                                                                    data.pics[
                                                                        index
                                                                    ]
                                                                        .pic_tlp_num
                                                                }
                                                                className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                                autoComplete={`pic_tlp_num_${index}`}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const updatedPics =
                                                                        [
                                                                            ...data.pics,
                                                                        ];
                                                                    updatedPics[
                                                                        index
                                                                    ] = {
                                                                        ...updatedPics[
                                                                            index
                                                                        ],
                                                                        pic_tlp_num:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    };
                                                                    setData(
                                                                        "pics",
                                                                        updatedPics
                                                                    );
                                                                }}
                                                                required
                                                            />

                                                            <InputError
                                                                message={
                                                                    errors.pics
                                                                }
                                                                className="mt-2 dark:text-red-400"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* PIC title & position */}

                                                    <div className="mt-5">
                                                        <InputLabel
                                                            htmlFor={`pic_position_${index}`}
                                                            value={`PIC Position (${
                                                                index + 1
                                                            })`}
                                                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                                        />

                                                        <TextInput
                                                            id={`pic_position_${index}`}
                                                            name={`pic_position_${index}`}
                                                            value={
                                                                data.pics[index]
                                                                    ?.pic_position
                                                            }
                                                            className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                            autoComplete={`pic_position_${index}`}
                                                            onChange={(e) => {
                                                                const updatedPics =
                                                                    [
                                                                        ...data.pics,
                                                                    ];
                                                                updatedPics[
                                                                    index
                                                                ] = {
                                                                    ...updatedPics[
                                                                        index
                                                                    ],
                                                                    pic_position:
                                                                        e.target
                                                                            .value,
                                                                };
                                                                setData(
                                                                    "pics",
                                                                    updatedPics
                                                                );
                                                            }}
                                                            required
                                                        />

                                                        <InputError
                                                            message={
                                                                errors.pics
                                                            }
                                                            className="mt-2 dark:text-red-400"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        {/* PIC_num & PIC_name */}
                                        {/* <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
                                            <div className="">
                                                <InputLabel
                                                    htmlFor="pic_name"
                                                    value="PIC Name"
                                                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                                />

                                                <TextInput
                                                    id="pic_name"
                                                    name="pic_name"
                                                    value={data.pic_name}
                                                    className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                    autoComplete="pic_name"
                                                    onChange={(e) =>
                                                        setData(
                                                            "pic_name",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                                <InputError
                                                    message={errors.pic_name}
                                                    className="mt-2 dark:text-red-400"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="pic_tlp_num"
                                                    value="PIC Tlp Num"
                                                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                                />

                                                <TextInput
                                                    id="pic_tlp_num"
                                                    name="pic_tlp_num"
                                                    value={data.pic_tlp_num}
                                                    className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                    autoComplete="pic_tlp_num"
                                                    onChange={(e) =>
                                                        setData(
                                                            "pic_tlp_num",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                                <InputError
                                                    message={errors.pic_tlp_num}
                                                    className="mt-2 dark:text-red-400"
                                                />
                                            </div>
                                        </div> */}

                                        {/* PIC title & position */}

                                        {/* <div>
                                            <InputLabel
                                                htmlFor="pic_position"
                                                value="PIC Position"
                                                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                            />

                                            <TextInput
                                                id="pic_position"
                                                name="pic_position"
                                                value={data.pic_position}
                                                className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                                autoComplete="pic_position"
                                                onChange={(e) =>
                                                    setData(
                                                        "pic_position",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />

                                            <InputError
                                                message={errors.pic_position}
                                                className="mt-2 dark:text-red-400"
                                            />
                                        </div> */}

                                        {/* Package */}
                                        <div>
                                            <InputLabel
                                                htmlFor="package"
                                                value="Package"
                                                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                            />

                                            <select
                                                id="package"
                                                name="package"
                                                value={data.package}
                                                className="block w-full mt-1 transition-all duration-200 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
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
                                                    className="dark:text-gray-300"
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

                                        {/* Price */}
                                        <div>
                                            <InputLabel
                                                htmlFor="price"
                                                value="Price"
                                                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                            />

                                            <div class="relative">
                                                <div class="relative rounded-md shadow-sm">
                                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span class="text-gray-500 sm:text-sm">
                                                            Rp
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        id="currency-input"
                                                        class="focus:ring-blue-500 bg-transparent border-gray-300  focus:border-blue-500 block w-full pl-8 pr-12 py-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 rounded-md"
                                                        placeholder="0"
                                                        onChange={(e) =>
                                                            setData(
                                                                "price",
                                                                e.target.value
                                                            )
                                                        }
                                                        name="price"
                                                        value={data.price}
                                                    />
                                                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <span class="text-gray-500 sm:text-sm">
                                                            IDR
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <InputError
                                                message={errors.price}
                                                className="mt-2 dark:text-red-400"
                                            />
                                        </div>
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
                                        Back
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
                                                Create Contract...
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
                                                Create Contract
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
