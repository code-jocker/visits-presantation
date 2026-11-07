import { useState } from 'react'
import { FaBell, FaCheck, FaTrash, FaEye, FaFilter, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
  category: string
}

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New Visitor Check-in',
      message: 'John Doe has checked in at the main entrance',
      type: 'info',
      timestamp: '2024-01-15 14:30',
      read: false,
      category: 'Visitor'
    },
    {
      id: 2,
      title: 'Security Alert',
      message: 'Unauthorized access attempt detected at Gate B',
      type: 'warning',
      timestamp: '2024-01-15 13:45',
      read: false,
      category: 'Security'
    },
    {
      id: 3,
      title: 'System Update',
      message: 'Attendance system updated successfully',
      type: 'success',
      timestamp: '2024-01-15 12:00',
      read: true,
      category: 'System'
    },
    {
      id: 4,
      title: 'Connection Error',
      message: 'Failed to sync data with central server',
      type: 'error',
      timestamp: '2024-01-15 11:15',
      read: false,
      category: 'System'
    },
    {
      id: 5,
      title: 'Event Reminder',
      message: 'Team meeting scheduled in 30 minutes',
      type: 'info',
      timestamp: '2024-01-15 10:30',
      read: true,
      category: 'Event'
    }
  ])

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <FaCheckCircle className="text-green-500" />
      case 'warning': return <FaExclamationTriangle className="text-yellow-500" />
      case 'error': return <FaTimesCircle className="text-red-500" />
      default: return <FaInfoCircle className="text-blue-500" />
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }

  const filteredNotifications = notifications.filter(notif => {
    const matchesReadFilter = filter === 'all' || 
      (filter === 'read' && notif.read) || 
      (filter === 'unread' && !notif.read)
    
    const matchesCategory = categoryFilter === 'all' || notif.category === categoryFilter
    
    return matchesReadFilter && matchesCategory
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const categories = ['all', ...Array.from(new Set(notifications.map(n => n.category)))]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="!text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBell className="text-blue-600" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600">Stay updated with system alerts and activities</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaCheck size={14} />
          Mark All Read
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          
          <div className="flex gap-2">
            {['all', 'unread', 'read'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  filter === filterType
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  categoryFilter === category
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm border-l-4 p-4 transition-all hover:shadow-md ${
                notification.read ? 'border-gray-300 opacity-75' : 'border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${
                        notification.read ? 'text-gray-600' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {notification.category}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${
                      notification.read ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">{notification.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Mark as read"
                    >
                      <FaEye size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete notification"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FaBell className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No notifications found</h3>
            <p className="text-gray-500">No notifications match your current filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications