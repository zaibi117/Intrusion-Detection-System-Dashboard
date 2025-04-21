// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertCircle,
  CheckCircle,
  Play,
  Square,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'


// API URL - replace with your actual backend URL
const API_URL = 'http://localhost:5000/api'

// Flow data interface
interface Flow {
  FlowID: number
  Src: string
  SrcPort: number
  Dest: string
  DestPort: number
  Protocol: string
  FlowDuration: number
  Classification: string
  Probability: number
  Risk: string
  FlowStartTime: string
  FlowLastSeen: string
}
interface FilterState {
  Src: string | null
  SrcPort: number | null
  Dest: string | null
  DestPort: number | null
  Protocol: string | null
  Classification: string | null
  Risk: string | null
}
// API status interface
interface ApiStatus {
  status: string
  flows_processed: number
  active_flows: number
}

export default function Dashboard() {





  const [flows, setFlows] = useState<Flow[]>([])
  const [initialLoad, setInitialLoad] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [isSniffing, setIsSniffing] = useState<boolean>(false)
  const router = useRouter()

  // Fetch all flows (initial load)
  const fetchInitialFlows = async () => {
    try {
      const response = await axios.get(`${API_URL}/flows`)
      setFlows(response.data.flows)
      setError(null)
    } catch (err) {
      console.error('Error fetching flows:', err)
      setError('Failed to fetch network flows. Please check if the API server is running.')
    } finally {
      setInitialLoad(false)
    }
  }

  // Fetch new flows (for polling)
  const fetchNewFlows = async () => {
    try {
      const response = await axios.get(`${API_URL}/flows`)
      setFlows(prevFlows => {
        // Create a map of existing flow IDs
        const existingIds = new Set(prevFlows.map(flow => flow.FlowID))
        // Filter out duplicates
        const newFlows = response.data.flows.filter((flow: Flow) =>
          !existingIds.has(flow.FlowID)
        )
        return newFlows.length > 0 ? [...prevFlows, ...newFlows] : prevFlows
      })
    } catch (err) {
      console.error('Error fetching new flows:', err)
      // Don't show error for polling to avoid UI disruption
    }
  }

  // Manual refresh
  const refreshFlows = async () => {
    try {
      const response = await axios.get(`${API_URL}/flows`)
      setFlows(response.data.flows)
    } catch (err) {
      console.error('Error refreshing flows:', err)
      setError('Failed to refresh flows. Please check the API server.')
    }
  }

  // Fetch API status
  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/status`)
      setApiStatus(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching API status:', err)
      setError('Failed to connect to the API server. Please check if it is running.')
    }
  }

  // Start packet sniffing
  const startSniffing = async () => {
    try {
      await axios.post(`${API_URL}/start`)
      setIsSniffing(true)
      await fetchStatus()
    } catch (err) {
      console.error('Error starting packet sniffing:', err)
      setError('Failed to start packet sniffing. Please check the API server.')
    }
  }

  // Stop packet sniffing
  const stopSniffing = async () => {
    try {
      await axios.post(`${API_URL}/stop`)
      setIsSniffing(false)
      await fetchStatus()
    } catch (err) {
      console.error('Error stopping packet sniffing:', err)
      setError('Failed to stop packet sniffing. Please check the API server.')
    }
  }

  // View flow details
  const viewFlowDetails = (flowId: number) => {
    router.push(`/flow/${flowId}`)
  }

  // Get color based on risk level
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Minimal':
        return 'bg-green-100 text-green-800'
      case 'Low':
        return 'bg-blue-100 text-blue-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'High':
        return 'bg-orange-100 text-orange-800'
      case 'Very High':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get color based on classification
  const getClassificationColor = (classification: string) => {
    return classification === 'Benign'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  useEffect(() => {
    fetchStatus()
    fetchInitialFlows()

    // Set up polling for real-time updates
    const statusInterval = setInterval(fetchStatus, 5000)
    const flowsInterval = setInterval(fetchNewFlows, 10000)

    return () => {
      clearInterval(statusInterval)
      clearInterval(flowsInterval)
    }
  }, [])

  //for filtering
  const [filters, setFilters] = useState<FilterState>({
    Src: null,
    SrcPort: null,
    Dest: null,
    DestPort: null,
    Protocol: null,
    Classification: null,
    Risk: null
  })

  // Add this function to get unique values for each column
  const getUniqueValues = (key: keyof Flow) => {
    const unique = new Set<string | number>()
    flows.forEach(flow => {
      unique.add(flow[key] as string | number)
    })
    return Array.from(unique).sort()
  }

  // Add this function to filter flows
  const filteredFlows = flows.filter(flow => {
    return (
      (!filters.Src || flow.Src === filters.Src) &&
      (!filters.SrcPort || flow.SrcPort === filters.SrcPort) &&
      (!filters.Dest || flow.Dest === filters.Dest) &&
      (!filters.DestPort || flow.DestPort === filters.DestPort) &&
      (!filters.Protocol || flow.Protocol === filters.Protocol) &&
      (!filters.Classification || flow.Classification === filters.Classification) &&
      (!filters.Risk || flow.Risk === filters.Risk)
    )
  })

  // Add this function to clear a specific filter
  const clearFilter = (key: keyof FilterState) => {
    setFilters(prev => ({ ...prev, [key]: null }))
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Network Traffic Analysis Dashboard</h1>

      {/* Status and Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* API Status Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">API Status</CardTitle>
          </CardHeader>
          <CardContent>
            {apiStatus ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge className={apiStatus.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {apiStatus.status === 'online' ? (
                      <CheckCircle className="mr-1 h-4 w-4" />
                    ) : (
                      <AlertCircle className="mr-1 h-4 w-4" />
                    )}
                    {apiStatus.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Flows Processed:</span>
                  <span className="font-semibold">{apiStatus.flows_processed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Flows:</span>
                  <span className="font-semibold">{apiStatus.active_flows}</span>
                </div>
              </div>
            ) : error ? (
              <div className="text-red-500">Failed to connect to API</div>
            ) : (
              <div className="flex justify-center">
                <RefreshCw className="animate-spin h-6 w-6" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Control Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Packet Capture Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Capture Status:</span>
              <Badge className={isSniffing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {isSniffing ? 'Running' : 'Stopped'}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex space-x-2 w-full">
              <Button onClick={startSniffing} disabled={isSniffing} className="flex-1" variant="outline">
                <Play className="mr-2 h-4 w-4" />
                Start
              </Button>
              <Button onClick={stopSniffing} disabled={!isSniffing} className="flex-1" variant="outline">
                <Square className="mr-2 h-4 w-4" />
                Stop
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Dashboard Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dashboard Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500 mb-4">
              Refresh data or view analytics
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex space-x-2 w-full">
              <Button onClick={refreshFlows} className="flex-1" variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => router.push('/analytics')}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>Network Flows</CardTitle>
          <CardDescription>
            Showing {flows.length} captured network flows
          </CardDescription>
        </CardHeader>
        <CardContent>
          {initialLoad ? (
            <div className="space-y-4 py-4">
              <div className="text-center text-sm text-gray-500">Loading flow data...</div>
              <Progress value={45} className="w-full" />
            </div>
          ) : flows.length === 0 ? (
            <div className="py-4 text-center text-sm text-gray-500">
              No network flows captured yet. Start packet capture to begin monitoring.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>

                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center">
                          Source <ChevronDown className="ml-1 h-4 w-4" />
                          {filters.Src && <span className="ml-1 text-xs">(filtered)</span>}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-60 overflow-y-auto">
                          <DropdownMenuItem onClick={() => clearFilter('Src')}>
                            Clear Filter
                          </DropdownMenuItem>
                          {getUniqueValues('Src').map(value => (
                            <DropdownMenuItem
                              key={value as string}
                              onClick={() => setFilters(prev => ({ ...prev, Src: value as string }))}
                            >
                              {value}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>

                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center">
                          Src Port <ChevronDown className="ml-1 h-4 w-4" />
                          {filters.SrcPort && <span className="ml-1 text-xs">(filtered)</span>}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-60 overflow-y-auto">
                          <DropdownMenuItem onClick={() => clearFilter('SrcPort')}>
                            Clear Filter
                          </DropdownMenuItem>
                          {getUniqueValues('SrcPort').map(value => (
                            <DropdownMenuItem
                              key={value as number}
                              onClick={() => setFilters(prev => ({ ...prev, SrcPort: value as number }))}
                            >
                              {value}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>

                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center">
                          Destination <ChevronDown className="ml-1 h-4 w-4" />
                          {filters.Dest && <span className="ml-1 text-xs">(filtered)</span>}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-60 overflow-y-auto">
                          <DropdownMenuItem onClick={() => clearFilter('Dest')}>
                            Clear Filter
                          </DropdownMenuItem>
                          {getUniqueValues('Dest').map(value => (
                            <DropdownMenuItem
                              key={value as string}
                              onClick={() => setFilters(prev => ({ ...prev, Dest: value as string }))}
                            >
                              {value}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>

                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center">
                          Dest Port <ChevronDown className="ml-1 h-4 w-4" />
                          {filters.DestPort && <span className="ml-1 text-xs">(filtered)</span>}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-60 overflow-y-auto">
                          <DropdownMenuItem onClick={() => clearFilter('DestPort')}>
                            Clear Filter
                          </DropdownMenuItem>
                          {getUniqueValues('DestPort').map(value => (
                            <DropdownMenuItem
                              key={value as number}
                              onClick={() => setFilters(prev => ({ ...prev, DestPort: value as number }))}
                            >
                              {value}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>

                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center">
                          Protocol <ChevronDown className="ml-1 h-4 w-4" />
                          {filters.Protocol && <span className="ml-1 text-xs">(filtered)</span>}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-60 overflow-y-auto">
                          <DropdownMenuItem onClick={() => clearFilter('Protocol')}>
                            Clear Filter
                          </DropdownMenuItem>
                          {getUniqueValues('Protocol').map(value => (
                            <DropdownMenuItem
                              key={value as string}
                              onClick={() => setFilters(prev => ({ ...prev, Protocol: value as string }))}
                            >
                              {value}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>

                    <TableHead className="w-32">Duration (ms)</TableHead>

                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center">
                          Classification <ChevronDown className="ml-1 h-4 w-4" />
                          {filters.Classification && <span className="ml-1 text-xs">(filtered)</span>}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-60 overflow-y-auto">
                          <DropdownMenuItem onClick={() => clearFilter('Classification')}>
                            Clear Filter
                          </DropdownMenuItem>
                          {getUniqueValues('Classification').map(value => (
                            <DropdownMenuItem
                              key={value as string}
                              onClick={() => setFilters(prev => ({ ...prev, Classification: value as string }))}
                            >
                              {value}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>

                    <TableHead>Probability</TableHead>

                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center">
                          Risk Level <ChevronDown className="ml-1 h-4 w-4" />
                          {filters.Risk && <span className="ml-1 text-xs">(filtered)</span>}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-60 overflow-y-auto">
                          <DropdownMenuItem onClick={() => clearFilter('Risk')}>
                            Clear Filter
                          </DropdownMenuItem>
                          {getUniqueValues('Risk').map(value => (
                            <DropdownMenuItem
                              key={value as string}
                              onClick={() => setFilters(prev => ({ ...prev, Risk: value as string }))}
                            >
                              {value}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}