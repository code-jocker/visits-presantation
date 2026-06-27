import { client } from './clients';

export interface Equipment {
  id: string;
  name: string;
  serialNumber?: string;
  quantity?: number;
  assignedTo?: string | null;
  status?: 'available' | 'inuse' | 'maintenance' | 'damaged' | 'lost' | string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EquipmentCreateRequest {
  name: string;
  serialNumber?: string | null;
  quantity?: number;
  assignedTo?: string | null;
  status?: string;
  description?: string | null;
}

export interface EquipmentUpdateRequest {
  name?: string;
  serialNumber?: string | null;
  quantity?: number;
  assignedTo?: string | null;
  status?: string;
  description?: string | null;
}

export const equipmentApi = {
  /**
   * Get all equipment
   */
  getAll: async (params?: { skip?: number; take?: number }): Promise<{ success: boolean; result: Equipment[] }> => {
    const { data } = await client.get('/equipments', { params });
    return data;
  },

  /**
   * Get equipment by ID
   */
  getById: async (equipmentId: string): Promise<{ success: boolean; result: Equipment }> => {
    const { data } = await client.get(`/equipments/${equipmentId}`);
    return data;
  },

  /**
   * Create new equipment
   */
  create: async (equipmentData: EquipmentCreateRequest): Promise<{ success: boolean; result: Equipment }> => {
    const { data } = await client.post('/equipments', equipmentData);
    return data;
  },

  /**
   * Update equipment
   */
  update: async (equipmentId: string, equipmentData: EquipmentUpdateRequest): Promise<{ success: boolean; result: Equipment }> => {
    const { data } = await client.put(`/equipments/${equipmentId}`, equipmentData);
    return data;
  },

  /**
   * Delete equipment
   */
  delete: async (equipmentId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await client.delete(`/equipments/${equipmentId}`);
    return data;
  },

  /**
   * Assign equipment to a user
   */
  assign: async (equipmentId: string, userId: string): Promise<{ success: boolean; result: Equipment }> => {
    const { data } = await client.put(`/equipments/${equipmentId}/assign`, { userId });
    return data;
  },

  /**
   * Return equipment from a user
   */
  return: async (equipmentId: string, userId: string): Promise<{ success: boolean; result: Equipment }> => {
    const { data } = await client.put(`/equipments/${equipmentId}/return/${userId}`);
    return data;
  },
};
