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
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl mt-8 font-semibold leading-tight text-gray-100 mb-4">
                        Add Your New Event 👋
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl">
                        Another day to chase your goals! We're here to make sure
                        your stay is smooth, smart, and stress-free. You've got
                        this 💪
                    </p>
                </>
            }
        >
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header Section */}
                        <div className="px-6 py-6 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-amber-500/30">
                            <Head title="Create Event" />
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <svg 
                                        className="w-6 h-6 text-amber-400" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-amber-400">
                                    Create New Event
                                </h2>
                            </div>
                        </div>

                        <form onSubmit={submit} className="p-6 sm:p-8 space-y-8">
                            {/* Event Title */}
                            <div>
                                <InputLabel
                                    htmlFor="title"
                                    value="Event Title"
                                    className="text-gray-200 font-medium mb-3 text-lg"
                                />

                                <TextInput
                                    id="title"
                                    name="title"
                                    value={data.title}
                                    className="mt-1 block w-full bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-lg transition-all duration-200 py-3 px-4 text-base"
                                    placeholder="Enter event title..."
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                {/* Start Date */}
                                <div>
                                    <InputLabel
                                        htmlFor="start"
                                        value="Start Date"
                                        className="text-gray-200 font-medium mb-3"
                                    />

                                    <div className="relative">
                                        <TextInput
                                            id="start"
                                            type="date"
                                            name="start"
                                            value={data.start}
                                            className="mt-1 block w-full bg-gray-700/50 border-gray-600 text-white focus:bg-gray-700 focus:purple-600 focus:ring-2 focus:ring-amber-500/20 rounded-lg transition-all duration-200 py-3 px-4"
                                            onChange={(e) =>
                                                setData("start", e.target.value)
                                            }
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>

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
                                        className="text-gray-200 font-medium mb-3"
                                    />

                                    <div className="relative">
                                        <TextInput
                                            id="start_time"
                                            type="time"
                                            name="start_time"
                                            value={data.start_time}
                                            className="mt-1 block w-full bg-gray-700/50 border-gray-600 text-white focus:bg-gray-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-lg transition-all duration-200 py-3 px-4"
                                            onChange={(e) =>
                                                setData(
                                                    "start_time",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>

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
                                        className="text-gray-200 font-medium mb-3"
                                    />

                                    <div className="relative">
                                        <TextInput
                                            id="end"
                                            type="date"
                                            name="end"
                                            value={data.end}
                                            className="mt-1 block w-full bg-gray-700/50 border-gray-600 text-white focus:bg-gray-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-lg transition-all duration-200 py-3 px-4"
                                            onChange={(e) =>
                                                setData("end", e.target.value)
                                            }
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>

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
                                        className="text-gray-200 font-medium mb-3"
                                    />

                                    <div className="relative">
                                        <TextInput
                                            id="end_time"
                                            type="time"
                                            name="end_time"
                                            value={data.end_time}
                                            className="mt-1 block w-full bg-gray-700/50 border-gray-600 text-white focus:bg-gray-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-lg transition-all duration-200 py-3 px-4"
                                            onChange={(e) =>
                                                setData("end_time", e.target.value)
                                            }
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>

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
                                    className="text-gray-200 font-medium mb-3 text-lg"
                                />

                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    rows="5"
                                    className="mt-1 block w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:bg-gray-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 py-3 px-4 resize-none text-base"
                                    placeholder="Describe your event details..."
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
                            <div className="flex items-center justify-end pt-6 border-t border-gray-700">
                                <PrimaryButton
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:to-purple-500 text-gray-900 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105 text-lg"
                                    disabled={processing}
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg 
                                            className="w-5 h-5" 
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
                                        <span>Create Event</span>
                                    </div>
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}