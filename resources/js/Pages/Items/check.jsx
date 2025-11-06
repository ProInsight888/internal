import Checkbox from "@/Components/Checkbox";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";

export default function create({ users, dataEvent, event, tanggal }) {
    const { data, setData, post, errors, processing } = useForm({
        event_name: "",
        tanggal_event: "",
        items: {},
    });

    // console.log(data);

    const [activeCategory, setActiveCategory] = useState("camera");
    const [searchTerm, setSearchTerm] = useState("");
    
    // Group items by category
    const categories = [...new Set(dataEvent.map(item => item.category))];
    const itemsByCategory = {};
    
    categories.forEach(category => {
        itemsByCategory[category] = dataEvent.filter(item => 
            item.category === category && 
            item.items.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleCheckboxChange = (itemId, checked) => {
        setData("items", {
            ...data.items,
            [itemId]: {
                ...(data.items?.[itemId] || {}),
                id: itemId,
                checked: checked,
                // Reset quantity when unchecking
                quantity: checked ? (data.items?.[itemId]?.quantity || '') : ''
            },
        });
        // console.log(data.items, itemId)
    };

    const handleQuantityChange = (itemId, quantity) => {
        setData("items", {
            ...data.items,
            [itemId]: {
                ...(data.items?.[itemId] || {}),
                id: itemId,
                quantity: parseInt(quantity) || '',
            },
        });
    };

    const handleSubmit = () => {
        // Validate that at least one item is selected
        const selectedItems = Object.values(data.items).filter(item => item.checked);
        
        if (selectedItems.length === 0) {
            alert("Please select at least one item before completing the checklist.");
            return;
        }
        
        router.delete(route("check.destroy", event), {
            onSuccess: () => alert("Checklist completed successfully!"),
            onError: (errors) => console.error(errors),
        });
    };

    // Count selected items for the badge
    const selectedItemsCount = Object.values(data.items).filter(item => item.checked).length;

    return (
        <AuthenticatedLayout
            header={
                <div className="text-center py-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg dark:from-indigo-800 dark:to-purple-900">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Equipment Checklist 🎯
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                        Prepare your gear for {event} on {tanggal}
                    </p>
                </div>
            }
        >
            <Head title={`Checklist - ${event}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 md:p-8">
                            {/* Event Header */}
                            <div className="mb-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 dark:from-indigo-900/20 dark:to-purple-900/20 dark:border-indigo-800">
                                <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 dark:text-indigo-300">{event}</h2>
                                <div className="text-lg text-indigo-600 dark:text-indigo-400 mt-1">{tanggal}</div>
                                <div className="mt-3 flex items-center">
                                    <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                                        {selectedItemsCount} item{selectedItemsCount !== 1 ? 's' : ''} selected
                                    </span>
                                </div>
                            </div>

                            {/* Search and Category Navigation */}
                            <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
                                <div className="w-full md:w-auto">
                                    <InputLabel className="text-gray-700 font-medium dark:text-gray-300">Search Equipment:</InputLabel>
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search equipment..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 block w-full md:w-80 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                                        />
                                    </div>
                                </div>
                                
                                <div className="w-full md:ml-auto md:w-auto">
                                    <InputLabel className="text-gray-700 font-medium dark:text-gray-300">Filter by Category:</InputLabel>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {categories.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setActiveCategory(category)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                    activeCategory === category 
                                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Equipment List */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Category Navigation Sidebar */}
                                <div className="lg:col-span-1">
                                    <div className="sticky top-4 p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                                        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Categories</h3>
                                        <ul className="space-y-2">
                                            {categories.map(category => (
                                                <li key={category}>
                                                    <button
                                                        onClick={() => setActiveCategory(category)}
                                                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex justify-between items-center ${
                                                            activeCategory === category
                                                                ? 'bg-indigo-100 text-indigo-700 font-medium shadow-sm dark:bg-indigo-800 dark:text-indigo-200'
                                                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600'
                                                        }`}
                                                    >
                                                        <span>{category}</span>
                                                        <span className={`bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full ${activeCategory === category ? '' : 'opacity-0'} dark:bg-indigo-400`}>
                                                            {itemsByCategory[category]?.length || 0}
                                                        </span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Equipment Items */}
                                <div className="lg:col-span-3">
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                                        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-300 dark:border-gray-600">
                                            <h3 className="text-xl font-bold text-gray-800 capitalize dark:text-gray-200">
                                                {activeCategory} Equipment
                                            </h3>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {itemsByCategory[activeCategory]?.length || 0} items
                                            </span>
                                        </div>
                                        
                                        {itemsByCategory[activeCategory]?.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {itemsByCategory[activeCategory].map((item) => (
                                                    <div key={item.id} className={`p-4 bg-white rounded-xl border transition-all dark:bg-gray-800 ${
                                                        data.items?.[item.id]?.checked 
                                                            ? 'border-indigo-300 shadow-md dark:border-indigo-500 dark:shadow-indigo-900' 
                                                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                                                    }`}>
                                                        <div className="flex items-start">
                                                            <Checkbox
                                                                id={item.id}
                                                                checked={data.items?.[item.id]?.checked || false}
                                                                onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                                                                className="mt-1 text-indigo-600 focus:ring-indigo-500 dark:text-indigo-400 dark:focus:ring-indigo-300"
                                                            />
                                                            <label htmlFor={item.id} className="ml-3 flex-1">
                                                                <span className={`block font-medium ${
                                                                    data.items?.[item.id]?.checked 
                                                                        ? 'text-indigo-700 dark:text-indigo-300' 
                                                                        : 'text-gray-800 dark:text-gray-200'
                                                                }`}>
                                                                    {item.items}
                                                                </span>
                                                                {(item.category === "battery drone" || 
                                                                 item.category === "tripod lighting" || 
                                                                 item.category === "battery camera") && (
                                                                    <div className="mt-3 flex items-center">
                                                                        <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Quantity: </span>
                                                                        <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">{item.quantity}</span>
                                                                    </div>
                                                                )}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="mt-3 text-lg font-medium">
                                                    {searchTerm 
                                                        ? `No equipment found in "${activeCategory}" matching "${searchTerm}"`
                                                        : `No equipment found in "${activeCategory}"`
                                                    }
                                                </p>
                                                <p className="text-sm mt-1">Try selecting a different category or clearing your search</p>
                                            </div>  
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={selectedItemsCount === 0}
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl font-semibold text-white uppercase tracking-widest hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all ease-in-out duration-150 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed dark:from-indigo-700 dark:to-purple-700 dark:hover:from-indigo-800 dark:hover:to-purple-800 dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Complete Checklist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}