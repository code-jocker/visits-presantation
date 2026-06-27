import React from 'react';
import { FaTimes, FaLaptop, FaMobile, FaCamera, FaTabletAlt, FaPlug } from 'react-icons/fa';

interface EquipmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitorName: string;
  equipmentList: string[];
}

const EquipmentDetailsModal: React.FC<EquipmentDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  visitorName, 
  equipmentList 
}) => {
  const getEquipmentIcon = (equipment: string) => {
    const item = equipment.toLowerCase();
    if (item.includes('laptop')) return <FaLaptop className="text-blue-600" size={20} />;
    if (item.includes('phone')) return <FaMobile className="text-green-600" size={20} />;
    if (item.includes('camera')) return <FaCamera className="text-purple-600" size={20} />;
    if (item.includes('tablet')) return <FaTabletAlt className="text-orange-600" size={20} />;
    if (item.includes('charger')) return <FaPlug className="text-red-600" size={20} />;
    return <div className="w-5 h-5 bg-gray-400 rounded"></div>;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Equipment Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">{visitorName}</h3>
          <p className="text-sm text-gray-500">Equipment carried by this visitor</p>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {equipmentList.map((equipment, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {getEquipmentIcon(equipment)}
              <span className="text-sm font-medium text-gray-800">{equipment}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailsModal;