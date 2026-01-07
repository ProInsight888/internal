import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Fragment, useState, useRef, useEffect } from "react";

export default function index({ event }) {
    // console.log(event.googleEvent.id);
    // console.log(event.googleEvent.start.dateTime.slice(11, 16));

    // const start = event.start.split(' ');
    // const end = event.end.split(' ');
    const { data, setData, put, processing, errors, reset } = useForm({
        id: event?.googleEvent.id || "",
        title: event?.googleEvent.summary || "",
        start: event?.googleEvent.start.dateTime.slice(0, 10) || "",
        start_time: event?.googleEvent.start.dateTime.slice(11, 16) || "",
        end: event?.googleEvent.end.dateTime.slice(0, 10) || "",
        end_time: event?.googleEvent.end.dateTime.slice(11, 16) || "",
        description: event?.googleEvent.description || "",
    });

    const [showDeleteEdit, setShowDeleteEdit] = useState(false);

    // const calendarEmail =
    //     event.googleEvent.organizer.email === "adm.deartinstitute@gmail.com"
    //         ? "DeArt"
    //         : "SummerVillage";

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
        // console.log(event);
        put(
            route("calendar.update", {
                // calendar: calendarEmail,
                id: event.googleEvent.id,
            }),
            {
                // onFinish: () => reset('title', 'start', 'start_time', 'end', 'end_time', 'description'),
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h1 className="text-6xl mt-8 font-semibold leading-tight text-gray-100 mb-2">
                        Edit Your Event 👋
                    </h1>
                    <p className="text-2xl text-gray-100/80">
                        Another day to chase your goals! We're here to make sure
                        your stay is smooth, smart, and stress-free. You've got
                        this 💪
                    </p>
                </>
            }
        >
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-[#1a1a20] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#1f2937] border border-[#CFB14F]/20 rounded-xl shadow-lg overflow-hidden">
                        <div className="px-6 py-5 bg-[#121216] border-b border-[#CFB14F]/10">
                            <Head title="Create Event" />
                            <h2 className="text-3xl font-bold text-[#CFB14F]">
                                Edit Your Event
                            </h2>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-6">
                            {/* Calendar Selection */}

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
                                    Edit Event
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
