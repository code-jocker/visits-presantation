import { useEffect, useState } from 'react';
import { FaSearch, FaUndo, FaUserCheck } from 'react-icons/fa';
import { equipmentApi, type Equipment as EquipmentRecord } from '../../../api/equipment';

function Equipment() {
    const [equipmentData, setEquipmentData] = useState<EquipmentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [assignUserIds, setAssignUserIds] = useState<Record<string, string>>({});

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await equipmentApi.getAll({ take: 100 });
            setEquipmentData(response.result || []);
        } catch (err) {
            console.error('Error fetching equipment:', err);
            setError('Failed to load equipment data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchEquipment();
    }, []);

    const handleAssign = async (equipmentId: string) => {
        const userId = assignUserIds[equipmentId]?.trim();
        if (!userId) {
            setError('Enter a user ID before assigning equipment');
            return;
        }

        try {
            setSavingId(equipmentId);
            setError(null);
            await equipmentApi.assign(equipmentId, userId);
            setAssignUserIds(prev => ({ ...prev, [equipmentId]: '' }));
            await fetchEquipment();
        } catch (err) {
            console.error('Error assigning equipment:', err);
            setError('Failed to assign equipment');
        } finally {
            setSavingId(null);
        }
    };

    const handleReturn = async (equipment: EquipmentRecord) => {
        if (!equipment.assignedTo) {
            setError('Equipment is not currently assigned');
            return;
        }

        try {
            setSavingId(equipment.id);
            setError(null);
            await equipmentApi.return(equipment.id, equipment.assignedTo);
            await fetchEquipment();
        } catch (err) {
            console.error('Error returning equipment:', err);
            setError('Failed to return equipment');
        } finally {
            setSavingId(null);
        }
    };

    const filteredData = equipmentData.filter((eq) => {
        const query = searchTerm.toLowerCase();
        return (
            eq.name?.toLowerCase().includes(query) ||
            eq.serialNumber?.toLowerCase().includes(query) ||
            eq.description?.toLowerCase().includes(query) ||
            eq.status?.toLowerCase().includes(query) ||
            eq.assignedTo?.toLowerCase().includes(query)
        );
    });

    const getStatusColor = (status?: string) => {
        if (status === 'available') return 'bg-green-100 text-green-800';
        if (status === 'inuse') return 'bg-blue-100 text-blue-800';
        if (status === 'maintenance') return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
                <h1 className="!text-2xl font-bold text-gray-800">Equipment Tracking</h1>
                <div className="relative w-full md:w-80">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search equipment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {loading && <div className="text-center py-8 text-gray-500">Loading equipment data...</div>}
            
            {!loading && (
                <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                    <table className="w-full min-w-[980px]">
                        <thead className="bg-[#1A3263]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Equipment
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Serial Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Assigned To
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Assign / Return
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        No equipment found
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((equipment) => (
                                    <tr key={equipment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{equipment.name}</div>
                                            <div className="text-xs text-gray-500 max-w-xs truncate">{equipment.description || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{equipment.serialNumber || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{equipment.quantity ?? 0}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 break-all max-w-[180px]">{equipment.assignedTo || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                                                {equipment.status || 'available'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {equipment.assignedTo ? (
                                                <button
                                                    onClick={() => handleReturn(equipment)}
                                                    disabled={savingId === equipment.id}
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-white text-sm hover:bg-gray-700 disabled:opacity-60"
                                                >
                                                    <FaUndo size={13} /> Return
                                                </button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="User ID"
                                                        value={assignUserIds[equipment.id] || ''}
                                                        onChange={(e) => setAssignUserIds(prev => ({ ...prev, [equipment.id]: e.target.value }))}
                                                        className="w-44 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                    />
                                                    <button
                                                        onClick={() => handleAssign(equipment.id)}
                                                        disabled={savingId === equipment.id}
                                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1A3263] text-white text-sm hover:bg-blue-700 disabled:opacity-60"
                                                    >
                                                        <FaUserCheck size={13} /> Assign
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && (
                <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                        Showing {filteredData.length} of {equipmentData.length} entries
                    </div>
                </div>
            )}
        </div>
    );
}

export default Equipment;
