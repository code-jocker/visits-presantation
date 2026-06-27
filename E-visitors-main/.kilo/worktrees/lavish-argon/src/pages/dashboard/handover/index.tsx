import { useState } from 'react'
import { FaExchangeAlt, FaUser, FaClock, FaCheckCircle, FaTimesCircle, FaPlus, FaSearch, FaEye, FaEllipsisV, FaClipboardList } from 'react-icons/fa'
import CreateHandoverModal from '../../../components/modals/CreateHandoverModal'

interface HandoverItem {
  category: string
  description: string
  status: 'completed' | 'pending' | 'issue'
  notes?: string
}

interface Handover {
  id: number
  date: string
  time: string
  outgoingStaff: string
  incomingStaff: string
  shift: string
  status: 'completed' | 'pending' | 'in-progress'
  items: HandoverItem[]
  generalNotes?: string
  signature?: boolean
}

function HandoverManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [selectedHandover, setSelectedHandover] = useState<Handover | null>(null)

  const stats = [
    { title: 'Total Handovers', value: '156', icon: FaExchangeAlt, color: 'bg-blue-500' },
    { title: 'Completed Today', value: '12', icon: FaCheckCircle, color: 'bg-green-500' },
    { title: 'Pending', value: '3', icon: FaClock, color: 'bg-yellow-500' },
    { title: 'Issues Reported', value: '2', icon: FaTimesCircle, color: 'bg-red-500' }
  ]

  const handovers: Handover[] = [
    {
      id: 1,
      date: '2024-01-15',
      time: '08:00',
      outgoingStaff: 'John Smith',
      incomingStaff: 'Sarah Johnson',
      shift: 'Night to Day',
      status: 'completed',
      items: [
        { category: 'Security Check', description: 'All doors locked', status: 'completed' },
        { category: 'Equipment', description: 'Radio and keys handed over', status: 'completed' },
        { category: 'Incidents', description: 'No incidents reported', status: 'completed' }
      ],
      generalNotes: 'Smooth handover, no issues',
      signature: true
    },
    {
      id: 2,
      date: '2024-01-15',
      time: '16:00',
      outgoingStaff: 'Sarah Johnson',
      incomingStaff: 'Mike Davis',
      shift: 'Day to Evening',
      status: 'in-progress',
      items: [
        { category: 'Security Check', description: 'Perimeter check ongoing', status: 'pending' },
        { category: 'Visitors', description: '5 visitors still on premises', status: 'issue', notes: 'Waiting for checkout' }
      ],
      signature: false
    },
    {
      id: 3,
      date: '2024-01-14',
      time: '20:00',
      outgoingStaff: 'Mike Davis',
      incomingStaff: 'John Smith',
      shift: 'Evening to Night',
      status: 'completed',
      items: [
        { category: 'Security Check', description: 'All systems operational', status: 'completed' },
        { category: 'Equipment', description: 'All equipment accounted for', status: 'completed' }
      ],
      generalNotes: 'Quiet evening shift',
      signature: true
    }
  ]

  const filteredHandovers = handovers.filter(handover => {
    const matchesSearch = handover.outgoingStaff.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         handover.incomingStaff.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         handover.shift.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || handover.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'issue': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const handleCreateHandover = (handoverData: any) => {
    console.log('Creating handover:', handoverData)
    setShowCreateModal(false)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="!text-3xl font-bold text-gray-900">Handover Management</h1>
        <p className="text-gray-600">Manage shift handovers between security/help desk staff</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Handover List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search handovers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
              </select>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-[#1A3263]/90 flex items-center gap-2"
              >
                <FaPlus size={14} />
                New Handover
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredHandovers.map((handover) => (
              <div
                key={handover.id}
                className="p-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedHandover(handover)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FaExchangeAlt className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{handover.shift}</h3>
                      <p className="text-sm text-gray-500">{handover.date} at {handover.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(handover.status)}`}>
                      {handover.status}
                    </span>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDropdown(openDropdown === handover.id ? null : handover.id)
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <FaEllipsisV size={14} />
                      </button>
                      {openDropdown === handover.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenDropdown(null)
                            }}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log('View', handover.id)
                                setOpenDropdown(null)
                              }}
                            >
                              <FaEye size={14} className="text-blue-600" />
                              View Details
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Outgoing Staff</p>
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" size={12} />
                      <p className="text-sm font-medium text-gray-900">{handover.outgoingStaff}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Incoming Staff</p>
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" size={12} />
                      <p className="text-sm font-medium text-gray-900">{handover.incomingStaff}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaClipboardList size={14} />
                  <span>{handover.items.length} items</span>
                  {handover.signature && (
                    <>
                      <span>•</span>
                      <FaCheckCircle className="text-green-600" size={14} />
                      <span>Signed</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Handover Details Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedHandover ? 'Handover Details' : 'Select a Handover'}
          </h2>

          {selectedHandover ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                <p className="font-medium text-gray-900">{selectedHandover.date} at {selectedHandover.time}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Shift</p>
                <p className="font-medium text-gray-900">{selectedHandover.shift}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Handover Items</p>
                <div className="space-y-3">
                  {selectedHandover.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{item.category}</p>
                        <span className={`text-xs font-semibold ${getItemStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{item.description}</p>
                      {item.notes && (
                        <p className="text-xs text-red-600 mt-1">Note: {item.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedHandover.generalNotes && (
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">General Notes</p>
                  <p className="text-sm text-gray-600">{selectedHandover.generalNotes}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">Signature Status</p>
                  {selectedHandover.signature ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <FaCheckCircle size={14} />
                      Signed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-600 text-sm">
                      <FaClock size={14} />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FaExchangeAlt className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-500">Click on a handover to view details</p>
            </div>
          )}
        </div>
      </div>

      <CreateHandoverModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateHandover}
      />
    </div>
  )
}

export default HandoverManagement
