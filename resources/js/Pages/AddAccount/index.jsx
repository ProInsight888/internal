import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";

// ======================
// Reusable Components
// ======================

const ActionButton = ({ onClick, children, className = "", title = "" }) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 dark:hover:bg-gray-700 ${className}`}
        aria-label={title}
        title={title}
    >
        {children}
    </button>
);

const DropdownItem = ({ onClick, children, className = "", icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full text-left px-4 py-2.5 text-sm ${className} hover:bg-gray-50 transition-colors duration-150 rounded-md dark:hover:bg-gray-600`}
    >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
    </button>
);

// Team Badge Component
const TeamBadge = ({ team }) => {
    const getTeamBadgeColor = (team) => {
        switch (team?.toLowerCase()) {
            case 'media':
                return 'bg-gradient-to-r from-purple-500 to-pink-600 text-white dark:from-purple-600 dark:to-pink-700';
            case 'creative':
                return 'bg-gradient-to-r from-orange-500 to-red-600 text-white dark:from-orange-600 dark:to-red-700';
            case 'marketing':
                return 'bg-gradient-to-r from-green-500 to-teal-600 text-white dark:from-green-600 dark:to-teal-700';
            case 'it':
                return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white dark:from-blue-600 dark:to-indigo-700';
            default:
                return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
        }
    };

    const getTeamDisplayName = (team) => {
        switch (team?.toLowerCase()) {
            case 'media':
                return 'Media Team';
            case 'creative':
                return 'Creative Team';
            case 'marketing':
                return 'Marketing';
            case 'it':
                return 'IT Team';
            default:
                return team || 'No Team';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTeamBadgeColor(team)}`}>
            {getTeamDisplayName(team)}
        </span>
    );
};

const UserTableRow = ({
    user,
    index,
    openDropdownIndex,
    setOpenDropdownIndex,
}) => {
    const isOpen = openDropdownIndex === index;

    const getRoleBadgeColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'bg-gradient-to-r from-red-500 to-pink-600 text-white dark:from-red-600 dark:to-pink-700';
            case 'member':
                return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white dark:from-blue-600 dark:to-cyan-700';
            case 'intern':
                return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white dark:from-green-600 dark:to-emerald-700';
            default:
                return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
        }
    };

    return (
        <tr key={user.id} className="hover:bg-blue-50 transition-colors duration-150 even:bg-gray-50/50 dark:hover:bg-blue-900/20 dark:even:bg-gray-800/50">
            <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{index + 1}</td>
            <td className="px-4 py-3">
                <div className="flex items-center">
                    <div>
                        <span className="font-semibold block text-gray-900 dark:text-gray-100">{user.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">email: {user.email}</span>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                    {user.role?.toLowerCase() || 'No role'}
                </span>
            </td>
            <td className="px-4 py-3">
                <TeamBadge team={user.team} />
            </td>
            <td className="px-4 py-3">
                <div className="flex space-x-2">
                    {/* Edit Button */}
                    <Link
                        href={route("add_account.edit", { user: user.id })}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30"
                        title="Edit User"
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
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </Link>

                    {/* Delete Button */}
                    <button
                        onClick={() => {
                            if (
                                confirm(
                                    `Are you sure you want to delete ${user.name}? This action cannot be undone.`
                                )
                            ) {
                                router.delete(
                                    route("add_account.destroy", {
                                        user: user.id,
                                    }),
                                );
                            }
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/30"
                        title="Delete User"
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
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    );
};

const UserListTable = ({ users, searchTerm, setSearchTerm, filterRole, setFilterRole, filterTeam, setFilterTeam }) => {
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    
    // Filter users based on search term, role filter, and team filter
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role?.toLowerCase() === filterRole;
        const matchesTeam = filterTeam === 'all' || user.team?.toLowerCase() === filterTeam;
        return matchesSearch && matchesRole && matchesTeam;
    });

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden dark:bg-gray-800 dark:shadow-gray-900/30">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-200">User List</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                        />
                    </div>
                    
                    {/* Role Filter */}
                    <div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                            <option value="intern">Intern</option>
                        </select>
                    </div>

                    {/* Team Filter */}
                    <div>
                        <select
                            value={filterTeam}
                            onChange={(e) => setFilterTeam(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                        >
                            <option value="all">All Teams</option>
                            <option value="media">Media Team</option>
                            <option value="creative">Creative Team</option>
                            <option value="marketing">Marketing</option>
                            <option value="it">IT Team</option>
                        </select>
                    </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-full font-semibold shadow-sm mr-2 dark:bg-gray-700 dark:text-blue-400">
                        {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
                    </span>
                    {searchTerm && (
                        <span className="text-gray-500 dark:text-gray-400">
                            matching "{searchTerm}"
                        </span>
                    )}
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                                No
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                                User
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                                Role
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                                Team
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {filteredUsers.map((user, index) => (
                            <UserTableRow
                                key={user.id}
                                user={user}
                                index={index}
                                openDropdownIndex={openDropdownIndex}
                                setOpenDropdownIndex={setOpenDropdownIndex}
                            />
                        ))}
                    </tbody>
                </table>
                
                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-700 mb-2 dark:text-gray-300">No users found</h3>
                        <p className="text-gray-500 mb-4 dark:text-gray-400">Try adjusting your search or filter criteria</p>
                        <button 
                            onClick={() => { setSearchTerm(''); setFilterRole('all'); setFilterTeam('all'); }}
                            className="text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const UserFormField = ({
    label,
    id,
    type = "text",
    value,
    onChange,
    error,
    required = true,
    as = "input",
    options,
    placeholder = "",
    helpText = ""
}) => {
    const InputComponent = as === "input" ? TextInput : "select";
    
    return (
        <div className="mb-5">
            <InputLabel htmlFor={id} value={label} className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300" />
            {as === "input" ? (
                <TextInput
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    className={`w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                        error ? "border-red-500 dark:border-red-400" : ""
                    }`}
                    required={required}
                    placeholder={placeholder}
                />
            ) : (
                <Select
                    value={value}
                    onValueChange={onChange}
                >
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
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
            )}
            <InputError message={error} className="mt-1 text-sm dark:text-red-400" />
        </div>
    );
};

const UserRegistrationForm = ({ onSubmit, processing, ...formProps }) => {
    const roleOptions = [
        { value: "admin", label: "Admin - Full access to all features" },
        { value: "member", label: "Member - Standard user access" },
        { value: "intern", label: "Intern - Limited access" },
    ];
    const teamOptions = [
        { value: "media", label: "Media Team - Editor, Video & Photographer" },
        { value: "creative", label: "Creative Team - Design" },
        { value: "marketing", label: "Marketing" },
        { value: "it", label: "IT Team" },
    ];

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="bg-blue-50 p-4 rounded-lg mb-4 dark:bg-blue-900/20 dark:border dark:border-blue-800/30">
                <h3 className="font-medium text-blue-800 dark:text-blue-300">Create New User Account</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">Fill in the details below to add a new team member</p>
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
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                        </span>
                    ) : (
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create User Account
                        </span>
                    )}
                </PrimaryButton>
            </div>
        </form>
    );
};

const AlertMessage = ({ type, message, onDismiss }) => {
    const styles = {
        success: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-300 dark:border-green-800/30",
        error: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200 dark:from-red-900/20 dark:to-rose-900/20 dark:text-red-300 dark:border-red-800/30",
        warning: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200 dark:from-yellow-900/20 dark:to-amber-900/20 dark:text-yellow-300 dark:border-yellow-800/30",
        info: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200 dark:from-blue-900/20 dark:to-cyan-900/20 dark:text-blue-300 dark:border-blue-800/30",
    };

    const icons = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️",
    };

    return (
        <div className={`${styles[type]} p-4 rounded-lg mb-4 flex items-center justify-between`}>
            <div className="flex items-center">
                <span className="mr-3 text-lg">{icons[type]}</span>
                <span className="font-medium">{message}</span>
            </div>
            {onDismiss && (
                <button onClick={onDismiss} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

// ======================
// Main Component
// ======================

export default function UserManagement({ users, userName }) {
    const form = useForm({
        name: "",
        role: "",
        team: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterTeam, setFilterTeam] = useState("all");
    const [dismissedAlerts, setDismissedAlerts] = useState([]);

    const submit = (e) => {
        e.preventDefault();
        form.post(route("add_account.store"), {
            onSuccess: () => form.reset(),
        });
    };

    const { flash } = usePage().props;
    const { success: accountAdded, deleted: deleteMessage } = flash ?? {};
    
    const dismissAlert = (type) => {
        setDismissedAlerts([...dismissedAlerts, type]);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg dark:from-blue-800 dark:to-purple-900">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                        User Management
                    </h1>
                    <p className="text-lg opacity-90">
                        Manage your team members and their access levels
                    </p>
                </div>
            }
        >
            <Head title="User Management" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Alert Messages */}
                    <div className="mb-6">
                        {accountAdded && !dismissedAlerts.includes('success') && (
                            <AlertMessage
                                type="success"
                                message={accountAdded}
                                onDismiss={() => dismissAlert('success')}
                            />
                        )}
                        {deleteMessage && !dismissedAlerts.includes('error') && (
                            <AlertMessage
                                type="error"
                                message={deleteMessage}
                                onDismiss={() => dismissAlert('error')}
                            />
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* User List Section */}
                        <div className="lg:col-span-1">
                            <UserListTable 
                                users={users} 
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                filterRole={filterRole}
                                setFilterRole={setFilterRole}
                                filterTeam={filterTeam}
                                setFilterTeam={setFilterTeam}
                            />
                        </div>

                        {/* Add New User Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full dark:bg-gray-800 dark:shadow-gray-900/30">
                                <div className="p-6">
                                    <UserRegistrationForm
                                        onSubmit={submit}
                                        processing={form.processing}
                                        data={form.data}
                                        setData={form.setData}
                                        errors={form.errors}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}