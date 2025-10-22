import Checkbox from "@/Components/Checkbox";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useRef } from "react";

export default function Create({ users, items }) {
    const { data, setData, post, errors, processing } = useForm({
        event_name: "",
        tanggal_event: "",
        items: {},
    });

    const [activeCategory, setActiveCategory] = useState("camera");
    const [searchTerm, setSearchTerm] = useState("");
    const categories = [
        "camera", "lensa", "audio", "cable audio", "gimbal", "drone", 
        "lighting", "battery drone", "tripod lighting", "tripod", 
        "cleaning kit", "charger", "sd card", "micro sd card", "battery camera"
    ];

    const formRef = useRef();

    function submit(e) {
        e.preventDefault();
        post(route("data_collection.store"));
    }

    const handleItemCheck = (itemId, category, checked) => {
        setData("items", {
            ...data.items,
            [itemId]: {
                ...(data.items?.[itemId] || {}),
                id: itemId,
                checked,
                category,
                // Reset quantity if unchecked
                quantity: checked ? (data.items?.[itemId]?.quantity || '') : ''
            },
        });
    };

    const handleQuantityChange = (itemId, quantity) => {
        const numQuantity = parseInt(quantity) || '';
        setData("items", {
            ...data.items,
            [itemId]: {
                ...(data.items?.[itemId] || {}),
                id: itemId,
                quantity: numQuantity,
            },
        });
    };

    // Filter items based on search term and category
    const filteredItems = items.filter(item => 
        item.category === activeCategory && 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="text-center py-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-lg">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        New Event Documentation 
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
                        Select equipment for your event and keep track of what you need
                    </p>
                </div>
            }
        >
            <Head title="Create Event Documentation" />

            <div className="py-8 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="p-8">
                            {/* Event Information Section */}
                            <div className="mb-10">
                                <div className="flex items-center mb-6">
                                    <div className="w-3 h-8 bg-indigo-600 rounded-full mr-3"></div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Event Information</h2>
                                </div>
                                
                                <form onSubmit={submit} ref={formRef}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div>
                                            <InputLabel 
                                                htmlFor="event_name" 
                                                value="Event Name"
                                                className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            />
                                            <TextInput
                                                type="text"
                                                name="event_name"
                                                value={data.event_name}
                                                onChange={(e) => setData("event_name", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                                placeholder="Enter event name"
                                            />
                                            {errors.event_name && <div className="text-red-500 text-sm mt-1">{errors.event_name}</div>}
                                        </div>
                                        
                                        <div>
                                            <InputLabel 
                                                htmlFor="tanggal_event" 
                                                value="Event Date"
                                                className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            />
                                            <TextInput
                                                name="tanggal_event"
                                                type="date"
                                                value={data.tanggal_event}
                                                onChange={(e) => setData("tanggal_event", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                            {errors.tanggal_event && <div className="text-red-500 text-sm mt-1">{errors.tanggal_event}</div>}
                                        </div>
                                    </div>

                                    {/* Equipment Selection Section */}
                                    <div className="mb-8">
                                        <div className="flex items-center mb-6">
                                            <div className="w-3 h-8 bg-indigo-600 rounded-full mr-3"></div>
                                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Equipment Selection</h2>
                                        </div>
                                        
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                            <div className="w-full md:w-auto">
                                                <InputLabel value="Search Equipment" className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2" />
                                                <div className="relative">
                                                    <TextInput
                                                        type="text"
                                                        placeholder="Search equipment..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-full md:w-64 pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                                    />
                                                    <svg 
                                                        className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" 
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        viewBox="0 0 20 20" 
                                                        fill="currentColor"
                                                    >
                                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <div className="w-full md:w-auto">
                                                <InputLabel value="Filter by Category" className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2" />
                                                <div className="flex flex-wrap gap-2">
                                                    {categories.map(category => (
                                                        <button
                                                            key={category}
                                                            type="button"
                                                            onClick={() => setActiveCategory(category)}
                                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                                                                activeCategory === category
                                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                            }`}
                                                        >
                                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4 flex items-center justify-between">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {filteredItems.length} items in <span className="font-medium capitalize">{activeCategory}</span>
                                            </p>
                                            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                                                {Object.values(data.items).filter(item => item.checked).length} items selected
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                                            {filteredItems.length > 0 ? (
                                                filteredItems.map((item) => (
                                                    <div 
                                                        key={item.id} 
                                                        className={`p-4 rounded-xl border transition-all ${
                                                            data.items?.[item.id]?.checked 
                                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700 shadow-sm' 
                                                                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-start space-x-3">
                                                                <Checkbox
                                                                    id={item.id}
                                                                    checked={data.items?.[item.id]?.checked || false}
                                                                    onChange={(e) => handleItemCheck(item.id, item.category, e.target.checked)}
                                                                    className="mt-1"
                                                                />
                                                                <label
                                                                    className="block text-md font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                                                    htmlFor={item.id}
                                                                >
                                                                    {item.name}
                                                                </label>
                                                            </div>
                                                            
                                                            {(item.category === "battery drone" || 
                                                              item.category === "tripod lighting" || 
                                                              item.category === "battery camera") && (
                                                                <div className="flex items-center">
                                                                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Qty:</span>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        value={data.items?.[item.id]?.quantity || ''}
                                                                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                                                        className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-center focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                                                                        disabled={!data.items?.[item.id]?.checked}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                                                    {searchTerm 
                                                        ? `No equipment found in "${activeCategory}" matching "${searchTerm}"`
                                                        : `No equipment found in "${activeCategory}"`
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end pt-6 border-t border-gray-200 dark:border-gray-600">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 border border-transparent rounded-xl font-semibold text-white tracking-widest hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50 shadow-md hover:shadow-lg"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    Create Documentation
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}