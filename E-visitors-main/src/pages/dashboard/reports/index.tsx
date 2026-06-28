import { useState, useEffect } from 'react'
import { Plus, FileText, Download, Search, BarChart3, Users, FileSpreadsheet, FileDown, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { reportsApi } from '../../../api/reports'
import GenerateAutoReportModal from '../../../components/modals/GenerateAutoReportModal'
import AutoDeleteReportModal from '../../../components/modals/AutoDeleteReportModal'
import { toast } from 'react-toastify'

interface ReportFile {
  name: string
  size: number
  createdAt: string
}

function ReportsPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [reportFiles, setReportFiles] = useState<ReportFile[]>([])
  const [loading, setLoading] = useState(true)
  const [isGenerateAutoModalOpen, setIsGenerateAutoModalOpen] = useState(false)
  const [isAutoDeleteModalOpen, setIsAutoDeleteModalOpen] = useState(false)
  const [currentRetentionDays, setCurrentRetentionDays] = useState(30)

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true)
        const res = await reportsApi.list()
        if (res.success && res.result) {
          setReportFiles(res.result.files)
        }
      } catch (err) {
        console.error('Failed to load reports:', err)
      } finally {
        setLoading(false)
      }
    }
    loadReports()
    loadRetentionSetting()
  }, [])

  const getFormatIcon = (filename: string) => {
    const format = filename.includes('.xlsx') ? 'excel' :
                   filename.includes('.doc') ? 'word' :
                   filename.includes('.pdf') ? 'pdf' : 'html';
    switch (format) {
      case 'excel': return <FileSpreadsheet className="w-4 h-4 text-green-600" />
      case 'word': return <FileText className="w-4 h-4 text-blue-600" />
      case 'pdf': return <FileText className="w-4 h-4 text-red-600" />
      default: return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredReports = reportFiles.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDownload = async (filename: string) => {
    try {
      const content = await reportsApi.download(filename)
      const blob = new Blob([content], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
      toast.error('Failed to download report')
    }
  }

  const handleGenerateAutoReport = async (format: 'excel' | 'pdf' | 'csv') => {
    setIsGenerateAutoModalOpen(false)
    if (!window.confirm('Are you sure you want to generate an auto report? This will create a visitor attendance report with predefined fields (date, time, visitor name, contact info, purpose of visit).')) {
      return
    }

    try {
      const res = await reportsApi.autoGenerate({ format, force: true })
      if (res.success && res.result?.generated && res.result.downloadUrl) {
        toast.success(`Report generated successfully: ${res.result.visitorCount} visitors included`)
        const content = await reportsApi.download(res.result.downloadUrl.split('/').pop() || '')
        const blob = new Blob([content], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = res.result.downloadUrl.split('/').pop() || 'report'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        loadReports()
      } else {
        toast.info(res.result?.reason || 'Report generation skipped')
      }
    } catch (err) {
      console.error('Auto report generation failed:', err)
      toast.error('Failed to generate auto report')
    }
  }

  const handleAutoDeleteReports = async (retentionDays: number) => {
    setIsAutoDeleteModalOpen(false)
    if (!window.confirm(`Are you sure you want to delete reports older than ${retentionDays} days? This action cannot be undone.`)) {
      return
    }

    try {
      const res = await reportsApi.autoDelete(retentionDays)
      if (res.success) {
        toast.success(`Deleted ${res.result.deletedCount} report(s)`)
        loadReports()
      }
    } catch (err) {
      console.error('Auto delete failed:', err)
      toast.error('Failed to delete reports')
    }
  }

  const loadReports = async () => {
    try {
      setLoading(true)
      const res = await reportsApi.list()
      if (res.success && res.result) {
        setReportFiles(res.result.files)
      }
    } catch (err) {
      console.error('Failed to load reports:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadRetentionSetting = async () => {
    try {
      const res = await reportsApi.getRetention()
      if (res.success) {
        setCurrentRetentionDays(res.result.retentionDays)
      }
    } catch (err) {
      console.error('Failed to load retention setting:', err)
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
                <p className="text-2xl font-bold text-gray-900">{reportFiles.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">{reportFiles.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">{reportFiles.length}</p>
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
            <div className="flex gap-2">
              <button
                onClick={() => setIsGenerateAutoModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                title="Generate Auto Report"
              >
                <FileDown className="w-4 h-4" />
                Generate Auto Report
              </button>
              <button
                onClick={() => setIsAutoDeleteModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                title="Auto Delete Reports"
              >
                <Trash2 className="w-4 h-4" />
                Auto Delete Report
              </button>
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
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading reports...</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <div key={report.name} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getFormatIcon(report.name)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{report.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Size: {(report.size / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span>Created: {new Date(report.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(report.name)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredReports.length === 0 && !loading && (
            <div className="p-12 text-center">
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

      <GenerateAutoReportModal
        isOpen={isGenerateAutoModalOpen}
        onClose={() => setIsGenerateAutoModalOpen(false)}
        onConfirm={handleGenerateAutoReport}
      />
      <AutoDeleteReportModal
        isOpen={isAutoDeleteModalOpen}
        onClose={() => setIsAutoDeleteModalOpen(false)}
        onConfirm={handleAutoDeleteReports}
        currentRetentionDays={currentRetentionDays}
      />
    </div>
  )
}

export default ReportsPage