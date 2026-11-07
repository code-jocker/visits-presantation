import { useState, useEffect } from 'react'
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaFilePdf, FaFileWord, FaPrint, FaUsers, FaClock } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import ExportReportModal from '../../../components/modals/ExportReportModal'
import DeleteFormModal from '../../../components/modals/DeleteFormModal'
import EditFormModal from '../../../components/modals/EditFormModal'

interface Form {
  id: string
  title: string
  description: string
  createdDate: string
  status: 'Active' | 'Draft' | 'Archived'
  responses: number
  allowedRoles: string[]
  startTime?: string
  endTime?: string
}

function AllForms() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'print'>('pdf')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedForm, setSelectedForm] = useState<Form | null>(null)
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch forms from backend
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true)
        setError(null)

        // Note: This endpoint should be implemented in backend
        // For now, using fallback mock data
        const response = await fetch('/api/forms')
        if (response.ok) {
          const data = await response.json()
          setForms(data.result || [])
        } else {
          // Fallback to mock data
          setForms([
            {
              id: '1',
              title: 'Employee Feedback Form',
              description: 'Annual employee satisfaction survey',
              createdDate: '2024-03-15',
              status: 'Active',
              responses: 45,
              allowedRoles: ['employee', 'manager'],
              startTime: '2024-03-01T09:00',
              endTime: '2024-03-31T17:00'
            },
            {
              id: '2',
              title: 'Visitor Registration',
              description: 'Standard visitor check-in form',
              createdDate: '2024-03-10',
              status: 'Active',
              responses: 128,
              allowedRoles: ['visitor', 'receptionist'],
              startTime: '2024-03-01T08:00',
              endTime: '2024-12-31T18:00'
            },
            {
              id: '3',
              title: 'Equipment Request Form',
              description: 'Request form for office equipment',
              createdDate: '2024-03-05',
              status: 'Draft',
              responses: 0,
              allowedRoles: ['employee', 'manager', 'admin']
            },
            {
              id: '4',
              title: 'Security Incident Report',
              description: 'Report security incidents and concerns',
              createdDate: '2024-02-28',
              status: 'Archived',
              responses: 12,
              allowedRoles: ['security', 'admin'],
              startTime: '2024-02-01T00:00',
              endTime: '2024-02-29T23:59'
            }
          ])
        }
      } catch (err) {
        console.error('Error fetching forms:', err)
        setError('Failed to load forms')
        // Set fallback mock data
        setForms([
          {
            id: '1',
            title: 'Employee Feedback Form',
            description: 'Annual employee satisfaction survey',
            createdDate: '2024-03-15',
            status: 'Active',
            responses: 45,
            allowedRoles: ['employee', 'manager'],
            startTime: '2024-03-01T09:00',
            endTime: '2024-03-31T17:00'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchForms()
  }, [])

  const roleNames: Record<string, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    employee: 'Employee',
    visitor: 'Visitor',
    security: 'Security',
    receptionist: 'Receptionist',
    hr: 'HR Staff',
    it: 'IT Support'
  }

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || form.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleExport = (type: 'pdf' | 'word' | 'print') => {
    setExportFormat(type)
    setShowExportModal(true)
  }

  const handleGenerateReport = (selectedFields: string[], startDate: string, endDate: string, format: 'pdf' | 'word' | 'print') => {
    console.log('Generating report:', { selectedFields, startDate, endDate, format })
  }

  const handleDeleteForm = (form: Form) => {
    setSelectedForm(form)
    setShowDeleteModal(true)
  }

  const handleEditForm = (form: Form) => {
    setSelectedForm(form)
    setShowEditModal(true)
  }

  const confirmEditForm = (formData: any) => {
    console.log('Updating form:', formData)
    // Handle update logic here
  }

  const confirmDeleteForm = () => {
    if (selectedForm) {
      console.log('Deleting form:', selectedForm.id)
      // Handle delete logic here
    }
    setShowDeleteModal(false)
    setSelectedForm(null)
  }

  const exportFields = [
    { id: 'title', label: 'Form Title' },
    { id: 'description', label: 'Description' },
    { id: 'status', label: 'Status' },
    { id: 'responses', label: 'Responses' },
    { id: 'allowedRoles', label: 'Allowed Roles' },
    { id: 'createdDate', label: 'Created Date' },
    { id: 'startTime', label: 'Start Time' },
    { id: 'endTime', label: 'End Time' },
  ]

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
        <h1 className="!text-2xl font-bold text-gray-900">All Forms</h1>
        <p className="text-gray-600">Manage and view all organizational forms</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <FaFileWord className="text-white" size={18} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Forms</p>
              <p className="text-2xl font-bold text-gray-900">{forms.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <FaClock className="text-white" size={18} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Forms</p>
              <p className="text-2xl font-bold text-gray-900">{forms.filter(f => f.status === 'Active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <FaUsers className="text-white" size={18} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Responses</p>
              <p className="text-2xl font-bold text-gray-900">{forms.reduce((sum, form) => sum + form.responses, 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-500">
              <FaEdit className="text-white" size={18} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Draft Forms</p>
              <p className="text-2xl font-bold text-gray-900">{forms.filter(f => f.status === 'Draft').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          
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
          
          {/* Create New Form Button */}
          <button
            onClick={() => navigate('/dashboard/forms/create')}
            className="bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center gap-2"
          >
            <FaPlus size={16} />
            Create New Form
          </button>
        </div>
      </div>

        {/* Forms Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#1A3263]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Form Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Responses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Allowed Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredForms.map((form) => (
                  <tr key={form.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{form.title}</div>
                        <div className="text-sm text-gray-500">{form.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        form.status === 'Active' ? 'bg-green-100 text-green-800' :
                        form.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {form.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {form.responses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {form.allowedRoles.slice(0, 2).map(roleId => (
                          <span key={roleId} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {roleNames[roleId]}
                          </span>
                        ))}
                        {form.allowedRoles.length > 2 && (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                            +{form.allowedRoles.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {form.createdDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View">
                          <FaEye size={18} />
                        </button>
                        <button 
                          onClick={() => handleEditForm(form)}
                          className="text-green-600 hover:text-green-900" 
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteForm(form)}
                          className="text-red-600 hover:text-red-900" 
                          title="Delete"
                        >
                          <FaTrash size={18} />
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

      {/* Export Modal */}
      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleGenerateReport}
        fields={exportFields}
        exportFormat={exportFormat}
        title="Export Forms Report"
      />

      {/* Delete Modal */}
      {selectedForm && (
        <DeleteFormModal
          isOpen={showDeleteModal}
          formTitle={selectedForm.title}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedForm(null)
          }}
          onConfirm={confirmDeleteForm}
        />
      )}

      {/* Edit Modal */}
      {selectedForm && (
        <EditFormModal
          isOpen={showEditModal}
          formData={selectedForm}
          onClose={() => {
            setShowEditModal(false)
            setSelectedForm(null)
          }}
          onSubmit={confirmEditForm}
        />
      )}
    </div>
  )
}

export default AllForms