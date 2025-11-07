import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Fragment, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const UserFormField = ({
    label,
    id,
    type = "text",
    value,
    onChange,
    error,
    as = "input",
    options,
    placeholder = "",
    helpText = "",
}) => {
    const InputComponent = as === "input" ? TextInput : "select";

    return (
        <div className="mb-5">
            <InputLabel
                htmlFor={id}
                value={label}
                className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
            />
            {as === "input" ? (
                <TextInput
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    className={`w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                        error ? "border-red-500 dark:border-red-400" : ""
                    }`}
                    placeholder={placeholder}
                />
            ) : (
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-full border-gray-300 rounded-[0.5rem] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        {options?.map((option, index) => (
                            <SelectItem
                                key={index}
                                value={option.value}
                                className="dark:focus:bg-gray-600 dark:text-white"
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {helpText && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {helpText}
                </p>
            )}
            <InputError
                message={error}
                className="mt-1 text-sm dark:text-red-400"
            />
        </div>
    );
};

const UserRegistrationForm = ({ onSubmit, processing, ...formProps }) => {
    const roleOptions = [
        { value: "admin", label: "Admin - Full access to all features" },
        { value: "leader", label: "Leader - Some Limited access" },
        { value: "member", label: "Member - Standard user access" },
    ];

    const teamOptions = [
        { value: "media", label: "Media Team" },
        { value: "creative", label: "Creative Team" },
        { value: "marketing", label: "Marketing" },
        { value: "it", label: "IT Team" },
    ];

    const { auth } = usePage().props;
    const [preview, setPreview] = useState(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        console.log(formProps, file)
        formProps.setData("avatar", file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    console.log(formProps.data)

    const handleRemoveAvatar = () => {
        formProps.setData("avatar", null);
        setPreview(null);
        const fileInput = document.getElementById("avatar");
        if (fileInput) fileInput.value = "";
    };

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="bg-blue-50 p-4 rounded-lg mb-4 dark:bg-blue-900/20 dark:border dark:border-blue-800/30">
                <h3 className="font-medium text-blue-800 dark:text-blue-300">
                    Create New User Account
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                    Fill in the details below to add a new team member
                </p>
            </div>

            {/* Profile Picture */}
            <div className="flex flex-col items-center">
                <div className="relative">
                    <img
                        src={
                            preview || "https://ui-avatars.com/api/?name=+"
                        }
                        alt="Profile"
                        className={`w-32 h-32 rounded-full object-cover border-4 ${
                            preview
                                ? "border-gray-300 dark:border-gray-600"
                                : "border-dashed border-gray-400 opacity-50"
                        }`}
                    />

                    <label
                        htmlFor="avatar"
                        className="absolute bottom-0 right-0 bg-gray-800 dark:bg-gray-700 text-white px-2 py-1 text-xs rounded cursor-pointer"
                    >
                        {preview ? "Change" : "Upload"}
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
                    {preview && (
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

                {/* Optional helper text */}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Upload a profile picture (optional)
                </p>
            </div>

            <UserFormField
                label="Full Name"
                id="name"
                value={formProps.data.name}
                onChange={(e) => formProps.setData("name", e.target.value)}
                error={formProps.errors.name}
                placeholder="Enter the user's full name"
            />

            <UserFormField
                label="User Team"
                id="team"
                value={formProps.data.team}
                onChange={(value) => formProps.setData("team", value)}
                error={formProps.errors.team}
                as="select"
                options={teamOptions}
                placeholder="Select Team"
                helpText="Select the appropriate access level for this user"
            />

            <UserFormField
                label="User Role"
                id="role"
                value={formProps.data.role}
                onChange={(value) => formProps.setData("role", value)}
                error={formProps.errors.role}
                as="select"
                options={roleOptions}
                placeholder="Select Role"
                helpText="Select the appropriate access level for this user"
            />

            <UserFormField
                label="Email Address"
                id="email"
                type="email"
                autoComplete="new-email"
                value={formProps.data.email}
                onChange={(e) => formProps.setData("email", e.target.value)}
                error={formProps.errors.email}
                placeholder="user@company.com"
                helpText="This will be used for login and notifications"
            />

            <UserFormField
                label="Password"
                id="password"
                type="password"
                autoComplete="new-password"
                value={formProps.data.password}
                onChange={(e) => formProps.setData("password", e.target.value)}
                error={formProps.errors.password}
                placeholder="Create a secure password"
                helpText="Minimum 8 characters with letters and numbers"
            />

            <UserFormField
                label="Confirm Password"
                id="password_confirmation"
                type="password"
                value={formProps.data.password_confirmation}
                onChange={(e) =>
                    formProps.setData("password_confirmation", e.target.value)
                }
                error={formProps.errors.password_confirmation}
                placeholder="Re-enter the password"
            />

            <div className="flex justify-end pt-4">
                <PrimaryButton
                    type="submit"
                    disabled={processing}
                    className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-medium py-2.5 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50 dark:from-blue-700 dark:to-purple-800 dark:hover:from-blue-800 dark:hover:to-purple-900"
                >
                    {processing ? (
                        <span className="flex items-center">
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Creating Account...
                        </span>
                    ) : (
                        <span className="flex items-center">
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
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            Create User Account
                        </span>
                    )}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default function edit({ user }) {
    const user_edit = usePage().props.auth.user;
    const { data, setData, put, errors, processing } = useForm({
        name: user?.name || "",
        role: user?.role || "",
        team: user?.team || "",
        email: user?.email || "",
        password: "",
        password_confirmation: "",
        created_by: user_create.name,
        avatar: user?.avatar || null,
    });


    const submit = (e) => {
        e.preventDefault();

        router.post(route("add_account.update", user.id), {
            _method: "put",
            forceFormData: true,
            ...data,
            // onSuccess: () => form.reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="text-center py-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg dark:from-indigo-800 dark:to-purple-900">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Update An Account ✏️
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                        Edit {user?.name}'s account details and permissions
                    </p>
                </div>
            }
        >
            <Head title={`Edit ${user?.name}'s Account`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/30">
                        <div className="p-6 md:p-8">
                            <div className="mb-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 dark:from-indigo-900/20 dark:to-purple-900/20 dark:border-indigo-800">
                                <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">
                                    Editing: {user?.name}
                                </h2>
                                <p className="text-indigo-600 mt-1 dark:text-indigo-400">
                                    Update account details below
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                                        Role: {user?.role}
                                    </span>
                                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
                                        Team: {user?.team}
                                    </span>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                        Email: {user?.email}
                                    </span>
                                </div>
                            </div>

                            <UserRegistrationForm
                                onSubmit={submit}
                                processing={processing}
                                data={data}
                                setData={setData}
                                errors={errors}
                            />

                            {/* Additional Actions */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Quick Actions
                                        </h4>
                                        <div className="flex gap-2">
                                            <Link
                                                href={route(
                                                    "add_account.index"
                                                )}
                                                className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
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
                                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                                    />
                                                </svg>
                                                Back to Users
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Last updated:{" "}
                                        {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
