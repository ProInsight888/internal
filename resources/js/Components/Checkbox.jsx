export default function Checkbox({ className = "", ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                "rounded w-7 h-7 border-gray-300 text-gray-800 shadow-sm focus:ring-gray-800 " +
                className
            }
        />
    );
}
