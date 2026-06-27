import { useEffect, useMemo, useState } from 'react'
import { FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import AnalyticsLineChart from '../../../components/ui/AnalyticsLineChart'
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  const [analyticsSeries, setAnalyticsSeries] = useState<Array<{ date: number; value: number }>>([])

  const apiPeriod = useMemo(() => {
    // Backend analyticsApi.getRevenueAnalytics expects daily/weekly/monthly/yearly
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
        setLoading(true)
        setError(null)

        const [dashboardStatsRes, revenueRes] = await Promise.all([
          analyticsApi.getDashboardStats(),
          analyticsApi.getRevenueAnalytics(apiPeriod),
        ])

        setStats(dashboardStatsRes?.result || null)

        // analyticsApi.getRevenueAnalytics returns { period, value, growth? }[]
        // AnalyticsLineChart expects {date:number,value:number}.
        const series = (revenueRes?.result || []).map((p) => {
          // Prefer period if it is epoch/ms; otherwise try Date.parse
          const parsed = typeof p.period === 'number' ? Number(p.period) : Date.parse(p.period)
          return {
            date: Number.isFinite(parsed) ? parsed : Date.now(),
            value: Number(p.value) || 0,
          }
        })

        setAnalyticsSeries(series)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load analytics')
        setStats(null)
        setAnalyticsSeries([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [apiPeriod])

  const kpiMetrics: KpiMetric[] = useMemo(() => {
    const s = stats
    if (!s) {
      return []
    }

    // Since backend DashboardStats does not include growth/change values,
    // we render only value cards (no fake change).
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

  const emptyState = !loading && !error && (kpiMetrics.length === 0 || stats === null)

  return (
    <div className="flex flex-col h-full">
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
      {/* Header - Fixed */}
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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {metric.trend === 'up' ? (
                    <FaArrowUp className="text-green-500" size={12} />
                  ) : (
                    <FaArrowDown className="text-red-500" size={12} />
                  )}
                  <p className={`text-sm ${
                    metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change} from last period
                  </p>
                </div>
              </div>
              <div className={`${metric.color} p-3 rounded-lg`}>
                <FaChartLine className="text-white" size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Chart - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Growth Trend</h2>
          <AnalyticsLineChart data={analyticsData} title="Daily Revenue" />
        </div>

        {/* Right Side - Revenue by Plan and Top Customers stacked */}
        <div className="space-y-6">
          {/* Revenue by Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Plan</h2>
            <div className="space-y-3">
              {revenueByPlan.map((plan, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      plan.plan === 'Enterprise' ? 'bg-blue-500' :
                      plan.plan === 'Professional' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{plan.plan}</p>
                      <p className="text-xs text-gray-500">{plan.customers} customers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${(plan.revenue/1000).toFixed(0)}k</p>
                    <p className="text-xs text-gray-500">{plan.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h2>
            <div className="space-y-2">
              {topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{customer.company}</p>
                    <p className="text-xs text-gray-500">{customer.plan}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${customer.revenue}/mo</p>
                    <p className="text-xs text-green-600">{customer.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>



      {/* Customer Growth Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Customer & Revenue Growth</h2>
        <div className="grid grid-cols-5 gap-4">
          {customerGrowth.map((data, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 rounded-lg p-4 mb-2">
                <div className="text-2xl font-bold text-blue-600">{data.customers}</div>
                <div className="text-sm text-gray-600">Customers</div>
              </div>
              <div className="bg-green-100 rounded-lg p-4 mb-2">
                <div className="text-lg font-semibold text-green-600">${data.revenue/1000}k</div>
                <div className="text-sm text-gray-600">Revenue</div>
              </div>
              <div className="text-sm font-medium text-gray-700">{data.month}</div>
            </div>
          ))}
        </div>
      </div>

   
      </div>
    </div>
  )
}
export default BusinessAnalytics;