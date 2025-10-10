import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Create({
    users,
    companies,
    task_title,
    task_format,
    description,
}) {
    const { data, setData, post, errors, processing } = useForm({
        task_title: "",
        description: "",
        penanggung_jawab: '',
        task_format: "",
        status: "Idle",
        company: "",
        category: "Monthly",
        deadline: new Date().toISOString().split('T')[0],
    });


    const [showOptionTitle, setShowOptionTitle] = useState(false);
    const [showOptionFormat, setShowOptionFormat] = useState(false);
    const [showOptionDescription, setShowOptionDescription] = useState(false);
    const [responsiblePopUp, setResponsiblePopUp] = useState(false);
    const [searchUser, setSearchUser] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [selectedUsers, setSelectedUsers] = useState([]);
    

    const descriptionRef = useRef(null);
    const dropdownRef = useRef(null);
    const formRef = useRef();

    // Filter users based on search input
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchUser.toLowerCase())
    );

    // Handle user selection for responsible persons
    const handleUserSelect = (user) => {
        if (!selectedUsers.some(selected => selected.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    // Remove selected user
    const removeUser = (userId) => {
        setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
    };

    // Apply selected users to form data
    const applySelectedUsers = () => {
        const dataSelectUser = selectedUsers.map(user => user.name).join(",");
        setData("penanggung_jawab", dataSelectUser);
        setResponsiblePopUp(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // console.log(event)
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

    console.log(data)

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
        post(route("it.store"));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Create Task" />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 border-b  border-gray-200">
                        <h2 className="text-xl font-bold text-white">Create New IT Task</h2>
                    </div>
                    
                    <div className="p-6">
                        <form onSubmit={submit} ref={formRef} className="space-y-6">
                            {/* Task Title */}
                                <div ref={dropdownRef}>
                                    <label
                                        htmlFor="task_title"
                                        className="block text-sm font-medium text-gray-700 mb-2"
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
                                        placeholder="Enter task title"
                                        className="w-full rounded-[0.5rem] text-sm border border-gray-300 px-4 py-2 
                                                    focus:ring-0 focus:ring-none focus:border-gray-400 shadow-sm"
                                        autoComplete='off'
                                        />

                                        {showOptionTitle && task_title.length > 0 && (
                                        <div className="absolute z-10 mt-1 w-full bg-white border py-2 max-h-32 border-gray-200 rounded-[0.5rem] shadow-lg 
                                                        overflow-y-auto animate-fadeIn">
                                            {task_title.map((option, i) => (
                                                <div
                                                    key={i}
                                                    onMouseDown={(e) => {
                                                    e.stopPropagation();
                                                    setData("task_title", option.task_title);
                                                    setShowOptionTitle(false);
                                                    }}
                                                    onMouseEnter={() => setHighlightedIndex(i)}
                                                    className={`px-6 text-sm py-2 cursor-pointer flex items-center gap-2 transition-colors duration-150  
                                                                ${highlightedIndex === i ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                                                >
                                                    <span className="truncate">{option.task_title}</span>
                                                </div>
                                                ))}
                                        </div>
                                        )}
                                    </div>

                                    {errors.task_title && (
                                        <p className="text-red-500 text-sm mt-1">{errors.task_title}</p>
                                    )}
                                </div>
                            

                            {/* Assignee and Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div
                                        htmlFor="penanggung_jawab"
                                        className="block text-sm text-gray-700 mb-2"
                                        value="Penanggung Jawab"
                                    />
                                    <InputLabel
                                        htmlFor="penanggung_jawab"
                                        value="Penanggung Jawab"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    />
                                    <div 
                                        className="w-full p-2 border border-gray-300 rounded-[0.5rem] cursor-pointer flex items-center flex-wrap gap-2"
                                        onClick={() => setResponsiblePopUp(true)}
                                    >
                                        {selectedUsers.length > 0 ? (
                                            selectedUsers.map(user => (
                                                <span 
                                                    key={user.id} 
                                                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"
                                                >
                                                    {user.name}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeUser(user.id);
                                                        }}
                                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                                    >
                                                        &times;
                                                    </button>
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-sm">Select Penanggung Jawab</span>
                                        )}
                                    </div>
                                    {errors.penanggung_jawab && <p className="text-red-500 text-sm mt-1">{errors.penanggung_jawab}</p>}
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="status"
                                        value="Status"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    />
                                    <div className="relative w-full">
                                        <Select
                                            onValueChange={(value) => setData('status', value)}
                                            value={data.status}>
                                            <SelectTrigger className="w-full border-gray-300 rounded-[0.5rem]">
                                                <SelectValue placeholder="Status" className="text-gray-400"/>
                                            </SelectTrigger>
                                            <SelectContent className="border-gray-300">
                                                <SelectItem value="Idle">Idle</SelectItem>
                                                <SelectItem value="On Progress">On Progress</SelectItem>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="In Review">In Review</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>


                                        {/* Custom dropdown icon */}

                                        {errors.category && (
                                            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Company */}
                            <div>
                                <InputLabel
                                    htmlFor="company"
                                    value="Company"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                />  
                                <div className="relative w-full">
                                        <Select 
                                            onValueChange={(value) => setData("company", value)} 
                                            value={data.company} // keep it controlled
                                            >
                                            <SelectTrigger className="w-full border-gray-300 rounded-[0.5rem]">
                                                <SelectValue placeholder="Category" className="text-gray-400" />
                                            </SelectTrigger>
                                            <SelectContent className="border-gray-300">
                                                {Array.from(new Set(companies.map(company => company.company_name))).map((name, idx) => (
                                                <SelectItem key={idx} value={name}>
                                                    {name}
                                                </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>



                                        {/* Custom dropdown icon */}

                                        {errors.category && (
                                            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                                        )}
                                    </div>
                            </div>

                            {/* Task Format */}
                            <div ref={dropdownRef}>
                                <InputLabel
                                    htmlFor="task_format"
                                    value="Task Format"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                />
                                <div className="relative">
                                    <TextInput
                                        type="text"
                                        name="task_format"
                                        value={data.task_format}
                                        autoComplete="off"
                                        placeholder="Enter task format"
                                        onChange={formatChange}
                                        onFocus={() => setShowOptionFormat(true)}
                                        className="w-full rounded-[0.5rem] text-sm border border-gray-300 px-4 py-2 
                                                    focus:ring-0 focus:ring-none focus:border-gray-400 shadow-sm"
                                    />
                                    {showOptionFormat && task_format.length > 0 && (
                                        <div className="absolute z-10 mt-1 w-full bg-white border py-2 max-h-32 border-gray-200 rounded-[0.5rem] shadow-lg 
                                                        overflow-y-auto animate-fadeIn">
                                            {task_format.map((option, i) => (
                                                <div
                                                    key={i}
                                                    onMouseDown={() => {
                                                        setData("task_format", option.task_format);
                                                        setShowOptionFormat(false);
                                                    }}
                                                    className={`px-6 text-sm py-2 cursor-pointer flex items-center gap-2 transition-colors duration-150  
                                                                ${highlightedIndex === i ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                                                >
                                                    {option.task_format}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors.task_format && <p className="text-red-500 text-sm mt-1">{errors.task_format}</p>}
                            </div>

                            {/* Category and Deadline */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel
                                        htmlFor="category"
                                        value="Category"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    />
                                    <div className="relative w-full">
                                        <Select>
                                            <SelectTrigger className="w-full border-gray-300 rounded-[0.5rem]">
                                                <SelectValue placeholder="Category" className="text-gray-400"/>
                                            </SelectTrigger>
                                            <SelectContent className="border-gray-300">
                                                <SelectItem value="Monthly">📅 Monthly</SelectItem>
                                                <SelectItem value="By Request">📝 By Request</SelectItem>
                                                <SelectItem value="Urgent">⚡ Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>


                                        {/* Custom dropdown icon */}

                                        {errors.category && (
                                            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="deadline"
                                        value="Deadline"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    />
                                    <TextInput
                                        name="deadline"
                                        type="date"
                                        value={data.deadline}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setData("deadline", e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                    />
                                    {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div ref={dropdownRef}>
                                <InputLabel
                                    htmlFor="description"
                                    value="Description"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                />
                                <div className="relative">
                                    <textarea
                                        ref={descriptionRef}
                                        value={data.description}
                                        onChange={descriptionChange}
                                        id="description"
                                        name="description"
                                        placeholder="Enter task description"
                                        onFocus={() => setShowOptionDescription(true)}
                                        className="w-full rounded-[0.5rem] text-sm border border-gray-300 px-4 py-2 
                                                    focus:ring-0 focus:ring-none focus:border-gray-400 shadow-sm"
                                        rows={4}
                                    />
                                    {showOptionDescription && description.length > 0 && (
                                        <div className="absolute z-10 mt-1 w-full bg-white border py-2 max-h-32 border-gray-200 rounded-[0.5rem] shadow-lg 
                                                        overflow-y-auto animate-fadeIn">
                                                {description.map((option, i) => (
                                                <div
                                                    key={i}
                                                    onMouseDown={(e) => {
                                                    e.stopPropagation();
                                                    setData("description", option.description);
                                                    setShowOptionDescription(false);
                                                    }}
                                                    onMouseEnter={() => setHighlightedIndex(i)}
                                                    className={`px-6 text-sm py-2 cursor-pointer flex items-center gap-2 transition-colors duration-150  
                                                                ${highlightedIndex === i ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                                                >
                                                    <span className="truncate">{option.description}</span>
                                                </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Task...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Create IT Task
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div 
                        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">Select Responsible Users</h3>
                            <p className="text-gray-500 text-sm">You can select multiple users</p>
                            
                            <div className="mt-4 relative">
                                <input 
                                    type="text" 
                                    value={searchUser}
                                    onChange={(e) => setSearchUser(e.target.value)}
                                    placeholder="Search users..."
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black "
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 max-h-72">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <div 
                                        key={user.id} 
                                        className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${selectedUsers.some(selected => selected.id === user.id) ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-100'}`}
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No users found</p>
                            )}
                        </div>
                        
                        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                            <div className="flex flex-wrap gap-2">
                                {selectedUsers.map(user => (
                                    <span 
                                        key={user.id} 
                                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"
                                    >
                                        {user.name}
                                        <button 
                                            type="button"
                                            onClick={() => removeUser(user.id)}
                                            className="ml-1 text-blue-600 hover:text-blue-800"
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
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button"
                                    onClick={applySelectedUsers}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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