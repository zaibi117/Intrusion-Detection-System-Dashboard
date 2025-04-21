// app/types/apiTypes.ts
export interface Flow {
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
    isPotentialDoS?: boolean
  }
  
  export interface ApiStatus {
    status: string
    flows_processed: number
    active_flows: number
  }
  
  export interface FilterState {
    Src: string | null
    SrcPort: number | null
    Dest: string | null
    DestPort: number | null
    Protocol: string | null
    Classification: string | null
    Risk: string | null
  }