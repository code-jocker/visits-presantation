import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import type { Equipment, EquipmentCreateRequest, EquipmentUpdateRequest } from "../../api/equipment";

type EquipmentFormData = EquipmentCreateRequest & { id?: string };

interface AddEquipmentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (equipmentData: EquipmentCreateRequest | EquipmentUpdateRequest) => Promise<void> | void;
  initialData?: Equipment | null;
  submitting?: boolean;
}

const statuses = ["available", "inuse", "maintenance", "damaged", "lost"];

const emptyForm: EquipmentFormData = {
  name: "",
  serialNumber: "",
  quantity: 1,
  status: "available",
  assignedTo: "",
  description: "",
};

function AddEquipment({ isOpen, onClose, onSubmit, initialData, submitting = false }: AddEquipmentProps) {
  const [formData, setFormData] = useState<EquipmentFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof EquipmentFormData, string>>>({});

  useEffect(() => {
    if (!isOpen) return;

    setFormData(initialData ? {
      id: initialData.id,
      name: initialData.name || "",
      serialNumber: initialData.serialNumber || "",
      quantity: initialData.quantity ?? 1,
      status: initialData.status || "available",
      assignedTo: initialData.assignedTo || "",
      description: initialData.description || "",
    } : emptyForm);
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof EquipmentFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Equipment name is required";
    }
    if (formData.quantity !== undefined && Number(formData.quantity) < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));

    if (errors[name as keyof EquipmentFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await onSubmit({
      name: formData.name.trim(),
      serialNumber: formData.serialNumber?.trim() || null,
      quantity: Number(formData.quantity ?? 0),
      status: formData.status || "available",
      assignedTo: formData.assignedTo?.trim() || null,
      description: formData.description?.trim() || null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {initialData ? "Edit Equipment" : "Add New Equipment"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipment Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Laptop Dell XPS 13"
              className={`w-full text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serial Number
              </label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber || ""}
                onChange={handleInputChange}
                placeholder="e.g., SN123456"
                className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="0"
                name="quantity"
                value={formData.quantity ?? 0}
                onChange={handleInputChange}
                className={`w-full px-4 text-black py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned User ID
              </label>
              <input
                type="text"
                name="assignedTo"
                value={formData.assignedTo || ""}
                onChange={handleInputChange}
                placeholder="Leave empty if unassigned"
                className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        <div className="p-6 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-[#1A3263] text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60"
          >
            {submitting ? "Saving..." : initialData ? "Save Changes" : "Add Equipment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEquipment;
