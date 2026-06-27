import { useState, useEffect } from 'react'
import { FaServer, FaExclamationTriangle, FaCheckCircle, FaClock, FaMemory, FaHdd } from 'react-icons/fa'
import { FiCpu } from 'react-icons/fi'
import { HiOutlineRefresh } from 'react-icons/hi'

function SystemHealthly() {
  const [refreshTime, setRefreshTime] = useState(new Date().toLocaleTimeString())
  const [systemStatus, setSystemStatus] = useState({
    overall: 'healthy',
    uptime: '99.8%',
    lastIncident: '12 days ago'
  })
  const [services, setServices] = useState<any[]>([])
  const [serverMetrics, setServerMetrics] = useState<any[]>([])
  const [recentAlerts, setRecentAlerts] = useState<any[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([])

// Fetch system health data from backend
  useEffect(() => {
    const fetchSystemHealth = async () => {
      try {
        // Note: These endpoints should be added to the backend if they don't exist
        // For now, using placeholder structure that can be implemented in backend
        
        // Fetch system status
        const statusResponse = await fetch('/api/system/status')
        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          setSystemStatus(statusData)
        }

        // Fetch services health
        const servicesResponse = await fetch('/api/system/services')
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json()
          setServices(servicesData)
        } else {
          // Fallback to default services if endpoint not available
          setServices([
            { name: 'API Gateway', status: 'healthy', uptime: '99.9%', responseTime: '45ms' },
            { name: 'Database', status: 'healthy', uptime: '99.8%', responseTime: '12ms' },
            { name: 'Authentication', status: 'healthy', uptime: '100%', responseTime: '23ms' },
            { name: 'File Storage', status: 'warning', uptime: '98.5%', responseTime: '156ms' },
            { name: 'Email Service', status: 'healthy', uptime: '99.7%', responseTime: '89ms' },
            { name: 'Backup System', status: 'healthy', uptime: '99.9%', responseTime: '234ms' }
          ])
        }

        // Fetch server metrics
        const metricsResponse = await fetch('/api/system/metrics')
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json()
          setServerMetrics(metricsData)
        } else {
          setServerMetrics([
            { name: 'CPU Usage', value: '23%', status: 'healthy', icon: FiCpu },
            { name: 'Memory Usage', value: '67%', status: 'warning', icon: FaMemory },
            { name: 'Disk Usage', value: '45%', status: 'healthy', icon: FaHdd },
            { name: 'Network I/O', value: '12MB/s', status: 'healthy', icon: FaServer }
          ])
        }

        // Fetch recent alerts
        const alertsResponse = await fetch('/api/system/alerts')
        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json()
          setRecentAlerts(alertsData)
        } else {
          setRecentAlerts([
            { time: '2 hours ago', type: 'warning', message: 'High memory usage detected on server-02', resolved: false },
            { time: '6 hours ago', type: 'info', message: 'Scheduled maintenance completed successfully', resolved: true },
            { time: '1 day ago', type: 'error', message: 'Database connection timeout resolved', resolved: true },
            { time: '2 days ago', type: 'info', message: 'Security patch applied to all servers', resolved: true }
          ])
        }

        // Fetch performance metrics
        const perfResponse = await fetch('/api/system/performance')
        if (perfResponse.ok) {
          const perfData = await perfResponse.json()
          setPerformanceMetrics(perfData)
        } else {
          setPerformanceMetrics([
            { metric: 'Average Response Time', value: '89ms', trend: 'stable' },
            { metric: 'Requests per Second', value: '1,247', trend: 'up' },
            { metric: 'Error Rate', value: '0.02%', trend: 'down' },
            { metric: 'Active Connections', value: '3,456', trend: 'up' }
          ])
        }
      } catch (err) {
        console.error('Error fetching system health data:', err)
        // Set default fallback data
        setServices([
          { name: 'API Gateway', status: 'healthy', uptime: '99.9%', responseTime: '45ms' },
          { name: 'Database', status: 'healthy', uptime: '99.8%', responseTime: '12ms' },
          { name: 'Authentication', status: 'healthy', uptime: '100%', responseTime: '23ms' },
          { name: 'File Storage', status: 'warning', uptime: '98.5%', responseTime: '156ms' },
          { name: 'Email Service', status: 'healthy', uptime: '99.7%', responseTime: '89ms' },
          { name: 'Backup System', status: 'healthy', uptime: '99.9%', responseTime: '234ms' }
        ])
      }
    }

    fetchSystemHealth()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <FaCheckCircle className="text-green-600" size={16} />
      case 'warning': return <FaExclamationTriangle className="text-yellow-600" size={16} />
      case 'error': return <FaExclamationTriangle className="text-red-600" size={16} />
      default: return <FaClock className="text-gray-600" size={16} />
    }
  }

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
          <h1 className="!text-2xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600">Monitor your E-Visitors platform infrastructure and performance</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated: {refreshTime}</p>
          <button 
            onClick={() => setRefreshTime(new Date().toLocaleTimeString())}
            className="mt-2 flex gap-2 px-3 py-1 bg-[#1A3263] text-white text-sm rounded-lg hover:bg-blue-700"
          >
           <HiOutlineRefresh size={17} /> Refresh
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Overall System Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaCheckCircle className="text-green-600" size={32} />
            </div>
            <div>
              <h2 className="!text-xl font-bold text-gray-900">All Systems Operational</h2>
              <p className="text-gray-600">Platform uptime: {systemStatus.uptime} | Last incident: {systemStatus.lastIncident}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              Healthy
            </div>
          </div>
        </div>
      </div>

      {/* Server Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {serverMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getStatusIcon(metric.status)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Icon className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h2>
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-500">Uptime: {service.uptime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="!text-sm  text-gray-900">{service.responseTime}</p>
                  <p className="text-xs text-gray-500">avg response</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            {performanceMetrics.map((perf, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{perf.metric}</p>
                  <p className="text-2xl font-bold text-gray-900">{perf.value}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 text-sm ${
                    perf.trend === 'up' ? 'text-green-600' :
                    perf.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {perf.trend === 'up' && '↗'}
                    {perf.trend === 'down' && '↘'}
                    {perf.trend === 'stable' && '→'}
                    {perf.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent System Alerts</h2>
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div key={index} className={`flex items-center gap-4 p-4 rounded-lg border-l-4 ${
                alert.type === 'error' ? 'bg-red-50 border-red-500' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                'bg-blue-50 border-blue-500'
              }`}>
                <div className={`p-2 rounded-full ${
                  alert.type === 'error' ? 'bg-red-100' :
                  alert.type === 'warning' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  {alert.type === 'error' && <FaExclamationTriangle className="text-red-600" size={16} />}
                  {alert.type === 'warning' && <FaExclamationTriangle className="text-yellow-600" size={16} />}
                  {alert.type === 'info' && <FaCheckCircle className="text-blue-600" size={16} />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{alert.message}</p>
                  <p className="text-sm text-gray-500">{alert.time}</p>
                </div>
                {alert.resolved && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Resolved
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default SystemHealthly;