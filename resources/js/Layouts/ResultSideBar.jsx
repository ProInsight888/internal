import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { 
  ChevronDown, 
  Users, 
  Filter, 
  LayoutDashboard, 
  X,
  Circle,
  CheckCircle,
  Clock,
  Slash
} from "lucide-react";

export default function ResultSideBar({ header, children, users, tasks, selectedFilter, setSelectedFilter }) {
  const [activeTeam, setActiveTeam] = useState("media");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { url } = usePage();

  // Determine active team from URL
  useEffect(() => {
    if (url.includes("creative")) setActiveTeam("creative");
    else if (url.includes("marketing")) setActiveTeam("marketing");
    else if (url.includes("it")) setActiveTeam("it");
    else setActiveTeam("media");
  }, [url]);

  // Count tasks by status
  const taskCounts = tasks.reduce(
    (acc, t) => {
      if (t.status === "In Review") acc.inReview++;
      else if (t.status === "Rejected") acc.rejected++;
      else if (t.status === "Approved") acc.approved++;
      else if (t.status === "Cancel") acc.cancel++;
      else acc.all++;
      return acc;
    },
    { all: 0, inReview: 0, rejected: 0, approved: 0, cancel: 0 }
  );

  const teams = [
    { key: "media", label: "Media Team", description: "Editor, Video & Photographer", route: route("media_review.index"), color: "bg-purple-500" },
    { key: "creative", label: "Creative Team", description: "Design", route: route("creative_review.index"), color: "bg-pink-500" },
    { key: "marketing", label: "Marketing Team", description: "Marketing campaigns", route: route("marketing_review.index"), color: "bg-blue-500" },
    { key: "it", label: "IT Team", description: "Technical support", route: route("it_review.index"), color: "bg-green-500" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`relative transition-all duration-300 ease-in-out 
          ${isCollapsed ? "w-20" : "w-64"} 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 bg-white shadow-lg md:shadow-none dark:bg-gray-800 dark:shadow-gray-900/30`}
      >
        <div className="absolute inset-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-90" : "-rotate-90"}`}
            />
          </button>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden absolute top-4 right-4 p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Sidebar Content */}
          <div className="overflow-y-auto h-[calc(100vh-4rem)] py-4">
            {/* Team Navigation */}
            <div className="px-4 mb-6">
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : ""} text-gray-500 mb-3 dark:text-gray-400`}>
                <Users className="h-4 w-4" />
                {!isCollapsed && (
                  <span className="ml-2 text-xs font-semibold uppercase tracking-wider">TEAMS</span>
                )}
              </div>

              {teams.map((team) => (
                <Link
                  key={team.key}
                  href={team.route}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center p-3 rounded-lg mb-2 transition-all duration-200 ${
                    activeTeam === team.key
                      ? "bg-blue-50 text-blue-700 border-l-4 -ml-1 border-blue-500 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className={`flex-shrink-0 h-3 w-3 rounded-full ${team.color}`} />
                  {!isCollapsed && (
                    <div className="ml-3">
                      <div className="text-sm font-medium">{team.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{team.description}</div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-0 transition-margin duration-300">
        <div className="p-6 pt-0">{children}</div>
      </div>
    </div>
  );
}