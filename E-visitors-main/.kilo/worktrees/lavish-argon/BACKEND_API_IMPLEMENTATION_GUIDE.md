# Backend API Implementation Guide

## Endpoints to Implement

These endpoints need to be implemented in your backend to fully replace the mock data:

### 1. System Health Monitoring Endpoints

#### GET /api/system/status
Returns overall system health status
```typescript
Response: {
  overall: 'healthy' | 'warning' | 'critical',
  uptime: string, // e.g., "99.8%"
  lastIncident: string, // e.g., "12 days ago"
  lastUpdated: string // ISO timestamp
}
```

#### GET /api/system/services
Returns list of service health statuses
```typescript
Response: {
  result: [
    {
      name: string,
      status: 'healthy' | 'warning' | 'error',
      uptime: string,
      responseTime: string, // e.g., "45ms"
      lastChecked: string // ISO timestamp
    }
  ]
}
```

#### GET /api/system/metrics
Returns server performance metrics
```typescript
Response: {
  result: [
    {
      name: string,
      value: string,
      status: 'healthy' | 'warning' | 'error',
      unit?: string
    }
  ]
}
```

#### GET /api/system/alerts
Returns recent system alerts
```typescript
Response: {
  result: [
    {
      time: string,
      type: 'warning' | 'info' | 'error',
      message: string,
      resolved: boolean,
      id: string
    }
  ]
}
```

#### GET /api/system/performance
Returns performance metrics
```typescript
Response: {
  result: [
    {
      metric: string,
      value: string,
      trend: 'up' | 'down' | 'stable'
    }
  ]
}
```

---

### 2. Security Endpoints

#### GET /api/security/threats
Returns list of security threats
```typescript
Response: {
  result: [
    {
      id: string,
      ipAddress: string,
      deviceInfo: string,
      location: string,
      threatType: 'Brute Force' | 'SQL Injection' | 'XSS Attack' | 'DDoS' | 'Malware',
      severity: 'Low' | 'Medium' | 'High' | 'Critical',
      timestamp: string, // ISO timestamp
      attempts: number,
      status: 'Active' | 'Blocked' | 'Monitoring'
    }
  ]
}
```

---

### 3. Forms Management Endpoints

#### GET /api/forms
Returns list of all forms
```typescript
Response: {
  result: [
    {
      id: string,
      title: string,
      description: string,
      createdDate: string, // ISO date
      status: 'Active' | 'Draft' | 'Archived',
      responses: number,
      allowedRoles: string[], // e.g., ['admin', 'manager']
      startTime?: string, // ISO timestamp
      endTime?: string, // ISO timestamp
      createdBy: string,
      lastModified: string
    }
  ]
}
```

#### POST /api/forms
Create new form (if needed)
```typescript
Request: {
  title: string,
  description: string,
  status: 'Active' | 'Draft' | 'Archived',
  allowedRoles: string[]
}

Response: {
  id: string,
  ...form data
}
```

#### PUT /api/forms/:id
Update form (if needed)
```typescript
Request: {
  title?: string,
  description?: string,
  status?: 'Active' | 'Draft' | 'Archived'
}

Response: {
  ...updated form data
}
```

#### DELETE /api/forms/:id
Delete form (if needed)
```typescript
Response: {
  success: boolean,
  message: string
}
```

---

## Existing API Usage (Already Implemented)

These APIs are already being used and should continue to work:

### User Management
```
GET /api/users - Get all users
GET /api/users/:id - Get user by ID
POST /api/users - Create user
PUT /api/users/:id - Update user
DELETE /api/users/:id - Delete user

Query parameters:
- take: number (limit results)
- status: 'Active' | 'Inactive' | 'Suspended' | 'Blacklisted'
```

### Visitor Management
```
GET /api/visitor/recent-taps - Get recent visitor taps/check-ins
GET /api/visitor - Get all visitors
POST /api/visitor - Create visitor record
```

### Appointments
```
GET /api/appointments - Get all appointments
GET /api/appointments/:id - Get appointment by ID
POST /api/appointments - Create appointment
PUT /api/appointments/:id - Update appointment

Query parameters:
- take: number
- appointmentDate: string (ISO date)
```

### Equipment
```
GET /api/equipment - Get all equipment
POST /api/equipment/:id/assign - Assign equipment to user
POST /api/equipment/:id/return - Return equipment
```

---

## Implementation Notes

1. **Error Handling**: All endpoints should return proper HTTP status codes
   - 200: Success
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Server Error

2. **Response Format**: All endpoints should follow the standard response format:
```typescript
{
  result: T | T[] | null,
  message?: string,
  error?: string,
  success: boolean,
  timestamp: string
}
```

3. **Authentication**: Add JWT token validation to all endpoints

4. **Pagination**: For large datasets, consider implementing:
```typescript
GET /api/endpoint?take=10&skip=0&page=1
```

5. **Filtering**: Add query parameter support for filtering:
```typescript
GET /api/users?status=Active&role=Manager
GET /api/visitor?from_date=2024-01-01&to_date=2024-12-31
```

6. **Caching**: Implement caching for system metrics that don't change frequently

7. **Real-time Updates**: For system health and alerts, consider:
   - WebSocket connections for live updates
   - Server-Sent Events (SSE)
   - Polling intervals

---

## Frontend Fallback Behavior

All pages have fallback mock data that will be used if:
1. Backend endpoint is not available
2. API call fails
3. No internet connection

Once backend endpoints are ready, the fallback data will be automatically replaced.

To remove fallback data after backend implementation:
1. Remove the `setXxx([...fallback_data])` calls in catch blocks
2. Optionally show error UI instead of falling back to mock data

---

## Testing the Integration

### Manual Testing Steps:

1. **With Backend Running**:
   - Open each page
   - Verify data loads from backend
   - Check console for any API errors
   - Test search/filter functionality

2. **Without Backend**:
   - Stop backend server
   - Verify fallback mock data displays
   - Check error messages in console

3. **Network Simulation**:
   - Use Chrome DevTools to throttle network
   - Verify loading states display correctly
   - Test timeout behavior

### Automated Testing:

Consider adding integration tests:
```typescript
describe('System Health Page', () => {
  it('should fetch system health from API', async () => {
    // Mock API call
    // Render component
    // Wait for data to load
    // Assert data is displayed
  })

  it('should show fallback data on API error', async () => {
    // Mock failed API call
    // Render component
    // Assert fallback data is displayed
  })
})
```

---

## Deployment Checklist

- [ ] All backend endpoints implemented
- [ ] API authentication configured
- [ ] CORS properly configured
- [ ] Database queries optimized
- [ ] Error handling in place
- [ ] Logging configured
- [ ] Rate limiting applied
- [ ] Frontend tested with backend
- [ ] Removed all hardcoded mock data references
- [ ] Performance tested with large datasets
- [ ] Security audit completed
