import { client } from './clients';

export interface Notification {
  id: string;
  recipientId: string;
  recipientType: 'user' | 'visitor';
  title: string;
  message: string;
  type: string;
  relatedId?: string;
  relatedType?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequest {
  recipientId: string;
  recipientType: 'user' | 'visitor';
  title: string;
  message: string;
  type: string;
  relatedId?: string;
  relatedType?: string;
}

export const notificationsApi = {
  getMyNotifications: async (params?: {
    isRead?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; result: Notification[] }> => {
    const { data } = await client.get('/notifications', { params });
    return data;
  },

  getUnreadCount: async (): Promise<{ success: boolean; result: { count: number } }> => {
    const { data } = await client.get('/notifications/unread-count');
    return data;
  },

  getById: async (id: string): Promise<{ success: boolean; result: Notification }> => {
    const { data } = await client.get(`/notifications/${id}`);
    return data;
  },

  markAsRead: async (id: string): Promise<{ success: boolean; result: Notification }> => {
    const { data } = await client.put(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async (): Promise<{ success: boolean }> => {
    const { data } = await client.put('/notifications/read-all');
    return data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await client.delete(`/notifications/${id}`);
    return data;
  },

  deleteAllRead: async (): Promise<{ success: boolean }> => {
    const { data } = await client.delete('/notifications');
    return data;
  },

  notifyHostAppointmentRequest: async (payload: {
    hostName: string;
    visitorName: string;
    visitorCompany?: string;
    visitorPhoto?: string;
    appointmentId?: string;
    department?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    purpose?: string;
  }): Promise<{ success: boolean; result: Notification }> => {
    const { data } = await client.post('/notifications/appointment-request', payload);
    return data;
  },

   notifyVisitorStatusUpdate: async (payload: {
    visitorId: string;
    status: string;
    appointmentId?: string;
    approvedTime?: string;
    meetingRoom?: string;
    hostName?: string;
    rejectionReason?: string;
    rescheduledDate?: string;
    rescheduledTime?: string;
  }): Promise<{ success: boolean; result: Notification }> => {
    const { data } = await client.post('/notifications/visitor-status', payload);
    return data;
  },

  sendMultiChannelNotification: async (payload: {
    hostId?: string;
    visitorId?: string;
    title: string;
    message: string;
    channels: ('email' | 'sms' | 'teams' | 'slack' | 'push' | 'inApp')[];
    visitorPhoto?: string;
    visitorCompany?: string;
    purpose?: string;
    appointmentDate?: string;
    appointmentTime?: string;
  }): Promise<{ success: boolean; result: Notification }> => {
    const { data } = await client.post('/notifications/send-multi-channel', payload);
    return data;
  },
};
