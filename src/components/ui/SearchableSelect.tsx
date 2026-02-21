import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { useTheme, themeStyles } from '../../utils/theme';
import { cn } from '../../lib/utils';
import { Input } from './Input';

interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    label,
    error,
    className,
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const styles = themeStyles[theme];

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find(o => o.value === value)?.label;

    return (
        <div className={cn("relative w-full", className)} ref={containerRef}>
            {label && (
                <label className={cn(
                    "block text-sm font-medium mb-1",
                    theme === 'v3' ? "text-slate-300" : "text-slate-700"
                )}>
                    {label}
                </label>
            )}
            <div
                className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm cursor-pointer border",
                    styles.rounded,
                    styles.input,
                    open ? "ring-2 ring-emerald-500 border-emerald-500" : "",
                    error ? "border-rose-500" : ""
                )}
                onClick={() => setOpen(!open)}
            >
                <span className={!value ? "text-slate-400" : ""}>
                    {selectedLabel || placeholder}
                </span>
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </div>

            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}

            {open && (
                <div className={cn(
                    "absolute z-50 w-full mt-1 overflow-hidden border shadow-md animate-in fade-in zoom-in-95 duration-100",
                    styles.rounded,
                    theme === 'v3' ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
                )}>
                    <div className="p-2 border-b border-inherit">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 opacity-50" />
                            <input
                                type="text"
                                className={cn(
                                    "w-full pl-8 pr-2 py-1 text-sm bg-transparent outline-none placeholder:text-slate-400",
                                    theme === 'v3' ? "text-white" : "text-slate-900"
                                )}
                                placeholder="search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-1">
                        {filteredOptions.length === 0 ? (
                            <div className="p-2 text-sm text-slate-500 text-center">No results found.</div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={cn(
                                        "flex items-center px-2 py-1.5 text-sm cursor-pointer transition-colors",
                                        styles.rounded,
                                        value === option.value
                                            ? "bg-emerald-600 text-white"
                                            : (theme === 'v3' ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-700")
                                    )}
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
