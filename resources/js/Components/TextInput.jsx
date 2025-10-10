import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export default forwardRef(function TextInput(
    { type = "text", className = "", isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
  {...props}
  type={type}
  ref={localRef}
  className={`w-full px-4 py-2 rounded-[0.5rem] border border-gray-300 
              text-gray-700 placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-black focus:border-black 
              transition duration-200 ease-in-out 
              disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
              ${className}`}
/>

    );
});
