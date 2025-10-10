import { ExampleCombobox } from "@/Components/Combobox";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Combobox } from "@headlessui/react";
import { Head, router, useForm } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";

export default function edit({ items_select }) {
    const singleItem = Object.values(items_select)[0];
    const { data, setData, put, errors, processing } = useForm({
        //useForm dia bisa dibilang sama kayak useState cuma lebih powerfull, dia bisa isi banyak state, misalnya disini ada state title, description, dan question yang mana kalau pakai usestate harus buat 3 use state

        items: singleItem.name || "",
        // sama aja kayak const [title, setTitle] = useState("Untitled Form")

        category: singleItem.category || "",
        quantity: singleItem.quantity || "",
        // sama aja kayak const [title, setDescription] = useState("")
    });
    const descriptionRef = useRef(null);

    // console.log(data, items_select[0]?.name, items_select)
    const textAreaAdjust = (element) => {
        element.style.height = "1px";
        element.style.height = `${8 + element.scrollHeight}px`;
    };

    // Adjust textarea height on value change
    useEffect(() => {
        if (descriptionRef.current) {
            textAreaAdjust(descriptionRef.current);
        }
    }, [data.description]);


    const formRef = useRef();

    function submit(e) {
        e.preventDefault();
        put(route("items.update", singleItem.id));
    }

    return (
        <AuthenticatedLayout
                    header={
                        <div className="bg-gradient-to-r from-teal-600 to-blue-700 text-white py-10 px-6 rounded-b-2xl shadow-md">
                            <div className="max-w-4xl mx-auto text-center">
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                    Add New Items 🎁
                                </h1>
                                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                                    Expand your inventory with new items to keep your business well-stocked and organized
                                </p>
                            </div>
                        </div>
                    }
                >
                    <Head title="Add New Items" />
        
                    <div className="py-8 bg-gray-50 min-h-screen">
                        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="p-1 bg-gradient-to-r from-teal-500 to-blue-600"></div>
                                
                                <div className="p-8">
                                    <div className="text-2xl font-bold text-gray-800 mb-6">Add New Item</div>
        
                                    <form onSubmit={submit} ref={formRef} className="space-y-6">
                                        {/* Item Name */}
                                        <div>
                                            <InputLabel
                                                htmlFor="items"
                                                value="Item Name"
                                                className="text-lg font-medium text-gray-800 mb-2"
                                            />
                                            <TextInput
                                                type="text"
                                                name="items"
                                                value={data.items}
                                                onChange={(e) => setData("items", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                placeholder="Enter item name"
                                                required
                                            />
                                        </div>
        
                                        {/* Category and Quantity */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Category */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="category"
                                                    value="Item Category"
                                                    className="text-lg font-medium text-gray-800 mb-2"
                                                />
                                                <ExampleCombobox
                                                    name="category"
                                                    value={data.category}
                                                    onChange={(val) => setData("category", val)}
                                                    className="w-full"
                                                />
                                            </div>
                                            
                                            {/* Quantity */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="quantity"
                                                    value="Quantity"
                                                    className="text-lg font-medium text-gray-800 mb-2"
                                                />
                                                <TextInput
                                                    type="text"
                                                    name="quantity"
                                                    value={data.quantity}
                                                    onChange={(e) => setData("quantity", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                    placeholder="Enter quantity"
                                                    required
                                                />
                                            </div>
                                        </div>
        
                                        {/* Submit Button */}
                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-teal-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-70"
                                            >
                                                {processing ? 'Creating Item...' : 'Create Item'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </AuthenticatedLayout>
    );
}
