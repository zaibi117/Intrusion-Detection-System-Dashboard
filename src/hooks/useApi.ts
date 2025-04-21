// app/hooks/useApi.ts
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Flow, ApiStatus } from '../types/apiTypes'
import { detectPotentialDoS } from '../utils/detectionUtils'
const API_URL = 'http://localhost:5000/api'

export const useApi = () => {
  const [flows, setFlows] = useState<Flow[]>([])
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [isSniffing, setIsSniffing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoad, setInitialLoad] = useState<boolean>(true)

  // Fetch all flows (initial load)
  const fetchInitialFlows = async () => {
    try {
      const response = await axios.get(`${API_URL}/flows`)
      const processedFlows = detectPotentialDoS(response.data.flows)
      setFlows(processedFlows)
      setError(null)
    } catch (err) {
      console.error('Error fetching flows:', err)
      setError('Failed to fetch network flows. Please check if the API server is running.')
    } finally {
      setInitialLoad(false)
    }
  }
  
  const fetchNewFlows = async () => {
    try {
      const response = await axios.get(`${API_URL}/flows`)
      setFlows(prevFlows => {
        const existingIds = new Set(prevFlows.map(flow => flow.FlowID))
        const newFlows = response.data.flows.filter((flow: Flow) =>
          !existingIds.has(flow.FlowID)
        )
        const processedNewFlows = detectPotentialDoS(newFlows)
        return processedNewFlows.length > 0 ? [...prevFlows, ...processedNewFlows] : prevFlows
      })
    } catch (err) {
      console.error('Error fetching new flows:', err)
    }
  }
  
  const refreshFlows = async () => {
    try {
      const response = await axios.get(`${API_URL}/flows`)
      const processedFlows = detectPotentialDoS(response.data.flows)
      setFlows(processedFlows)
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

  return {
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
  }
}