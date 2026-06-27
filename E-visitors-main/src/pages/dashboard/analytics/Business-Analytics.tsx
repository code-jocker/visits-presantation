import { useEffect, useMemo, useState } from 'react'
import { FaChartLine } from 'react-icons/fa'
import { analyticsApi, type DashboardStats } from '../../../api/analytics'

type KpiMetric = {
  title: string
  value: string
  change?: string
  trend?: 'up' | 'down'
  color: string
}

function BusinessAnalytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const [stats, setStats] = useState<DashboardStats | null>(null)

  const apiPeriod = useMemo(() => {
    switch (timeRange) {
      case '7d':
        return 'daily' as const
      case '30d':
        return 'daily' as const
      case '90d':
        return 'weekly' as const
      case '1y':
        return 'monthly' as const
      default:
        return 'daily' as const
    }
  }, [timeRange])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardStatsRes = await analyticsApi.getDashboardStats()
        setStats(dashboardStatsRes?.result || null)
      } catch {
        setStats(null)
      }
    }

    fetchData()
  }, [apiPeriod])

  const kpiMetrics: KpiMetric[] = useMemo(() => {
    const s = stats
    if (!s) {
      return []
    }

    return [
      {
        title: 'Total Users',
        value: String(s.totalUsers ?? 0),
        color: 'bg-blue-500',
      },
      {
        title: 'Active Users',
        value: String(s.activeUsers ?? 0),
        color: 'bg-green-500',
      },
      {
        title: 'Total Visitors',
        value: String(s.totalVisitors ?? 0),
        color: 'bg-purple-500',
      },
      {
        title: 'Total Events',
        value: String(s.totalEvents ?? 0),
        color: 'bg-red-500',
      },
    ]
  }, [stats])

  return (
    <div className="flex flex-col h-full">
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
      <div className='flex-shrink-0 flex justify-between items-center'>
        <div>
          <h1 className="!text-2xl font-bold text-gray-900">Business Analytics</h1>
          <p className="text-gray-600">Track your SaaS platform performance and growth metrics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`${metric.color} p-3 rounded-lg`}>
                  <FaChartLine className="text-white" size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default BusinessAnalytics;