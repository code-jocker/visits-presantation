import { client } from './clients';

export interface Appointment {
  id: string;
  visitorId?: string;
  visitorName?: string;
  hostId?: string;
  hostName?: string;
  departmentId?: string;
  department?: string;
  date?: string;
  time?: string;
  purpose?: string;
  status?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentCreateRequest {
  visitorId?: string;
  visitorName?: string;
  hostId?: string;
  hostName?: string;
  department?: string;
  date?: string;
  time?: string;
  purpose?: string;
  location?: string;
}

export interface AppointmentUpdateRequest {
  visitorName?: string;
  hostName?: string;
  department?: string;
  date?: string;
  time?: string;
  purpose?: string;
  status?: string;
  location?: string;
}

export const appointmentsApi = {
  /**
   * Get all appointments
   */
  getAll: async (params?: { skip?: number; take?: number }): Promise<{ success: boolean; result: Appointment[] }> => {
    const { data } = await client.get('/appointments', { params });
    return data;
  },

  /**
   * Get appointment by ID
   */
  getById: async (appointmentId: string): Promise<{ success: boolean; result: Appointment }> => {
    const { data } = await client.get(`/appointments/${appointmentId}`);
    return data;
  },

  /**
   * Get appointments by user
   */
  getByUser: async (userId: string): Promise<{ success: boolean; result: Appointment[] }> => {
    const { data } = await client.get(`/appointments/user/${userId}`);
    return data;
  },

  /**
   * Get appointments by date
   */
  getByDate: async (date: string): Promise<{ success: boolean; result: Appointment[] }> => {
    const { data } = await client.get(`/appointments/date/${date}`);
    return data;
  },

  /**
   * Get appointments by department
   */
  getByDepartment: async (department: string): Promise<{ success: boolean; result: Appointment[] }> => {
    const { data } = await client.get(`/appointments/department/${department}`);
    return data;
  },

  /**
   * Get appointments by host
   */
  getByHost: async (hostId: string): Promise<{ success: boolean; result: Appointment[] }> => {
    const { data } = await client.get(`/appointments/host/${hostId}`);
    return data;
  },

  /**
   * Get appointments by time
   */
  getByTime: async (time: string): Promise<{ success: boolean; result: Appointment[] }> => {
    const { data } = await client.get(`/appointments/time/${time}`);
    return data;
  },

  /**
   * Get appointments by location
   */
  getByLocation: async (location: string): Promise<{ success: boolean; result: Appointment[] }> => {
    const { data } = await client.get(`/appointments/location/${location}`);
    return data;
  },

  /**
   * Get appointments for visitor
   */
  getForVisitor: async (): Promise<{ success: boolean; result: Appointment[] }> => {
    const { data } = await client.get('/appointments/for-visitor');
    return data;
  },

  /**
   * Create new appointment
   */
  create: async (appointmentData: AppointmentCreateRequest): Promise<{ success: boolean; result: Appointment }> => {
    const { data } = await client.post('/appointments', appointmentData);
    return data;
  },

  /**
   * Update appointment
   */
  update: async (appointmentId: string, appointmentData: AppointmentUpdateRequest): Promise<{ success: boolean; result: Appointment }> => {
    const { data } = await client.patch(`/appointments/${appointmentId}`, appointmentData);
    return data;
  },

  /**
   * Delete appointment
   */
  delete: async (appointmentId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await client.delete(`/appointments/${appointmentId}`);
    return data;
  },

  /**
   * Search appointments
   */
  search: async (query: string): Promise<{ success: boolean; result: Appointment[] }> => {
    const { data } = await client.get('/appointments/search', { params: { q: query } });
    return data;
  },
};
