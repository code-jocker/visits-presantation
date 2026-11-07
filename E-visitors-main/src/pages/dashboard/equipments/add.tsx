import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import AddEquipment from "../../../components/modals/addEquipment";
import { equipmentApi, type Equipment, type EquipmentCreateRequest, type EquipmentUpdateRequest } from "../../../api/equipment";

function AddEquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await equipmentApi.getAll({ take: 100 });
      setEquipmentList(response.result || []);
    } catch (err) {
      console.error("Error fetching equipment:", err);
      setError("Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEquipment();
  }, []);

  const openCreateModal = () => {
    setEditingEquipment(null);
    setIsModalOpen(true);
  };

  const openEditModal = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleSubmit = async (equipmentData: EquipmentCreateRequest | EquipmentUpdateRequest) => {
    try {
      setSaving(true);
      if (editingEquipment) {
        await equipmentApi.update(editingEquipment.id, equipmentData);
      } else {
        await equipmentApi.create(equipmentData as EquipmentCreateRequest);
      }
      setIsModalOpen(false);
      setEditingEquipment(null);
      await fetchEquipment();
    } catch (err) {
      console.error("Error saving equipment:", err);
      setError("Failed to save equipment");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async (id: string) => {
    try {
      setSaving(true);
      await equipmentApi.delete(id);
      setShowDeleteConfirm(null);
      await fetchEquipment();
    } catch (err) {
      console.error("Error deleting equipment:", err);
      setError("Failed to delete equipment");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status?: string) => {
    if (status === "available") return "bg-green-100 text-green-800";
    if (status === "inuse") return "bg-blue-100 text-blue-800";
    if (status === "maintenance") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6">
      <div className="flex flex-row items-center justify-between mb-6">
        <h1 className="!text-2xl font-bold text-black">Equipment Management</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center bg-[#1A3263] text-white rounded-lg hover:bg-blue-800 px-4 py-2"
        >
          <FaPlus className="mr-2" /> Add Equipment
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {loading && <div className="text-center py-8 text-gray-500">Loading equipment...</div>}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentList.map(equipment => (
            <div
              key={equipment.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4 bg-blue-50">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 break-words">
                    {equipment.name}
                  </h3>
                  <span className={`shrink-0 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(equipment.status)}`}>
                    {equipment.status || "available"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{equipment.description || "No description"}</p>
              </div>

              <div className="p-4">
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Serial Number</p>
                    <p className="text-sm font-medium text-gray-800">{equipment.serialNumber || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Quantity</p>
                    <p className="text-sm font-medium text-gray-800">{equipment.quantity ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Assigned User</p>
                    <p className="text-sm font-medium text-gray-800 break-all">{equipment.assignedTo || "-"}</p>
                  </div>
                </div>

                <div className="border-t pt-4 flex gap-2">
                  <button
                    onClick={() => openEditModal(equipment)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1A3263] text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    <FaEdit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(equipment.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    <FaTrash size={14} /> Delete
                  </button>
                </div>
              </div>

              {showDeleteConfirm === equipment.id && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg p-6 max-w-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Confirm Delete</h2>
                    <p className="text-gray-600 mb-6">
                      Are you sure you want to delete <strong>{equipment.name}</strong>?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => confirmDelete(equipment.id)}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-60"
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && equipmentList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No equipment found. Add one to get started.</p>
        </div>
      )}

      <AddEquipment
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEquipment(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingEquipment}
        submitting={saving}
      />
    </div>
  );
}

export default AddEquipmentPage;
