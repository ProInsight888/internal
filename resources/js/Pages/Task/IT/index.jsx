import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
// import TaskSideBar from "@/Layouts/TaskSideBar";
import TaskSideBar from "@/Layouts/TaskSideBar";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";


// Status Badge Component
const StatusBadge = ({ status }) => {
    const statusColors = {
    'On Progress': '#3B82F6', // blue
    'Pending': '#F59E0B',     // amber
    'Approved': '#10B981',    // emerald
    'In Review': '#8B5CF6',   // violet
    'Rejected': '#EF4444',    // red
    'Revision': '#F97316',    // orange
    'Idle': '#6B7280',        // gray
    'Lunas': '#EC4899',       // pink
    'Cici': '#14B8A6',        // teal
  };

    return (
        <div
            className={`${statusColors[status] || "bg-gray-200 text-black"} font-medium py-1.5 px-3 rounded-full text-center text-xs shadow-sm`}
        >
            {status}
        </div>
    );
};

// Priority Badge Component
const PriorityBadge = ({ deadline }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate - today;
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let priority = "";
    let bgColor = "";
    
    if (remainingDays < 0) {
        priority = "Overdue";
        bgColor = "bg-red-100 text-red-800";
    } else if (remainingDays === 0) {
        priority = "Due Today";
        bgColor = "bg-amber-100 text-amber-800";
    } else if (remainingDays <= 3) {
        priority = "High";
        bgColor = "bg-orange-100 text-orange-800";
    } else if (remainingDays <= 7) {
        priority = "Medium";
        bgColor = "bg-yellow-100 text-yellow-800";
    } else {
        priority = "Low";
        bgColor = "bg-green-100 text-green-800";
    }

    return (
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${bgColor}`}>
            {priority}
        </span>
    );
};

// Task Card Component
const TaskCard = ({ task, onOpenDetails, index }) => {
    // Assign different pastel colors based on task status
    // console.log(task, onOpenDetails, index)
    const getCardColor = (status) => {
        const colorMap = {
                'In Review': 'bg-[#8B5CF6]/10 border-[#8B5CF6] shadow-xl',   // violet
            'Rejected': 'bg-[#EF4444]/10 border-[#EF4444] shadow-xl',    // red
                'Approved': 'bg-[#10B981]/10 border-[#10B981] shadow-xl',    // emerald
            "Cancel": "bg-slate-100 border-slate-800",
            'Idle': 'bg-[#d141b7]/10 border-[#d141b7] shadow-xl',        // gray
            'Revision': 'bg-[#F97316]/10 border-[#F97316] shadow-xl',    // orange
                'Pending': 'bg-[#F59E0B]/10 border-[#F59E0B] shadow-xl',     // amber
                'On Progress': 'bg-[#3B82F6]/10 border-[#3B82F6] shadow-xl', // blue
            "default": "bg-purple-100 border-purple-200"
        };
                
        return colorMap[status] || colorMap.default;
    };

    return (
        <div className={`rounded-xl border-2 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1 mb-5 ${getCardColor(task.status)}`}>
            <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <PriorityBadge deadline={task.deadline} />
                    </div>
                    <StatusBadge status={task.status} />
                </div>

                {/* Task Title */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {task.task_title}
                </h3>

                {/* Company and Category */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {task.company}
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {task.category}
                    </span>
                </div>

                {/* Assignee and Format */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <span className="font-medium">{task.penanggung_jawab}</span>
                    <span>{task.task_format}</span>
                </div>

                {/* Deadline */}
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">
                        Deadline: <span className="font-medium text-gray-700">{task.deadline}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <button
                        onClick={() => onOpenDetails(task, index)}
                        className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                    </button>
                    
                    {!["Cancel", "In Review"].includes(task.status) && (
                        <div className="flex space-x-2">
                            <Link
                                href={route("it.edit", task.uuid)}
                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </Link>
                            <button
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this task?")) {
                                        router.delete(route("it.destroy", task.uuid), {
                                            onSuccess: () => alert("Task deleted successfully!"),
                                            onError: (errors) => console.error(errors),
                                        });
                                    }
                                }}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Task Modal Component
const TaskModal = ({ task, isOpen, onClose, data, setData, onSubmit, userName, processing }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-t-2xl text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{task.task_title}</h2>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={task.status} />
                                <span className="text-blue-100">{task.company}</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-blue-200 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Task Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Assignee:</span>
                            <p className="font-medium">{task.penanggung_jawab}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Format:</span>
                            <p className="font-medium">{task.task_format}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Category:</span>
                            <p className="font-medium">{task.category}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Deadline:</span>
                            <p className="font-medium text-red-600">{task.deadline}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                            </svg>
                            Description
                        </h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            {task.description}
                        </p>
                    </div>

                    {/* Revision Notice (if rejected) */}
                    {task.status === "Rejected" && task.rejected_revision?.revision && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="text-red-800 font-semibold mb-2 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                                </svg>
                                Revision Required
                            </h4>
                            <p className="text-red-700">{task.rejected_revision.revision}</p>
                        </div>
                    )}

                    {/* Submission Form */}
                    {task.status !== "Cancel" && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Submit Your Work
                            </h3>
                            
                            {["In Review", "Approved"].includes(task.status) ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-green-800 font-medium">
                                        {task.status === "Approved" ? "Approved" : "Under Review"} - {task?.result_link}
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={onSubmit}>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                            value={data.link}
                                            onChange={(e) => setData("link", e.target.value)}
                                            placeholder="https://example.com/your-work"
                                            required
                                            disabled={!(task.penanggung_jawab??"")?.split(',').map(s => s.trim().toLowerCase()).includes(userName.trim().toLowerCase())}
                                        />
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 disabled:opacity-50"
                                            disabled={processing}
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Submit Task
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Filter Tabs Component


export default function TaskIndex({ tasks, userName, users }) {

    const user = usePage().props.auth.user.name

    const { data, setData, post, put, processing, errors } = useForm({
        uuid: "",
        link: "",
        sended_by: user||'User Name Not Found',
    });

    const [selectedFilter, setSelectedFilter] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [sortDeadline, setSortDeadline] = useState("Desc");
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const successMessage = usePage().props?.flash?.success;

    // Filter and sort tasks
    const filteredTasks = tasks
        .filter(task => {
            const matchesFilter = selectedFilter === "" ? !["Rejected", "Approved", "In Review", "Cancel"].includes(task.status) : task.status === selectedFilter;
            const matchesUser = selectedUser === "" || task.penanggung_jawab === selectedUser;
            const matchesCompany = selectedCompany === "" || task.company === selectedCompany;
            return matchesFilter && matchesUser && matchesCompany;
        })
        .sort((a, b) => {
            const dateA = new Date(a.deadline);
            const dateB = new Date(b.deadline);
            return sortDeadline === "Desc" ? dateA - dateB : dateB - dateA;
        });

    

    // Open task details modal
    const openTaskDetails = (task, index) => {
        setSelectedTask(task);
        setData("uuid", task.uuid);
        setData("link", task.result?.link || "");
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    

    // Submit task
    const submitTask = (e) => {
        e.preventDefault();
            put(route("it_submit.update", {it: data.uuid}), {
                onSuccess: () => window.location.reload(),
                onError: (e) => console.error("PUT error", e),
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <AuthenticatedLayout>
                <Head title="IT Team Task Management" />
                IT Team
                    <TaskSideBar
                        users = {users}
                        tasks = {tasks}
                        selectedFilter = {selectedFilter}
                        setSelectedFilter = {setSelectedFilter}
                    >
                        <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
                            {/* Success Message */}
                            {successMessage && (
                                <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 p-4 rounded-lg border border-green-200 mb-6 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                    </svg>
                                    {successMessage}
                                </div>
                            )}

                            {/* Filters Section */}
                            

                                {/* Add New Task Button */}
                                <div className="flex justify-end mb-6">
                                    <Link
                                        href={route("it.create")}
                                        className="flex items-center justify-center px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add New Task
                                    </Link>
                                </div>

                            {/* Tasks Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {selectedFilter === '' ? (
                                    <>
                                    <div className="col-span-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                            <div className="gap-5 flex-flex-col">
                                                <div className="w-full p-3 pl-0 flex gap-2">
                                                    <div className="h-[1.7rem] bg-[#d141b7] w-2"></div>
                                                    <p className="font-extrabold">Idle</p>
                                                </div>
                                                {filteredTasks.filter(task => task.status === 'Idle').map((task, index) => {
                                                    return(
                                                        <>                                                    
                                                            <TaskCard
                                                                key={task.uuid}
                                                                task={task}
                                                                onOpenDetails={openTaskDetails}
                                                                index={index}
                                                            />
                                                        </>

                                                    )
                                                })}
                                            </div>
                                            <div className="gap-5 flex-flex-col">
                                                <div className="w-full p-3 pl-0 flex gap-2">
                                                    <div className="h-[1.7rem] bg-[#3B82F6] w-2"></div>
                                                    <p className="font-extrabold">On Progress</p>
                                                </div>
                                                {filteredTasks.filter(task => task.status === 'On Progress').map((task, index) => {
                                                    return(
                                                        <TaskCard
                                                            key={task.uuid}
                                                            task={task}
                                                            onOpenDetails={openTaskDetails}
                                                            index={index}
                                                        />
                                                    )
                                                })}
                                            </div>
                                            <div className="gap-5 flex-flex-col">
                                                <div className="w-full p-3 pl-0 flex gap-2">
                                                    <div className="h-[1.7rem] bg-[#F59E0B] w-2"></div>
                                                    <p className="font-extrabold">Pending</p>
                                                </div>
                                                {filteredTasks.filter(task => task.status === 'Pending').map((task, index) => {
                                                    return(
                                                        <TaskCard
                                                            key={task.uuid}
                                                            task={task}
                                                            onOpenDetails={openTaskDetails}
                                                            index={index}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        </div>
                                    </>
                                ):(filteredTasks.map((task, index) => {
                                            return(
                                                <TaskCard
                                                    key={task.uuid}
                                                    task={task}
                                                    onOpenDetails={openTaskDetails}
                                                    index={index}
                                                />
                                            )
                                        }))}
                            </div>

                            {/* Empty State */}
                            {filteredTasks.length === 0 && (
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                                    <p className="text-gray-500 mb-4">Try adjusting your filters or create a new task.</p>
                                    <Link
                                        href={route("it.create")}
                                        className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Create New Task
                                    </Link>
                                </div>
                            )}
                        </div>
                    </TaskSideBar>
                {/* Task Modal */}
                {selectedTask && (
                    <TaskModal
                        task={selectedTask}
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        data={data}
                        userName={userName}
                        setData={setData}
                        onSubmit={submitTask}
                        processing={processing}
                    />
                )}
            </AuthenticatedLayout>
        </div>
    );
}