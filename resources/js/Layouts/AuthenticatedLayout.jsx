import Audit from "@/Components/Audit";
import Dropdown from "@/Components/Dropdown";
import { Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const audits = usePage().props.auth.audit;
    console.log(audits)
    const currentRoute = usePage().url; // Get current route
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [auditExpanded, setAuditExpanded] = useState(false);
    const [closeExpanded, setCloseExpanded] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Update active path when route changes
    useEffect(() => {
        // Set dark mode based on localStorage or system preference
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setDarkMode(true);
        } else if (savedTheme === "light") {
            setDarkMode(false);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setDarkMode(true);
        }
    }, []);

    // Toggle dark mode and update HTML class
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    // Check if a route is active
    const isActiveRoute = (routeName) => {
        // console.log()
        let checkedCurrentRoute = currentRoute;
        // console.log(realRoute)
        if (currentRoute === "/creative") {
            checkedCurrentRoute = "/media";
        } else if (currentRoute === "/marketing") {
            checkedCurrentRoute = "/media";
        } else if (currentRoute === "/it") {
            checkedCurrentRoute = "/media";
        } else if (currentRoute === "/creative_review") {
            checkedCurrentRoute = "/media_review";
        } else if (currentRoute === "/marketing_review") {
            checkedCurrentRoute = "/media_review";
        } else if (currentRoute === "/it_review") {
            checkedCurrentRoute = "/media_review";
        }

        return (
            checkedCurrentRoute === routeName ||
            checkedCurrentRoute.startsWith(routeName + "/")
        );
    };

    // Navigation items
    const navItems = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            routeName: "/dashboard",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            ),
        },
        {
            name: "Media",
            href: route("media.index"),
            routeName: "/media",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
            ),
        },
        {
            name: "Attendance",
            href: route("absen.index"),
            routeName: "/absen",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
        {
            name: "Calendar",
            href: route("calendar.index"),
            routeName: "/calendar",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
        {
            name: "Equipments",
            href: route("items.index"),
            routeName: "/items",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                </svg>
            ),
        },
    ];

    const adminItems = [
        {
            name: "Add Account",
            href: route("add_account.index"),
            routeName: "/add_account",
            icon: (
                <svg
                    className="w-5 h-5"
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
            ),
        },
        {
            name: "New Client",
            href: route("new_client.index"),
            routeName: "/new_client",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            ),
        },
        {
            name: "Submitted Task",
            href: route("media_review.index"),
            routeName: "/media_review",
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {/* Clipboard outline */}
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
       M9 5a2 2 0 002 2h2a2 2 0 002-2
       M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />

                    {/* Checklist mark inside */}
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4"
                    />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Top Navigation Bar */}
            <div className="bg-white dark:bg-gray-800 sticky top-0 shadow-sm z-50 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <img
                                    src="/logo/Logo Pro Insight.png"
                                    className="h-10"
                                    alt="Pro Insight Logo"
                                />
                            </Link>
                        </div>

                        {/* Right side items */}
                        <div className="flex items-center space-x-4">
                            {/* Notification Bell + Toggle Audit */}
                            <div className="relative w-4 aspect-square">
                                <button
                                    onClick={() =>{
                                        setAuditExpanded(!auditExpanded),
                                        setCloseExpanded(true)
                                    }
                                    }
                                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    aria-label="Toggle Audit"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        className="bi bi-bell w-5 h-5 text-gray-700 dark:text-gray-300"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                                    </svg>
                                </button>

                                {/* Show or hide the Audit component */}
                                {auditExpanded && (
                                    <div className="absolute right-0 mt-2 z-50">
                                        <Audit audits={audits} />
                                    </div>
                                )}
                            </div>

                            {/* Dark/Light mode toggle */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Toggle dark mode"
                            >
                                {darkMode ? (
                                    <svg
                                        className="w-5 h-5 text-yellow-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            d="M10 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5 text-gray-700 dark:text-gray-300"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </button>

                            {/* Desktop Profile & Logout */}
                            <div className="hidden lg:flex items-center space-x-4 ">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <div className="flex items-center text-sm rounded-full focus:outline-none cursor-pointer ">
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold mr-2">
                                                {user?.avatar_url ? (
                                                    <img
                                                        src={`/storage/${user.avatar}`}
                                                        alt={user.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-bold">
                                                        {user?.name
                                                            ?.substring(0, 2)
                                                            .toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300 mr-1">
                                                {user.name}
                                            </span>
                                            <svg
                                                className="w-4 h-4 text-gray-700 dark:text-gray-300"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content
                                        align="right"
                                        width="48"
                                        className="dark:bg-gray-700 dark:border-gray-600"
                                    >
                                        {/* <Dropdown.Link href={route("personal_dashboard.index")} className="flex items-center dark:text-gray-300 dark:hover:bg-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile
                                        </Dropdown.Link> */}
                                        <Dropdown.Link
                                            href={route("profile")}
                                            as="button"
                                            className="flex items-center dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600"
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
                                                    strokeWidth={1}
                                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"
                                                />
                                            </svg>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="flex items-center dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600"
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
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            Logout
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        !showingNavigationDropdown
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1">
                {/* Desktop Sidebar */}
                <div className="hidden lg:flex lg:flex-col z-50">
                    <div className="flex flex-col h-[calc(100vh-4rem)] fixed bg-white dark:bg-gray-800 shadow-xl rounded-r-2xl px-4 py-6">
                        {/* Logo and Toggle */}
                        <div className="flex items-center justify-center mb-6 px-2">
                            <button
                                onClick={() =>{
                                    setSidebarExpanded(!sidebarExpanded),
                                    setCloseExpanded(true)
                                ;}
                                }
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                {sidebarExpanded ? (
                                    <svg
                                        className="w-5 h-5 text-gray-700 dark:text-gray-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5 text-gray-700 dark:text-gray-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 space-y-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    href={item.href}
                                    active={isActiveRoute(item.routeName)}
                                    icon={item.icon}
                                    expanded={sidebarExpanded}
                                    darkMode={darkMode}
                                    item_name={item.name}
                                    user_role={user.role}
                                >
                                    {item.name}
                                </NavLink>
                            ))}

                            {user.role === "admin" && (
                                <>
                                    <div className="border-b-[1px] border-black/15 dark:border-gray-600 mx-2 my-4"></div>
                                    {adminItems.map((item) => (
                                        <NavLink
                                            key={item.name}
                                            href={item.href}
                                            active={isActiveRoute(
                                                item.routeName
                                            )}
                                            icon={item.icon}
                                            expanded={sidebarExpanded}
                                            darkMode={darkMode}
                                        >
                                            {item.name}
                                        </NavLink>
                                    ))}
                                </>
                            )}
                        </nav>
                    </div>
                </div>

                {/* Mobile navigation menu */}
                {showingNavigationDropdown && (
                    <div className="lg:hidden bg-white dark:bg-gray-800 shadow-md py-4 px-6 space-y-2">
                        {navItems.map((item) => (
                            <ResponsiveNavLink
                                key={item.name}
                                href={item.href}
                                active={isActiveRoute(item.routeName)}
                                className="flex items-center px-4 py-3 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.name}
                            </ResponsiveNavLink>
                        ))}

                        {user.role === "admin" && (
                            <>
                                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                                {adminItems.map((item) => (
                                    <ResponsiveNavLink
                                        key={item.name}
                                        href={item.href}
                                        active={isActiveRoute(item.routeName)}
                                        className="flex items-center px-4 py-3 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        <span className="mr-3">
                                            {item.icon}
                                        </span>
                                        {item.name}
                                    </ResponsiveNavLink>
                                ))}
                            </>
                        )}

                        {/* Mobile profile and logout */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                            <div className="flex items-center px-4 py-3">
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold mr-3">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {user.email}
                                    </div>
                                </div>
                            </div>

                            {/* <ResponsiveNavLink
                                href={route("personal_dashboard.index")}
                                active={isActiveRoute("/personal_dashboard")}
                                className="flex items-center px-4 py-3 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Profile
                            </ResponsiveNavLink> */}
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                                className="flex items-center px-4 py-3 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <svg
                                    className="w-5 h-5 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                )}

                {/* Main content */}
                <div className="flex-1 overflow-auto lg:p-8 w-full lg:ml-20 max-w-8xl mx-auto px-6 sm:px-8 sm:ml-0">
                    {header && (
                        <header className="mb-6">
                            <div className="mx-auto">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {header}
                                </h2>
                            </div>
                        </header>
                    )}

                    {children}
                </div>
            </div>

            {/* Overlay for expanded sidebar */}
            <div
                className={`w-screen h-screen fixed bg-gray-900/30 ${
                    closeExpanded ? "block" : "hidden" 
                } transition-all z-40`}
                onClick={() => {setSidebarExpanded(false),
                    setAuditExpanded(false),
                    setCloseExpanded(false);
                }}
            ></div>
        </div>
    );
}

// Custom NavLink component for sidebar
function NavLink({
    href,
    active,
    icon,
    expanded,
    children,
    className = "",
    darkMode,
    item_name,
    user_role,
}) {
    return (
        <>
            {((user_role === "intern" && item_name !== "Absensi") ||
                user_role !== "intern") && (
                <Link
                    href={href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        active
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-r-4 border-indigo-600 dark:border-indigo-400"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    } ${className} ${!expanded ? "justify-center" : ""}`}
                >
                    <span className={`opacity-75 ${expanded ? "mr-3" : ""}`}>
                        {icon}
                    </span>
                    {expanded && children}
                </Link>
            )}
        </>
    );
}

// Custom ResponsiveNavLink component
function ResponsiveNavLink({
    href,
    active,
    method,
    as = "a",
    children,
    className = "",
}) {
    return (
        <Link
            href={href}
            method={method}
            as={as}
            className={`flex items-center text-sm font-medium transition-colors duration-200 ${
                active
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            } ${className}`}
        >
            {children}
        </Link>
    );
}
