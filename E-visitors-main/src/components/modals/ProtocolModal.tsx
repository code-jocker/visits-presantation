import { FaUser, FaStar } from 'react-icons/fa'

interface Protocol {
    name: string
    title: string
    photo: string
    isVIP: boolean
    carPlate: string
    company: string
    purpose: string
    securityLevel: 'high' | 'medium' | 'low'
    specialInstructions: string
    contactPerson: string
    expectedDate: string
    expectedTime: string
}

interface ProtocolModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: Partial<Protocol>) => void
    formData: Partial<Protocol>
    onInputChange: (field: keyof Protocol, value: any) => void
    onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function ProtocolModal({ isOpen, onClose, onSave, formData, onInputChange, onPhotoUpload }: ProtocolModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <style dangerouslySetInnerHTML={{
                __html: `
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `
            }} />
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">Create VIP Protocol</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto  hide-scrollbar p-6 space-y-4">
                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                {formData.photo ? (
                                    <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <FaUser className="text-gray-400" size={32} />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onPhotoUpload}
                                className="text-sm text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => onInputChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                                placeholder="e.g., Mayor John Smith"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title/Position *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => onInputChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                                placeholder="e.g., City Mayor"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organization</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => onInputChange('company', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                                placeholder="e.g., City Government"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Car Plate Number</label>
                            <input
                                type="text"
                                value={formData.carPlate}
                                onChange={(e) => onInputChange('carPlate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                                placeholder="e.g., GOV-001"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit</label>
                        <input
                            type="text"
                            value={formData.purpose}
                            onChange={(e) => onInputChange('purpose', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="e.g., Official Visit"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Date</label>
                            <input
                                type="date"
                                value={formData.expectedDate}
                                onChange={(e) => onInputChange('expectedDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Time</label>
                            <input
                                type="time"
                                value={formData.expectedTime}
                                onChange={(e) => onInputChange('expectedTime', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Security Level</label>
                        <select
                            value={formData.securityLevel}
                            onChange={(e) => onInputChange('securityLevel', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.isVIP}
                                onChange={(e) => onInputChange('isVIP', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium text-gray-700">Mark as VIP</span>
                            <FaStar className="text-yellow-500" size={14} />
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                        <input
                            type="text"
                            value={formData.contactPerson}
                            onChange={(e) => onInputChange('contactPerson', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="e.g., Jane Doe - Protocol Officer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                        <textarea
                            value={formData.specialInstructions}
                            onChange={(e) => onInputChange('specialInstructions', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="e.g., Red carpet reception, security escort required"
                        />
                    </div>
                </div>

                <div className="flex-shrink-0 bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-200 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-black border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        className="px-4 py-2 bg-[#1A3263] text-white rounded-lg hover:bg-[#1A3263]/90 transition-colors"
                    >
                        Create Protocol
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProtocolModal
