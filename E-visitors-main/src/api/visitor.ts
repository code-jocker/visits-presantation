import { client } from './clients'

export type VisitorStatus =
  | 'IN'
  | 'OUT'
  | 'ACTIVE'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'BLACKLISTED'
  | string

export type Visitor = {
  id?: string | number
  fullName: string
  studentName?: string
  studentId?: string | null
  className?: string | null
  classLevel?: string | null
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
  [key: string]: unknown
}

export type CheckOutPayload = {
  visitorId?: string | number
  badgeId?: string
  department?: string
  checkoutReason?: string
  vehicleId?: string
  vehiclePlate?: string
  vehicleType?: string
  [key: string]: unknown
}

export type RecentTap = {
  id: string | number
  visitorName: string
  studentName?: string | null
  studentId?: string | null
  className?: string | null
  classLevel?: string | null
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
    isReturning?: boolean
  }
}

export type ClassItem = {
  id?: string
  name: string
  description?: string | null
  level?: string | null
  isActive?: boolean
}

export type StudentItem = {
  id?: string
  studentId: string
  fullName: string
  email?: string | null
  phoneNumber?: string | null
  admissionNumber?: string | null
  classId?: string | null
  className?: string | null
  classLevel?: string | null
  status: string
}

export type StudentSearchResultItem = {
  id: string
  studentId: string
  fullName: string
  className?: string | null
  classLevel?: string | null
}

export type ClassCreateRequest = {
  name: string
  description?: string
  level?: string
}

export type StudentCreateRequest = {
  studentId: string
  fullName: string
  email?: string
  phoneNumber?: string
  admissionNumber?: string
  classId?: string
  status?: string
}

export type VisitorCreateRequest = Omit<Visitor, 'id' | 'createdAt' | 'updatedAt'>
export type VisitorUpdateRequest = Partial<
  Omit<VisitorCreateRequest, 'entryTime' | 'exitTime'>
> & {
  entryTime?: string | null
  exitTime?: string | null
}

export const classApi = {
  getAll: async (params?: {
    limit?: number
    search?: string
    isActive?: boolean
  }): Promise<{ success: boolean; message: string; result: ClassItem[] }> => {
    const { data } = await client.get('/classes', { params })
    return data
  },

  create: async (payload: ClassCreateRequest): Promise<{ success: boolean; message: string; result: ClassItem }> => {
    const { data } = await client.post('/classes', payload)
    return data
  },

  update: async (
    classId: string,
    payload: Partial<ClassCreateRequest> & { isActive?: boolean }
  ): Promise<{ success: boolean; message: string; result: ClassItem }> => {
    const { data } = await client.put(`/classes/${classId}`, payload)
    return data
  },

  delete: async (classId: string): Promise<{ success: boolean; message: string; result: null }> => {
    const { data } = await client.delete(`/classes/${classId}`)
    return data
  },
}

export const studentApi = {
  getAll: async (params?: {
    limit?: number
    search?: string
    classId?: string
    status?: string
  }): Promise<{ success: boolean; message: string; result: StudentItem[] }> => {
    const { data } = await client.get('/students', { params })
    return data
  },

  search: async (params: {
    q: string
    limit?: number
  }): Promise<{ success: boolean; message: string; result: StudentSearchResultItem[] }> => {
    const { data } = await client.get('/students/search', { params })
    return data
  },

  getById: async (
    studentId: string | number
  ): Promise<{ success: boolean; message: string; result: StudentItem }> => {
    const { data } = await client.get(`/students/${studentId}`)
    return data
  },

  create: async (payload: StudentCreateRequest): Promise<{ success: boolean; message: string; result: StudentItem }> => {
    const { data } = await client.post('/students', payload)
    return data
  },

  update: async (
    studentId: string | number,
    payload: Partial<StudentCreateRequest>
  ): Promise<{ success: boolean; message: string; result: StudentItem }> => {
    const { data } = await client.put(`/students/${studentId}`, payload)
    return data
  },

  delete: async (studentId: string): Promise<{ success: boolean; message: string; result: null }> => {
    const { data } = await client.delete(`/students/${studentId}`)
    return data
  },
}

const normalize = (payload: any) => ({
  ...payload,
  visitor: payload.visitor
    ? {
        ...payload.visitor,
        mobile: payload.visitor.mobile
          ? String(payload.visitor.mobile).replace(/\D/g, '')
          : payload.visitor?.mobile,
      }
    : undefined,
})

export const visitorApi = {
   getAll: async (params?: {
     limit?: number
     query?: string
     status?: string
     department?: string
   }): Promise<{ success: boolean; message: string; result: Visitor[] }> => {
     const { data } = await client.get('/visitors', { params })
     return data
   },

   getSystemFeatures: async (): Promise<{
     success: boolean
     message: string
     result: { selfRegistrationEnabled: boolean; selfCheckoutEnabled: boolean }
   }> => {
     const { data } = await client.get('/visitors/system-features')
     return data
   },

    updateSystemFeature: async (payload: {
      featureKey: string
      isEnabled: boolean
    }): Promise<{ success: boolean; message: string; result: any }> => {
      const { data } = await client.put('/visitors/system-features', payload)
      return data
    },

  getById: async (
    visitorId: string | number
  ): Promise<{ success: boolean; message: string; result: Visitor }> => {
    const { data } = await client.get(`/visitors/${visitorId}`)
    return data
  },

  create: async (
    payload: VisitorCreateRequest
  ): Promise<{ success: boolean; message: string; result: Visitor }> => {
    const { data } = await client.post('/visitors', {
      ...payload,
      mobile: payload.mobile ? String(payload.mobile).replace(/\D/g, '') : payload.mobile,
    })
    return data
  },

  update: async (
    visitorId: string | number,
    payload: VisitorUpdateRequest
  ): Promise<{ success: boolean; message: string; result: Visitor }> => {
    const { data } = await client.put(`/visitors/${visitorId}`, {
      ...payload,
      mobile: payload.mobile ? String(payload.mobile).replace(/\D/g, '') : payload.mobile,
    })
    return data
  },

  delete: async (
    visitorId: string | number
  ): Promise<{ success: boolean; message: string; result: null }> => {
    const { data } = await client.delete(`/visitors/${visitorId}`)
    return data
  },

  faceVerify: async (payload: {
    apiKey: string
    faceImageBase64: string
    department?: string
  }) => {
    const { data } = await client.post('/faces/verify', payload)
    return data
  },

  getRecentTaps: async (params: {
    department?: string
    query?: string
    searchType?: 'name' | 'phone' | 'voice'
    limit?: number
  }): Promise<{ success: boolean; message: string; result: RecentTap[] }> => {
    const { data } = await client.get('/visitors/recent-taps', { params })
    return data
  },

  searchVisitors: async (params: {
    query: string
    searchType: 'name' | 'phone' | 'voice'
    department?: string
    limit?: number
  }): Promise<{
    success: boolean
    message: string
    result: VisitorSearchResult[]
  }> => {
    const { data } = await client.get('/visitors/search', { params })
    return data
  },

  getAppointmentForVisitor: async (params: {
    visitorId?: string
    idNumber?: string
    fullName?: string
    phone?: string
    department?: string
  }): Promise<{ success: boolean; message: string; result: AppointmentDetails }> => {
    const { data } = await client.get('/appointments/for-visitor', { params })
    return data
  },

  // Public kiosk check-in — no JWT required
  // NOTE: tsoa rejects extra top-level properties (throw-on-extras) for this route.
  // Strip keys that are used by the frontend but are not part of the backend schema.
  publicCheckIn: async (
    payload: Omit<CheckInPayload, 'appointmentId'>
  ): Promise<VisitorCheckInResponse> => {
    const { visitorType, date, time, ...rest } = payload as any

    const cleanPayload = {
      ...rest,
    } as Omit<CheckInPayload, 'appointmentId'>

    const { data } = await client.post(
      '/visitors/public-check-in',
      normalize(cleanPayload)
    )
    return data
  },

  checkIn: async (
    payload: CheckInPayload & { appointmentId?: string | number }
  ): Promise<{
    success: boolean
    message: string
    result: { badgeId?: string; visitorId?: string | number }
  }> => {
    const { data } = await client.post(
      '/visitors/check-in',
      normalize(payload)
    )
    return data
  },

  checkOut: async (
    payload: CheckOutPayload
  ): Promise<{
    success: boolean
    message: string
    result: { badgeId?: string; visitorId?: string | number }
  }> => {
    const { data } = await client.post('/visitors/check-out', payload)
    return data
  },

  publicCheckOut: async (
    payload: { badgeId: string }
  ): Promise<{
    success: boolean
    message: string
    result?: { badgeId?: string; visitorId?: string | number; fullName?: string }
  }> => {
    const { data } = await client.post('/visitors/public-check-out', payload)
    return data
  },

  whatsappStatus: async (): Promise<{ success: boolean; message: string; result: { isReady: boolean; hasQR: boolean } }> => {
    const { data } = await client.get('/visitors/whatsapp/status')
    return data
  },

  whatsappQR: async (): Promise<{ success: boolean; message: string; result: { qrCode: string | null } }> => {
    const { data } = await client.get('/visitors/whatsapp/qr')
    return data
  },

  whatsappInit: async (): Promise<{ success: boolean; message: string; result: { isReady: boolean } }> => {
    const { data } = await client.post('/visitors/whatsapp/init')
    return data
  },

  whatsappSend: async (payload: { phoneNumber: string; message?: string }): Promise<{ success: boolean; message: string; result: any }> => {
    const { data } = await client.post('/visitors/whatsapp/send', payload)
    return data
  },
}