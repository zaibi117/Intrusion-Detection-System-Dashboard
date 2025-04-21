// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatusCards } from '@/components/StatusCard'
import { FlowTable } from '@/components/FlowTable'
import { useApi } from '@/hooks/useApi'
import { Flow, FilterState } from '@/types/apiTypes'

export default function Dashboard() {
  const router = useRouter()
  const {
    flows,
    apiStatus,
    isSniffing,
    error,
    initialLoad,
    fetchInitialFlows,
    fetchNewFlows,
    refreshFlows,
    fetchStatus,
    startSniffing,
    stopSniffing,
  } = useApi()

  const [filters, setFilters] = useState<FilterState>({
    Src: null,
    SrcPort: null,
    Dest: null,
    DestPort: null,
    Protocol: null,
    Classification: null,
    Risk: null
  })

  // Filter flows based on current filters
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

  // Get color based on risk level
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Minimal': return 'bg-green-100 text-green-800'
      case 'Low': return 'bg-blue-100 text-blue-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Very High': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Network Traffic Analysis Dashboard</h1>

      <StatusCards
        apiStatus={apiStatus}
        isSniffing={isSniffing}
        startSniffing={startSniffing}
        stopSniffing={stopSniffing}
        refreshFlows={refreshFlows}
        router={router}
      />

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
            <FlowTable
              flows={flows}
              filteredFlows={filteredFlows}
              initialLoad={initialLoad}
              filters={filters}
              setFilters={setFilters}
              getRiskColor={getRiskColor}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}