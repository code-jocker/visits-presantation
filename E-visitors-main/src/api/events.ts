import { client } from './clients';

export interface Event {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  status?: string;
  attendeeCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventCreateRequest {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  status?: string;
}

export interface EventUpdateRequest {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  status?: string;
}

export const eventsApi = {
  /**
   * Get all events
   */
  getAll: async (params?: { skip?: number; take?: number }): Promise<{ success: boolean; result: Event[] }> => {
    const { data } = await client.get('/events', { params });
    return data;
  },

  /**
   * Get event by ID
   */
  getById: async (eventId: string): Promise<{ success: boolean; result: Event }> => {
    const { data } = await client.get(`/events/${eventId}`);
    return data;
  },

  /**
   * Create new event
   */
  create: async (eventData: EventCreateRequest): Promise<{ success: boolean; result: Event }> => {
    const { data } = await client.post('/events', eventData);
    return data;
  },

  /**
   * Update event
   */
  update: async (eventId: string, eventData: EventUpdateRequest): Promise<{ success: boolean; result: Event }> => {
    const { data } = await client.patch(`/events/${eventId}`, eventData);
    return data;
  },

  /**
   * Delete event
   */
  delete: async (eventId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await client.delete(`/events/${eventId}`);
    return data;
  },

  /**
   * Search events
   */
  search: async (query: string): Promise<{ success: boolean; result: Event[] }> => {
    const { data } = await client.get('/events/search', { params: { q: query } });
    return data;
  },
};
