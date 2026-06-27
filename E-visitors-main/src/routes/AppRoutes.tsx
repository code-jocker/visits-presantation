import { Routes, Route } from 'react-router-dom'
import Home from '../pages/dashboard/Home'
import About from '../pages/About'
import Services from '../pages/Services'
import Contact from '../pages/Contact'

import DashboardLayout from '../layouts/DashboardLayout'
import Dashboard from '../pages/Dashboard'
import UserDetails from '../pages/dashboard/users/UserDetail'
import ActiveUsers from '../pages/dashboard/users/active'
import InactiveUsers from '../pages/dashboard/users/inactive'
import BlacklistedUsers from '../pages/dashboard/users/blacklisted'

import SystemHealthly from '../pages/dashboard/healthly'
import Notifications from '../pages/dashboard/notifications/Notification'
import Settings from '../pages/dashboard/settings/Setting'
import Login from '../pages/auth/LoginPage'
import Register from '../pages/auth/RegisterPage'
import ResetPassword from '../pages/auth/ResetPasswordPage'
import Hostmanagement from '../pages/dashboard/hosting'
import Customers from '../pages/dashboard/accounts'
import ActiveCustomers from '../pages/dashboard/accounts/active'
import InactiveCustomers from '../pages/dashboard/accounts/inactive'
import SuspendedCustomers from '../pages/dashboard/accounts/suspended'
import BlacklistedCustomers from '../pages/dashboard/accounts/blacklisted'
import CustomerDetail from '../pages/dashboard/accounts/CustomerDetail'
import SubBillingsPage from '../pages/dashboard/payment/Sub&billing'
import Users from '../pages/dashboard/users'
import BusinessAnalytics from '../pages/dashboard/analytics/Business-Analytics'
import ReportPage from '../pages/dashboard/reports'
import ScanningPage from '../pages/dashboard/attendance/ScanningPage'
import EventsPage from '../pages/dashboard/events/Events'
import Equipment from '../pages/dashboard/equipments/Equipment'
import AddEquipmentPage from '../pages/dashboard/equipments/add'
import AppointmentPage from '../pages/dashboard/appointment/Appointment'
import FormPage from '../pages/dashboard/forms'
import CreateForm from '../pages/dashboard/forms/createForm'
import Security from '../pages/dashboard/security'
import CreateReport from '../pages/dashboard/reports/createReport'
import CalendarViewPage from '../pages/dashboard/appointment/viaCalender'
import HandoverManagement from '../pages/dashboard/handover'
import HelpDeskDashboard from '../pages/dashboard/Roles/helpDesk'
import DataManagerDashboard from '../pages/dashboard/Roles/dataManager'
import TeamLeader from '../pages/dashboard/Roles/teamLeader'
import CheckPoint from '../pages/dashboard/Roles/check point'
import Attendance from '../pages/dashboard/attendance'
import AttendedUsers from '../pages/dashboard/attendance/AttendedUsers'
import AttendedVisitors from '../pages/dashboard/attendance/AttendedVisitors'
import Staff from '../pages/dashboard/Roles/staff'
import ProtocalPage from '../pages/dashboard/protocals'
import ApprovalPending from '../pages/auth/approval_required'
import SelfRegistration from '../pages/SelfRegistration'
import SelfCheckout from '../pages/SelfCheckout'

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/self-registration" element={<SelfRegistration />} />
      <Route path="/self-checkout" element={<SelfCheckout />} />
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path='/auth/approval_required' element={<ApprovalPending/>}/>
      
      {/* Dashboard Routes - Role-based routing handled by URL params */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        
        {/* System Owner Routes */}
        <Route path="customers" element={<Customers />} />
        <Route path="customers/active" element={<ActiveCustomers />} />
        <Route path="customers/inactive" element={<InactiveCustomers />} />
        <Route path="customers/suspended" element={<SuspendedCustomers />} />
        <Route path="customers/blacklisted" element={<BlacklistedCustomers />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="billings" element={<SubBillingsPage/>}/>
        <Route path="system-health" element={<SystemHealthly/>}/>
        <Route path='forms' element={<FormPage/>}/>
        <Route path='forms/create' element={<CreateForm/>}/>
        <Route path='system-reports' element={<ReportPage/>}/>
        <Route path='system-reports/createReport' element={<CreateReport/>}/>
        <Route path='security' element={<Security/>}/>
        
        {/* Customer Routes */}
        <Route path="users" element={<Users />} />
        <Route path="users/active" element={<ActiveUsers />} />
        <Route path="users/inactive" element={<InactiveUsers />} />
        <Route path="users/blacklisted" element={<BlacklistedUsers />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="visitor" element={<Attendance />} />
        <Route path="attendedUser" element={<AttendedUsers />} />
        <Route path="attendedVisitor" element={<AttendedVisitors />} />
        <Route path="scanning" element={<ScanningPage />} />
        <Route path="events" element={<EventsPage/>}/>
        <Route path='protocals' element={<ProtocalPage/>}/>
        <Route path='equipments' element={<Equipment/>}/>
        <Route path="equipments/add" element={<AddEquipmentPage/>}/>
        <Route path="handover" element={<HandoverManagement/>}/>
        <Route path="staff" element={<Staff/>}/>
        <Route path="hosts" element={<Hostmanagement/>}/>
        <Route path="appointments" element={<AppointmentPage/>}/>
        <Route path="appointments/viaCalender" element={<CalendarViewPage/>}/>
        <Route path="reports" element={<ReportPage/>}/>
        <Route path="reports/create" element={<CreateReport/>}/>
        <Route path="checkPoint" element={<CheckPoint/>}/>

         {/* helper desk Routes */}
        <Route path="helpdesk" element={<HelpDeskDashboard/>}/>
        <Route path='dataManager' element={<DataManagerDashboard/>}/>
        <Route path='teamLeader' element={<TeamLeader/>}/>
        
        {/* Shared Routes */}
        <Route path="Analytics" element={<BusinessAnalytics/>}/>
        <Route path="notifications" element={<Notifications/>}/>
        <Route path="settings" element={<Settings />}/>

      </Route>
    </Routes>
  )
}

export default AppRoutes