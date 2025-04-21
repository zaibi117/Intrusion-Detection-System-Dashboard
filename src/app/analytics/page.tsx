'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

const API_URL = 'http://localhost:5000/api/ip-stats'

export default function IPStatsPage() {
  const [ipData, setIpData] = useState<{ ip_addresses: string[]; counts: number[] }>({ ip_addresses: [], counts: [] })

  useEffect(() => {
    const fetchIpStats = async () => {
      try {
        const response = await axios.get(API_URL)
        setIpData(response.data)
      } catch (err) {
        console.error('Error fetching IP stats:', err)
      }
    }

    fetchIpStats()
  }, [])

  const data = {
    labels: ipData.ip_addresses,
    datasets: [
      {
        label: 'IP Counts',
        data: ipData.counts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'IP Address Statistics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-center text-2xl'>IP Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Bar data={data} options={options} />
      </CardContent>
    </Card>
  )
}

