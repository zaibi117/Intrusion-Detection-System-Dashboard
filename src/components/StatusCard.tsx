// app/components/dashboard/StatusCards.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, RefreshCw, Play, Square, AlertTriangle } from 'lucide-react'
import { ApiStatus } from '@/types/apiTypes'
import { Button } from './ui/button'

interface StatusCardsProps {
  apiStatus: ApiStatus | null
  isSniffing: boolean
  startSniffing: () => void
  stopSniffing: () => void
  refreshFlows: () => void
  router: any
}

export const StatusCards = ({ 
  apiStatus, 
  isSniffing, 
  startSniffing, 
  stopSniffing, 
  refreshFlows,
  router
}: StatusCardsProps) => {
  return (
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
  )
}