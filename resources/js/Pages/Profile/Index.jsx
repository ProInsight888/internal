import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ auth }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: auth.user.name || "",
        email: auth.user.email || "",
        avatar: null,
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const [preview, setPreview] = useState(auth.user.avatar_url || null);


    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setData("avatar", file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveAvatar = () => {
        setData("avatar", null);
        setPreview(null);
        // Clear the file input
        const fileInput = document.getElementById("avatar");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("profile.update"), {
            forceFormData: true,
        });
    };



    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-8 text-gray-900 dark:text-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <img
                                        src={
                                            preview ||
                                            "https://ui-avatars.com/api/?name=" +
                                                encodeURIComponent(
                                                    auth.user.name
                                                )
                                        }
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600"
                                    />
                                    <label
                                        htmlFor="avatar"
                                        className="absolute bottom-0 right-0 bg-gray-800 dark:bg-gray-700 text-white px-2 py-1 text-xs rounded cursor-pointer"
                                    >
                                        Change
                                    </label>
                                    <input
                                        id="avatar"
                                        name="avatar"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />

                                    {/* Remove Avatar Button */}
                                    {(preview || auth.user.avatar_url) && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveAvatar}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                            title="Remove avatar"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                                    placeholder="N/A"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email (read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    readOnly
                                    className="mt-1 w-full border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 dark:text-gray-300 rounded-md shadow-sm cursor-not-allowed"
                                />
                            </div>

                            {/* Password Update */}
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    Change Password
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            value={data.current_password}
                                            placeholder="Current Password '123'"
                                            onChange={(e) =>
                                                setData(
                                                    "current_password",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                                        />
                                        {errors.current_password && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.current_password}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={data.new_password}
                                            placeholder="New Password 'Test123'"
                                            onChange={(e) =>
                                                setData(
                                                    "new_password",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                                        />
                                        {errors.new_password && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.new_password}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={
                                                data.new_password_confirmation
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "new_password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50"
                                >
                                    {processing ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
