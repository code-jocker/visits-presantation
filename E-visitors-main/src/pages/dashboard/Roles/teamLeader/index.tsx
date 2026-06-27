import { FaUsers, FaMapMarkerAlt, FaUserCheck, FaUserTimes, FaShieldAlt, FaExclamationTriangle, FaClock, FaClipboardList, FaSearch, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useState } from 'react'

function TeamLeader() {
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const workersPerPage = 5

    const deploymentLocations = [
        { id: 1, name: 'Main Gate', workers: 4, status: 'active', incidents: 2 },
        { id: 2, name: 'Office Door', workers: 2, status: 'active', incidents: 0 },
        { id: 3, name: 'Stock Room', workers: 3, status: 'active', incidents: 1 },
        { id: 4, name: 'Parking Area', workers: 2, status: 'active', incidents: 0 },
    ]

    const securityWorkers = [
        { id: 1, name: 'John Doe', location: 'Main Gate', status: 'on-duty', shift: 'Morning', phone: '+250788123456' },
        { id: 2, name: 'Jane Smith', location: 'Main Gate', status: 'on-duty', shift: 'Morning', phone: '+250788123457' },
        { id: 3, name: 'Mike Johnson', location: 'Office Door', status: 'on-duty', shift: 'Morning', phone: '+250788123458' },
        { id: 4, name: 'Sarah Williams', location: 'Stock Room', status: 'on-leave', shift: 'Evening', phone: '+250788123459' },
        { id: 5, name: 'David Brown', location: 'Stock Room', status: 'on-duty', shift: 'Morning', phone: '+250788123460' },
        { id: 6, name: 'Emma Davis', location: 'Parking Area', status: 'on-duty', shift: 'Night', phone: '+250788123461' },
    ]

    const recentSecurityActions = [
        { id: 1, action: 'Visitor logged at Main Gate', worker: 'John Doe', time: '10 mins ago', type: 'visitor' },
        { id: 2, action: 'Incident reported at Stock Room', worker: 'David Brown', time: '25 mins ago', type: 'incident' },
        { id: 3, action: 'Shift change at Office Door', worker: 'Mike Johnson', time: '1 hour ago', type: 'shift' },
        { id: 4, action: 'Equipment check at Main Gate', worker: 'Jane Smith', time: '2 hours ago', type: 'check' },
    ]

    const stats = {
        totalWorkers: securityWorkers.length,
        onDuty: securityWorkers.filter(w => w.status === 'on-duty').length,
        onLeave: securityWorkers.filter(w => w.status === 'on-leave').length,
        totalLocations: deploymentLocations.length,
    }

    const filteredWorkers = selectedLocation
        ? securityWorkers.filter(w => w.location === selectedLocation)
        : securityWorkers

    const searchedWorkers = filteredWorkers.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.phone.includes(searchTerm)
    )

    const totalPages = Math.ceil(searchedWorkers.length / workersPerPage)
    const startIndex = (currentPage - 1) * workersPerPage
    const endIndex = startIndex + workersPerPage
    const paginatedWorkers = searchedWorkers.slice(startIndex, endIndex)

    const handleViewWorker = (workerId: number) => {
        console.log('View worker details:', workerId)
        // Add navigation or modal logic here
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    return (
        <div className="flex flex-col h-screen">
            <style dangerouslySetInnerHTML={{
                __html: `
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `
            }} />

            {/* Header - Fixed */}
            <div className='flex-shrink-0 mb-4'>
                <h1 className="!text-2xl font-bold text-gray-900">Security Team Leader Dashboard</h1>
                <p className="text-gray-600 text-sm">Manage security personnel and deployment locations</p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Workers</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalWorkers}</p>
                            </div>
                            <div className="bg-blue-500 p-3 rounded-lg">
                                <FaUsers className="text-white" size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">On Duty</p>
                                <p className="text-2xl font-bold text-green-600">{stats.onDuty}</p>
                            </div>
                            <div className="bg-green-500 p-3 rounded-lg">
                                <FaUserCheck className="text-white" size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">On Leave</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.onLeave}</p>
                            </div>
                            <div className="bg-orange-500 p-3 rounded-lg">
                                <FaUserTimes className="text-white" size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Locations</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.totalLocations}</p>
                            </div>
                            <div className="bg-purple-500 p-3 rounded-lg">
                                <FaMapMarkerAlt className="text-white" size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deployment Locations */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Deployment Locations</h2>
                        <button
                            onClick={() => setSelectedLocation(null)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            View All Workers
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {deploymentLocations.map((location) => (
                            <button
                                key={location.id}
                                onClick={() => setSelectedLocation(location.name)}
                                className={`p-4 rounded-lg border-2 transition-all text-left ${
                                    selectedLocation === location.name
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-blue-300'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <FaMapMarkerAlt className="text-blue-600" size={20} />
                                    {location.incidents > 0 && (
                                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                                            {location.incidents} incidents
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">{location.name}</h3>
                                <p className="text-sm text-gray-600">{location.workers} workers assigned</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Workers and Recent Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Security Workers */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {selectedLocation ? `Workers at ${selectedLocation}` : 'All Security Workers'}
                            </h2>
                            <div className="relative w-64">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search workers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Location</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Shift</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Contact</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedWorkers.map((worker) => (
                                        <tr key={worker.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-900">{worker.name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{worker.location}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{worker.shift}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    worker.status === 'on-duty'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-orange-100 text-orange-800'
                                                }`}>
                                                    {worker.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{worker.phone}</td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => handleViewWorker(worker.id)}
                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-gray-600">
                                    Showing {startIndex + 1} to {Math.min(endIndex, searchedWorkers.length)} of {searchedWorkers.length} workers
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaChevronLeft size={14} />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 rounded ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recent Security Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Actions</h2>
                        <div className="space-y-3">
                            {recentSecurityActions.map((activity) => (
                                <div key={activity.id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        {activity.type === 'incident' && <FaExclamationTriangle className="text-red-500 mt-1" size={14} />}
                                        {activity.type === 'visitor' && <FaShieldAlt className="text-blue-500 mt-1" size={14} />}
                                        {activity.type === 'shift' && <FaClock className="text-purple-500 mt-1" size={14} />}
                                        {activity.type === 'check' && <FaClipboardList className="text-green-500 mt-1" size={14} />}
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm">{activity.action}</p>
                                            <p className="text-xs text-gray-500">{activity.worker}</p>
                                            <span className="text-xs text-gray-400">{activity.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeamLeader;