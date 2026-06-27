import { client } from './clients';

export interface Card {
  id: string;
  cardId?: string;
  status?: string;
  assignedTo?: string;
  assignedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CardCreateRequest {
  cardId: string;
  status?: string;
}

export interface CardUpdateRequest {
  status?: string;
  assignedTo?: string;
}

export const cardsApi = {
  /**
   * Get all cards
   */
  getAll: async (params?: { skip?: number; take?: number }): Promise<{ success: boolean; result: Card[] }> => {
    const { data } = await client.get('/cards', { params });
    return data;
  },

  /**
   * Get available cards
   */
  getAvailable: async (): Promise<{ success: boolean; result: Card[] }> => {
    const { data } = await client.get('/cards/available');
    return data;
  },

  /**
   * Get card by ID
   */
  getById: async (cardId: string): Promise<{ success: boolean; result: Card }> => {
    const { data } = await client.get(`/cards/${cardId}`);
    return data;
  },

  /**
   * Create new card
   */
  create: async (cardData: CardCreateRequest): Promise<{ success: boolean; result: Card }> => {
    const { data } = await client.post('/cards', cardData);
    return data;
  },

  /**
   * Update card
   */
  update: async (cardId: string, cardData: CardUpdateRequest): Promise<{ success: boolean; result: Card }> => {
    const { data } = await client.patch(`/cards/${cardId}`, cardData);
    return data;
  },

  /**
   * Delete card
   */
  delete: async (cardId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await client.delete(`/cards/${cardId}`);
    return data;
  },
};
