# BloodConnect — Product Requirements Document

**Version:** 1.0  
**Status:** MVP  
**Product Type:** Verified Blood Donation & Request Coordination Platform  
**Backend:** Supabase  
**Frontend:** React + TypeScript + Vite  
**Database:** PostgreSQL + PostGIS  

---

## 1. Product Overview

### 1.1 Product Name

**BloodConnect**

### 1.2 Product Vision

BloodConnect is a secure platform that connects people who genuinely need blood with nearby, eligible and willing blood donors.

The platform prioritizes:

- Authenticity of blood requests
- Donor safety and eligibility
- Blood-group compatibility
- Geographic proximity
- Request urgency
- Privacy
- Real-time communication
- Administrative verification

The platform is intended to coordinate blood donation and should not replace hospitals, blood banks, doctors, or medical screening.

---

## 2. Problem Statement

During medical emergencies, finding a suitable blood donor can be difficult and time-consuming.

People commonly rely on:

- WhatsApp groups
- Social media
- Personal contacts
- Phone calls
- Informal donor databases

These approaches create several problems:

1. Blood requests may be fake or unauthorized.
2. There is no reliable verification mechanism.
3. Donors may receive requests that are geographically far away.
4. Blood-group compatibility is not automatically considered.
5. Old or fulfilled requests may continue circulating.
6. Patient and donor information may be unnecessarily exposed.
7. There is no centralized request lifecycle.
8. Hospitals and administrators have limited control over verification.
9. Emergency requests can become difficult to prioritize.
10. Donors may not know whether their response actually helped fulfill the requirement.

BloodConnect addresses these problems through a verified, location-aware donor matching system.

---

# 3. Goals

## 3.1 Primary Goals

The platform should:

- Allow verified users to request blood.
- Allow eligible users to register as donors.
- Verify blood requests before making them active.
- Match compatible donors with blood requests.
- Prioritize nearby donors.
- Notify suitable donors.
- Allow donors to accept or decline requests.
- Track blood requirements in real time.
- Protect donor and patient information.
- Allow hospitals and administrators to verify requests.
- Maintain an auditable request and donation history.

## 3.2 Secondary Goals

The platform should eventually support:

- Hospital/blood-bank integration
- SMS notifications
- Email notifications
- Advanced analytics
- Blood inventory integration
- Mobile applications
- Demand prediction
- Fraud detection

---

# 4. Non-Goals

The MVP will NOT:

- Perform medical diagnosis.
- Determine final medical donor eligibility.
- Replace blood-bank screening.
- Replace doctors or hospitals.
- Guarantee blood availability.
- Process blood transfusions.
- Store unnecessary medical records.
- Expose donor personal information publicly.
- Allow unverified emergency requests to bypass verification.

---

# 5. Target Users

## 5.1 Donor

A person willing to donate blood.

Primary needs:

- Register as a donor.
- Specify blood group.
- Set availability.
- Receive nearby compatible requests.
- Accept or decline requests.
- Track donation history.

---

## 5.2 Recipient / Requester

A person requesting blood for themselves or another patient.

Primary needs:

- Create a blood request.
- Provide hospital information.
- Submit verification information.
- Track request status.
- See donor response progress.
- Know when the requirement has been fulfilled.

---

## 5.3 Hospital / Blood Bank

An authorized medical organization.

Primary needs:

- Maintain verified organization profile.
- Create/manage blood requests.
- Verify donation fulfillment.
- Manage active requests.
- Coordinate with matched donors.

---

## 5.4 Administrator

Platform administrator.

Primary needs:

- Verify users and hospitals.
- Review blood requests.
- Approve/reject requests.
- Manage suspicious activity.
- Suspend users.
- Monitor platform activity.
- View analytics.
- Maintain audit logs.

---

# 6. User Roles & Permissions

| Feature | Donor | Requester | Hospital | Admin |
|---|---:|---:|---:|---:|
| Register | ✓ | ✓ | ✓ | — |
| Create blood request | — | ✓ | ✓ | ✓ |
| Donate/respond | ✓ | — | — | — |
| Verify request | — | — | ✓* | ✓ |
| Manage hospital | — | — | ✓ | ✓ |
| View own requests | — | ✓ | ✓ | ✓ |
| View donor matches | Limited | Limited | ✓ | ✓ |
| Manage users | — | — | — | ✓ |
| Suspend users | — | — | — | ✓ |
| View analytics | — | — | Limited | ✓ |
| View audit logs | — | — | — | ✓ |

`*` Hospital verification capabilities depend on the hospital's authorization level.

---

# 7. Core User Journey

## 7.1 Blood Request Journey

```text
User Registration
       ↓
Requester Verification
       ↓
Create Blood Request
       ↓
Submit Supporting Information
       ↓
Pending Verification
       ↓
Admin/Hospital Review
       ↓
Approved
       ↓
Request Becomes Active
       ↓
Matching Engine
       ↓
Compatible Nearby Donors
       ↓
Donor Notifications
       ↓
Donor Accepts
       ↓
Donation Coordination
       ↓
Donation Confirmed
       ↓
Units Fulfilled
       ↓
Request Closed
```

---

# 8. Authentication

Authentication will use **Supabase Auth**.

## Supported methods

MVP:

- Email + password
- Phone OTP where practical

Optional:

- Google OAuth

After registration, users must select their role:

```text
I want to:

[ Donate Blood ]

[ Request Blood ]

[ Hospital / Blood Bank ]
```

Role information must be stored and enforced server-side.

Frontend-provided role values must never be treated as trusted authorization.

---

# 9. User Verification

Every account has a verification status.

```text
UNVERIFIED
PENDING
VERIFIED
REJECTED
```

Account status:

```text
ACTIVE
SUSPENDED
DEACTIVATED
```

Only verified and active accounts can participate in protected workflows.

---

# 10. Donor Profile

## Required Fields

- Full name
- Blood group
- Date of birth
- Phone
- Email
- City/area
- Donation location
- Last donation date
- Availability
- Eligibility status

## Availability

```text
AVAILABLE
UNAVAILABLE
TEMPORARILY_UNAVAILABLE
RECENTLY_DONATED
SUSPENDED
```

## Donor Dashboard

Display:

- Blood group
- Current availability
- Eligibility status
- Nearby requests
- Recent notifications
- Donation history

---

# 11. Donor Eligibility

The system should maintain an eligibility state:

```text
ELIGIBLE
NOT_ELIGIBLE
PENDING_REVIEW
```

Eligibility rules should be configurable.

Potential factors:

- Age
- Last donation date
- Account verification
- Availability
- Temporary restrictions

The application must clearly state:

> Platform eligibility is not a substitute for medical screening. Final donor eligibility must be determined by the appropriate medical/blood-bank professionals.

---

# 12. Blood Request

## Request Form

A requester must provide:

- Patient name
- Blood group required
- Number of units
- Hospital
- Hospital address
- Required date
- Required time
- Urgency
- Requester relationship
- Requester phone
- Request description
- Supporting documentation
- Request location

---

# 13. Blood Request Status

Requests follow this lifecycle:

```text
DRAFT
PENDING_VERIFICATION
UNDER_REVIEW
APPROVED
REJECTED
ACTIVE
PARTIALLY_FULFILLED
FULFILLED
EXPIRED
CANCELLED
```

### Important Rule

A request cannot be matched with donors until it has been approved.

---

# 14. Request Verification

All requests initially enter:

```text
PENDING_VERIFICATION
```

The request must be reviewed by an authorized administrator or hospital.

## Admin Actions

- Approve
- Reject
- Request more information
- Flag
- Cancel
- Close

## Verification Interface

Display:

```text
Request ID
Requester
Blood Group
Units
Hospital
Urgency
Required Date
Verification Documents
Request History
```

Actions:

```text
[ Approve ]

[ Reject ]

[ Request More Information ]
```

---

# 15. Supporting Documents

Supporting documents must be stored using **Supabase Storage**.

Documents may include appropriate hospital/request verification material.

Documents must:

- Use private storage buckets.
- Never be publicly accessible.
- Be accessible only to authorized users.
- Use signed URLs or controlled server-side access.
- Be subject to appropriate retention policies.

---

# 16. Hospital Module

Hospitals/blood banks have verified profiles.

## Hospital Fields

```text
id
name
registration_number
address
phone
email
location
verification_status
created_at
updated_at
```

## Hospital Status

```text
PENDING
VERIFIED
REJECTED
SUSPENDED
```

## Hospital Capabilities

Verified hospitals can:

- Create requests.
- Manage requests.
- View matched donors.
- Confirm donations.
- Update required units.
- Close fulfilled requests.

---

# 17. Blood Compatibility

Create a database-driven compatibility system.

For red-cell donation, the initial compatibility rules should support the standard ABO/Rh relationships.

Example:

| Recipient | Compatible Donor Groups |
|---|---|
| O− | O− |
| O+ | O−, O+ |
| A− | O−, A− |
| A+ | O−, O+, A−, A+ |
| B− | O−, B− |
| B+ | O−, O+, B−, B+ |
| AB− | O−, A−, B−, AB− |
| AB+ | O−, O+, A−, A+, B−, B+, AB−, AB+ |

These rules must be configurable in the database.

The system must communicate that actual transfusion compatibility is confirmed by qualified medical professionals.

---

# 18. Donor Matching Engine

The matching engine is a core feature.

Matching should happen server-side using Supabase/PostgreSQL/PostGIS.

## Matching Criteria

1. Blood compatibility
2. Donor eligibility
3. Donor availability
4. Geographic distance
5. Request urgency

Compatibility and eligibility are mandatory filters.

Distance determines priority among otherwise suitable donors.

---

# 19. Location Matching

Use **PostGIS** for geospatial queries.

Store donor and request locations using geographic coordinates.

Example:

```text
Donor A → 2.4 km
Donor B → 4.8 km
Donor C → 9.1 km
Donor D → 18.4 km
```

Closer donors receive higher matching priority.

---

# 20. Matching Radius

Use an expanding radius:

```text
5 km
 ↓
10 km
 ↓
25 km
 ↓
50 km
```

Critical requests may expand the radius more aggressively.

The system should avoid notifying the entire city immediately.

---

# 21. Match Scoring

Create an internal match score.

Example conceptual model:

```text
Match Score =
Compatibility
+
Eligibility
+
Availability
+
Distance
+
Urgency Priority
```

Suggested priority:

```text
Compatibility → Mandatory
Eligibility → Mandatory
Availability → Mandatory
Distance → High Weight
Urgency → Notification Priority
```

The internal score should not be displayed to donors or requesters.

---

# 22. Donor Privacy

Donor information must remain private.

Do NOT publicly display:

- Exact address
- Exact GPS coordinates
- Phone number
- Email
- Personal medical information

Instead display:

```text
Compatible donor found

Distance:
3.4 km

Availability:
Available
```

Controlled contact information may be exchanged only after the appropriate donor/request interaction and authorization.

---

# 23. Patient Privacy

Do not publicly expose:

- Patient medical documents
- Sensitive medical details
- Unnecessary personal information

Only expose the minimum information required for donation coordination.

---

# 24. Donor Notifications

When a compatible donor is found, create an in-app notification.

Example:

```text
URGENT BLOOD REQUEST

Blood Group: O+
Hospital: XYZ Hospital
Distance: 3.4 km
Units Required: 2
Urgency: Critical

[ I CAN DONATE ]

[ NOT AVAILABLE ]
```

---

# 25. Notification Types

```text
REQUEST_SUBMITTED
REQUEST_APPROVED
REQUEST_REJECTED
BLOOD_REQUEST_NEARBY
DONOR_ACCEPTED
DONOR_DECLINED
DONATION_CONFIRMED
REQUEST_PARTIALLY_FULFILLED
REQUEST_FULFILLED
REQUEST_EXPIRING
ADMIN_ALERT
```

---

# 26. Real-Time Updates

Use **Supabase Realtime**.

Real-time updates should include:

- Request status
- Donor acceptance
- Donation confirmation
- Fulfillment progress
- Notifications
- Admin verification actions where appropriate

Example:

```text
Required Units: 2
Confirmed Units: 1

        ↓

Donor accepts

        ↓

Required Units: 2
Confirmed Units: 2

        ↓

Request → FULFILLED
```

---

# 27. Donor Match Lifecycle

Each donor match has a status:

```text
MATCHED
NOTIFIED
ACCEPTED
DECLINED
EXPIRED
CANCELLED
```

When a donor accepts:

1. Record acceptance.
2. Notify requester/hospital.
3. Update fulfillment progress.
4. Prevent unnecessary additional matching when enough donors are confirmed.
5. Maintain additional donors as standby if necessary.

---

# 28. Request Fulfillment

A request contains:

```text
units_required
units_fulfilled
```

Example:

```text
Units required: 4
Units fulfilled: 2

Progress: 50%
```

Status:

```text
PARTIALLY_FULFILLED
```

Once:

```text
units_fulfilled >= units_required
```

set:

```text
FULFILLED
```

Stop unnecessary donor notifications.

---

# 29. Emergency Requests

Urgency levels:

```text
NORMAL
URGENT
CRITICAL
```

Critical requests should:

- Be prominently displayed.
- Receive higher matching priority.
- Notify nearby compatible donors faster.
- Expand search radius.
- Alert administrators.

### Important

Selecting "Critical" must NOT bypass verification.

---

# 30. Anti-Abuse System

Implement:

## Rate Limiting

Prevent excessive request creation.

## Duplicate Detection

Flag potentially duplicate requests based on combinations such as:

- Hospital
- Blood group
- Date
- Requester
- Similar patient/request information

## Reporting

Users can report:

```text
FAKE_REQUEST
INCORRECT_INFORMATION
HARASSMENT
SUSPICIOUS_ACTIVITY
```

## Account Suspension

Administrators can suspend accounts.

Suspended accounts cannot:

- Create requests
- Accept donations
- Modify protected records

---

# 31. Admin Dashboard

## Dashboard Metrics

Display:

```text
Total Users
Active Donors
Active Requests
Pending Verification
Critical Requests
Successful Donations
Fulfillment Rate
Average Response Time
Average Match Distance
```

## Admin Routes

```text
/admin/dashboard
/admin/requests
/admin/users
/admin/hospitals
/admin/donations
/admin/reports
/admin/audit-log
```

---

# 32. Admin Request Management

Request table:

| Field | Description |
|---|---|
| Request ID | Unique identifier |
| Blood Group | Required group |
| Units | Required units |
| Hospital | Associated hospital |
| Urgency | Normal/Urgent/Critical |
| Status | Current state |
| Created | Creation time |
| Action | Review/manage |

Actions:

```text
Review
Approve
Reject
Request Information
Flag
Close
```

---

# 33. Admin User Management

Display:

```text
Name
Role
Verification
Blood Group
Status
Created At
```

Actions:

```text
View
Verify
Suspend
Unsuspend
```

---

# 34. Admin Audit Log

Every sensitive administrative action should be logged.

Example:

```text
Admin:
Admin User

Action:
APPROVED_REQUEST

Request:
#1024

Timestamp:
2026-09-09 18:30

Reason:
Hospital verification completed
```

Store:

```text
admin_id
action
entity_type
entity_id
metadata
created_at
```

---

# 35. Recipient Dashboard

Route:

```text
/requester/dashboard
```

Display:

```text
ACTIVE REQUEST

Blood Group: O+
Units Required: 2
Units Confirmed: 1
Hospital: XYZ Hospital
Urgency: Critical

████████░░ 50%
```

### Request Timeline

```text
✓ Request submitted
✓ Verification completed
✓ Request approved
✓ Donors notified
✓ 1 donor confirmed
○ Requirement fulfilled
```

---

# 36. Donor Dashboard

Route:

```text
/donor/dashboard
```

Display:

```text
Welcome

Blood Group
O+

Availability
AVAILABLE

Nearby Requests
```

Each request card:

```text
O+ Blood Required
3.2 km away
XYZ Hospital
2 Units
Critical

[View Request]
```

---

# 37. Donation History

Donors can see:

```text
Donation Date
Hospital
Units
Status
```

Example:

```text
12 Aug 2026
XYZ Hospital
1 unit
Completed
```

---

# 38. Search & Filters

Users should be able to filter relevant requests by:

- Blood group
- Urgency
- Distance
- Availability
- Hospital
- Request status

Donors should primarily see requests relevant to their blood group and eligibility.

---

# 39. Maps & Location

Use a mapping provider where required.

Potential options:

- Mapbox
- Google Maps

Location should be used primarily for matching.

Donors should be able to set:

```text
Current location
Preferred donation location
```

Allow users to update their location.

Do not expose exact donor locations to other users.

---

# 40. Landing Page

## Hero

Headline:

> **Someone nearby needs your blood.**

Supporting text:

> Connect verified blood requests with eligible donors in your area.

Buttons:

```text
Donate Blood
Request Blood
```

---

## How It Works

### 01 — Request

Submit a verified blood requirement.

### 02 — Match

We find compatible donors nearby.

### 03 — Connect

Donors respond to the request.

### 04 — Donate

Complete the donation through the hospital or blood bank.

---

# 41. Landing Page Sections

```text
Navbar
↓
Hero
↓
Impact Statistics
↓
How It Works
↓
Emergency Requests
↓
Blood Groups
↓
Why BloodConnect
↓
Verified Hospitals
↓
Become a Donor
↓
FAQ
↓
Footer
```

---

# 42. Design System

The UI should feel:

- Trustworthy
- Modern
- Premium
- Human
- Clean
- Accessible

It should NOT look like a generic hospital management dashboard.

## Color Palette

```text
Deep Burgundy  #7F1D1D
Blood Red      #DC2626
Warm Red       #EF4444
Off White      #FAFAF9
Charcoal       #171717
Muted Grey     #737373
Success Green  #16A34A
```

Red should be used selectively.

Use neutral backgrounds for most screens.

Avoid:

- Excessive gradients
- Neon colors
- Excessive glassmorphism
- Overly dense dashboards
- Excessive red
- Generic medical stock imagery

---

# 43. Responsive Design

The application must work on:

- Desktop
- Tablet
- Mobile

Donor workflows should be especially optimized for mobile.

Important actions should be easy to access:

```text
View Request
Accept
Decline
Mark Available
```

---

# 44. Required Routes

```text
/
 /login
 /register
 /verify

 /dashboard

 /donor
 /donor/dashboard
 /donor/profile
 /donor/requests
 /donor/requests/:id
 /donor/history

 /requester
 /requester/dashboard
 /requester/request
 /requester/requests
 /requester/requests/:id

 /hospital
 /hospital/dashboard
 /hospital/requests
 /hospital/requests/:id

 /admin
 /admin/dashboard
 /admin/requests
 /admin/users
 /admin/hospitals
 /admin/donations
 /admin/reports
 /admin/audit-log
```

---

# 45. Database Schema

## profiles

```text
id
auth_user_id
full_name
email
phone
role
verification_status
account_status
created_at
updated_at
```

---

## donor_profiles

```text
id
user_id
blood_group
date_of_birth
last_donation_date
availability_status
eligibility_status
location
latitude
longitude
created_at
updated_at
```

---

## recipient_profiles

```text
id
user_id
created_at
updated_at
```

---

## hospitals

```text
id
name
registration_number
address
phone
email
location
verification_status
created_at
updated_at
```

---

## blood_requests

```text
id
requester_id
hospital_id
blood_group
units_required
units_fulfilled
urgency
required_date
required_time
description
location
status
created_at
updated_at
expires_at
verified_by
verified_at
```

---

## request_documents

```text
id
request_id
storage_path
document_type
uploaded_by
created_at
```

---

## donor_matches

```text
id
request_id
donor_id
distance_km
match_score
status
notified_at
responded_at
created_at
updated_at
```

---

## donation_records

```text
id
request_id
donor_id
hospital_id
donation_date
units
status
verified_by
created_at
```

---

## notifications

```text
id
user_id
type
title
message
related_request_id
read
created_at
```

---

## reports

```text
id
reported_by
report_type
target_type
target_id
description
status
reviewed_by
created_at
resolved_at
```

---

## admin_actions

```text
id
admin_id
action
entity_type
entity_id
metadata
created_at
```

---

## blood_compatibility

```text
id
donor_blood_group
recipient_blood_group
compatible
```

---

# 46. Database Requirements

Use PostgreSQL constraints wherever possible.

Add indexes for:

```text
blood_group
status
availability_status
urgency
hospital_id
requester_id
donor_id
location
created_at
```

Use PostGIS indexes for geospatial searches.

---

# 47. Supabase Architecture

Use:

```text
Supabase Auth
       ↓
PostgreSQL
       ↓
PostGIS
       ↓
Supabase Storage
       ↓
Supabase Realtime
       ↓
Supabase Edge Functions
```

Use Edge Functions for operations requiring:

- Privileged access
- Matching
- Notifications
- Sensitive calculations
- Administrative operations

Never expose the Supabase service-role key in frontend code.

---

# 48. Row Level Security

RLS must be enabled on all sensitive tables.

## Donor

Can:

- Read own profile.
- Update own profile.
- View relevant active requests.
- View own matches.
- Accept/decline own matches.
- View own donation history.

Cannot:

- View arbitrary donor profiles.
- Modify blood requests.
- Access private patient documents.
- Access other donors' private information.

---

## Requester

Can:

- Create requests.
- View own requests.
- Update permitted fields on own requests.
- Cancel own requests where allowed.

Cannot:

- View arbitrary donor information.
- Access unrelated requests.
- Access private documents belonging to others.

---

## Hospital

Can:

- Manage own hospital profile.
- Create requests.
- Manage its requests.
- View authorized donor matches.
- Confirm donations.

---

## Admin

Can perform authorized administrative operations.

Privileged operations should use secure server-side logic.

---

# 49. File Storage Security

Use private Supabase Storage buckets.

Suggested buckets:

```text
request-documents
hospital-documents
profile-images
```

Sensitive documents must not have public URLs.

Use signed URLs with appropriate expiration.

---

# 50. Security Requirements

Implement:

- Supabase Auth
- Row Level Security
- Server-side authorization
- Input validation
- Rate limiting
- Secure file uploads
- Private storage
- Signed URLs
- Audit logging
- Account suspension
- Protected administrative routes
- No service-role credentials in frontend
- No sensitive information in logs

---

# 51. Error Handling

Provide proper UI states for:

```text
No compatible donors
No nearby donors
Request pending verification
Request rejected
Request expired
Request fulfilled
Donor unavailable
Hospital not verified
Location unavailable
Document upload failed
Network failure
Unauthorized access
```

Do not show empty/blank screens.

---

# 52. Loading States

Use skeleton loaders for:

- Dashboards
- Request lists
- Donor matches
- Admin tables
- Notifications

Use confirmation dialogs for destructive actions:

```text
Cancel request
Reject request
Suspend user
Delete/withdraw request
```

---

# 53. Accessibility

Follow accessible UI principles.

Requirements:

- Proper semantic HTML
- Keyboard navigation
- Accessible form labels
- Sufficient color contrast
- Clear focus states
- Accessible buttons
- Do not rely only on color for status
- Screen-reader-friendly notifications

---

# 54. Performance

The application should:

- Lazy-load large pages.
- Avoid unnecessary API calls.
- Use pagination for large tables.
- Use indexed database queries.
- Use geospatial indexes.
- Use Realtime instead of aggressive polling.
- Optimize images.
- Avoid loading unnecessary dashboard data.

---

# 55. Analytics

Admin analytics should include:

### Platform

- Total registered users
- Active donors
- Verified hospitals
- Active requests

### Blood

- Most requested blood groups
- Most available blood groups
- Fulfillment rate

### Matching

- Average match distance
- Average donor response time
- Donors notified per request

### Requests

- Requests created
- Requests approved
- Requests rejected
- Requests fulfilled
- Requests expired

---

# 56. MVP Requirements

The MVP must include:

### Authentication

- Supabase Auth
- Role-based access

### Donor

- Registration
- Profile
- Blood group
- Availability
- Location
- Donation history

### Requester

- Create request
- Track request
- Verification status

### Admin

- Verify requests
- Manage users
- Manage hospitals
- Audit logs

### Matching

- Blood compatibility
- Eligibility
- Availability
- Distance
- Match ranking

### Communication

- In-app notifications
- Realtime updates

### Security

- RLS
- Private documents
- Role-based permissions

---

# 57. Future Features

## Phase 2

- Email notifications
- SMS notifications
- Maps
- Advanced hospital verification
- Advanced analytics
- Better donor scheduling

## Phase 3

- Mobile application
- Blood inventory integration
- Hospital APIs
- AI-based fraud detection
- Demand prediction
- Blood shortage forecasting

---

# 58. Success Metrics

The platform should measure:

### Primary

- Blood request fulfillment rate
- Average donor response time
- Average time to first donor
- Number of successful donations

### Secondary

- Average donor-request distance
- Number of active donors
- Number of verified requests
- Number of verified hospitals
- Request rejection rate
- Duplicate/fraudulent request rate

---

# 59. Acceptance Criteria

The MVP is considered functional when the following complete workflow works:

```text
User registers
        ↓
User verifies account
        ↓
Requester creates blood request
        ↓
Request enters verification
        ↓
Admin reviews request
        ↓
Admin approves request
        ↓
Matching engine finds compatible donors
        ↓
Nearby donors receive notifications
        ↓
Donor views request
        ↓
Donor accepts
        ↓
Requester/hospital receives realtime update
        ↓
Donation is coordinated
        ↓
Hospital confirms donation
        ↓
Units fulfilled
        ↓
Request becomes FULFILLED
        ↓
Additional donor notifications stop
```

---

# 60. Development Principles

The implementation should follow these principles:

1. **Security before convenience.**
2. **Verification before visibility.**
3. **Compatibility before distance.**
4. **Distance before broad notification.**
5. **Privacy by default.**
6. **Server-side authorization.**
7. **Database-driven business rules.**
8. **Real-time status updates.**
9. **Clear audit trails.**
10. **Mobile-first emergency workflows.**

---

# 61. Final Product Definition

BloodConnect is not simply a donor directory.

It is a:

> **Verified, privacy-conscious, location-aware blood donation coordination platform.**

Its core differentiator is the combination of:

```text
Verified Requests
       +
Blood Compatibility
       +
Geospatial Matching
       +
Donor Availability
       +
Real-Time Notifications
       +
Privacy
       +
Administrative Oversight
```

The system should prioritize **genuine requests, medically appropriate matching workflows, nearby donors, and secure coordination**, while leaving final medical screening and transfusion decisions to qualified healthcare professionals.