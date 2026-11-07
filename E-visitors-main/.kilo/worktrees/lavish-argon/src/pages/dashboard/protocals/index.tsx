import { useState } from 'react';
import { FaPlus, FaStar, FaCar, FaUser, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import ProtocolModal from '../../../components/modals/ProtocolModal';

interface Protocol {
    id: number;
    name: string;
    title: string;
    photo: string;
    isVIP: boolean;
    carPlate: string;
    company: string;
    purpose: string;
    securityLevel: 'high' | 'medium' | 'low';
    specialInstructions: string;
    contactPerson: string;
    expectedDate: string;
    expectedTime: string;
}

function ProtocalPage() {
    const [showProtocolModal, setShowProtocolModal] = useState(false);
    const [protocols, setProtocols] = useState<Protocol[]>([
        {
            id: 1,
            name: 'Mayor John Smith',
            title: 'City Mayor',
            photo: '',
            isVIP: true,
            carPlate: 'GOV-001',
            company: 'City Government',
            purpose: 'Official Visit',
            securityLevel: 'high',
            specialInstructions: 'Red carpet reception, security escort required',
            contactPerson: 'Jane Doe - Protocol Officer',
            expectedDate: '2024-02-10',
            expectedTime: '10:00'
        },
        {
            id: 2,
            name: 'Dr. Sarah Johnson',
            title: 'Health Minister',
            photo: '',
            isVIP: true,
            carPlate: 'MIN-045',
            company: 'Ministry of Health',
            purpose: 'Inspection Visit',
            securityLevel: 'high',
            specialInstructions: 'Medical team on standby',
            contactPerson: 'Mike Wilson - Security Head',
            expectedDate: '2024-02-12',
            expectedTime: '14:00'
        }
    ]);

    const [formData, setFormData] = useState<Partial<Protocol>>({
        name: '',
        title: '',
        photo: '',
        isVIP: false,
        carPlate: '',
        company: '',
        purpose: '',
        securityLevel: 'medium',
        specialInstructions: '',
        contactPerson: '',
        expectedDate: '',
        expectedTime: ''
    });

    const handleInputChange = (field: keyof Protocol, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProtocol = () => {
        if (formData.name && formData.title) {
            const newProtocol: Protocol = {
                id: Date.now(),
                name: formData.name || '',
                title: formData.title || '',
                photo: formData.photo || '',
                isVIP: formData.isVIP || false,
                carPlate: formData.carPlate || '',
                company: formData.company || '',
                purpose: formData.purpose || '',
                securityLevel: formData.securityLevel || 'medium',
                specialInstructions: formData.specialInstructions || '',
                contactPerson: formData.contactPerson || '',
                expectedDate: formData.expectedDate || '',
                expectedTime: formData.expectedTime || ''
            };
            setProtocols([...protocols, newProtocol]);
            setShowProtocolModal(false);
            setFormData({
                name: '', title: '', photo: '', isVIP: false, carPlate: '',
                company: '', purpose: '', securityLevel: 'medium',
                specialInstructions: '', contactPerson: '', expectedDate: '', expectedTime: ''
            });
        }
    };

    const handleDeleteProtocol = (id: number) => {
        setProtocols(protocols.filter(p => p.id !== id));
    };

    const getSecurityLevelColor = (level: string) => {
        switch (level) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex flex-col h-screen">

            {/* Header */}
            <div className="flex-shrink-0 mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="!text-2xl font-bold text-gray-900">VIP Protocol Management</h1>
                        <p className="text-gray-600 text-sm">Manage special protocols for VIP visitors</p>
                    </div>
                    <button
                        onClick={() => setShowProtocolModal(true)}
                        className="flex items-center gap-2 bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-[#1A3263]/90 transition-colors"
                    >
                        <FaPlus size={14} />
                        Create Protocol
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-2xl font-bold text-blue-600">{protocols.length}</div>
                        <div className="text-gray-600 text-sm">Total Protocols</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-2xl font-bold text-purple-600">{protocols.filter(p => p.isVIP).length}</div>
                        <div className="text-gray-600 text-sm">VIP Visitors</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-2xl font-bold text-red-600">{protocols.filter(p => p.securityLevel === 'high').length}</div>
                        <div className="text-gray-600 text-sm">High Security</div>
                    </div>
                </div>

                {/* Protocols List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Protocols</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {protocols.map((protocol) => (
                            <div key={protocol.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                        {protocol.photo ? (
                                            <img src={protocol.photo} alt={protocol.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <FaUser className="text-gray-400" size={24} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">{protocol.name}</h3>
                                            {protocol.isVIP && <FaStar className="text-yellow-500" size={14} />}
                                        </div>
                                        <p className="text-sm text-gray-600">{protocol.title}</p>
                                        <p className="text-xs text-gray-500">{protocol.company}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaCar size={12} />
                                        <span className="font-medium">{protocol.carPlate}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSecurityLevelColor(protocol.securityLevel)}`}>
                                            {protocol.securityLevel.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-gray-500">{protocol.expectedDate} {protocol.expectedTime}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-2">{protocol.purpose}</p>
                                </div>

                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                                    <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs">
                                        <FaEye size={12} />
                                        View
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-green-600 hover:bg-green-50 rounded text-xs">
                                        <FaEdit size={12} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProtocol(protocol.id)}
                                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs"
                                    >
                                        <FaTrash size={12} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ProtocolModal
                isOpen={showProtocolModal}
                onClose={() => setShowProtocolModal(false)}
                onSave={handleSaveProtocol}
                formData={formData}
                onInputChange={handleInputChange}
                onPhotoUpload={handlePhotoUpload}
            />
        </div>
    );
}
export default ProtocalPage;