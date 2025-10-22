"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
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

const frameworks = [
    {
        value: "camera",
        label: "Camera",
    },
    {
        value: "lensa",
        label: "Lensa",
    },
    {
        value: "audio",
        label: "Audio",
    },
    {
        value: "cable audio",
        label: "Cable Audio",
    },
    {
        value: "card",
        label: "Card",
    },
    {
        value: "gimbal",
        label: "Gimbal",
    },
    {
        value: "drone",
        label: "Drone",
    },
    {
        value: "lighting",
        label: "Lighting",
    },
    {
        value: "tripod",
        label: "Tripod",
    },
    {
        value: "cleaning kit",
        label: "Cleaning Kit",
    },
    {
        value: "tripod lighting",
        label: "Tripod Lighting",
    },
    {
        value: "charger",
        label: "Charger",
    },
    {
        value: "sd card",
        label: "SD Card",
    },
    {
        value: "micro sd card",
        label: "Micro SD Card",
    },
    {
        value: "battery camera",
        label: "Battery Camera",
    },
    {
        value: "battery drone",
        label: "Battery Drone",
    },
];

export function ExampleCombobox({ value, onChange }) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? frameworks.find(
                              (framework) => framework.value === value
                          )?.label
                        : "Select framework..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command className="w-full">
                    <CommandInput placeholder="Search Items..." />
                    <CommandList>
                        <CommandEmpty>No items found.</CommandEmpty>
                        <CommandGroup>
                            {frameworks.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={(currentValue) => {
                                        const newValue =
                                            currentValue === value
                                                ? ""
                                                : currentValue;
                                        onChange(newValue); // ✅ Pass back to parent
                                        setOpen(false);
                                    }}
                                >
                                    {framework.label}
                                    {value === framework.value && (
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
