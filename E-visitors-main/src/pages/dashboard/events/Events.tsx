import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import MapChart from '../../../components/ui/MapChart';
import AddEventModal from '../../../components/modals/AddEventModal';
import { eventsApi, type Event } from '../../../api/events';

function EventsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await eventsApi.getAll({ take: 200 });
            setEvents(res.result || []);
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || 'Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void fetchEvents(); }, []);

    const handleSaveEvent = async (eventData: any) => {
        try {
            await eventsApi.create(eventData);
            setIsModalOpen(false);
            await fetchEvents();
        } catch (e: any) {
            console.error('Failed to create event:', e);
        }
    };

    const now = new Date().toISOString();
    const upcomingEvents = events.filter(e => (e.startDate || '') >= now);
    const recentEvents = events.filter(e => (e.startDate || '') < now);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="!text-2xl font-bold text-gray-800">Events & Activities</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                >
                    Create Event
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Visitor Locations</h2>
                <MapChart/>
            </div>

            {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {loading && <div className="text-center text-gray-500 py-8">Loading events...</div>}

            {!loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4 text-blue-600">Upcoming Events</h2>
                        {upcomingEvents.length === 0 ? (
                            <p className="text-gray-500">No upcoming events.</p>
                        ) : (
                            <div className="space-y-4">
                                {upcomingEvents.map(event => (
                                    <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r">
                                        <h3 className="font-medium text-gray-800">{event.name}</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                                            <span className="flex items-center gap-1">
                                                <FaCalendarAlt size={12} />
                                                {event.startDate?.slice(0, 10) || '-'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaClock size={12} />
                                                {event.startDate?.slice(11, 16) || '-'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaMapMarkerAlt size={12} />
                                                {event.location || '-'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaUsers size={12} />
                                                {event.attendeeCount ?? '-'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4 text-green-600">Recent Events</h2>
                        {recentEvents.length === 0 ? (
                            <p className="text-gray-500">No recent events.</p>
                        ) : (
                            <div className="space-y-4">
                                {recentEvents.map(event => (
                                    <div key={event.id} className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 rounded-r">
                                        <h3 className="font-medium text-gray-800">{event.name}</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                                            <span className="flex items-center gap-1">
                                                <FaCalendarAlt size={12} />
                                                {event.startDate?.slice(0, 10) || '-'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaClock size={12} />
                                                {event.startDate?.slice(11, 16) || '-'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaMapMarkerAlt size={12} />
                                                {event.location || '-'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaUsers size={12} />
                                                {event.attendeeCount ?? '-'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600">{upcomingEvents.length}</div>
                        <div className="text-gray-600">Upcoming Events</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="text-3xl font-bold text-green-600">{events.reduce((s, e) => s + (e.attendeeCount || 0), 0)}</div>
                        <div className="text-gray-600">Total Attendees</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="text-3xl font-bold text-orange-600">{events.length}</div>
                        <div className="text-gray-600">Total Events</div>
                    </div>
                </div>
            )}

            <AddEventModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEvent}
            />
        </div>
    );
}
export default EventsPage;
