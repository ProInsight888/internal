export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-gray-300 dark:bg-gray-900 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-black dark:text-white transition duration-150 ease-in-out dark:hover:bg-gray-700 focus:bg-green-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 active:bg-gray-900${
                    disabled && "opacity-25"
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
