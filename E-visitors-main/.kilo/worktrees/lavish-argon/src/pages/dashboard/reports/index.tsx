import { useState } from 'react'
import { Plus, FileText, Download, Search, BarChart3, TrendingUp, Users, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Report {
  id: string
  title: string
  type: 'attendance' | 'performance' | 'financial' | 'custom'
  createdBy: string
  createdAt: string
  lastModified: string
  status: 'draft' | 'published' | 'archived'
  downloads: number
}

function ReportsPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const reports: Report[] = [
    {
      id: '1',
      title: 'Monthly Attendance Report',
      type: 'attendance',
      createdBy: 'John Doe',
      createdAt: '2024-01-15',
      lastModified: '2024-01-20',
      status: 'published',
      downloads: 45
    },
    {
      id: '2',
      title: 'Employee Performance Analysis',
      type: 'performance',
      createdBy: 'Jane Smith',
      createdAt: '2024-01-10',
      lastModified: '2024-01-18',
      status: 'published',
      downloads: 32
    },
    {
      id: '3',
      title: 'Quarterly Financial Summary',
      type: 'financial',
      createdBy: 'Mike Johnson',
      createdAt: '2024-01-05',
      lastModified: '2024-01-12',
      status: 'draft',
      downloads: 0
    },
    {
      id: '4',
      title: 'Custom Department Report',
      type: 'custom',
      createdBy: 'Sarah Wilson',
      createdAt: '2024-01-08',
      lastModified: '2024-01-15',
      status: 'published',
      downloads: 28
    }
  ]

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || report.type === filterType
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'attendance': return <Clock className="w-4 h-4 text-blue-600" />
      case 'performance': return <TrendingUp className="w-4 h-4 text-purple-600" />
      case 'financial': return <BarChart3 className="w-4 h-4 text-green-600" />
      case 'custom': return <FileText className="w-4 h-4 text-orange-600" />
      default: return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeIconBg = (type: string) => {
    switch (type) {
      case 'attendance': return 'bg-blue-100'
      case 'performance': return 'bg-purple-100'
      case 'financial': return 'bg-green-100'
      case 'custom': return 'bg-orange-100'
      default: return 'bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'attendance': return 'bg-blue-100 text-blue-800'
      case 'performance': return 'bg-purple-100 text-purple-800'
      case 'financial': return 'bg-green-100 text-green-800'
      case 'custom': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
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
      <div className='flex-shrink-0'>
        <h1 className="!text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Manage and create reports for your organization</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.status === 'published').length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-gray-900">{reports.reduce((sum, r) => sum + r.downloads, 0)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="attendance">Attendance</option>
              <option value="performance">Performance</option>
              <option value="financial">Financial</option>
              <option value="custom">Custom</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <button 
              onClick={() => navigate('/dashboard/reports/create')}
              className="bg-[#1A3263] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Report
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Reports ({filteredReports.length})</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 ${getTypeIconBg(report.type)} rounded-lg`}>
                    {getTypeIcon(report.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{report.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created by {report.createdBy}</span>
                      <span>•</span>
                      <span>Created {report.createdAt}</span>
                      <span>•</span>
                      <span>Modified {report.lastModified}</span>
                      <span>•</span>
                      <span>{report.downloads} downloads</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
                    View
                  </button>
                  <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

        {filteredReports.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => navigate('/dashboard/reports/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Report
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportsPage