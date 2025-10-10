import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Fragment, useState, useRef, useEffect } from "react";

export default function index({}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        event_title: "",
        start: "",
        start_time: "",
        end: "",
        end_time: "",
        description: "",
    });

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
        post(route("kalender.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-10 px-6 rounded-b-2xl shadow-md">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Create New Event 🎉
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Plan your next important occasion with ease. We're here to help you stay organized and productive!
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Create Event" />

            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                        
                        <div className="p-8">
                            <div className="text-2xl font-bold text-gray-800 mb-6">Create New Event</div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Event Title */}
                                <div>
                                    <InputLabel
                                        htmlFor="event_title"
                                        value="Event Title"
                                        className="text-lg font-medium text-gray-800 mb-2"
                                    />
                                    <TextInput
                                        id="event_title"
                                        name="text"
                                        value={data.event_title}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                                        onChange={(e) =>
                                            setData("event_title", e.target.value)
                                        }
                                        required
                                        placeholder="Enter event title"
                                    />
                                    <InputError
                                        message={errors.event_title}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Date and Time Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Start Date */}
                                    <div>
                                        <InputLabel 
                                            htmlFor="start" 
                                            value="Start Date" 
                                            className="text-lg font-medium text-gray-800 mb-2"
                                        />
                                        <TextInput
                                            id="start"
                                            type="date"
                                            name="start"
                                            value={data.start}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
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
                                            className="text-lg font-medium text-gray-800 mb-2"
                                        />
                                        <TextInput
                                            id="start_time"
                                            type="time"
                                            name="start_time"
                                            value={data.start_time}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                                            onChange={(e) =>
                                                setData("start_time", e.target.value)
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
                                            className="text-lg font-medium text-gray-800 mb-2"
                                        />
                                        <TextInput
                                            id="end"
                                            type="date"
                                            name="end"
                                            value={data.end}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
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
                                            className="text-lg font-medium text-gray-800 mb-2"
                                        />
                                        <TextInput
                                            id="end_time"
                                            type="time"
                                            name="end_time"
                                            value={data.end_time}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
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
                                        className="text-lg font-medium text-gray-800 mb-2"
                                    />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition min-h-[120px]"
                                        onChange={(e) =>
                                            setData("description", e.target.value)
                                        }
                                        required
                                        placeholder="Enter event description"
                                    />
                                    <InputError
                                        message={errors.description}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end pt-4">
                                    <PrimaryButton
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-70"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating Event...' : 'Create Event'}
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