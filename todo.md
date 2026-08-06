# Vedana Scheduler - Project TODO

## Phase 1: Database & Core Models
- [x] Design and create database schema (Staff, Patients, Appointments, WorkingHours, AppointmentTypes)
- [x] Create Drizzle migrations and apply to database
- [x] Implement database query helpers in server/db.ts

## Phase 2: Backend API - Staff & Configuration
- [x] Create tRPC procedures for staff management (CRUD operations)
- [x] Implement working hours configuration per staff member
- [x] Create appointment slot duration settings
- [x] Build staff availability calculation logic
- [x] Add role-based access control (receptionist, therapist, admin)
- [ ] Write vitest tests for staff and configuration endpoints

## Phase 3: Backend API - Appointments
- [x] Create appointment booking procedure (protected)
- [x] Implement appointment editing and rescheduling
- [x] Build appointment cancellation with notification triggers
- [x] Create appointment listing with filters (by staff, date range, status)
- [x] Implement conflict detection (double-booking prevention)
- [ ] Write vitest tests for appointment procedures

## Phase 4: Backend API - Patient Portal
- [x] Create public procedure for available slots listing
- [x] Implement patient self-registration (name, email, phone)
- [x] Build online booking procedure (no auth required)
- [x] Create appointment confirmation and details retrieval
- [ ] Write vitest tests for patient portal endpoints

## Phase 5: Backend - Notifications
- [x] Database schema for notifications created
- [ ] Integrate email notification service (confirmation, reminder, cancellation)
- [ ] Implement in-app notification system
- [ ] Create notification scheduling (reminders 24h before appointment)
- [ ] Write notification templates

## Phase 6: Frontend - Layout & Navigation
- [x] Design and implement elegant DashboardLayout for staff
- [x] Create public portal layout for patient self-booking
- [x] Build responsive navigation with role-based menu items
- [x] Implement theme system with premium color palette
- [x] Add global typography and spacing system

## Phase 7: Frontend - Calendar Views
- [x] Implement daily calendar view with time slots (skeleton)
- [x] Build weekly calendar view with multi-staff columns (skeleton)
- [x] Create monthly calendar view with appointment indicators
- [x] Add view switching (day/week/month)
- [x] Implement date navigation (prev/next)
- [ ] Add responsive design for mobile calendar views

## Phase 8: Frontend - Staff Panel
- [x] Create staff dashboard showing personal schedule (skeleton)
- [ ] Build appointment details modal/drawer
- [ ] Implement appointment editing interface
- [ ] Add appointment cancellation with reason
- [ ] Create staff availability management UI
- [ ] Build working hours configuration panel

## Phase 9: Frontend - Reception Panel
- [x] Create reception dashboard with all staff calendars (skeleton)
- [ ] Build staff selector for multi-view
- [ ] Implement appointment creation form (manual booking)
- [ ] Add patient search and management
- [ ] Create bulk operations (reschedule, cancel)
- [ ] Build reporting and analytics dashboard

## Phase 10: Frontend - Patient Portal
- [x] Create public landing page for patient booking
- [ ] Implement staff/service selector
- [ ] Build available slots display
- [ ] Create patient registration form
- [ ] Implement booking confirmation screen
- [ ] Add booking history and management for registered patients

## Phase 11: Frontend - Modals & Forms
- [ ] Create appointment details modal
- [ ] Build appointment creation/editing form
- [ ] Implement patient details form
- [ ] Create staff configuration forms
- [ ] Add confirmation dialogs for destructive actions

## Phase 12: Mobile Optimization
- [ ] Test and optimize calendar views for mobile
- [ ] Implement touch-friendly interactions
- [ ] Create mobile-optimized forms
- [ ] Test responsive breakpoints
- [ ] Optimize performance for slow connections

## Phase 13: Testing & Polish
- [ ] Comprehensive vitest coverage for all procedures
- [ ] E2E testing of critical user flows
- [ ] Performance optimization
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Cross-browser testing
- [ ] Mobile device testing

## Phase 14: Documentation & Integration
- [ ] Create API documentation
- [ ] Write integration guide for main Vedana project
- [ ] Create deployment guide
- [ ] Document environment variables
- [ ] Create user guide for staff and patients

## Phase 15: Delivery
- [ ] Create checkpoint with all features complete
- [ ] Prepare demo data and test scenarios
- [ ] Final polish and bug fixes
- [ ] Deliver to user with integration instructions
