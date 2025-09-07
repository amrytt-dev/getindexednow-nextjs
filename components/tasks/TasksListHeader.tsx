import { useState } from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {Filter, Search, X} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { format, subDays, startOfMonth, startOfWeek } from 'date-fns';

interface TasksListHeaderProps {
    taskType?: 'indexer' | 'checker' | 'failed';
    onSearch?: (query: string) => void;
    onFilterChange?: (value: string | null) => void;
}

export const TasksListHeader = ({
                                    taskType,
                                    onFilterChange,
                                    onSearch,
                                }: TasksListHeaderProps) => {
                                    console.log('taskType', taskType);
    const title = taskType === 'checker' ? 'Checker Tasks' : taskType === 'failed' ? 'Failed Tasks' : 'Indexer Tasks';
    const description =
        taskType === 'checker'
            ? 'Monitor the status of your URL checking operations'
            : taskType === 'failed'
                ? 'View and manage failed indexing tasks'
                : 'Track your indexing tasks and their progress';

    const [searchQuery, setSearchQuery] = useState('');
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const handleFilter = (label: string) => {
        setActiveFilter(label);

        const filterMap: Record<string, string> = {
            'Today': 'today',
            'Yesterday': 'yesterday',
            'This Week': 'this_week',
            'This Month': 'this_month',
        };

        const backendFilterValue = filterMap[label];
        if (backendFilterValue) {
            onFilterChange?.(backendFilterValue); // send string
        }
    };

    const clearFilter = () => {
        setActiveFilter(null);
    };

    return (
        <CardHeader className="px-6 py-5 border-b border-[#dadce0]">
            <div className="flex justify-between items-center flex-wrap gap-4 w-full">
                {/* Left side: Title + Description */}
                <div>
                    <CardTitle className="text-[20px] font-normal text-[#202124]">
                        {title}
                    </CardTitle>
                    <CardDescription className="text-[14px] text-[#5f6368]">
                        {description}
                    </CardDescription>
                </div>

                {/* Right side: Filter + Search */}
                <div className="flex items-center gap-2 flex-wrap mt-4">
                    {/* Search Input Styled Like Button */}
                    <div
                        className={`flex items-center border border-[#dadce0] rounded-full bg-white text-sm text-[#202124] transition-all duration-300 px-3 h-9 ${
                            searchExpanded ? 'w-64' : 'w-40'
                        }`}
                    >
                        <Search
                            className="h-4 w-4 text-gray-500 cursor-pointer"
                            onClick={() => {
                                if (!searchExpanded) {
                                    setSearchExpanded(true);
                                }
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search by task title and url"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                // Uncomment below if you want live search
                                onSearch?.(e.target.value);
                            }}
                            onFocus={() => setSearchExpanded(true)}
                            onBlur={() => {
                                if (!searchQuery) setSearchExpanded(false);
                                // Optional: trigger on blur
                                // onSearch?.(searchQuery);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onSearch?.(searchQuery);
                                }
                            }}
                            className="bg-transparent outline-none ml-2 w-full text-[14px]"
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-[#dadce0] rounded-full text-[14px] gap-1 h-9 px-4"
                            >
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                            {['Today', 'Yesterday', 'This Week', 'This Month'].map((label) => (
                                <DropdownMenuItem key={label} onClick={() => handleFilter(label)}>
                                    {label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Selected Filter Badge */}
                    {activeFilter && (
                        <div className="flex items-center bg-[#e8f0fe] text-[#1a73e8] text-sm font-medium px-3 py-1 rounded-full h-9">
                            {activeFilter}
                            <X className="h-4 w-4 ml-2 cursor-pointer" onClick={clearFilter} />
                        </div>
                    )}
                </div>

            </div>
        </CardHeader>
    );
};
