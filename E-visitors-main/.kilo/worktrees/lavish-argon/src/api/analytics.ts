import { client } from './clients';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalVisitors: number;
  totalEvents: number;
  totalRevenue?: number;
  monthlyRevenue?: number;
  activeSubscriptions?: number;
  systemUptime?: number;
}

export interface AnalyticsData {
  period: string;
  value: number;
  growth?: number;
}

export interface RevenueByPlan {
  plan: string;
  customers: number;
  revenue: number;
  percentage: number;
  growth?: number;
}

export interface AttendanceAnalytics {
  date: string;
  totalUsers: number;
  presentUsers: number;
  absentUsers: number;
  attendanceRate: number;
}

export const analyticsApi = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<{ success: boolean; result: DashboardStats }> => {
    const { data } = await client.get('/analytics/dashboard-stats');
    return data;
  },

  /**
   * Get attendance analytics for a date range
   */
  getAttendanceAnalytics: async (startDate: string, endDate: string): Promise<{ success: boolean; result: AttendanceAnalytics[] }> => {
    const { data } = await client.get('/analytics/attendance', {
      params: { startDate, endDate }
    });
    return data;
  },

  /**
   * Get revenue analytics
   */
  getRevenueAnalytics: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<{ success: boolean; result: AnalyticsData[] }> => {
    const { data } = await client.get('/analytics/revenue', {
      params: { period }
    });
    return data;
  },

  /**
   * Get visitor analytics
   */
  getVisitorAnalytics: async (startDate?: string, endDate?: string): Promise<{ success: boolean; result: AnalyticsData[] }> => {
    const { data } = await client.get('/analytics/visitors', {
      params: { startDate, endDate }
    });
    return data;
  },

  /**
   * Get event analytics
   */
  getEventAnalytics: async (startDate?: string, endDate?: string): Promise<{ success: boolean; result: AnalyticsData[] }> => {
    const { data } = await client.get('/analytics/events', {
      params: { startDate, endDate }
    });
    return data;
  },

  /**
   * Get system health status
   */
  getSystemHealth: async (): Promise<{ success: boolean; result: any }> => {
    const { data } = await client.get('/analytics/system-health');
    return data;
  },

  /**
   * Get top visitors by frequency
   */
  getTopVisitors: async (limit?: number): Promise<{ success: boolean; result: any[] }> => {
    const { data } = await client.get('/analytics/top-visitors', {
      params: { limit }
    });
    return data;
  },

  /**
   * Get active user sessions
   */
  getActiveSessions: async (): Promise<{ success: boolean; result: any[] }> => {
    const { data } = await client.get('/analytics/active-sessions');
    return data;
  },
};
