# Plan: Host Notification & Approval Flow with QR Badge Status Check

## Problem Statement
When a visitor selects a host during self-registration, the host should receive a notification to approve the available time slot. The visitor should then receive a message and be able to check their appointment status using their QR badge.

## Current System Analysis

### Existing Assets
- Models: Visitor, Appointment, Notification, User already exist
- Notification Model: Supports type: "appointment_request" and links to related entities
- Appointment Flow: Currently uses pending -> confirmed status workflow
- QR Badge: Already generated at V-<badgeId> format, displayed in confirmation step
- Frontend: SelfRegistrationCard has host selection step with hosts data from users API
- Issue in visitor.ts:629: Duplicate code block causing syntax error (needs immediate fix)

### Current Limitations
1. Host selection doesn't trigger notification to the host
2. No approval workflow between visitor check-in and host confirmation
3. Visitor cannot check appointment status via QR badge
4. No time-slot availability checking logic exists

---

## Implementation Plan

### Phase 1: Fix Critical Bug (Immediate)
File: attendance-backend-main/controllers/visitor.ts
- Remove duplicate code block at lines 629-645 (duplicate validation and feature update logic)
- The method updateSystemFeature already has valid implementation at lines 582-626

### Phase 2: Backend - Appointment Enhancement

2.1 Appointment Controller - New Endpoints
- POST /api/appointments/visitor-request (public)
- GET /api/appointments/visitor-status/:badgeId (public)
- PUT /api/appointments/:id/host-response (protected)

2.2 Visitor Controller - Status Update
- Accept hostId in publicCheckIn
- Set visitor status to PENDING_APPROVAL initially

### Phase 3: Frontend - SelfRegistration Enhancement
- Capture hostId when selecting host
- Modify handleSubmit to call visitor-request endpoint
- Add waiting_approval step with QR badge display
- Poll status endpoint

### Phase 4: Frontend - Host Dashboard
- Add Approve/Decline buttons in notification page
- Send response to backend

---

## API Endpoints to Add

Public: POST /api/appointments/visitor-request, GET /api/appointments/visitor-status/:badgeId
Protected: PUT /api/appointments/:id/host-response, GET /api/appointments/host-pending
