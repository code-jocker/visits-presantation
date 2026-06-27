# Mock Data Removal - Implementation Guide

## Overview
This document guides the removal of mock/hardcoded data from the E-Visitors frontend and replacing it with real API calls.

## Completed Changes ✅

### API Services Created
All API service files have been created in `src/api/`:
- `users.ts` - User management API
- `equipment.ts` - Equipment management API
- `roles.ts` - Roles and permissions API
- `events.ts` - Event management API
- `cards.ts` - Card management API
- `attendance.ts` - Attendance tracking API
- `appointments.ts` - Appointment management API
- `analytics.ts` - Analytics and dashboard data API
- `visitor.ts` - Visitor management (already existed)
- `auth.ts` - Authentication (already existed)

### Pages Updated with API Integration ✅
1. **src/pages/Dashboard.tsx** - System owner dashboard now fetches real user and visitor data
2. **src/pages/dashboard/users/index.tsx** - User management page uses API calls

## Remaining Work

### Priority 1 - Core Management Pages
These pages are frequently used and should be updated first:

#### 1. **src/pages/dashboard/attendance/ScanningPage.tsx**
- **Mock Data**: `countryCodes` array (5 items)
- **Solution**: Keep countryCodes as config - it's not data, just for phone input
- **Remaining**: Remove any other test/hardcoded visitor data

#### 2. **src/pages/dashboard/equipments/Equipment.tsx**
- **Mock Data**: `equipmentData` array with 4 items
- **Solution**: 
  ```typescript
  import { equipmentApi } from '../../../api/equipment'
  
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await equipmentApi.getAll({ take: 100 })
        if (response.success) setEquipment(response.result || [])
      } catch (err) {
        console.error('Error fetching equipment:', err)
      }
    }
    fetchEquipment()
  }, [])
  ```

#### 3. **src/pages/dashboard/events/Events.tsx**
- **Mock Data**: `upcomingEvents` and `recentEvents` arrays
- **Solution**: Fetch from `eventsApi.getAll()` and filter by date

#### 4. **src/pages/dashboard/appointment/Appointment.tsx**
- **Mock Data**: `appointments` array
- **Solution**: Use `appointmentsApi.getAll()` and `appointmentsApi.getByDate()`

### Priority 2 - Role-Based Dashboards
These are specific to different user roles:

#### 1. **src/pages/dashboard/Roles/superAdmin/index.tsx**
- **Mock Data**: `stats`, `recentVisitors`
- **Solution**: Use `analyticsApi.getDashboardStats()` and `visitorApi.getRecentTaps()`

#### 2. **src/pages/dashboard/Roles/staff/index.tsx**
- **Mock Data**: `upcomingAppointments`, `assignedEquipment`
- **Solution**: Fetch user's appointments and equipment

#### 3. **src/pages/dashboard/Roles/helpDesk/index.tsx**
- **Mock Data**: Check-in/check-out visitors
- **Solution**: Filter visitors by status from `visitorApi.getRecentTaps()`

#### 4. **src/pages/dashboard/Roles/teamLeader/index.tsx**
- **Mock Data**: `securityWorkers`, `recentSecurityActions`
- **Solution**: Fetch team members and their actions

#### 5. **src/pages/dashboard/Roles/check point/index.tsx**
- **Mock Data**: Check-in/check-out stats
- **Solution**: Calculate from real visitor data

### Priority 3 - Informational Pages
These pages show general information (can use minimal real data):

#### 1. **src/pages/Services.tsx**
- **Decision**: Services are product features - can keep as configuration
- **Action**: Move to config file if not already there

#### 2. **src/pages/About.tsx**
- **Decision**: Team/company info - move to config or CMS
- **Action**: Create separate config file for about page data

#### 3. **src/pages/Contact.tsx**
- **Decision**: Contact info - move to environment variables or config

### Priority 4 - Other Pages
#### src/pages/dashboard/handover/index.tsx
#### src/pages/dashboard/reports/index.tsx
#### src/pages/dashboard/security/index.tsx

## Common Pattern for Updates

### 1. Add imports at the top
```typescript
import { useState, useEffect } from 'react'
import { someApi } from '../../../api/someName'
```

### 2. Replace hardcoded arrays with state
```typescript
// Before
const items = [
  { id: 1, name: 'Item 1' },
  // ...
]

// After
const [items, setItems] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
```

### 3. Add useEffect to fetch data
```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await someApi.getAll()
      if (response.success) {
        setItems(response.result || [])
      }
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  fetchData()
}, [])
```

### 4. Add loading and error states to UI
```typescript
{loading && <p>Loading...</p>}
{error && <p className="text-red-500">{error}</p>}
{items.length === 0 && <p>No data found</p>}
{!loading && !error && items.map(item => ...)}
```

## Testing Checklist

For each updated page:
- [ ] Build succeeds with `npm run build`
- [ ] Page loads without errors in browser
- [ ] Data displays correctly from API
- [ ] Loading state shows briefly
- [ ] Error handling works (test by disconnecting API)
- [ ] Filters and searches work with real data
- [ ] Create/Update/Delete operations work (if applicable)

## Environment Configuration

Ensure `.env` file has:
```
VITE_API_URL=http://localhost:3000  # Backend server address
```

## Next Steps

1. Update Priority 1 pages
2. Test in browser
3. Update Priority 2 pages
4. Update Priority 3 pages
5. Remove any remaining hardcoded data
6. Full system testing

## Notes

- Keep utility functions and configurations (like countryCodes, themes, etc.)
- Only replace data that comes from/should come from the backend
- Test each change incrementally
- Use TypeScript types from API services
- Handle errors gracefully
