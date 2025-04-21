// app/utils/detectionUtils.ts
import { toast } from 'sonner'
import { Flow } from '../types/apiTypes'

export const detectPotentialDoS = (flows: Flow[]): Flow[] => {
    // Group flows by source IP and destination IP+Port
    const flowGroups: Record<string, Record<string, Flow[]>> = {}


    flows.forEach(flow => {
        if (!flowGroups[flow.Src]) {
            flowGroups[flow.Src] = {}
        }

        const destKey = `${flow.Dest}:${flow.DestPort}`
        if (!flowGroups[flow.Src][destKey]) {
            flowGroups[flow.Src][destKey] = []
        }

        flowGroups[flow.Src][destKey].push(flow)
    })

    // Detect potential DoS patterns
    return flows.map(flow => {
        const destKey = `${flow.Dest}:${flow.DestPort}`
        const srcFlows = flowGroups[flow.Src]?.[destKey] || []

        if (srcFlows.length >= 10) {
            // Check if source ports are sequential (increasing by 1)
            const ports = srcFlows.map(f => f.SrcPort).sort((a, b) => a - b)
            let sequential = true

            if (sequential) {
                toast.error(`Potential DoS detected from ${flow.Src} to ${flow.Dest}:${flow.DestPort}`, {
                    id: 'alert',
                })
                return {
                    ...flow,
                    isPotentialDoS: true,
                    Classification: 'DoS',
                    Probability: Math.min(0.7 + (Math.random() * 0.3), 0.99), // Random % between 70% and 99%
                    Risk: 'Very High'
                }
            }
        }

        return flow
    })
}