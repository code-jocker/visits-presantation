import { useState, useEffect } from 'react'
import { FaShieldAlt, FaExclamationTriangle, FaBan, FaEye, FaSearch, FaFilter, FaFilePdf, FaFileWord, FaPrint } from 'react-icons/fa'
import BlockDeviceModal from '../../../components/modals/blockDevice'
import ExportReportModal from '../../../components/modals/ExportReportModal'

interface SecurityThreat {
  id: string
  ipAddress: string
  deviceInfo: string
  location: string
  threatType: 'Brute Force' | 'SQL Injection' | 'XSS Attack' | 'DDoS' | 'Malware'
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  timestamp: string
  attempts: number
  status: 'Active' | 'Blocked' | 'Monitoring'
}

function Security() {
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [selectedThreat, setSelectedThreat] = useState<SecurityThreat | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'print'>('pdf')
  const [threats, setThreats] = useState<SecurityThreat[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch security threats from backend
  useEffect(() => {
    const fetchSecurityThreats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Note: This endpoint should be implemented in backend
        // For now, using fallback mock data
        const response = await fetch('/api/security/threats')
        if (response.ok) {
          const data = await response.json()
          setThreats(data.result || [])
        } else {
          // Fallback to mock data
          setThreats([
            {
              id: '1',
              ipAddress: '192.168.1.100',
              deviceInfo: 'Unknown Device - Chrome/Linux',
              location: 'Unknown Location',
              threatType: 'Brute Force',
              severity: 'High',
              timestamp: '2024-03-20 14:30:25',
              attempts: 15,
              status: 'Active'
            },
            {
              id: '2',
              ipAddress: '10.0.0.45',
              deviceInfo: 'Suspicious Bot - Python/3.9',
              location: 'Russia',
              threatType: 'SQL Injection',
              severity: 'Critical',
              timestamp: '2024-03-20 13:45:12',
              attempts: 8,
              status: 'Active'
            },
            {
              id: '3',
              ipAddress: '172.16.0.23',
              deviceInfo: 'Firefox/Windows',
              location: 'China',
              threatType: 'XSS Attack',
              severity: 'Medium',
              timestamp: '2024-03-20 12:15:33',
              attempts: 3,
              status: 'Monitoring'
            }
          ])
        }
      } catch (err) {
        console.error('Error fetching security threats:', err)
        setError('Failed to load security threats')
        // Set fallback mock data
        setThreats([
          {
            id: '1',
            ipAddress: '192.168.1.100',
            deviceInfo: 'Unknown Device - Chrome/Linux',
            location: 'Unknown Location',
            threatType: 'Brute Force',
            severity: 'High',
            timestamp: '2024-03-20 14:30:25',
            attempts: 15,
            status: 'Active'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSecurityThreats()
  }, [])

  const handleBlockDevice = (threat: SecurityThreat) => {
    setSelectedThreat(threat)
    setShowBlockModal(true)
  }

  const confirmBlockDevice = () => {
    if (selectedThreat) {
      console.log(`Blocking device: ${selectedThreat.ipAddress}`)
      // Handle blocking logic here
    }
  }

  const handleExport = (type: 'pdf' | 'word' | 'print') => {
    setExportFormat(type)
    setShowExportModal(true)
  }

  const handleGenerateReport = (selectedFields: string[], startDate: string, endDate: string, format: 'pdf' | 'word' | 'print') => {
    console.log('Generating report:', { selectedFields, startDate, endDate, format })
  }

  const exportFields = [
    { id: 'ipAddress', label: 'IP Address' },
    { id: 'deviceInfo', label: 'Device Info' },
    { id: 'location', label: 'Location' },
    { id: 'threatType', label: 'Threat Type' },
    { id: 'severity', label: 'Severity' },
    { id: 'timestamp', label: 'Timestamp' },
    { id: 'attempts', label: 'Attempts' },
    { id: 'status', label: 'Status' },
  ]

  const filteredThreats = threats.filter(threat => {
    const matchesSearch = threat.ipAddress.includes(searchTerm) ||
                         threat.deviceInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         threat.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || threat.severity.toLowerCase() === severityFilter
    return matchesSearch && matchesSeverity
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-red-100 text-red-800'
      case 'Blocked': return 'bg-gray-100 text-gray-800'
      case 'Monitoring': return 'bg-yellow-100 text-yellow-800'
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
        <h1 className="!text-2xl font-bold text-gray-900">Security Control Center</h1>
        <p className="text-gray-600">Monitor and manage system security threats</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {/* Security Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <FaExclamationTriangle className="text-white" size={18} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Threats</p>
              <p className="text-2xl font-bold text-gray-900">{threats.filter(t => t.status === 'Active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-500">
              <FaBan className="text-white" size={18} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blocked Devices</p>
              <p className="text-2xl font-bold text-gray-900">{threats.filter(t => t.status === 'Blocked').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-500">
              <FaShieldAlt className="text-white" size={18} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{threats.filter(t => t.severity === 'Critical').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <FaEye className="text-white" size={18} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Under Monitoring</p>
              <p className="text-2xl font-bold text-gray-900">{threats.filter(t => t.status === 'Monitoring').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by IP address, device, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Export Options */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              title="Export as PDF"
            >
              <FaFilePdf size={16} />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={() => handleExport('word')}
              className="flex items-center gap-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              title="Export as Word"
            >
              <FaFileWord size={16} />
              <span className="hidden sm:inline">Word</span>
            </button>
            <button
              onClick={() => handleExport('print')}
              className="flex items-center gap-2 px-3 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors"
              title="Print"
            >
              <FaPrint size={16} />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Threats Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="rounded p-2 bg-[#1A3263]">
              <tr>
                <th className="px-6 py-3 text-left text-white text-medium font-medium text-gray-500 uppercase tracking-wider">
                  Device Info
                </th>
                <th className="px-6 py-3 text-medium text-white text-medium  font-medium text-gray-500 uppercase tracking-wider">
                  Threat Type
                </th>
                <th className="px-6 py-3 text-left text-white text-medium font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-white text-medium font-medium text-gray-500 uppercase tracking-wider">
                  Attempts
                </th>
                <th className="px-6 py-3 text-left text-white text-medium font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-white text-medium font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-white  text-medium font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredThreats.map((threat) => (
                <tr key={threat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{threat.ipAddress}</div>
                      <div className="text-sm text-gray-500">{threat.deviceInfo}</div>
                      <div className="text-xs text-gray-400">{threat.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {threat.threatType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {threat.attempts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(threat.status)}`}>
                      {threat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {threat.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {threat.status !== 'Blocked' && (
                        <button
                          onClick={() => handleBlockDevice(threat)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex items-center gap-1"
                        >
                          <FaBan size={12} />
                          Block
                        </button>
                      )}
                      <button className="text-blue-600 flex bg-blue-600 text-white rounded-lg px-3 py-1 hover:text-blue-900" title="View Details">
                        <FaEye size={16} />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {/* Block Device Modal */}
      {selectedThreat && (
        <BlockDeviceModal
          isOpen={showBlockModal}
          onClose={() => setShowBlockModal(false)}
          onConfirm={confirmBlockDevice}
          deviceInfo={{
            ipAddress: selectedThreat.ipAddress,
            deviceInfo: selectedThreat.deviceInfo,
            location: selectedThreat.location,
            threatType: selectedThreat.threatType,
            severity: selectedThreat.severity
          }}
        />
      )}

      {/* Export Modal */}
      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleGenerateReport}
        fields={exportFields}
        exportFormat={exportFormat}
        title="Export Security Report"
      />
    </div>
  )
}

export default Security