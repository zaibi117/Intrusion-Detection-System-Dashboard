// app/components/dashboard/FilterDropdown.tsx
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { Flow } from '@/types/apiTypes'

interface FilterDropdownProps {
    title: string
    filterKey: keyof Flow
    currentFilter: any
    flows: Flow[]
    onFilterChange: (key: keyof Flow, value: any) => void
    onClearFilter: (key: keyof Flow) => void
}

export const FilterDropdown = ({
    title,
    filterKey,
    currentFilter,
    flows,
    onFilterChange,
    onClearFilter,
}: FilterDropdownProps) => {
    const getUniqueValues = (key: keyof Flow) => {
        const unique = new Set<string | number>()
        flows.forEach(flow => {
            unique.add(flow[key] as string | number)
        })
        return Array.from(unique).sort()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center">
                {title} <ChevronDown className="ml-1 h-4 w-4" />
                {currentFilter && <span className="ml-1 text-xs">(filtered)</span>}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-y-auto">
                <DropdownMenuItem onClick={() => onClearFilter(filterKey)}>
                    Clear Filter
                </DropdownMenuItem>
                {getUniqueValues(filterKey).map(value => (
                    <DropdownMenuItem
                        key={value.toString()}
                        onClick={() => onFilterChange(filterKey, value)}
                    >
                        {value}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}