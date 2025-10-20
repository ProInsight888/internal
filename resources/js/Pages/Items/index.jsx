import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";

export default function EquipmentInventory({
    userName,
    items,
    tool_data_collection,
    events_name,
}) {
    const user = usePage().props.auth.user;
    const successMessage = usePage().props?.flash?.success;

    // Define category colors for consistent styling
    const categoryColors = {
        camera: "bg-gradient-to-r from-blue-500 to-blue-600",
        lensa: "bg-gradient-to-r from-purple-500 to-purple-600",
        audio: "bg-gradient-to-r from-green-500 to-green-600",
        "cable audio": "bg-gradient-to-r from-teal-500 to-teal-600",
        gimbal: "bg-gradient-to-r from-orange-500 to-orange-600",
        drone: "bg-gradient-to-r from-red-500 to-red-600",
        lighting: "bg-gradient-to-r from-yellow-500 to-yellow-600",
        "battery camera": "bg-gradient-to-r from-indigo-500 to-indigo-600",
        tripod: "bg-gradient-to-r from-pink-500 to-pink-600",
        "cleaning kit": "bg-gradient-to-r from-cyan-500 to-cyan-600",
        "tripod lighting": "bg-gradient-to-r from-lime-500 to-lime-600",
        charger: "bg-gradient-to-r from-amber-500 to-amber-600",
        "sd card": "bg-gradient-to-r from-emerald-500 to-emerald-600",
        "micro sd card": "bg-gradient-to-r from-rose-500 to-rose-600",
        "battery drone": "bg-gradient-to-r from-violet-500 to-violet-600",
    };

    const categoryIcons = {
        camera: "📷",
        lensa: "🔍",
        audio: "🎤",
        "cable audio": "🔌",
        gimbal: "📹",
        drone: "🚁",
        lighting: "💡",
        "battery camera": "🔋",
        tripod: "📐",
        "cleaning kit": "🧹",
        "tripod lighting": "💡",
        charger: "⚡",
        "sd card": "💾",
        "micro sd card": "📀",
        "battery drone": "🔋",
    };

    // Group items by category for better organization
    const itemsByCategory = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    // Define the order of categories for display
    const categoryOrder = [
        "camera", "lensa", "audio", "cable audio", "gimbal", "drone", 
        "lighting", "battery camera", "tripod", "cleaning kit", 
        "tripod lighting", "charger", "sd card", "micro sd card", "battery drone"
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                        Hi, {userName}! 👋
                    </h1>
                    <p className="text-lg opacity-90">
                        Manage your equipment inventory with our comprehensive
                        dashboard.
                    </p>
                </div>
            }
        >
            <Head title="Equipment Inventory" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        {user.role !== "intern" && user.role !== "member" && (
                            <Link
                                href={route("items.create")}
                                className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
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
                                Add New Item
                            </Link>
                        )}
                        <Link
                            href={route("data_collection.create")}
                            className="flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
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
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            Tool Data Collection
                        </Link>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 p-4 rounded-lg border border-green-200 flex items-center mb-6">
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
                            {successMessage}
                        </div>
                    )}

                    {/* Equipment Inventory */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Equipment Inventory
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {categoryOrder.map(
                                    (category) =>
                                        itemsByCategory[category] &&
                                        itemsByCategory[category].length >
                                            0 && (
                                            <div
                                                key={category}
                                                className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                                            >
                                                <div
                                                    className={`flex items-center p-3 rounded-lg mb-4 ${categoryColors[category]} text-white`}
                                                >
                                                    <span className="text-2xl mr-3">
                                                        {
                                                            categoryIcons[
                                                                category
                                                            ]
                                                        }
                                                    </span>
                                                    <h3 className="text-xl font-bold capitalize">
                                                        {category}
                                                    </h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {itemsByCategory[
                                                        category
                                                    ].map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                                                        >
                                                            <div className="flex items-center">
                                                                <span className="text-lg font-medium">
                                                                    {item.name}
                                                                </span>
                                                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>
                                                            </div>
                                                            {user.role !== 'intern' && user.role !== 'member' && (
                                                                <div className="flex gap-2">
                                                                    <Link
                                                                        href={route(
                                                                            "items.edit",
                                                                            item
                                                                        )}
                                                                        className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                                                        title="Edit"
                                                                    >
                                                                        <svg
                                                                            className="w-4 h-4"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={
                                                                                    2
                                                                                }
                                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                            />
                                                                        </svg>
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => {
                                                                            if (
                                                                                confirm(
                                                                                    "Are you sure you want to delete this item?"
                                                                                )
                                                                            ) {
                                                                                router.delete(
                                                                                    route(
                                                                                        "items.destroy",
                                                                                        item
                                                                                    ),
                                                                                    {
                                                                                        onSuccess:
                                                                                            () =>
                                                                                                alert(
                                                                                                    "Item deleted successfully!"
                                                                                                ),
                                                                                        onError:
                                                                                            (
                                                                                                errors
                                                                                            ) =>
                                                                                                console.error(
                                                                                                    errors
                                                                                                ),
                                                                                    }
                                                                                );
                                                                            }
                                                                        }}
                                                                        className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                                                        title="Delete"
                                                                    >
                                                                        <svg
                                                                            className="w-4 h-4"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={
                                                                                    2
                                                                                }
                                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tool Data Collections */}
                    {events_name && events_name.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Tool Data Collections
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6">
                                    {events_name.map((event, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-50 rounded-xl p-5 border border-gray-200"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold text-gray-800 bg-white px-4 py-2 rounded-lg border border-gray-200">
                                                    {event}
                                                </h3>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "Are you sure you want to delete this collection?"
                                                                )
                                                            ) {
                                                                router.delete(
                                                                    route(
                                                                        "check.destroy",
                                                                        event
                                                                    ),
                                                                    {
                                                                        onSuccess:
                                                                            () =>
                                                                                alert(
                                                                                    "Collection deleted successfully!"
                                                                                ),
                                                                        onError:
                                                                            (
                                                                                errors
                                                                            ) =>
                                                                                console.error(
                                                                                    errors
                                                                                ),
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                        className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                                        title="Delete Collection"
                                                    >
                                                        <svg
                                                            className="w-4 h-4 mr-1"
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
                                                        Delete
                                                    </button>
                                                    {/* <Link
                                                        href={route("data_collection.edit", event)}
                                                        className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                                        title="Edit Collection"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </Link> */}
                                                    <Link
                                                        href={route(
                                                            "check.edit",
                                                            event
                                                        )}
                                                        className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                                        title="Check Collection"
                                                    >
                                                        <svg
                                                            className="w-4 h-4 mr-1"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        Check
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {tool_data_collection
                                                    .filter(
                                                        (data) =>
                                                            data.event_name ===
                                                            event
                                                    )
                                                    .map((data, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center"
                                                        >
                                                            <span className="font-medium">
                                                                {data.items}
                                                            </span>
                                                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                                                                {data.quantity}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}