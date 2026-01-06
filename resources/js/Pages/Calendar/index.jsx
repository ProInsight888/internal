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

export default function index({
    ev,
    selectedTeams,
    setSelectedTeams,
    teams,
}) {
    const date = new Date();
    // console.log(teams);
    // console.log(ev);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
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

        events: ev.map((e) => {
            const rawStart =
                e.googleEvent.start.dateTime || e.googleEvent.start.date;
            const rawEnd = e.googleEvent.end.dateTime || e.googleEvent.end.date;

            return {
                id: e.googleEvent.id,
                title: e.googleEvent.summary,
                start:
                    rawStart.length > 10
                        ? rawStart?.slice(0, 16).replace("T", " ")
                        : rawStart + " 00:00",
                end:
                    rawEnd.length > 10
                        ? rawEnd?.slice(0, 16).replace("T", " ")
                        : rawEnd + " 00:00",
                description: e.googleEvent.description,
            };
        }),

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

                const id = eventId?.getAttribute("data-event-id");
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

    // console.log(ev[0].googleEvent.start.dateTime.slice(0, 10));

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
                    <div className="flex justify-between">
                        <div>
                            <div className=" bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-left">
                                    Filter by Teams
                                </label>
                                <select
                                    className="w-full px-5 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all"
                                    value={selectedTeams}
                                    onChange={(e) =>{
                                            console.log(e.target.value);

                                        router.get(route("calendar.index"), {
                                            team: e.target.value,
                                        }, {
                                            replace: true,
                                        })}
                                    }
                                >
                                        <option value="proinsight">
                                            All Teams
                                        </option>
                                        <option value="it">
                                            IT
                                        </option>
                                        <option value="media">
                                            Media
                                        </option>
                                        <option value="creative">
                                            Creative
                                        </option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <div className=" my-5 w-full flex">
                                <Link
                                    href={route("calendar.create", { team: selectedTeams })}
                                    className="px-5 py-4 mb-10 bg-yellow-500 text-black rounded-lg"
                                >
                                    + Add Event
                                </Link>
                            </div>
                        </div>
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
                            setCustomMenu({ ...customMenu, visible: true })
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
                                <td className="text-black dark:text-white">
                                    {number_event++}
                                </td>
                                <td>{e?.googleEvent.summary}</td>
                                <td>
                                    {new Date(
                                        e?.googleEvent.start.dateTime
                                    ).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        timeZone: "Asia/Jakarta",
                                    })}{" "}
                                    -{" "}
                                    {new Date(
                                        e?.googleEvent.start.dateTime
                                    ).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        timeZone: "Asia/Jakarta",
                                    })}
                                </td>
                                <td>
                                    {e?.googleEvent.start.dateTime?.slice(
                                        11,
                                        16
                                    )}{" "}
                                    -{" "}
                                    {e?.googleEvent.end.dateTime?.slice(11, 16)}
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
