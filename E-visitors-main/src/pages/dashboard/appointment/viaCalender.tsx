import { useEffect, useState } from "react"
import { FaChevronLeft, FaChevronRight, FaClock, FaUser, FaPhone, FaEnvelope } from "react-icons/fa"
import { appointmentsApi, type Appointment } from "../../../api/appointments"

function CalendarViewPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const res = await appointmentsApi.getAll({ take: 500 })
        setAppointments(res.result || [])
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load appointments')
      } finally {
        setLoading(false)
      }
    }
    void fetch()
  }, [])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return appointments.filter(apt => (apt.date || '').startsWith(dateStr))
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (day: number) => {
    const { year, month } = getDaysInMonth(currentDate)
    setSelectedDate(new Date(year, month, day))
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const selectedAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : []

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6">
      <h1 className="!text-2xl font-bold mb-6 text-black">Appointment Calendar</h1>

      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {loading && <div className="text-center text-gray-500 py-8">Loading appointments...</div>}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {monthNames[month]} {year}
              </h2>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <FaChevronLeft className="text-gray-600" />
                </button>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <FaChevronRight className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const date = new Date(year, month, day)
                const dayAppointments = getAppointmentsForDate(date)
                const isBooked = dayAppointments.length > 0
                const isSelected = selectedDate?.toDateString() === date.toDateString()
                const isToday = new Date().toDateString() === date.toDateString()

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`p-2 rounded-lg border-2 transition-all min-h-[80px] flex flex-col ${
                      isSelected ? "border-blue-500 bg-blue-50"
                      : isToday ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className={`text-sm font-medium mb-1 ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                      {day}
                    </span>
                    {isBooked && (
                      <div className="flex-1 overflow-hidden">
                        {dayAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className="text-[10px] bg-green-100 text-green-800 px-1 py-0.5 rounded mb-0.5 truncate"
                            title={apt.visitorName || apt.hostName || ''}
                          >
                            {apt.visitorName || apt.hostName || 'Appointment'}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-50 border-2 border-blue-300 rounded" />
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-800 rounded" />
                <span>Has Appointments</span>
              </div>
            </div>
          </div>

          {/* Appointment Details Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedDate
                ? `Appointments - ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : "Select a Date"}
            </h2>

            {selectedDate ? (
              selectedAppointments.length > 0 ? (
                <div className="space-y-4">
                  {selectedAppointments.map(apt => (
                    <div key={apt.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaClock className="text-blue-600" />
                          <span className="font-semibold">{apt.time || '-'}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(apt.status)}`}>
                          {apt.status || 'pending'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaUser className="text-gray-400 text-sm" />
                          <span className="font-medium">{apt.visitorName || apt.hostName || '-'}</span>
                        </div>
                        {apt.department && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <FaPhone className="text-gray-400" />
                            <span>{apt.department}</span>
                          </div>
                        )}
                        {apt.location && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <FaEnvelope className="text-gray-400" />
                            <span className="truncate">{apt.location}</span>
                          </div>
                        )}
                        {apt.purpose && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Reason:</span> {apt.purpose}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No appointments scheduled for this date.</p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Click on a date to view appointments.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarViewPage
