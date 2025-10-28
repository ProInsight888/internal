import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Fragment, useState, useRef, useEffect } from "react";

export default function create({}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        calendar_id: "",
        title: "",
        start: "",
        start_time: "",
        end: "",
        end_time: "",
        description: "",
        user: usePage().props.auth.user,
    });

    console.log(data);

    const [showDeleteEdit, setShowDeleteEdit] = useState(false);

    const dropdownRefs = useRef([]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                showDeleteEdit !== false &&
                dropdownRefs.current[showDeleteEdit] &&
                !dropdownRefs.current[showDeleteEdit].contains(e.target)
            ) {
                setShowDeleteEdit(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showDeleteEdit]);

    const submit = (e) => {
        e.preventDefault();
        post(route("calendar.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h1 className="text-6xl mt-8 font-semibold leading-tight text-gray-100 mb-2">
                        Add Your New Event 👋
                    </h1>
                    <p className="text-2xl text-gray-100/80">
                        Another day to chase your goals! We're here to make sure
                        your stay is smooth, smart, and stress-free. You've got
                        this 💪
                    </p>
                </>
            }
        >
            <div className="min-h-screen bg-gradient-to-br from-[#121216] to-[#1a1a20] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#121216] border border-[#CFB14F]/20 rounded-xl shadow-lg overflow-hidden">
                        <div className="px-6 py-5 bg-[#121216] border-b border-[#CFB14F]/10">
                            <Head title="Create Event" />
                            <h2 className="text-3xl font-bold text-[#CFB14F]">
                                Create New Event
                            </h2>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-6">
                            {/* Calendar Selection */}
                            <div>
                                <InputLabel
                                    value="Select Calendar"
                                    className="text-gray-100 mb-3"
                                />
                                <div className="flex gap-4">
                                    <label
                                        htmlFor="DeArt"
                                        className={`flex-1 cursor-pointer transition-all duration-200 py-4 px-4 text-center rounded-lg border-2 ${
                                            data.calendar_id === "DeArt"
                                                ? "border-[#CFB14F] bg-[#CFB14F]/10 text-[#CFB14F] font-medium"
                                                : "border-gray-700 text-gray-300 hover:border-[#CFB14F]/50"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="calendar_id"
                                            id="DeArt"
                                            value={"DeArt"}
                                            onChange={(e) =>
                                                setData(
                                                    "calendar_id",
                                                    e.target.value
                                                )
                                            }
                                            className="hidden"
                                        />
                                        DeART
                                    </label>
                                    <label
                                        htmlFor="SummerVillage"
                                        className={`flex-1 cursor-pointer transition-all duration-200 py-4 px-4 text-center rounded-lg border-2 ${
                                            data.calendar_id === "SummerVillage"
                                                ? "border-[#CFB14F] bg-[#CFB14F]/10 text-[#CFB14F] font-medium"
                                                : "border-gray-700 text-gray-300 hover:border-[#CFB14F]/50"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="calendar_id"
                                            id="SummerVillage"
                                            value={"SummerVillage"}
                                            onChange={(e) =>
                                                setData(
                                                    "calendar_id",
                                                    e.target.value
                                                )
                                            }
                                            className="hidden"
                                        />
                                        Summer Village
                                    </label>
                                </div>
                                <InputError
                                    message={errors.calendar_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* Event Title */}
                            <div>
                                <InputLabel
                                    htmlFor="title"
                                    value="Event Title"
                                    className="text-gray-100"
                                />

                                <TextInput
                                    id="title"
                                    name="title"
                                    value={data.title}
                                    className="mt-2 block w-full  border-gray-700 text-gray-900 focus:border-[#CFB14F] focus:ring-1 focus:ring-[#CFB14F]"
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.title}
                                    className="mt-2"
                                />
                            </div>

                            {/* Date and Time Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Start Date */}
                                <div>
                                    <InputLabel
                                        htmlFor="start"
                                        value="Start Date"
                                        className="text-gray-100"
                                    />

                                    <TextInput
                                        id="start"
                                        type="date"
                                        name="start"
                                        value={data.start}
                                        className="mt-2 block w-full  border-gray-700 text-gray-900 focus:border-[#CFB14F] focus:ring-1 focus:ring-[#CFB14F]"
                                        onChange={(e) =>
                                            setData("start", e.target.value)
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.start}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Start Time */}
                                <div>
                                    <InputLabel
                                        htmlFor="start_time"
                                        value="Start Time"
                                        className="text-gray-100"
                                    />

                                    <TextInput
                                        id="start_time"
                                        type="time"
                                        name="start_time"
                                        value={data.start_time}
                                        className="mt-2 block w-full  border-gray-700 text-gray-900 focus:border-[#CFB14F] focus:ring-1 focus:ring-[#CFB14F]"
                                        onChange={(e) =>
                                            setData(
                                                "start_time",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.start_time}
                                        className="mt-2"
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <InputLabel
                                        htmlFor="end"
                                        value="End Date"
                                        className="text-gray-100"
                                    />

                                    <TextInput
                                        id="end"
                                        type="date"
                                        name="end"
                                        value={data.end}
                                        className="mt-2 block w-full  border-gray-700 text-gray-900 focus:border-[#CFB14F] focus:ring-1 focus:ring-[#CFB14F]"
                                        onChange={(e) =>
                                            setData("end", e.target.value)
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.end}
                                        className="mt-2"
                                    />
                                </div>

                                {/* End Time */}
                                <div>
                                    <InputLabel
                                        htmlFor="end_time"
                                        value="End Time"
                                        className="text-gray-100"
                                    />

                                    <TextInput
                                        id="end_time"
                                        type="time"
                                        name="end_time"
                                        value={data.end_time}
                                        className="mt-2 block w-full  border-gray-700 text-gray-900 focus:border-[#CFB14F] focus:ring-1 focus:ring-[#CFB14F]"
                                        onChange={(e) =>
                                            setData("end_time", e.target.value)
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.end_time}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel
                                    htmlFor="description"
                                    value="Description"
                                    className="text-gray-100"
                                />

                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    rows="4"
                                    className="mt-2 block w-full  border-gray-700 rounded-md text-gray-900 focus:border-[#CFB14F] focus:ring-1 focus:ring-[#CFB14F]"
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    required
                                ></textarea>

                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end pt-4">
                                <PrimaryButton
                                    className="bg-[#CFB14F] hover:bg-[#CFB14F]/90 text-[#121216] font-medium px-6 py-3 transition-colors duration-200"
                                    disabled={processing}
                                >
                                    Create Event
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
