# E-Visitors System (EVS) — How It Works

This README explains the front-end architecture and the main flows of the **E-Visitors System** (EVS) found in this repository.

> Note: This is the **frontend** (React + TypeScript + Vite). The backend APIs are called through `src/api/*`.

---

## 1) Tech Stack

- **React (TypeScript)**
- **Vite** for build/dev
- **React Router** for routing
- **@tanstack/react-query** for server state and mutations
- **axios** for API calls
- **react-toastify** for user notifications
- **Tailwind CSS** for styling

Entry points:
- `src/main.tsx` → mounts the app
- `src/App.tsx` → wraps the app with `QueryClientProvider` and `Router`

---

## 2) Application Shell (App + Providers)

### `src/App.tsx`
- Creates a React Query `QueryClient`
- Wraps the app in:
  - `QueryClientProvider` (enables React Query hooks)
  - `Router` (React Router)
  - `ToastContainer` (global toast UI)
- Renders routes from `src/routes/AppRoutes.tsx`

---

## 3) Routing & Navigation

### `src/routes/AppRoutes.tsx`
- Defines public routes:
  - `/` (Home)
  - `/auth/login`
  - `/auth/register`
  - `/auth/reset-password`
  - `/auth/approval_required`

- Defines the main app area:
  - `/dashboard` layout route uses `DashboardLayout`
  - Child routes render page components inside `DashboardLayout` using `<Outlet />`

Important: dashboards are **role-based** at runtime (via user data in `DashboardLayout` / `useAuth`). The URL paths include different modules like:
- `/dashboard/customers/*`
- `/dashboard/users/*`
- `/dashboard/attendance`, `/dashboard/scanning`
- `/dashboard/events`
- `/dashboard/equipments`, `/dashboard/equipments/add`
- `/dashboard/appointments`, `/dashboard/appointments/viaCalender`
- `/dashboard/reports`, `/dashboard/reports/create`
- `/dashboard/handover`
- `/dashboard/security`
- Role dashboards:
  - `/dashboard/helpdesk`
  - `/dashboard/dataManager`
  - `/dashboard/teamLeader`
  - `/dashboard/staff`
  - `/dashboard/protocals`
  - `/dashboard/checkPoint`

---

## 4) Authentication Flow

### Token Storage: `src/lib/auth.ts`
A small token manager controls persistence:
- `tokenManager.saveToken(token, remember)`
  - if `remember=true` → store in `localStorage`
  - else → store in `sessionStorage`
- `tokenManager.getToken()` reads from either storage
- `tokenManager.removeToken()` clears both
- `tokenManager.hasToken()` checks if token exists

### API Client: `src/api/clients.ts`
Uses axios:
- `baseURL: ${appAPI}/api`
- `withCredentials: true` (cookies support)
- Request interceptor:
  - attaches `Authorization: Bearer <token>` when a token exists
- Response interceptor:
  - on `401`:
    - clears token
    - redirects to `/auth/login`

`appAPI` comes from `src/utils/validateEnvs.ts`.

### Auth Hooks: `src/hooks/useAuth.ts`
Implements login/signup/logout + current user loading.

#### Login (`useAuth().login`)
- Calls `authApi.login()` (POST `/auth/login`)
- On success:
  - saves token using `tokenManager.saveToken(accessToken, true)`
  - determines where to navigate after login:
    - if `user.roleType === 'owner'` → `/dashboard`
    - else uses first role name to map into a dashboard path (e.g. `helpdesk`, `data_manager`, `team_leader`, `staff`, etc.)
- On error:
  - if message includes `verification` or `approval` → navigate to `/auth/approval_required`
  - otherwise shows a toast with the error message

#### Signup (`useAuth().signup`)
- Calls `authApi.signup()` (POST `/auth/signup`)
- On success:
  - saves token
  - navigates similarly by role mapping

#### Logout (`useAuth().logout`)
- Calls `authApi.logout()` (POST `/auth/logout`)
- Removes token and clears React Query cache
- Navigates to `/auth/login`

#### Current user (`useQuery`)
- Query key: `['currentUser']`
- Calls `authApi.getCurrentUser()` (GET `/auth/me` with bearer token)
- Enabled only when `tokenManager.hasToken()`
- `staleTime: 5 minutes`

---

## 5) Auth API Details

### `src/api/auth.ts`
- `login(credentials)`
  - sanitizes phone input (removes non-digits)
  - POST `/auth/login`
- `signup(userData)`
  - sanitizes phone input
  - POST `/auth/signup`
- `getCurrentUser()`
  - GET `/auth/me` with `Authorization: Bearer <token>`
- `logout()`
  - POST `/auth/logout`

---

## 6) Dashboard Layout (Role Context)

### `src/layouts/DashboardLayout.tsx`
Responsible for the dashboard UI shell:
- Header: `DashboardHeader`
- Sidebar: `DashboardSidebar`
- Content container renders the route’s component via `<Outlet />`

How it decides what the sidebar should show:
1. Calls `useAuth()` to obtain `currentUser`
2. Determines `userRole`:
   - if `currentUser.roleType === 'owner'` → `owner`
   - else uses `currentUser.roles[0].name` (fallbacks to `client`)

The computed `userRole` + `currentUser` are passed into `DashboardSidebar`.

---

## 7) Typical Module Behavior (How pages work)

Across pages, the pattern generally looks like:
1. A page component loads data using **React Query** (`useQuery`) or triggers updates with **mutations** (`useMutation`).
2. API calls use axios clients that already include:
   - `baseURL`
   - bearer token injection
   - automatic 401 handling
3. UI feedback is given via:
   - `react-toastify` to show success/error messages
   - modal components under `src/components/modals/*` for CRUD actions

For example, there are modal components for:
- Add/Edit/Delete Customer
- Add/Edit/Delete User
- Equipment details and creation
- Appointment scheduling and attendance
- Export reports

---

## 8) Forms & Modals

Modals live in `src/components/modals/`.
They are typically used inside dashboard pages to perform CRUD actions (create/update/delete) without leaving the current screen.

This repo contains many modals, including (non-exhaustive):
- `AddCustomer.tsx`, `EditCustomer.tsx`, `deleteCustomer.tsx`, `SuspendCustomer.tsx`
- `AddUserModal.tsx`, `EditUserModal.tsx`, `DeleteUserModal.tsx`
- `AddEventModal.tsx`, `AppointmentModal.tsx`
- `EquipmentModal.tsx`, `EquipmentDetailsModal.tsx`
- `ExportReportModal.tsx`

---

## 9) Visual Styling & Assets

- Tailwind CSS is enabled via `@tailwindcss/vite` and imported in `src/App.css`.
- `DashboardLayout` uses `src/assets/images/design.png` as a border image effect.
- Login/Register pages use background and border image assets.

---

## 10) Running the Frontend

From the project root:

```bash
npm install
npm run dev
```

Build:
```bash
npm run build
```

Lint:
```bash
npm run lint
```

---

## 11) Environment Variables (Backend URL)

The axios client uses `appAPI` from `src/utils/validateEnvs.ts`.
To make the app work, ensure your backend base URL is configured there (or through the repo’s environment mechanism).

---

# Summary (End-to-End Flow)

1. User opens `/auth/login`.
2. Login form submits email or phone + password.
3. `useAuth.login` calls `/auth/login`, stores token (remember-me logic).
4. App navigates to a role-specific dashboard path.
5. `DashboardLayout` loads `currentUser` with `/auth/me`.
6. Sidebar and pages render the correct modules for that role.
7. All API calls attach the bearer token automatically via axios interceptors.
8. On 401, the user is logged out and redirected to `/auth/login`.

---

If you want, I can also generate a **module-by-module** README (Customers, Users, Attendance, Appointments, Reports, Roles, etc.) using the actual page and modal implementations.
