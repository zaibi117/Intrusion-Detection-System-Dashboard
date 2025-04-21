// app/components/dashboard/FlowTable.tsx

//@ts-nocheck
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RefreshCw } from 'lucide-react'
import { FilterDropdown } from './FilterDropdown'
import { Flow, FilterState } from '@/types/apiTypes'

interface FlowTableProps {
    flows: Flow[]
    filteredFlows: Flow[]
    initialLoad: boolean
    filters: FilterState
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>
    getRiskColor: (risk: string) => string
}

export const FlowTable = ({
    flows,
    filteredFlows,
    initialLoad,
    filters,
    setFilters,
    getRiskColor,
}: FlowTableProps) => {
    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const handleClearFilter = (key: keyof FilterState) => {
        setFilters((prev) => ({ ...prev, [key]: null }))
    }

    return (
        <div className="rounded-md border max-h-[90vh] overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16">ID</TableHead>
                        <TableHead>
                            <FilterDropdown
                                title="Source"
                                filterKey="Src"
                                currentFilter={filters.Src}
                                flows={flows}
                                onFilterChange={handleFilterChange}
                                onClearFilter={handleClearFilter}
                            />
                        </TableHead>
                        <TableHead>
                            <FilterDropdown
                                title="Src Port"
                                filterKey="SrcPort"
                                currentFilter={filters.SrcPort}
                                flows={flows}
                                onFilterChange={handleFilterChange}
                                onClearFilter={handleClearFilter}
                            />
                        </TableHead>
                        <TableHead>
                            <FilterDropdown
                                title="Destination"
                                filterKey="Dest"
                                currentFilter={filters.Dest}
                                flows={flows}
                                onFilterChange={handleFilterChange}
                                onClearFilter={handleClearFilter}
                            />
                        </TableHead>
                        <TableHead>
                            <FilterDropdown
                                title="Dest Port"
                                filterKey="DestPort"
                                currentFilter={filters.DestPort}
                                flows={flows}
                                onFilterChange={handleFilterChange}
                                onClearFilter={handleClearFilter}
                            />
                        </TableHead>
                        <TableHead>
                            <FilterDropdown
                                title="Protocol"
                                filterKey="Protocol"
                                currentFilter={filters.Protocol}
                                flows={flows}
                                onFilterChange={handleFilterChange}
                                onClearFilter={handleClearFilter}
                            />
                        </TableHead>
                        <TableHead className="w-32">Duration (ms)</TableHead>
                        <TableHead>
                            <FilterDropdown
                                title="Classification"
                                filterKey="Classification"
                                currentFilter={filters.Classification}
                                flows={flows}
                                onFilterChange={handleFilterChange}
                                onClearFilter={handleClearFilter}
                            />
                        </TableHead>
                        <TableHead>Probability</TableHead>
                        <TableHead>
                            <FilterDropdown
                                title="Risk Level"
                                filterKey="Risk"
                                currentFilter={filters.Risk}
                                flows={flows}
                                onFilterChange={handleFilterChange}
                                onClearFilter={handleClearFilter}
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredFlows.map((flow) => (
                        <TableRow key={flow.FlowID}>
                            <TableCell className="font-medium">{flow.FlowID}</TableCell>
                            <TableCell>{flow.Src}</TableCell>
                            <TableCell>{flow.SrcPort}</TableCell>
                            <TableCell>{flow.Dest}</TableCell>
                            <TableCell>{flow.DestPort}</TableCell>
                            <TableCell>{flow.Protocol}</TableCell>
                            <TableCell>{Math.round(flow.FlowDuration)}</TableCell>
                            <TableCell>
                                {flow.Classification}
                            </TableCell>
                            <TableCell>
                                {Number(flow.Probability * 100).toFixed(2)}%
                            </TableCell>
                            <TableCell>
                                <Badge className={getRiskColor(flow.Risk)}>
                                    {flow.Risk}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}