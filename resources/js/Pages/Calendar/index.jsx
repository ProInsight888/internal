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

export default function index({ ev }) {
    const date = new Date();
    // console.log(ev);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // bulan dimulai dari 0
    const dd = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${yyyy}-${mm}-${dd}`;

    const calendar = useCalendarApp({
        views: [
            createViewDay({ key: "day" }),
            createViewWeek({ key: "week" }),
            createViewMonthGrid({
                key: "monthGrid",
                showOverflowingEvents: true,
            }),
            createViewMonthAgenda({ key: "monthAgenda" }),
        ],
        defaultView: "month-grid",

        events: [
            ...ev.map((e) => ({
                id: e.googleEvent.id,
                title: e.googleEvent.summary,
                start: e.googleEvent.start.dateTime
                    .slice(0, 16)
                    .replace("T", " "),
                end: e.googleEvent.end.dateTime.slice(0, 16).replace("T", " "),
                description: e.googleEvent.description,
            })),
        ],
        selectedDate: formattedDate,
        plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
        callbacks: {
            onEventUpdate(updatedEvent) {
                // console.log(updatedEvent);
                router.visit(
                    route("drag_and_drop_update.update", updatedEvent.id),
                    {
                        method: "put",
                        data: updatedEvent,
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    }
                );
            },
            onBeforeEventUpdate(oldEvent, newEvent, $app) {
                return true;
            },
        },
    });

    // console.log(calendar);

    const [customMenu, setCustomMenu] = useState({
        visible: false,
        top: 0,
        left: 0,
        eventId: null,
    });

    useEffect(() => {
        const handleContextMenu = (e) => {
            const eventEl = e.target.closest(".sx__time-grid-event-inner");
            // console.log(eventEl);
            const eventId =
                e.target.closest(".sx__time-grid-event.sx__event") ||
                e.target.closest("[data-event-id]");
            // console.log(eventId);
            if (eventEl) {
                e.preventDefault(); // Disable browser context menu

                const id = eventId?.getAttribute("data-event-id"); // You might need to inspect ScheduleX DOM for actual attr
                const position = {
                    top: e.pageY,
                    left: e.pageX,
                };
                // console.log(id);

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

    // console.log(customMenu);

    let number_event = 1;

    let main_user = usePage().props.auth.user;
    // console.log(main_user)

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h1 className="text-6xl mt-8 font-semibold leading-tight text-[#1c1c1c] dark:text-white mb-2">
                        Calendar 📆
                    </h1>
                    <p className="text-2xl">
                        Finally, you have completed the task. You can now
                        proceed to the next task.
                    </p>
                </>
            }
        >
            <Head title="Calendar" />

            {main_user.role !== "member" && (
                <div>
                    <div className=" my-5 w-full justify-end flex">
                        <Link
                            href={route("calendar.create")}
                            className="px-5 py-4 mb-10 bg-yellow-500 text-black rounded-lg"
                        >
                            + Add Event
                        </Link>
                    </div>

                    <div>
                        {success && (
                            <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
                                ✅ {success}
                            </div>
                        )}
                        {deleteMessage && (
                            <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
                                ❌ {deleteMessage}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div>
                <ScheduleXCalendar calendarApp={calendar} />
                {customMenu.visible && (
                    <div
                        className="absolute bg-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-lg z-[9999]"
                        style={{ top: customMenu.top, left: customMenu.left }}
                        onClick={() =>
                            setCustomMenu({ ...customMenu, visible: false })
                        }
                    >
                        <ul className=" flex flex-col p-5">
                            <Link
                                id="edit"
                                href={route(
                                    "calendar.edit",
                                    customMenu.eventId
                                )}
                                className="text-left ml-2 text-sm pr-3 pb-2 w-fit hover:text-green-600"
                            >
                                Edit
                            </Link>
                            <button
                                id="delete"
                                onClick={() => {
                                    if (confirm("Are you sure?")) {
                                        router.delete(
                                            route(
                                                "calendar.destroy",
                                                customMenu.eventId
                                            ),
                                            {
                                                onSuccess: () => {
                                                    alert("Calendar deleted!"),
                                                        window.location.reload();
                                                },
                                                onError: (errors) =>
                                                    console.error(errors),
                                            }
                                        );
                                    }
                                }}
                                className="text-left ml-2 text-sm pr-3 w-fit hover:text-red-600"
                            >
                                Delete
                            </button>
                        </ul>
                    </div>
                )}
            </div>
            <div className="mt-10 overflow-x-auto w-full">
                <table className="w-full pb-8 border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-300">
                            <th className="flex items-center justify-middle px-3 py-2 min-w-12 text-left text-sm font-medium text-gray-700 dark:text-white">
                                No
                            </th>
                            <th className="px-3 py-2 min-w-48 text-left text-sm font-medium text-gray-700 dark:text-white">
                                Event Name
                            </th>
                            <th className="px-3 py-2 min-w-24 text-left text-sm font-medium text-gray-700 dark:text-white">
                                Date
                            </th>
                            <th className="px-3 py-2 min-w-24 text-left text-sm font-medium text-gray-700 dark:text-white">
                                Time
                            </th>
                            <th className="px-3 py-2 min-w-48 text-left text-sm font-medium text-gray-700 dark:text-white">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {ev.map((e) => (
                            <tr className=" border-b relative bg-gray-100 border-black dark:border-gray-300 dark:bg-gray-800 hover:bg-gray-50 hover:dark:bg-gray-700">
                                <td className="text-black dark:text-white">{number_event++}</td>
                                <td>{e?.googleEvent.summary}</td>
                                <td>
                                    {e?.googleEvent.start.dateTime.slice(0, 10)}{" "}
                                    -{" "}
                                    {e?.googleEvent.end.dateTime.slice(0, 10)}
                                </td>
                                <td>
                                    {e?.googleEvent.start.dateTime.slice(
                                        11,
                                        16
                                    )}{" "}
                                    -{" "}
                                    {e?.googleEvent.end.dateTime.slice(11, 16)}
                                </td>
                                <td>{e?.googleEvent.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
