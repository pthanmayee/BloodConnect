# BloodConnect — Pages & UI Requirements

## Overview

To keep the BloodConnect MVP focused and manageable, the application will use only **5 primary pages**.

The goal is to avoid a large number of routes while still supporting the complete workflow:

```text
Register
    ↓
Create Profile
    ↓
Create / Receive Blood Request
    ↓
Verification
    ↓
Nearby Donor Matching
    ↓
Donor Response
    ↓
Donation Confirmation
    ↓
Request Fulfillment
```

Complex workflows should use:

- Modals
- Drawers
- Tabs
- Expandable sections
- Step forms
- Detail panels

instead of creating unnecessary pages.

---

# 1. Home Page

## Route

```text
/
```

## Purpose

The landing page should communicate:

- What BloodConnect is.
- How the platform works.
- Why verification is important.
- How donors and recipients can get started.
- That nearby compatible donors are prioritized.

The page should feel trustworthy, modern, human, and premium.

It should not look like a generic hospital website.

---

## 1.1 Navigation Bar

### Left

BloodConnect logo.

Example:

```text
🩸 BloodConnect
```

### Center / Right Navigation

```text
How It Works
Why BloodConnect
FAQ
```

### Actions

```text
Log In
[ Get Started ]
```

The navbar should remain simple and clean.

On mobile, collapse navigation into a menu.

---

## 1.2 Hero Section

The hero should immediately communicate the product's purpose.

### Headline

> **Someone nearby could be waiting for your help.**

Alternative supporting line:

> BloodConnect securely matches verified blood requests with eligible donors nearby.

### Primary CTAs

```text
[ Donate Blood ]

[ Request Blood ]
```

Both buttons should lead to authentication/onboarding.

---

## 1.3 Hero Visual

Instead of generic hospital imagery, use an abstract visual representing connection.

Possible concept:

```text
Blood Request
      ↓
Matching Network
      ↓
Nearby Donors
```

Visual elements can include:

- Subtle location nodes
- Connection lines
- Blood drop accent
- Nearby donor indicators
- Small distance labels

Example:

```text
           ● Donor
             2.3 km
               \
                \
🩸 Request ────── Matching Network
                /
               /
          ● Donor
            4.1 km
```

The visual should be subtle and premium.

Avoid:

- Large stock hospital images
- Excessive medical icons
- Too much red
- Cartoonish illustrations

---

# 1.4 Impact Statistics

Below the hero.

Display 3–4 metrics.

Example:

```text
1,200+
Registered Donors

340+
Requests Fulfilled

92%
Fulfillment Rate

4.8 km
Average Match Distance
```

For the MVP, use clearly marked demo/sample statistics until real data exists.

---

# 1.5 How It Works

Use four simple steps.

```text
01
REQUEST

Submit a blood requirement.
```

```text
02
VERIFY

Every request is reviewed before matching begins.
```

```text
03
MATCH

Compatible donors nearby are prioritized.
```

```text
04
DONATE

Coordinate and complete the donation through the hospital.
```

Use a horizontal layout on desktop and vertical cards on mobile.

---

# 1.6 Why BloodConnect

Explain the core differentiators.

### Verified Requests

Only approved requests enter the donor matching system.

### Nearby Matching

Compatible donors closer to the requirement are prioritized.

### Privacy First

Personal and location information is protected.

### Real-Time Updates

Track request progress and donor responses live.

Use four clean cards.

---

# 1.7 Blood Group Section

Display the eight blood groups.

```text
O+    O-

A+    A-

B+    B-

AB+   AB-
```

Clicking a blood group can open a small informational modal.

Keep this section educational and visually simple.

Include a disclaimer that final compatibility is determined by medical professionals.

---

# 1.8 FAQ

Include questions such as:

### How are blood requests verified?

Requests are reviewed before becoming active.

### How are donors selected?

Matching considers compatibility, eligibility, availability, and geographic proximity.

### Is my location public?

No. Exact donor location is not publicly displayed.

### Can anyone request blood?

No. Requests must go through verification.

### How do I become a donor?

Create an account, complete your profile, and provide the required information.

---

# 1.9 Footer

Include:

```text
BloodConnect

About
How It Works
FAQ
Privacy
Terms
Contact
```

Also include:

> BloodConnect coordinates blood donation requests and does not replace medical screening or professional healthcare decisions.

---

---

# 2. Authentication & Onboarding Page

## Route

```text
/auth
```

This should handle:

- Login
- Registration
- Role selection
- Basic onboarding

Use a single page with steps instead of multiple routes.

---

# 2.1 Login State

Display:

```text
Welcome back

Email
[________________]

Password
[________________]

[ Log In ]

──────── OR ────────

[ Continue with Google ]

Don't have an account?
Create one
```

---

# 2.2 Registration State

After selecting registration:

```text
Create your account

Full Name
Email
Phone
Password

[ Continue ]
```

---

# 2.3 Role Selection

After registration:

> **How would you like to use BloodConnect?**

Display three large cards.

---

### 🩸 Donate Blood

```text
I want to register as a donor and receive
nearby compatible blood requests.
```

---

### ❤️ Request Blood

```text
I need to request blood for myself
or someone else.
```

---

### 🏥 Hospital / Blood Bank

```text
I represent a hospital or blood bank.
```

---

# 2.4 Donor Onboarding

If the user selects donor:

Collect:

```text
Blood Group

Date of Birth

Preferred Donation Area

Last Donation Date

Availability
```

Location input:

```text
[ Use Current Location ]

or

[ Search Location ]
```

Display a privacy note:

> Your exact location will never be publicly displayed.

At the end:

```text
[ Complete Donor Profile ]
```

---

# 2.5 Requester Onboarding

Collect basic information:

```text
Full Name
Phone
Relationship to Patient
```

After completion:

```text
[ Go to Request Dashboard ]
```

---

# 2.6 Hospital Onboarding

Collect:

```text
Hospital Name
Registration Number
Address
Official Contact Number
Official Email
```

Status:

```text
PENDING VERIFICATION
```

Display:

> Your organization will be reviewed before access to protected workflows is enabled.

---

---

# 3. Donor Dashboard

## Route

```text
/donor
```

## Purpose

This is the donor's main workspace.

The donor should immediately understand:

- Whether they are available.
- Whether they are eligible.
- Whether nearby requests need their attention.
- Their recent donation activity.

---

# 3.1 Dashboard Header

Example:

```text
Good evening, Alex 👋

Thank you for being ready to help.
```

Right side:

```text
🔔 Notifications

Profile Avatar
```

---

# 3.2 Donor Status Card

Large primary card.

```text
YOUR DONOR STATUS

Blood Group
O+

Availability

● AVAILABLE

[ Change Status ]
```

The availability switch should be prominent.

Options:

```text
Available
Unavailable
Temporarily Unavailable
```

---

# 3.3 Eligibility Card

Example:

```text
DONATION STATUS

✓ Currently available for matching

Last donation:
12 June 2026
```

If unavailable:

```text
Currently unavailable for matching

You can update your availability
when appropriate.
```

Do not make definitive medical claims.

---

# 3.4 Nearby Requests

This is the most important section.

Title:

```text
Nearby Requests
```

Subtitle:

> Based on your blood group and availability.

Each request is displayed as a card.

Example:

```text
┌───────────────────────────────────┐
│ 🔴 CRITICAL                       │
│                                   │
│ O+ Blood Required                 │
│                                   │
│ XYZ Hospital                      │
│ Approximately 3.2 km away         │
│                                   │
│ Units Required: 2                 │
│                                   │
│ [ View Request ]                  │
└───────────────────────────────────┘
```

Do not display:

- Patient name
- Exact patient address
- Private medical documents
- Other donor information

---

# 3.5 Request Detail Drawer

When the donor clicks a request, open a drawer or modal.

Display:

```text
Blood Group Required
O+

Hospital
XYZ Hospital

Approximate Distance
3.2 km

Units Required
2

Urgency
CRITICAL

Required By
Today, 7:00 PM
```

Primary action:

```text
[ I CAN DONATE ]
```

Secondary:

```text
[ NOT AVAILABLE ]
```

---

# 3.6 Acceptance Confirmation

After clicking:

```text
I CAN DONATE
```

Show confirmation modal.

```text
Ready to help?

By confirming, the hospital/request coordinator
will be informed that you are willing to donate.

[ Confirm Availability ]

[ Cancel ]
```

After confirmation:

```text
✓ Response Sent

The request coordinator has been notified.
```

---

# 3.7 Donation History

Lower section or tab.

Example:

```text
DONATION HISTORY

12 Aug 2026
XYZ Hospital
Completed

04 May 2026
ABC Blood Bank
Completed
```

---

# 3.8 Notifications Panel

Use a notification dropdown/drawer.

Examples:

```text
🔴 Critical O+ blood request nearby

3 minutes ago
```

```text
✓ Your donation response was received

1 hour ago
```

```text
🎉 A request you responded to has been fulfilled
```

---

# 3.9 Profile Settings

Open as a modal or side panel.

Allow updates to:

- Name
- Phone
- Preferred location
- Availability
- Last donation date

Do not allow users to bypass verification controls.

---

---

# 4. Blood Request Dashboard

## Route

```text
/request
```

This is the primary workspace for requesters.

It should support:

- Creating requests.
- Tracking verification.
- Tracking donor responses.
- Viewing fulfillment progress.

---

# 4.1 Empty State

If the user has no active request:

```text
Need blood?

Submit a verified blood request and
we'll help match compatible donors nearby.

[ Create Blood Request ]
```

---

# 4.2 Create Request

Use a multi-step form instead of a separate page.

---

## Step 1 — Requirement

```text
Blood Group Required

[ Select ]

Units Required

[ 1 ]

Urgency

○ Normal
○ Urgent
○ Critical
```

---

## Step 2 — Hospital

```text
Hospital Name

[ Search / Select Hospital ]

Hospital Address

[______________________]

Required Date

[ Date ]

Required Time

[ Time ]
```

---

## Step 3 — Request Details

```text
Patient Name

Requester Relationship

Reason / Additional Information

Requester Phone
```

Only authorized users should see sensitive information.

---

## Step 4 — Verification

```text
Supporting Information

[ Upload Document ]

Hospital Reference

[________________]
```

Display:

> Requests are reviewed before donors are contacted.

---

## Final Step

Show a review screen.

```text
Review Your Request

Blood Group: O+
Units: 2
Hospital: XYZ Hospital
Urgency: Critical
Required: Today, 7:00 PM

[ Submit for Verification ]
```

---

# 4.3 Pending Verification State

After submission:

```text
REQUEST UNDER REVIEW

Your blood request has been submitted
for verification.

Status

● Verification Pending

We will begin donor matching only after
the request has been approved.
```

Include a timeline.

```text
✓ Submitted

◉ Under Review

○ Approved

○ Donors Contacted

○ Fulfilled
```

---

# 4.4 Active Request Dashboard

Once approved:

```text
ACTIVE BLOOD REQUEST

O+ Blood Required

XYZ Hospital

CRITICAL

Units Progress

1 / 2 Units Confirmed

████████░░ 50%
```

---

# 4.5 Matching Status

Display:

```text
DONOR MATCHING

Nearby compatible donors are being notified.

Potential Donors Matched

8
```

Do not expose donor personal information by default.

Instead:

```text
2 donors responded
1 donor confirmed
```

---

# 4.6 Request Timeline

```text
✓ Request Submitted

✓ Verification Complete

✓ Request Approved

✓ Nearby Donors Notified

✓ 1 Donor Confirmed

○ Requirement Fulfilled
```

Use real-time updates.

---

# 4.7 Request Actions

Allow:

```text
[ Update Request ]

[ Cancel Request ]
```

For important changes such as:

- Blood group
- Units
- Hospital

the request may need to return to review depending on business rules.

---

# 4.8 Fulfilled State

When the request is completed:

```text
✓ REQUEST FULFILLED

The required blood units have been confirmed.

Thank you to everyone who responded
and helped with this request.
```

Actions:

```text
[ View Request Summary ]

[ Close ]
```

---

# 4.9 Request History

At the bottom or inside a tab:

```text
REQUEST HISTORY

#BC-1042
O+
XYZ Hospital
Fulfilled

#BC-0981
A+
ABC Hospital
Cancelled
```

---

---

# 5. Admin Dashboard

## Route

```text
/admin
```

This page handles the majority of administration.

Use tabs and drawers instead of creating multiple admin pages.

Suggested tabs:

```text
Overview
Requests
Users
Hospitals
Reports
Activity
```

---

# 5.1 Overview Tab

Top metric cards:

```text
1,248
TOTAL USERS
```

```text
436
ACTIVE DONORS
```

```text
37
ACTIVE REQUESTS
```

```text
8
PENDING VERIFICATION
```

```text
5
CRITICAL REQUESTS
```

---

# 5.2 Critical Requests Section

Place near the top.

```text
CRITICAL REQUESTS

O+
XYZ Hospital
2 Units
Created 12 min ago

[ Review ]
```

Critical requests should be visually prominent.

---

# 5.3 Pending Verification Queue

Display requests requiring review.

Columns:

```text
Request ID
Blood Group
Units
Hospital
Urgency
Created
Status
Action
```

Example:

```text
#BC-1042

O+

2 Units

XYZ Hospital

CRITICAL

12 min ago

PENDING

[ Review ]
```

---

# 5.4 Request Review Drawer

Clicking `Review` opens a side panel.

Display:

```text
REQUEST #BC-1042

Requester Information

Hospital Information

Blood Requirement

Supporting Documents

Request History
```

Actions:

```text
[ Approve Request ]

[ Reject Request ]

[ Request More Information ]
```

Approving the request should trigger the matching workflow.

---

# 5.5 Active Requests Tab

Display:

```text
Blood Group
Hospital
Urgency
Units Required
Units Fulfilled
Matched Donors
Status
```

Example:

```text
O+
XYZ Hospital
Critical
2
1
4
Partially Fulfilled
```

Clicking opens details.

---

# 5.6 Users Tab

Allow filtering:

```text
All Users

Donors

Requesters

Hospitals

Suspended
```

User row:

```text
Name
Role
Verification
Blood Group
Status
Joined
```

Actions:

```text
[ View ]

[ Verify ]

[ Suspend ]
```

---

# 5.7 User Detail Drawer

Display:

```text
Profile Information

Role

Verification Status

Account Status

Activity

Donation / Request History

Reports
```

Admin actions:

```text
[ Verify ]

[ Suspend ]

[ Unsuspend ]
```

---

# 5.8 Hospitals Tab

Display:

```text
Hospital Name
Registration
Location
Verification
Active Requests
```

Actions:

```text
[ Review ]

[ Verify ]

[ Suspend ]
```

---

# 5.9 Reports Tab

Display reports submitted by users.

Types:

```text
Fake Request
Incorrect Information
Harassment
Suspicious Activity
```

Each report should contain:

```text
Report ID
Reported By
Target
Reason
Created
Status
```

Actions:

```text
[ Review ]

[ Resolve ]

[ Suspend User ]
```

---

# 5.10 Activity / Audit Log Tab

Display important actions.

Example:

```text
Admin approved request #BC-1042

5 minutes ago
```

```text
Hospital XYZ verified a donation

20 minutes ago
```

```text
User account suspended

1 hour ago
```

Include filters for:

- Date
- Action type
- Admin
- Entity

---

# 6. Shared UI Components

The following components should be reusable throughout the application.

---

## Navigation

Use a consistent top navigation.

Dashboard navigation should adapt based on role.

---

## Status Badge

Reusable status badges:

```text
PENDING
APPROVED
ACTIVE
PARTIALLY FULFILLED
FULFILLED
REJECTED
CANCELLED
EXPIRED
```

Urgency badges:

```text
NORMAL
URGENT
CRITICAL
```

---

## Blood Group Badge

Reusable component:

```text
O+
A+
B+
AB+
O-
A-
B-
AB-
```

---

## Notification System

Use a reusable notification component with:

```text
Unread indicator
Icon
Title
Message
Timestamp
Action
```

---

## Confirmation Modal

Use for:

```text
Accept Donation Request
Cancel Blood Request
Reject Blood Request
Suspend User
Approve Request
```

---

# 7. Mobile Behaviour

The application should be mobile-first.

---

## Donor Mobile Priority

The most important mobile screen should allow a donor to quickly see:

```text
Blood Group
Availability
Nearby Request
Distance
Urgency

[ I CAN DONATE ]
```

The donor should not need to navigate through multiple screens to respond.

---

## Requester Mobile Priority

The requester should easily see:

```text
Request Status

Units Required

Units Confirmed

Donors Responded

Timeline
```

---

## Admin Mobile

The admin dashboard can be simplified on mobile.

Use:

- Horizontally scrollable tables
- Drawers
- Bottom sheets
- Cards instead of large tables where appropriate

---

# 8. Page Summary

The MVP contains only five primary pages:

| # | Page | Route | Main Purpose |
|---|---|---|---|
| 1 | Home | `/` | Explain platform and onboard users |
| 2 | Authentication & Onboarding | `/auth` | Login, register, choose role, setup profile |
| 3 | Donor Dashboard | `/donor` | Receive and respond to nearby requests |
| 4 | Blood Request Dashboard | `/request` | Create and track blood requests |
| 5 | Admin Dashboard | `/admin` | Verification, management, moderation |

---

# 9. Navigation Strategy

Instead of creating many separate pages, use:

```text
Main Page
    ↓
Tabs
    ↓
Cards
    ↓
Drawer / Modal
    ↓
Action
```

Example:

```text
Admin Dashboard
      ↓
Requests Tab
      ↓
Request Row
      ↓
Review Drawer
      ↓
Approve
```

Similarly:

```text
Donor Dashboard
      ↓
Nearby Request Card
      ↓
Request Detail Drawer
      ↓
I Can Donate
      ↓
Confirmation Modal
```

This keeps the application focused while maintaining a complete workflow.

---

# 10. Recommended MVP Flow

The entire MVP should be usable through these five pages:

```text
HOME
 │
 ├── Donate Blood
 │        ↓
 │      AUTH
 │        ↓
 │   DONOR DASHBOARD
 │        ↓
 │   Receive Nearby Request
 │        ↓
 │   Accept / Decline
 │
 └── Request Blood
          ↓
        AUTH
          ↓
   REQUEST DASHBOARD
          ↓
   Create Request
          ↓
   Pending Verification
          ↓
   ADMIN DASHBOARD
          ↓
   Approve Request
          ↓
   Donors Matched
          ↓
   Donor Accepts
          ↓
   Real-Time Update
          ↓
   REQUEST FULFILLED
```

---

# 11. Final Design Principle

The product should feel like a focused emergency coordination platform rather than a large hospital management system.

The experience should prioritize:

1. **Speed**
2. **Trust**
3. **Verification**
4. **Privacy**
5. **Clear status tracking**
6. **Nearby donor matching**
7. **Simple actions**

The ideal experience is:

> A requester should be able to create and track a verified request with minimal confusion.

> A donor should be able to understand and respond to a nearby request within seconds.

> An administrator should be able to review and approve a request without navigating through a complex system.

This five-page architecture should be treated as the core MVP scope.