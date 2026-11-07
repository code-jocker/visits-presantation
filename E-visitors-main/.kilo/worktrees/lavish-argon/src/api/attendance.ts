import { client } from './clients';

export interface Attendance {
  id: string;
  userId: string;
  checkIn: string;
  checkOut?: string;
  date: string;
  status: string;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceReport {
  userId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  percentage: number;
}

export interface AttendanceCreateRequest {
  userId: string;
  checkIn?: string;
  checkOut?: string;
  date: string;
  status?: string;
}

export const attendanceApi = {
  /**
   * Get all attendance records
   */
  getAll: async (params?: { skip?: number; take?: number }): Promise<{ success: boolean; result: Attendance[] }> => {
    const { data } = await client.get('/attendance', { params });
    return data;
  },

  /**
   * Get attendance by ID
   */
  getById: async (attendanceId: string): Promise<{ success: boolean; result: Attendance }> => {
    const { data } = await client.get(`/attendance/${attendanceId}`);
    return data;
  },

  /**
   * Get attendance by user ID
   */
  getByUser: async (userId: string, params?: { skip?: number; take?: number }): Promise<{ success: boolean; result: Attendance[] }> => {
    const { data } = await client.get(`/attendance/by-user/${userId}`, { params });
    return data;
  },

  /**
   * Get attendance by date
   */
  getByDate: async (date: string): Promise<{ success: boolean; result: Attendance[] }> => {
    const { data } = await client.get(`/attendance/by-date/${date}`);
    return data;
  },

  /**
   * Get attendance report for date range
   */
  getReport: async (startDate: string, endDate: string): Promise<{ success: boolean; result: AttendanceReport[] }> => {
    const { data } = await client.get(`/attendance/report/range/${startDate}/${endDate}`);
    return data;
  },

  /**
   * Get user attendance report for date range
   */
  getUserReport: async (userId: string, startDate: string, endDate: string): Promise<{ success: boolean; result: AttendanceReport }> => {
    const { data } = await client.get(`/attendance/report/user/${userId}/${startDate}/${endDate}`);
    return data;
  },

  /**
   * Create attendance record
   */
  create: async (attendanceData: AttendanceCreateRequest): Promise<{ success: boolean; result: Attendance }> => {
    const { data } = await client.post('/attendance', attendanceData);
    return data;
  },

  /**
   * Update attendance record
   */
  update: async (attendanceId: string, attendanceData: Partial<AttendanceCreateRequest>): Promise<{ success: boolean; result: Attendance }> => {
    const { data } = await client.patch(`/attendance/${attendanceId}`, attendanceData);
    return data;
  },

  /**
   * Delete attendance record
   */
  delete: async (attendanceId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await client.delete(`/attendance/${attendanceId}`);
    return data;
  },
};
