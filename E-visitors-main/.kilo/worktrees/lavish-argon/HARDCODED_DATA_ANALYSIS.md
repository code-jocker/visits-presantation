# Frontend Hardcoded Data Analysis Report
**Generated:** June 1, 2026  
**Analysis Scope:** All page files in `src/pages/` directory  
**Total Pages Analyzed:** 33 pages  
**Pages with Hardcoded Data:** 28+ pages  

---

## Executive Summary

This report identifies all hardcoded mock data, static values, and arrays in frontend pages that should be replaced with API calls from the backend. The analysis reveals:

- ✅ **8 API endpoints** already exist and are partially implemented
- ❌ **10 API endpoints** need to be created in the backend
- 📊 **28 pages** contain hardcoded business data needing API integration
- 📄 **3 pages** contain intentional static content (About, Services, Contact)

---

## Detailed Findings by Page

### 🎯 CRITICAL PRIORITY - Missing Backend Endpoints

#### 1. **AllForms.tsx** - Forms Management
- **Path:** `src/pages/dashboard/forms/AllForms.tsx`
- **Hardcoded Data:** 
  - `forms` array (4 mock form records with titles, descriptions, status)
  - Form metadata includes: id, title, description, createdDate, status, responses count
- **Required API Endpoint:** `formsApi.getAll()` or `formsApi.getForms()`
- **Data Structure:**
  ```typescript
  Form {
    id: string
    title: string
    description: string
    createdDate: string
    status: 'Active' | 'Draft' | 'Archived'
    responses: number
    allowedRoles: string[]
    startTime?: string
    endTime?: string
  }
  ```
- **Backend Action:** Create endpoint at `/api/forms` with GET all, GET by ID, CREATE, UPDATE, DELETE
- **Note:** AllForms has comment "Mock forms data"

#### 2. **Customers/Accounts Pages** - Customer Management
- **Path:** `src/pages/dashboard/accounts/index.tsx`
- **Hardcoded Data:**
  - `customers` array (5+ mock customer records)
  - Fields: id, companyName, contactPerson, email, plan, users, monthlyRevenue, status, joinDate
- **Required API Endpoint:** `customersApi.getAll()` or `accountsApi.getAll()`
- **Data Structure:**
  ```typescript
  Customer {
    id: number
    companyName: string
    contactPerson: string
    email: string
    phone?: string
    plan: string ('Enterprise' | 'Professional' | 'Basic')
    users: number
    monthlyRevenue: number
    status: string ('Active' | 'Suspended' | 'Inactive')
    joinDate: string
  }
  ```
- **Backend Action:** Create `/api/customers` or `/api/accounts` endpoint
- **Note:** Has comment "Mock customer data"

#### 3. **CustomerDetail.tsx** - Individual Customer Details
- **Path:** `src/pages/dashboard/accounts/CustomerDetail.tsx`
- **Hardcoded Data:**
  - `customer` object (TechCorp Solutions mock profile)
  - `availableUsers` array (4 mock users)
  - `blacklistedUsers` array (2 blacklisted entries)
  - `verificationTools` array (9 verification method configs)
  - `visitHistory` array (3 mock visits)
  - `activityLog` array (3 activity entries)
- **Required API Endpoint:** `customersApi.getById(customerId)`
- **Backend Action:** Extend customer endpoint to return full details with related data
- **Note:** Comments in code say "Mock customer data" and "Mock users for search"

#### 4. **Notification.tsx** - Notifications System
- **Path:** `src/pages/dashboard/notifications/Notification.tsx`
- **Hardcoded Data:**
  - `notifications` array (5 mock notification records)
  - Fields: id, title, message, type, timestamp, read, category
- **Required API Endpoint:** `notificationsApi.getAll()` or similar
- **Data Structure:**
  ```typescript
  Notification {
    id: number
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    timestamp: string
    read: boolean
    category: string
  }
  ```
- **Backend Action:** Create `/api/notifications` endpoint with real-time support
- **Note:** Notifications currently use local state management

#### 5. **Sub&billing.tsx** - Billing & Subscriptions
- **Path:** `src/pages/dashboard/payment/Sub&billing.tsx`
- **Hardcoded Data:**
  - `stats` array (4 billing metrics: Total Revenue, Active Subscriptions, MRR, Overdue Payments)
  - `subscriptions` array (3+ mock subscription records)
  - `invoices` array (3+ mock invoice records)
  - `plans` array (pricing plans)
- **Required API Endpoints:**
  - `billingApi.getSubscriptions()`
  - `billingApi.getInvoices()`
  - `billingApi.getBillingStats()`
- **Data Structures:**
  ```typescript
  Subscription {
    id: number
    company: string
    email: string
    plan: string
    price: string
    status: 'Active' | 'Suspended'
    nextBilling: string
    users: number
  }
  
  Invoice {
    id: string
    company: string
    amount: number
    date: string
    dueDate: string
    status: 'Paid' | 'Pending' | 'Overdue'
  }
  ```
- **Backend Action:** Create `/api/billing`, `/api/subscriptions`, `/api/invoices` endpoints

#### 6. **SystemHealth (healthly/index.tsx)** - System Monitoring
- **Path:** `src/pages/dashboard/healthly/index.tsx`
- **Hardcoded Data:**
  - `services` array (6 service status records: API Gateway, Database, Auth, File Storage, Email, Backup)
  - `serverMetrics` array (4 metrics: CPU, Memory, Disk, Network)
  - `recentAlerts` array (4 system alerts with timestamps)
  - `performanceMetrics` array (Response time, RPS, Error Rate, Connections)
- **Required API Endpoint:** `systemHealthApi.getStatus()` or `monitoringApi.getMetrics()`
- **Backend Action:** Create `/api/system-health` endpoint with real-time metric collection
- **Note:** Comment says "Mock system health data"

#### 7. **Security.tsx** - Security Threats & Monitoring
- **Path:** `src/pages/dashboard/security/index.tsx`
- **Hardcoded Data:**
  - `threats` array (3 security threat records)
  - Fields: id, ipAddress, deviceInfo, location, threatType, severity, timestamp, attempts, status
- **Required API Endpoint:** `securityApi.getThreats()` or `threatsApi.getAll()`
- **Backend Action:** Create `/api/security/threats` endpoint
- **Note:** Comment says "Mock security threats data"

#### 8. **Handover Index (handover/index.tsx)** - Shift Handover Management
- **Path:** `src/pages/dashboard/handover/index.tsx`
- **Hardcoded Data:**
  - `stats` array (Total Handovers, Completed Today, Pending, Issues)
  - `handovers` array (3 handover records with staff details and items)
- **Required API Endpoint:** `handoverApi.getAll()` - may partially exist in backend
- **Backend Action:** Create/complete `/api/handover` endpoint

#### 9. **Reports Index (reports/index.tsx)** - Report Management
- **Path:** `src/pages/dashboard/reports/index.tsx`
- **Hardcoded Data:**
  - `reports` array (4 mock report records)
  - Fields: id, title, type, createdBy, createdAt, lastModified, status, downloads
- **Required API Endpoint:** `reportsApi.getAll()` or similar
- **Backend Action:** Create `/api/reports` endpoint

#### 10. **Hosting Index (hosting/index.tsx)** - Hosting Management
- **Path:** `src/pages/dashboard/hosting/index.tsx`
- **Hardcoded Data:**
  - `stats` array (hosting statistics)
  - `hosts` array (mock host records)
- **Required API Endpoint:** `hostingApi.getAll()`
- **Backend Action:** Create `/api/hosting` endpoint

---

### ⚠️ HIGH PRIORITY - Existing APIs Needing Enhancement

#### 11. **Dashboard.tsx** - Main Dashboard
- **Path:** `src/pages/Dashboard.tsx`
- **Current Status:** PARTIALLY IMPLEMENTED
- **Hardcoded Data Remaining:**
  - `primaryStats` - needs better calculation logic
  - `criticalAlerts` - dynamically built but could be optimized
  - `revenueBreakdown` - calculated from user roles
  - `businessActivity` - constructed from visitor data
- **APIs Used:** ✅ `usersApi.getAll()`, ✅ `visitorApi.getRecentTaps()`
- **Enhancement Needed:** Add dedicated dashboard stats endpoint
- **Recommendation:** Create `analyticsApi.getDashboardStats()` for single consolidated call

#### 12. **UserDetail.tsx** - User Profile
- **Path:** `src/pages/dashboard/users/UserDetail.tsx`
- **Hardcoded Data:**
  - `user` object (John Smith mock profile)
  - `visitHistory` array
  - `activityLog` array
- **Required API Enhancement:** `usersApi.getById(userId)` should return visit history & activity log
- **Note:** Code comment says "Mock user data - replace with actual data from API/props"
- **Backend Action:** Enhance user endpoint to include related visit/activity data

#### 13. **Business-Analytics.tsx** - Analytics Dashboard
- **Path:** `src/pages/dashboard/analytics/Business-Analytics.tsx`
- **Hardcoded Data:**
  - `kpiMetrics` array (hardcoded values and growth %)
  - `revenueByPlan` array (Enterprise/Professional/Basic breakdown)
  - `topCustomers` array (top 3 customers by revenue)
  - `customerGrowth` array (monthly trends)
  - Generated `analyticsData` (simulated 50-day history)
- **Required API Enhancement:** `analyticsApi` needs more detailed methods
- **Missing Methods:**
  - `analyticsApi.getRevenueByPlan()`
  - `analyticsApi.getTopCustomers()`
  - `analyticsApi.getCustomerGrowth(dateRange)`
  - `analyticsApi.getRevenueHistory(startDate, endDate)`
- **Backend Action:** Extend `/api/analytics` with revenue and customer endpoints

#### 14. **Events.tsx** - Event Management
- **Path:** `src/pages/dashboard/events/Events.tsx`
- **Hardcoded Data:**
  - `upcomingEvents` array (3 mock events)
  - `recentEvents` array (3 past events)
- **Current API:** ✅ `eventsApi.getAll()` exists
- **Enhancement Needed:** Filter logic for upcoming vs. past events
- **Backend Action:** Ensure events endpoint includes date fields for filtering

#### 15. **Appointment Calendar (viaCalender.tsx)** - Appointments
- **Path:** `src/pages/dashboard/appointment/viaCalender.tsx`
- **Hardcoded Data:**
  - `appointments` array (3 mock appointments)
- **Current API:** ✅ `appointmentsApi.getAll()` exists
- **Enhancement Needed:** None - already set up for API integration
- **Status:** Should be straightforward to implement

#### 16. **AttendedVisitors.tsx** - Visitor Attendance Report
- **Path:** `src/pages/dashboard/attendance/AttendedVisitors.tsx`
- **Hardcoded Data:**
  - `stats` array (attendance stats)
  - `attendedVisitors` array (visitor records)
- **Current APIs:** ✅ `visitorApi`, ✅ `attendanceApi`
- **Enhancement Needed:** Combine visitor + attendance data
- **Recommendation:** Create compound query for attended visitors

#### 17. **Attendance Index (attendance/index.tsx)**
- **Path:** `src/pages/dashboard/attendance/index.tsx`
- **Hardcoded Data:**
  - `departments` array (list of departments)
- **Current API:** ✅ `visitorApi.getAll()`
- **Status:** Using API but departments are hardcoded
- **Enhancement:** Should fetch departments from backend or user endpoint

#### 18. **Suspended Customers (suspended/index.tsx)**
- **Path:** `src/pages/dashboard/accounts/suspended/index.tsx`
- **Hardcoded Data:**
  - `customers` array (2 suspended customer records)
- **Required API:** Once `customersApi` exists, filter by status='Suspended'
- **Note:** Comment says "Mock suspended customer data"

#### 19. **Active Users (active/index.tsx)** & **Inactive Users (inactive/index.tsx)**
- **Paths:** 
  - `src/pages/dashboard/users/active/index.tsx`
  - `src/pages/dashboard/users/inactive/index.tsx`
- **Hardcoded Data:**
  - `activeUsers` / `inactiveUsers` arrays
- **Current API:** ✅ `usersApi.getAll()` exists
- **Status:** Can filter by status field
- **Enhancement:** Minimal - just filter results

---

### 📊 MEDIUM PRIORITY - Configuration Data (Lower Priority)

#### 20. **Attendance/ScanningPage.tsx**
- **Path:** `src/pages/dashboard/attendance/ScanningPage.tsx`
- **Hardcoded Data:**
  - `countryCodes` array (phone validation)
  - `verificationModes` array (Face, Fingerprint, QR, etc.)
- **Type:** Configuration data, not business data
- **Priority:** LOW - These are system configurations
- **Note:** Already implements API for visitor scanning

#### 21. **Equipment Pages**
- **Path:** `src/pages/dashboard/equipments/`
- **Status:** ✅ Already uses `equipmentApi.getAll()`
- **No additional work needed**

#### 22. **Forms Creation (createForm/index.tsx)**
- **Path:** `src/pages/dashboard/forms/createForm/index.tsx`
- **Hardcoded Data:**
  - `questions` array (form questions)
- **Status:** Depends on forms API creation
- **Enhancement:** Once forms API exists, fetch questions from backend

#### 23. **Protocols Index (protocals/index.tsx)**
- **Path:** `src/pages/dashboard/protocals/index.tsx`
- **Hardcoded Data:**
  - `protocols` array (initially populated from uploads)
- **Required API:** `protocolsApi.getAll()`
- **Backend Action:** Create `/api/protocols` endpoint

---

### 🎨 LOW PRIORITY - Static/Marketing Content (Intentional)

#### 24. **About.tsx** - Company About Page
- **Path:** `src/pages/About.tsx`
- **Hardcoded Data:**
  - `stats` array (company statistics for display)
  - `values` array (company values)
  - `timeline` array (company history)
  - `team` array (team members)
- **Type:** Static marketing content
- **Priority:** ❌ DO NOT CHANGE - This is intentional
- **Note:** This should remain hardcoded or in CMS

#### 25. **Services.tsx** - Services Page
- **Path:** `src/pages/Services.tsx`
- **Hardcoded Data:**
  - `services` array (service descriptions)
  - `pricing` array (pricing plans)
- **Type:** Static marketing content
- **Priority:** ❌ DO NOT CHANGE - This is intentional

#### 26. **Contact.tsx** - Contact Page
- **Path:** `src/pages/Contact.tsx`
- **Hardcoded Data:**
  - `contactInfo` array (office locations)
  - `socialLinks` array (social media links)
- **Type:** Static content
- **Priority:** ❌ DO NOT CHANGE - This is intentional

---

### 🔑 AUTHENTICATION & CONFIGURATION (Non-Business Data)

#### 27-29. **Auth Pages** (LoginPage.tsx, RegisterPage.tsx, ResetPasswordPage.tsx)
- **Paths:** `src/pages/auth/`
- **Hardcoded Data:**
  - `countries` array (for form dropdowns)
- **Type:** Configuration data
- **Priority:** LOW - Not business data
- **Status:** Can be moved to constants/config file if needed

---

## API Integration Priority Matrix

### Phase 1: Critical (Sprint 1-2)
| Page | API Needed | Backend Endpoint | Complexity |
|------|-----------|-----------------|-----------|
| AllForms | formsApi | `/api/forms` | Medium |
| Customers | customersApi | `/api/customers` | Medium |
| Notifications | notificationsApi | `/api/notifications` | Medium |
| Billing | billingApi | `/api/billing`, `/api/invoices` | High |

### Phase 2: Important (Sprint 3-4)
| Page | API Needed | Backend Endpoint | Complexity |
|------|-----------|-----------------|-----------|
| Business Analytics | analyticsApi (enhanced) | `/api/analytics/revenue` | Medium |
| System Health | systemHealthApi | `/api/system-health` | High |
| Security | securityApi | `/api/security/threats` | Medium |
| Reports | reportsApi | `/api/reports` | Medium |

### Phase 3: Nice to Have (Sprint 5+)
| Page | API Needed | Backend Endpoint | Complexity |
|------|-----------|-----------------|-----------|
| Handover | handoverApi | `/api/handover` | Low-Medium |
| Hosting | hostingApi | `/api/hosting` | Low |
| Protocols | protocolsApi | `/api/protocols` | Low |

---

## Implementation Checklist

### Backend Tasks
- [ ] Create `formsApi` endpoint at `/api/forms` with CRUD operations
- [ ] Create `customersApi` endpoint at `/api/customers` with CRUD operations
- [ ] Create `notificationsApi` endpoint at `/api/notifications`
- [ ] Create `billingApi` endpoint at `/api/billing` with subscriptions & invoices
- [ ] Create `systemHealthApi` endpoint at `/api/system-health`
- [ ] Create `securityApi` endpoint at `/api/security/threats`
- [ ] Create `handoverApi` endpoint at `/api/handover`
- [ ] Create `reportsApi` endpoint at `/api/reports`
- [ ] Enhance `analyticsApi` with revenue and customer methods
- [ ] Enhance `usersApi.getById()` to include visit history and activity log
- [ ] Add department endpoint or include in users/visitors response

### Frontend Tasks
- [ ] Update `AllForms.tsx` to use `formsApi.getAll()`
- [ ] Update `Customers/Accounts` pages to use `customersApi`
- [ ] Update `Notification.tsx` to use `notificationsApi`
- [ ] Update `Sub&billing.tsx` to use `billingApi`
- [ ] Update `Dashboard.tsx` to use enhanced analytics endpoint
- [ ] Update `Business-Analytics.tsx` with new analytics methods
- [ ] Update `UserDetail.tsx` to fetch from `usersApi.getById()`
- [ ] Update `Events.tsx` to properly filter upcoming/past events
- [ ] Update `AttendedVisitors.tsx` to use compound visitor+attendance query
- [ ] Remove mock data comments and hardcoded arrays

---

## Code Quality Notes

### Comments Found
Several files explicitly mention mock data in comments:
```
// Mock user data - replace with actual data from API/props         (UserDetail.tsx)
// Mock customer data                                              (Customers/accounts)
// Mock suspended customer data                                   (suspended/index.tsx)
// Mock analytics data                                            (Business-Analytics.tsx)
// Mock system health data                                        (healthly/index.tsx)
// Mock security threats data                                     (security/index.tsx)
// Mock forms data                                                (AllForms.tsx)
```

These should be replaced with actual API calls.

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total Pages Analyzed | 33 |
| Pages with Hardcoded Business Data | 28 |
| Pages with Static/Config Data | 5 |
| Existing API Endpoints | 8 |
| Missing API Endpoints | 10 |
| Pages Ready for API Integration | 8 |
| Pages Needing Minor Enhancements | 10 |
| Pages Needing Major Refactoring | 10 |
| Intentional Static Content Pages | 3 |

---

## Recommendations

1. **Immediate Actions:**
   - Prioritize the 4 Phase 1 critical APIs
   - Start with Customers API (most blocking for other features)
   - Parallel work on Forms API

2. **Development Strategy:**
   - Create API layer first (backend)
   - Update pages incrementally (frontend)
   - Use mock data during development, switch to API when ready
   - Add loading and error states

3. **Testing:**
   - Create integration tests for each API endpoint
   - Test data transformation between backend and frontend
   - Test loading/error states in UI

4. **Documentation:**
   - Document all new API endpoints
   - Create TypeScript interfaces for all responses
   - Update API client files as new endpoints are added

---

**Report Generated:** June 1, 2026  
**Analysis Tool:** Automated Frontend Data Audit  
**Next Review:** Upon completion of Phase 1 implementation
