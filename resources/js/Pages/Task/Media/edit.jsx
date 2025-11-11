import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function edit({
    users,
    task,
    companies,
    task_title,
    task_format,
    description,
}) {
    const { data, setData, put, errors, processing } = useForm({
        task_title: task?.task_title || "",
        description: task?.description || "",
        penanggung_jawab: task?.penanggung_jawab || "",
        task_format: task?.task_format || "",
        status: task?.status || "On Progress",
        company: task?.company || "",
        category: task?.category || "",
        deadline: task?.deadline || "",
    });

    const pj = data.penanggung_jawab;
    const arr = pj
        ? pj.split(",").map((name) => {
              const trimmed = name.trim();
              const match = users.find((u) => u.name === trimmed);
              return match || { id: trimmed, name: trimmed };
          })
        : [];

    const [showOptionTitle, setShowOptionTitle] = useState(false);
    const [showOptionFormat, setShowOptionFormat] = useState(false);
    const [showOptionDescription, setShowOptionDescription] = useState(false);
    const [showOptionCompany, setShowOptionCompany] = useState(false);
    const [responsiblePopUp, setResponsiblePopUp] = useState(false);
    const [searchUser, setSearchUser] = useState("");
    const [selectedUsers, setSelectedUsers] = useState(arr);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const descriptionRef = useRef(null);
    const dropdownRef = useRef(null);
    const formRef = useRef();

    // Filter users based on search input
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchUser.toLowerCase())
    );

    // Handle user selection for responsible persons
    const handleUserSelect = (user) => {
        if (!selectedUsers.some((selected) => selected.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    // Remove selected user
    const removeUser = (userId) => {
        setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
    };

    // Apply selected users to form data
    const applySelectedUsers = () => {
        const dataSelectUser = selectedUsers.map((user) => user.id).join(",");
        setData("penanggung_jawab", dataSelectUser);
        setResponsiblePopUp(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowOptionDescription(false);
                setShowOptionFormat(false);
                setShowOptionTitle(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const textAreaAdjust = (element) => {
        element.style.height = "1px";
        element.style.height = `${3 + element.scrollHeight}px`;
    };

    useEffect(() => {
        if (descriptionRef.current) {
            textAreaAdjust(descriptionRef.current);
        }
    }, [data.description]);

    const descriptionChange = (e) => {
        setData("description", e.target.value);
    };

    const titleChange = (e) => {
        setData("task_title", e.target.value);
        setShowOptionTitle(true);
        setHighlightedIndex(-1);
    };

    const formatChange = (e) => {
        setData("task_format", e.target.value);
    };

    function submit(e) {
        e.preventDefault();

        const dataSelectUser = selectedUsers.map((user) => user.name).join(",");
        setData("penanggung_jawab", dataSelectUser);

        put(route("media.update", { media: task.uuid }), {
            onSuccess: () => {},
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Edit Media Task" />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header Section with Back Button */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {/* Back to Tasks Button */}
                                <Link
                                    href={route("media.index")}
                                    className="inline-flex items-center text-sm font-medium text-white hover:text-blue-100 transition-colors duration-200 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 backdrop-blur-sm border border-white/30"
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
                                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                        />
                                    </svg>
                                    Back to Tasks
                                </Link>
                            </div>
                            <h2 className="text-xl font-bold text-white">
                                Edit Media Task Details
                            </h2>
                            <div className="w-20"></div>{" "}
                            {/* Spacer for balance */}
                        </div>
                    </div>

                    <div className="p-6">
                        <form
                            onSubmit={submit}
                            ref={formRef}
                            className="space-y-6"
                        >
                            {/* Task Title */}
                            <div ref={dropdownRef}>
                                <label
                                    htmlFor="task_title"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Task Title
                                </label>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="task_title"
                                        value={data.task_title}
                                        onChange={titleChange}
                                        id="task_title"
                                        onFocus={() => setShowOptionTitle(true)}
                                        onBlur={() =>
                                            setTimeout(
                                                () => setShowOptionTitle(false),
                                                150
                                            )
                                        }
                                        placeholder="Enter task title"
                                        className="w-full rounded-[0.5rem] text-sm border border-gray-300 dark:border-gray-600 px-4 py-2 
                            focus:ring-0 focus:ring-none focus:border-gray-400 dark:focus:border-gray-500 shadow-sm
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        autoComplete="off"
                                    />

                                    {showOptionTitle &&
                                        data.task_title.length > 0 && (
                                            <div
                                                className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 py-2 max-h-32 rounded-[0.5rem] shadow-lg 
                                overflow-y-auto animate-fadeIn"
                                            >
                                                {task_title
                                                    .filter((option) =>
                                                        option.task_title
                                                            .toLowerCase()
                                                            .includes(
                                                                data.task_title.toLowerCase()
                                                            )
                                                    )
                                                    .map((option, i) => (
                                                        <div
                                                            key={i}
                                                            onMouseDown={(
                                                                e
                                                            ) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setData(
                                                                    "task_title",
                                                                    option.task_title
                                                                );
                                                                setShowOptionTitle(
                                                                    false
                                                                );
                                                            }}
                                                            onMouseEnter={() =>
                                                                setHighlightedIndex(
                                                                    i
                                                                )
                                                            }
                                                            className={`px-6 text-sm py-2 cursor-pointer flex items-center gap-2 transition-colors duration-150  
                                        ${
                                            highlightedIndex === i
                                                ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
                                                : "hover:bg-gray-50 dark:hover:bg-gray-600"
                                        }`}
                                                        >
                                                            {/* Highlight matching text */}
                                                            <span className="text-gray-900 dark:text-white">
                                                                {option.task_title
                                                                    .split(
                                                                        new RegExp(
                                                                            `(${data.task_title})`,
                                                                            "gi"
                                                                        )
                                                                    )
                                                                    .map(
                                                                        (
                                                                            part,
                                                                            index
                                                                        ) =>
                                                                            part.toLowerCase() ===
                                                                            data.task_title.toLowerCase() ? (
                                                                                <span
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="bg-yellow-200 dark:bg-yellow-800 font-medium"
                                                                                >
                                                                                    {
                                                                                        part
                                                                                    }
                                                                                </span>
                                                                            ) : (
                                                                                part
                                                                            )
                                                                    )}
                                                            </span>
                                                        </div>
                                                    ))}

                                                {task_title.filter((option) =>
                                                    option.task_title
                                                        .toLowerCase()
                                                        .includes(
                                                            data.task_title.toLowerCase()
                                                        )
                                                ).length === 0 && (
                                                    <div className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                                        No matching tasks found
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                </div>

                                {errors.task_title && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.task_title}
                                    </p>
                                )}
                            </div>

                            {/* Assignee and Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="penanggung_jawab"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Penanggung Jawab
                                    </label>
                                    <div
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-[0.5rem] cursor-pointer flex items-center flex-wrap gap-2 min-h-[42px] bg-white dark:bg-gray-700"
                                        onClick={() =>
                                            setResponsiblePopUp(true)
                                        }
                                    >
                                        {selectedUsers.length > 0 ? (
                                            selectedUsers.map((user) => (
                                                <span
                                                    key={user.id}
                                                    className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"
                                                >
                                                    {user.name}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeUser(user.id);
                                                        }}
                                                        className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                                    >
                                                        &times;
                                                    </button>
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500 text-sm">
                                                Select Penanggung Jawab
                                            </span>
                                        )}
                                    </div>
                                    {errors.penanggung_jawab && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.penanggung_jawab}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="status"
                                        value="Status"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    />
                                    <div className="relative w-full">
                                        <Select
                                            onValueChange={(value) =>
                                                setData("status", value)
                                            }
                                            value={data.status}
                                        >
                                            <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 rounded-[0.5rem] bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                                <SelectValue
                                                    placeholder="Status"
                                                    className="text-gray-400 dark:text-gray-500"
                                                />
                                            </SelectTrigger>
                                            <SelectContent className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                                                <SelectItem
                                                    value="Idle"
                                                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                                >
                                                    Idle
                                                </SelectItem>
                                                <SelectItem
                                                    value="On Progress"
                                                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                                >
                                                    On Progress
                                                </SelectItem>
                                                <SelectItem
                                                    value="Pending"
                                                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                                >
                                                    Pending
                                                </SelectItem>
                                                <SelectItem
                                                    value="In Review"
                                                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                                >
                                                    In Review
                                                </SelectItem>
                                                <SelectItem
                                                    value="Completed"
                                                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                                >
                                                    Completed
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {errors.status && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Company */}
                            <div>
                                <InputLabel
                                    htmlFor="company"
                                    value="Company"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                />
                                <div className="relative w-full">
                                    <div className="relative">
                                        <TextInput
                                            type="text"
                                            name="company" // Changed from "task_company" to "company" to match your form data
                                            value={data.company}
                                            autoComplete="off"
                                            placeholder="Enter Company Name"
                                            onChange={(e) => {
                                                setData(
                                                    "company",
                                                    e.target.value
                                                );
                                                setShowOptionCompany(true);
                                            }}
                                            onFocus={() =>
                                                setShowOptionCompany(true)
                                            }
                                            onBlur={() =>
                                                setTimeout(
                                                    () =>
                                                        setShowOptionCompany(
                                                            false
                                                        ),
                                                    150
                                                )
                                            }
                                            className="w-full rounded-[0.5rem] text-sm border border-gray-300 dark:border-gray-600 px-4 py-2 
                                                        focus:ring-0 focus:ring-none focus:border-gray-400 dark:focus:border-gray-500 shadow-sm
                                                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        />

                                        {/* Company Dropdown Options */}
                                        {showOptionCompany &&
                                            companies.length > 0 && (
                                                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 py-2 max-h-32 rounded-[0.5rem] shadow-lg overflow-y-auto animate-fadeIn">
                                                    {Array.from(
                                                        new Set(
                                                            companies.map(
                                                                (company) =>
                                                                    company.company_name
                                                            )
                                                        )
                                                    )
                                                        .filter((name) =>
                                                            name
                                                                .toLowerCase()
                                                                .includes(
                                                                    data.company.toLowerCase()
                                                                )
                                                        )
                                                        .map((name, idx) => (
                                                            <div
                                                                key={idx}
                                                                onMouseDown={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    setData(
                                                                        "company",
                                                                        name
                                                                    );
                                                                    setShowOptionCompany(
                                                                        false
                                                                    );
                                                                }}
                                                                className="px-6 text-sm py-2 cursor-pointer flex items-center gap-2 transition-colors duration-150  
                                                                    hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                                                            >
                                                                {/* Highlight matching text */}
                                                                <span className="text-gray-900 dark:text-white">
                                                                    {name
                                                                        .split(
                                                                            new RegExp(
                                                                                `(${data.company})`,
                                                                                "gi"
                                                                            )
                                                                        )
                                                                        .map(
                                                                            (
                                                                                part,
                                                                                index
                                                                            ) =>
                                                                                part.toLowerCase() ===
                                                                                data.company.toLowerCase() ? (
                                                                                    <span
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="bg-yellow-200 dark:bg-yellow-800 font-medium"
                                                                                    >
                                                                                        {
                                                                                            part
                                                                                        }
                                                                                    </span>
                                                                                ) : (
                                                                                    part
                                                                                )
                                                                        )}
                                                                </span>
                                                            </div>
                                                        ))}

                                                    {/* No results message */}
                                                    {Array.from(
                                                        new Set(
                                                            companies.map(
                                                                (company) =>
                                                                    company.company_name
                                                            )
                                                        )
                                                    ).filter((name) =>
                                                        name
                                                            .toLowerCase()
                                                            .includes(
                                                                data.company.toLowerCase()
                                                            )
                                                    ).length === 0 && (
                                                        <div className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                                            No matching
                                                            companies found
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                    </div>

                                    {errors.company && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.company}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Task Format */}
                            <div ref={dropdownRef}>
                                <InputLabel
                                    htmlFor="task_format"
                                    value="Task Format"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                />
                                <div className="relative">
                                    <TextInput
                                        type="text"
                                        name="task_format"
                                        value={data.task_format}
                                        autoComplete="off"
                                        placeholder="Enter task format"
                                        onChange={formatChange}
                                        onFocus={() =>
                                            setShowOptionFormat(true)
                                        }
                                        onBlur={() =>
                                            setTimeout(
                                                () =>
                                                    setShowOptionFormat(false),
                                                150
                                            )
                                        }
                                        className="w-full rounded-[0.5rem] text-sm border border-gray-300 dark:border-gray-600 px-4 py-2 
                                                        focus:ring-0 focus:ring-none focus:border-gray-400 dark:focus:border-gray-500 shadow-sm
                                                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                    {showOptionFormat &&
                                        task_format.length > 0 && (
                                            <div
                                                className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 py-2 max-h-32 rounded-[0.5rem] shadow-lg 
                                                            overflow-y-auto animate-fadeIn"
                                            >
                                                {task_format
                                                    .filter((option) =>
                                                        option.task_format
                                                            .toLowerCase()
                                                            .includes(
                                                                data.task_format.toLowerCase()
                                                            )
                                                    )
                                                    .map((option, i) => (
                                                        <div
                                                            key={i}
                                                            onMouseDown={(
                                                                e
                                                            ) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setData(
                                                                    "task_format",
                                                                    option.task_format
                                                                );
                                                                setShowOptionFormat(
                                                                    false
                                                                );
                                                            }}
                                                            onMouseEnter={() =>
                                                                setHighlightedIndex(
                                                                    i
                                                                )
                                                            }
                                                            className={`px-6 text-sm py-2 cursor-pointer flex items-center gap-2 transition-colors duration-150  
                                                                    ${
                                                                        highlightedIndex ===
                                                                        i
                                                                            ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
                                                                            : "hover:bg-gray-50 dark:hover:bg-gray-600"
                                                                    }`}
                                                        >
                                                            {/* Highlight matching text */}
                                                            <span className="text-gray-900 dark:text-white">
                                                                {option.task_format
                                                                    .split(
                                                                        new RegExp(
                                                                            `(${data.task_format})`,
                                                                            "gi"
                                                                        )
                                                                    )
                                                                    .map(
                                                                        (
                                                                            part,
                                                                            index
                                                                        ) =>
                                                                            part.toLowerCase() ===
                                                                            data.task_format.toLowerCase() ? (
                                                                                <span
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="bg-yellow-200 dark:bg-yellow-800 font-medium"
                                                                                >
                                                                                    {
                                                                                        part
                                                                                    }
                                                                                </span>
                                                                            ) : (
                                                                                part
                                                                            )
                                                                    )}
                                                            </span>
                                                        </div>
                                                    ))}

                                                {/* Show message when no matches found */}
                                                {task_format.filter((option) =>
                                                    option.task_format
                                                        .toLowerCase()
                                                        .includes(
                                                            data.task_format.toLowerCase()
                                                        )
                                                ).length === 0 && (
                                                    <div className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                                        No matching formats
                                                        found
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                </div>
                                {errors.task_format && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.task_format}
                                    </p>
                                )}
                            </div>

                            {/* Category and Deadline */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel
                                        htmlFor="category"
                                        value="Category"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    />
                                    <div className="relative w-full">
                                        <Select
                                            onValueChange={(value) =>
                                                setData("category", value)
                                            }
                                            value={data.category}
                                        >
                                            <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 rounded-[0.5rem] bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                                <SelectValue
                                                    placeholder="Category"
                                                    className="text-gray-400 dark:text-gray-500"
                                                />
                                            </SelectTrigger>
                                            <SelectContent className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                                                <SelectItem
                                                    value="Monthly"
                                                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                                >
                                                    📅 Monthly
                                                </SelectItem>
                                                <SelectItem
                                                    value="By Request"
                                                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                                >
                                                    📝 By Request
                                                </SelectItem>
                                                <SelectItem
                                                    value="Urgent"
                                                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                                >
                                                    ⚡ Urgent
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {errors.category && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.category}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="deadline"
                                        value="Deadline"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    />
                                    <TextInput
                                        name="deadline"
                                        type="date"
                                        value={data.deadline}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        onChange={(e) =>
                                            setData("deadline", e.target.value)
                                        }
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                    {errors.deadline && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.deadline}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div ref={dropdownRef}>
                                <InputLabel
                                    htmlFor="description"
                                    value="Description"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                />
                                <div className="relative">
                                    <textarea
                                        ref={descriptionRef}
                                        value={data.description}
                                        onChange={descriptionChange}
                                        id="description"
                                        name="description"
                                        placeholder="Enter task description"
                                        onFocus={() =>
                                            setShowOptionDescription(true)
                                        }
                                        onBlur={() =>
                                            setShowOptionDescription(false)
                                        }
                                        className="w-full rounded-[0.5rem] text-sm border border-gray-300 dark:border-gray-600 px-4 py-2 
                                                                                                            focus:ring-0 focus:ring-none focus:border-gray-400 dark:focus:border-gray-500 shadow-sm
                                                                                                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                                        rows={4}
                                    />
                                    {showOptionDescription &&
                                        description.length > 0 && (
                                            <div
                                                className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 py-2 max-h-32 rounded-[0.5rem] shadow-lg 
                                                                                                                overflow-y-auto animate-fadeIn"
                                            >
                                                {description
                                                    .filter((option) =>
                                                        option.description
                                                            .toLowerCase()
                                                            .includes(
                                                                data.description.toLowerCase()
                                                            )
                                                    )
                                                    .map((option, i) => (
                                                        <div
                                                            key={i}
                                                            onMouseDown={(
                                                                e
                                                            ) => {
                                                                e.stopPropagation();
                                                                setData(
                                                                    "description",
                                                                    option.description
                                                                );
                                                                setShowOptionDescription(
                                                                    false
                                                                );
                                                            }}
                                                            onMouseEnter={() =>
                                                                setHighlightedIndex(
                                                                    i
                                                                )
                                                            }
                                                            className={`px-6 text-sm py-2 cursor-pointer flex items-center gap-2 transition-colors duration-150  
                                                                                                                        ${
                                                                                                                            highlightedIndex ===
                                                                                                                            i
                                                                                                                                ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
                                                                                                                                : "hover:bg-gray-50 dark:hover:bg-gray-600"
                                                                                                                        }`}
                                                        >
                                                            <span className="truncate text-gray-900 dark:text-white">
                                                                {
                                                                    option.description
                                                                }
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                </div>
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50 flex items-center"
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
                                            Updating Task...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
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
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            Update Media Task
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Responsible User Selection Modal */}
            {responsiblePopUp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-opacity-70">
                    <div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                Select Responsible Users
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                You can select multiple users
                            </p>

                            <div className="mt-4 relative">
                                <input
                                    type="text"
                                    value={searchUser}
                                    onChange={(e) =>
                                        setSearchUser(e.target.value)
                                    }
                                    placeholder="Search users..."
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 max-h-72">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                                            selectedUsers.some(
                                                (selected) =>
                                                    selected.id === user.id
                                            )
                                                ? "bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700"
                                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {user.email}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                    No users found
                                </p>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                            <div className="flex flex-wrap gap-2">
                                {selectedUsers.map((user) => (
                                    <span
                                        key={user.id}
                                        className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"
                                    >
                                        {user.name}
                                        <button
                                            type="button"
                                            onClick={() => removeUser(user.id)}
                                            className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setResponsiblePopUp(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={applySelectedUsers}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Apply Selection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
