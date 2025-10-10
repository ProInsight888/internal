import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                "inline-flex font-extrabold items-center border-b-2 px-1 pt-1 text-sm leading-5 transition duration-150 ease-in-out focus:outline-none " +
                (active
                    ? "bg-[#1c1c1c] w-32 rounded-lg text-white justify-center"
                    : "border-transparent text-gray-500 hover:border-indigo-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 ") +
                className
            }
        >
            {children}
        </Link>
    );
}
