import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Fragment, useState, useRef, useEffect } from "react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
    createViewDay,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";

export default function index({ schedule }) {
    const user = usePage().props.auth.user;
    const { data, setData, put, processing, errors } = useForm({});

    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    const eventsService = useState(() => createEventsServicePlugin())[0];
    const calendar = useCalendarApp({
        views: [
            createViewDay(),
            createViewWeek(),
            createViewMonthGrid(),
            createViewMonthAgenda(),
        ],
        events: [
            ...schedule.map((e) => ({
                id: e.id,
                title: e.title,
                start: e.start,
                end: e.end,
                description: e.description,
            })),
        ],
        selectedDate: formattedDate,
        plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
        callbacks: {
            onEventUpdate(updatedEvent) {
                console.log(updatedEvent);
                router.visit(
                    route("drag_and_drop_update.update", updatedEvent.id),
                    {
                        method: "put",
                        data: updatedEvent,
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    },
                );
            },
            onBeforeEventUpdate(oldEvent, newEvent, $app) {
                return true;
            },
        },
    });

    const [customMenu, setCustomMenu] = useState({
        visible: false,
        top: 0,
        left: 0,
        eventId: null,
    });

    useEffect(() => {
        const handleContextMenu = (e) => {
            const eventEl = e.target.closest(".sx__time-grid-event-inner");
            const eventId =
                e.target.closest(".sx__time-grid-event.sx__event") ||
                e.target.closest("[data-event-id]");
                
            if (eventEl) {
                e.preventDefault();
                const id = eventId?.getAttribute("data-event-id");
                const position = {
                    top: e.pageY,
                    left: e.pageX,
                };

                setCustomMenu({
                    visible: true,
                    top: position.top,
                    left: position.left,
                    eventId: id,
                });
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);

    useEffect(() => {
        const hideMenu = () =>
            setCustomMenu((prev) => ({ ...prev, visible: false }));
        document.addEventListener("click", hideMenu);
        return () => document.removeEventListener("click", hideMenu);
    }, []);

    const { success, deleted: deleteMessage } = usePage().props.flash ?? {};

    return (
        <AuthenticatedLayout
            header={
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-3">
                        Calendar 📆
                    </h1>
                    <p className="text-xl opacity-90">
                        Manage your schedule with our interactive calendar. Drag
                        and drop events to reschedule them.
                    </p>
                </div>
            }
        >
            <Head title="Calendar" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        {user.role !== "intern" && user.role !== 'member' && (
                            <Link
                                href={route("kalender.create")}
                                className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                            >
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
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                                Add New Event
                            </Link>
                        )}

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg border border-blue-100 dark:border-blue-800">
                            <svg
                                className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            Right-click on events to edit or delete
                        </div>
                    </div>

                    {/* Flash Messages */}
                    <div className="mb-6">
                        {success && (
                            <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 text-green-800 dark:text-green-300 p-4 rounded-lg border border-green-200 dark:border-green-800 flex items-center">
                                <svg
                                    className="w-5 h-5 mr-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                {success}
                            </div>
                        )}
                        {deleteMessage && (
                            <div className="bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-800 flex items-center">
                                <svg
                                    className="w-5 h-5 mr-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                {deleteMessage}
                            </div>
                        )}
                    </div>

                    {/* Calendar Container */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <ScheduleXCalendar calendarApp={calendar} />
                    </div>

                    {/* Custom Context Menu */}
                    {customMenu.visible && (
                        <div
                            className="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-50 overflow-hidden"
                            style={{
                                top: customMenu.top,
                                left: customMenu.left,
                            }}
                        >
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/30 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Event Actions
                                </p>
                            </div>
                            <ul className="py-1">
                                <li>
                                    <Link
                                        id="edit"
                                        href={route(
                                            "kalender.edit",
                                            customMenu.eventId
                                        )}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
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
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        Edit Event
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        id="delete"
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    "Are you sure you want to delete this event?"
                                                )
                                            ) {
                                                router.delete(
                                                    route(
                                                        "kalender.destroy",
                                                        customMenu.eventId
                                                    ),
                                                    {
                                                        onSuccess: () => {
                                                            alert(
                                                                "Event deleted successfully!"
                                                            );
                                                            window.location.reload();
                                                        },
                                                        onError: (errors) =>
                                                            console.error(
                                                                errors
                                                            ),
                                                    }
                                                );
                                            }
                                        }}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150"
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
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        Delete Event
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}