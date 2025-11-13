"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function ExampleCombobox({ value, onChange, options = [] }) {
    const [open, setOpen] = React.useState(false);

    const formattedOptions = React.useMemo(() => {
        if (!Array.isArray(options)) return [];
        return options
            .filter((opt) => typeof opt === "string" && opt.trim() !== "")
            .map((opt) => ({
                value: opt,
                label: opt.charAt(0).toUpperCase() + opt.slice(1),
            }));
    }, [options]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between dark:bg-gray-700"
                >
                    {value
                        ? formattedOptions.find((opt) => opt.value === value)?.label
                        : "Select category..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
                <Command className="w-full">
                    <CommandInput placeholder="Search categories..." />
                    <CommandList>
                        <CommandEmpty>No categories found.</CommandEmpty>
                        <CommandGroup>
                            {formattedOptions.map((opt) => (
                                <CommandItem
                                    key={opt.value}
                                    value={opt.value}
                                    onSelect={(currentValue) => {
                                        const newValue =
                                            currentValue === value
                                                ? ""
                                                : currentValue;
                                        onChange(newValue);
                                        setOpen(false);
                                    }}
                                >
                                    {opt.label}
                                    {value === opt.value && (
                                        <CheckIcon className="ml-auto h-4 w-4" />
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
