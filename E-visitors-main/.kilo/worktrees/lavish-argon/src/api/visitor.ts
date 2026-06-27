import { client } from './clients'

export type VisitorStatus = 'IN' | 'OUT' | 'ACTIVE' | 'CHECKED_IN' | 'CHECKED_OUT' | string

export type Visitor = {
  id?: string | number
  fullName: string
  mobile?: string
  email?: string
  visitorCompany?: string
  purpose?: string
  department?: string
  hostName?: string
  idProofType?: string
  idNumber?: string
  passType?: string
  status?: VisitorStatus
  badgeId?: string
  profilePhoto?: string
  entryTime?: string
  exitTime?: string
  createdAt?: string
  updatedAt?: string
}

export type VisitorSearchResult = {
  id: string | number
  fullName: string
  mobile?: string
  email?: string
  visitorCompany?: string
  purpose?: string
  department?: string
  hostName?: string
  documentType?: string
  entryTime?: string
  exitTime?: string
  badgeId?: string
  status?: VisitorStatus
}

export type AppointmentDetails = {
  visitorName: string
  hostName: string
  hostStatus?: 'in' | 'out'
  hostAvailability?: 'available' | 'not-available' | string
  appointmentTime?: string
  purpose?: string
  department?: string
}

export type CheckInPayload = {
  visitor: Visitor
  verificationMode?: string
  appointmentId?: string | number
  department?: string
  badgeType?: 'QR' | 'RFID' | string
  vehicleId?: string
  vehiclePlate?: string
  vehicleType?: string
}

export type CheckOutPayload = {
  visitorId?: string | number
  badgeId?: string
  department?: string
  checkoutReason?: string
  vehicleId?: string
  vehiclePlate?: string
  vehicleType?: string
}

export type RecentTap = {
  id: string | number
  visitorName: string
  documentType?: string
  phoneNumber?: string
  entryTime?: string
  exitTime?: string
  department?: string
}

export type VisitorCheckInResponse = {
  success: boolean
  message?: string
  result?: {
    badgeId?: string
    visitorId?: string | number
  }
}

export type VisitorCreateRequest = Omit<Visitor, 'id' | 'createdAt' | 'updatedAt'>
export type VisitorUpdateRequest = Partial<Omit<VisitorCreateRequest, 'entryTime' | 'exitTime'>> & {
  entryTime?: string | null
  exitTime?: string | null
}

const normalize = (payload: any) => ({
  ...payload,
  visitor: {
    ...payload.visitor,
    mobile: payload.visitor?.mobile ? String(payload.visitor.mobile).replace(/\D/g, '') : payload.visitor?.mobile,
  },
})

export const visitorApi = {
  getAll: async (params?: {
    limit?: number;
    query?: string;
    status?: string;
    department?: string;
  }): Promise<{ success: boolean; message: string; result: Visitor[] }> => {
    const { data } = await client.get('/visitors', { params });
    return data;
  },

  getById: async (visitorId: string | number): Promise<{ success: boolean; message: string; result: Visitor }> => {
    const { data } = await client.get(`/visitors/${visitorId}`);
    return data;
  },

  create: async (payload: VisitorCreateRequest): Promise<{ success: boolean; message: string; result: Visitor }> => {
    const { data } = await client.post('/visitors', {
      ...payload,
      mobile: payload.mobile ? String(payload.mobile).replace(/\D/g, '') : payload.mobile,
    });
    return data;
  },

  update: async (visitorId: string | number, payload: VisitorUpdateRequest): Promise<{ success: boolean; message: string; result: Visitor }> => {
    const { data } = await client.put(`/visitors/${visitorId}`, {
      ...payload,
      mobile: payload.mobile ? String(payload.mobile).replace(/\D/g, '') : payload.mobile,
    });
    return data;
  },

  delete: async (visitorId: string | number): Promise<{ success: boolean; message: string; result: null }> => {
    const { data } = await client.delete(`/visitors/${visitorId}`);
    return data;
  },

  faceVerify: async (payload: { apiKey: string; faceImageBase64: string; department?: string }) => {
    const { data } = await client.post('/faces/verify', payload);
    return data;
  },

  getRecentTaps: async (params: {
    department?: string;
    query?: string;
    searchType?: 'name' | 'phone' | 'voice';
    limit?: number;
  }): Promise<{ success: boolean; message: string; result: RecentTap[] }> => {
    const { data } = await client.get('/visitors/recent-taps', { params });
    return data;
  },

  searchVisitors: async (params: {
    query: string;
    searchType: 'name' | 'phone' | 'voice';
    department?: string;
    limit?: number;
  }): Promise<{ success: boolean; message: string; result: VisitorSearchResult[] }> => {
    const { data } = await client.get('/visitors/search', { params });
    return data;
  },

  getAppointmentForVisitor: async (params: {
    visitorId?: string;
    idNumber?: string;
    fullName?: string;
    phone?: string;
    department?: string;
  }): Promise<{ success: boolean; message: string; result: AppointmentDetails }> => {
    const { data } = await client.get('/appointments/for-visitor', { params });
    return data;
  },

  // Public kiosk check-in — no JWT required
  publicCheckIn: async (payload: Omit<CheckInPayload, 'appointmentId'>): Promise<{ success: boolean; message: string; result: { badgeId?: string; visitorId?: string | number } }> => {
    const { data } = await client.post('/visitors/public-check-in', normalize(payload));
    return data;
  },

  checkIn: async (payload: CheckInPayload & { appointmentId?: string | number }): Promise<{ success: boolean; message: string; result: { badgeId?: string; visitorId?: string | number } }> => {
    const { data } = await client.post('/visitors/check-in', normalize(payload));
    return data;
  },

  checkOut: async (payload: CheckOutPayload): Promise<{ success: boolean; message: string; result: { badgeId?: string; visitorId?: string | number } }> => {
    const { data } = await client.post('/visitors/check-out', payload);
    return data;
  },
};
