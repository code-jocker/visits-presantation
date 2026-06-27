import { client } from './clients';

export interface User {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  department?: string;
  company?: string;
  status?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  nationalId?: string;
  scannedId?: string;
  category?: string;
  badge?: string;
}

export interface UserWithDetails extends User {
  lastLogin?: string;
  permissions?: string[];
  visitHistory?: any[];
  activityLog?: any[];
}

export interface UserCreateRequest {
  fullName: string;
  email?: string;
  password?: string;
  scannedId: string;
  phoneNumber?: string;
  status?: string;
  category?: string;
  badge?: string;
  role?: string;
  company?: string;
  department?: string;
  nationalId?: string;
}

export interface UserUpdateRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  department?: string;
  role?: string;
  category?: string;
  company?: string;
  status?: string;
}

export const usersApi = {
  /**
   * Get all users
   */
  getAll: async (params?: { skip?: number; take?: number }): Promise<{ success: boolean; result: User[] }> => {
    const { data } = await client.get('/users', { params });
    return data;
  },

  /**
   * Get user by ID
   */
  getById: async (userId: string): Promise<{ success: boolean; result: User }> => {
    const { data } = await client.get(`/users/${userId}`);
    return data;
  },

  /**
   * Create new user
   */
  create: async (userData: UserCreateRequest): Promise<{ success: boolean; result: User }> => {
    const { data } = await client.post('/users', userData);
    return data;
  },

  /**
   * Update user
   */
  update: async (userId: string, userData: UserUpdateRequest): Promise<{ success: boolean; result: User }> => {
    const { data } = await client.put(`/users/${userId}`, userData);
    return data;
  },

  /**
   * Delete user
   */
  delete: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await client.delete(`/users/${userId}`);
    return data;
  },

  /**
   * Get user's equipment
   */
  getEquipment: async (userId: string): Promise<{ success: boolean; result: any[] }> => {
    const { data } = await client.get(`/users/${userId}/equipment`);
    return data;
  },

  /**
   * Approve (activate) a pending user
   */
  activate: async (userId: string): Promise<{ success: boolean; result: User }> => {
    const { data } = await client.put(`/users/${userId}/activate`);
    return data;
  },

  /**
   * Approve (activate) a pending user
   */
  activate: async (userId: string): Promise<{ success: boolean; result: User }> => {
    const { data } = await client.put(`/users/${userId}/activate`);
    return data;
  },

  /**
   * Search users
   */
  search: async (query: string): Promise<{ success: boolean; result: User[] }> => {
    const { data } = await client.get('/users/search', { params: { q: query } });
    return data;
  },
};
