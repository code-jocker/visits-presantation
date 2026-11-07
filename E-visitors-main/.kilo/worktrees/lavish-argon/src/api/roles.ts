import { client } from './clients';

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
  userCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleCreateRequest {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface RoleUpdateRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

export const rolesApi = {
  /**
   * Get all roles
   */
  getAll: async (params?: { page?: number; limit?: number }): Promise<{ success: boolean; result: Role[] }> => {
    const { data } = await client.get('/roles', { params: { page: params?.page ?? 1, limit: params?.limit ?? 100 } });
    return data;
  },

  /**
   * Get role by ID
   */
  getById: async (roleId: string): Promise<{ success: boolean; result: Role }> => {
    const { data } = await client.get(`/roles/${roleId}`);
    return data;
  },

  /**
   * Create new role
   */
  create: async (roleData: RoleCreateRequest): Promise<{ success: boolean; result: Role }> => {
    const { data } = await client.post('/roles', roleData);
    return data;
  },

  /**
   * Update role
   */
  update: async (roleId: string, roleData: RoleUpdateRequest): Promise<{ success: boolean; result: Role }> => {
    const { data } = await client.patch(`/roles/${roleId}`, roleData);
    return data;
  },

  /**
   * Delete role
   */
  delete: async (roleId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await client.delete(`/roles/${roleId}`);
    return data;
  },
};

export const permissionsApi = {
  /**
   * Get all permissions
   */
  getAll: async (params?: { skip?: number; take?: number }): Promise<{ success: boolean; result: Permission[] }> => {
    const { data } = await client.get('/permissions', { params });
    return data;
  },

  /**
   * Get permission by ID
   */
  getById: async (permissionId: string): Promise<{ success: boolean; result: Permission }> => {
    const { data } = await client.get(`/permissions/${permissionId}`);
    return data;
  },

  /**
   * Create new permission
   */
  create: async (permissionData: Permission): Promise<{ success: boolean; result: Permission }> => {
    const { data } = await client.post('/permissions', permissionData);
    return data;
  },

  /**
   * Update permission
   */
  update: async (permissionId: string, permissionData: Partial<Permission>): Promise<{ success: boolean; result: Permission }> => {
    const { data } = await client.patch(`/permissions/${permissionId}`, permissionData);
    return data;
  },

  /**
   * Delete permission
   */
  delete: async (permissionId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await client.delete(`/permissions/${permissionId}`);
    return data;
  },
};
