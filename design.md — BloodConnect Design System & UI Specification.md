# BloodConnect — Design System & UI Specification

## 1. Design Direction

BloodConnect should look like a **premium, modern health-tech platform**.

The website should communicate:

- Trust
- Urgency
- Human connection
- Safety
- Reliability
- Modern technology

It should NOT look like:

- A generic hospital website
- A government portal
- A basic CRUD dashboard
- An overly futuristic AI dashboard
- A template filled with red gradients
- A website where every section is a card

The overall visual language should be:

> **Editorial + Health-tech + Minimal + Human**

Think of a high-end healthcare startup website with the cleanliness of a modern SaaS product.

---

# 2. Core Visual Principle

The design should follow:

```text
Strong Typography
        +
Large Whitespace
        +
High-quality Photography
        +
Subtle Red Accents
        +
Soft Neutral Surfaces
        +
Elegant Motion
```

Red should be an **accent**, not the entire visual identity.

Approximately:

```text
70% → Neutral / white / off-white
20% → Dark typography / charcoal
10% → Blood red / accent
```

---

# 3. Color Palette

## Primary

```text
Blood Red
#C62828
```

Use for:

- Primary CTA
- Important indicators
- Active states
- Blood-group accents
- Critical actions

---

## Secondary Red

```text
Deep Burgundy
#8F1D2C
```

Use sparingly for:

- Hero accents
- Dark sections
- Important headings
- Hover states

---

## Background

Primary:

```text
#FAFAF8
```

Secondary:

```text
#F4F3F0
```

Cards:

```text
#FFFFFF
```

---

## Dark

Primary text:

```text
#171717
```

Secondary:

```text
#525252
```

Muted:

```text
#737373
```

---

## Borders

```text
#E7E5E4
```

Use extremely subtle borders.

Avoid heavy outlines.

---

## Success

```text
#16803C
```

---

## Warning

```text
#C2410C
```

---

## Critical

```text
#B91C1C
```

---

# 4. Typography

Typography is one of the most important parts of this design.

Do NOT use generic combinations such as:

```text
Poppins + Roboto
Montserrat + Open Sans
```

The website should have a sophisticated typographic identity.

---

# 5. Recommended Font Pair

## Primary Font

### Manrope

Use **Manrope** as the primary UI font.

It should be used for:

- Navigation
- Buttons
- Cards
- Forms
- Dashboard
- Body text
- Metrics
- Labels

Weights:

```text
400 → Body
500 → Labels
600 → Buttons / Subheadings
700 → Headings
800 → Hero headlines
```

---

## Display Font

Use:

### DM Serif Display

Use this very selectively for large editorial moments.

Examples:

```text
Every donation
can change a life.
```

or:

```text
Help can be closer
than you think.
```

The serif should NOT be used everywhere.

Use it only for:

- Hero emphasis
- Major section statements
- Emotional storytelling sections

This creates a strong contrast:

```text
MANROPE
Modern / precise / technical

DM SERIF DISPLAY
Human / emotional / editorial
```

---

# 6. Typography Scale

Use a responsive type scale.

## Hero

Desktop:

```text
72px – 88px
Line height: 0.95 – 1.05
Weight: 700–800
Letter spacing: -0.04em
```

Tablet:

```text
56px – 64px
```

Mobile:

```text
42px – 48px
```

---

## Section Heading

Desktop:

```text
48px – 60px
```

Mobile:

```text
36px – 42px
```

---

## Card Heading

```text
20px – 24px
```

---

## Body

```text
16px – 18px
Line height: 1.6
```

---

## Small Text

```text
13px – 14px
```

---

# 7. Typography Rules

Do NOT center-align everything.

Use:

### Left alignment

For:

- Hero copy
- Section headings
- Dashboard content
- Forms
- Tables
- Information blocks

### Center alignment

Only for:

- Short marketing statements
- Small CTA sections
- Some statistics
- Empty states

This will make the site feel significantly more premium.

---

# 8. Layout System

Use a strong grid.

Desktop:

```text
Max width: 1280px
```

Large desktop:

```text
Max width: 1400px
```

Page horizontal padding:

```text
Desktop: 64px
Tablet: 32px
Mobile: 20px
```

---

# 9. Vertical Rhythm

Use generous spacing.

Major sections:

```text
120px – 180px
```

Section heading → content:

```text
48px – 72px
```

Cards:

```text
24px – 32px padding
```

Avoid cramming sections together.

Whitespace is an important part of the visual identity.

---

# 10. Border Radius

Avoid excessive rounded cards.

Recommended:

```text
Small controls:
8px

Cards:
16px

Large feature containers:
24px

Hero image:
24px – 32px
```

Do NOT make every component extremely rounded.

Avoid the generic:

```text
rounded-full everywhere
```

---

# 11. Shadows

Use extremely subtle shadows.

Example:

```text
0 8px 30px rgba(0,0,0,0.05)
```

Most cards should rely on:

```text
background
+
border
+
spacing
```

rather than strong shadows.

---

# 12. Component Library

Use **shadcn/ui** as the primary component foundation.

Use components from **21st.dev** selectively when they improve the visual experience.

Do NOT import random components simply because they look impressive.

---

## Recommended shadcn Components

Use:

```text
Button
Card
Badge
Dialog
Drawer
Sheet
Tabs
Input
Textarea
Select
Dropdown Menu
Avatar
Tooltip
Progress
Skeleton
Separator
Alert
Table
Command
Popover
Calendar
Checkbox
Switch
```

---

# 13. 21st.dev Usage

21st.dev components can be used for:

- Hero animations
- Animated cards
- Bento layouts
- Spotlight effects
- Text reveal
- Magnetic buttons
- Animated navigation
- Number counters
- Background effects

However:

> The website should remain clean even if all animations are disabled.

Animation should enhance the design, not define it.

---

# 14. Image Direction

Photography is extremely important.

Use **high-quality authentic photography**.

Avoid:

- Generic hospital stock photos
- Overly staged smiling doctors
- Cartoon illustrations
- Fake medical 3D renders
- Excessive blood imagery

Preferred photography:

### Donor

Close-up / environmental photography of a person donating blood.

### Human Connection

Two people interacting naturally.

### Hospital

Clean modern hospital environment.

### Community

People participating in a blood donation drive.

Use photographs with:

- Natural lighting
- Neutral backgrounds
- Realistic skin tones
- Documentary/editorial feel
- Strong composition

---

# 15. Image Treatment

Photography should have:

```text
Large aspect ratio
Rounded corners
Subtle cropping
Natural colors
```

Avoid putting a strong red overlay over photographs.

Instead, use small red design accents around them.

---

# 16. Home Page Design

## Hero

The hero should be the strongest visual section.

Layout:

```text
┌──────────────────────────────────────────────┐
│ NAVIGATION                                   │
│                                              │
│                                              │
│  Someone nearby                              │
│  could be waiting                            │
│  for your help.        ┌──────────────────┐  │
│                        │                  │  │
│  Connect with verified │     IMAGE        │  │
│  blood requests and    │                  │  │
│  nearby donors.        │                  │  │
│                        └──────────────────┘  │
│                                              │
│  [ Donate Blood ] [ Request Blood ]          │
│                                              │
└──────────────────────────────────────────────┘
```

Do not make the hero symmetrical.

Use an editorial asymmetrical layout.

---

# 17. Hero Image

Use one large image.

Recommended:

A close-up editorial photograph showing a donor during the donation process.

Image should occupy approximately:

```text
45% – 50% of hero width
```

Use a large rounded rectangle.

Add a small floating information card.

Example:

```text
┌────────────────────────┐
│  ● LIVE MATCH          │
│                        │
│  O+ donor found        │
│  3.2 km away           │
└────────────────────────┘
```

This card should look like a real product feature rather than a decorative UI element.

---

# 18. Hero Background

Use:

```text
#FAFAF8
```

Do not use a red background.

Add subtle visual texture:

- Very light grid
- Tiny dots
- Faint radial shape

Opacity should remain extremely low.

---

# 19. Hero Animation

On page load:

### Step 1

Headline fades upward.

### Step 2

Supporting text appears.

### Step 3

CTA buttons appear.

### Step 4

Hero image scales from:

```text
0.97 → 1
```

### Step 5

Floating donor card slides upward.

Animation duration:

```text
400–700ms
```

Use staggered delays.

Do NOT use dramatic animations.

---

# 20. Trust / Impact Strip

Immediately below the hero.

Use a horizontal statistics strip.

Example:

```text
1,200+
DONORS

340+
REQUESTS FULFILLED

92%
FULFILLMENT RATE

4.8 km
AVG. MATCH DISTANCE
```

Animate numbers counting up when the section enters the viewport.

Use **Framer Motion**.

---

# 21. How It Works Section

Use a large editorial layout.

Left:

```text
HOW IT WORKS

Simple when every second matters.

From verified request
to nearby donor.
```

Right:

Four numbered steps.

```text
01 Request
02 Verify
03 Match
04 Donate
```

Each step should animate when entering viewport.

---

# 22. Interactive Matching Visualization

This should be one of the signature sections.

Display a simplified map/network visualization.

Example:

```text
                 ●
               Donor
               2.4 km

                    \
                     \
                      ●
                   REQUEST
                      /
                     /
               ●
             Donor
             4.8 km
```

Use subtle animated connection lines.

When the section enters the viewport:

```text
Request appears
↓
Nearby donor nodes appear
↓
Connection lines animate
↓
Nearest donor becomes highlighted
```

This visually explains the core product differentiator.

---

# 23. Blood Group Section

Do not simply display eight boring cards.

Create a visual grid.

```text
O+     O−     A+     A−

B+     B−     AB+    AB−
```

Hover:

```text
Scale: 1.02
Background subtly changes
```

Click opens an informational modal.

---

# 24. Why BloodConnect

Use a Bento-style layout.

Example:

```text
┌──────────────────────┬───────────────┐
│                      │               │
│  VERIFIED REQUESTS   │  LOCATION     │
│                      │  MATCHING      │
│                      │               │
├──────────────────────┼───────────────┤
│                      │               │
│  PRIVACY             │ REAL-TIME     │
│                      │ UPDATES       │
└──────────────────────┴───────────────┘
```

Use different image treatments in some cards.

Avoid making every card identical.

---

# 25. Human Story Section

Introduce an emotional section.

Large photograph on one side.

Text on the other:

```text
Sometimes help
is closer than you think.

A nearby donor can turn
a desperate search into
a moment of hope.
```

Use DM Serif Display for:

```text
Sometimes help
is closer than you think.
```

This should be one of the most visually memorable sections.

---

# 26. CTA Section

Use a dark burgundy background.

```text
#4A1018
```

Large white heading:

> **Be the reason someone gets another chance.**

Buttons:

```text
[ Become a Donor ]

[ Request Blood ]
```

Add subtle animated particles / connection nodes.

Keep the effect extremely subtle.

---

# 27. Dashboard Design

Marketing pages and application dashboards should share the same design system.

But dashboards should be more functional.

---

# 28. Donor Dashboard Layout

Desktop:

```text
┌──────────────────────────────────────────────┐
│ Header                                       │
├──────────────────────────────────────────────┤
│                                              │
│  Good evening, Alex                          │
│                                              │
│  ┌──────────────┐ ┌────────────────────────┐ │
│  │              │ │                        │ │
│  │ DONOR STATUS │ │ NEARBY REQUESTS        │ │
│  │              │ │                        │ │
│  └──────────────┘ └────────────────────────┘ │
│                                              │
│  ┌─────────────────────────────────────────┐ │
│  │ Nearby requests                         │ │
│  │                                         │ │
│  │ Request cards                           │ │
│  └─────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

Do not make the dashboard overly dense.

---

# 29. Donor Status Component

Large status indicator.

```text
┌─────────────────────────────┐
│ YOUR DONOR STATUS            │
│                             │
│       ● AVAILABLE           │
│                             │
│ Blood Group                 │
│ O+                          │
│                             │
│ [ Change Availability ]     │
└─────────────────────────────┘
```

Use a subtle animated status dot.

---

# 30. Nearby Request Cards

Prioritize:

```text
Urgency
Blood Group
Distance
Hospital
Units
```

Example:

```text
CRITICAL

O+

XYZ Hospital

3.2 km away

2 units required

[ View Request ]
```

The distance should be visually prominent.

---

# 31. Request Dashboard

The request dashboard should prioritize the status of the request.

Top section:

```text
YOUR BLOOD REQUEST

O+

XYZ Hospital

CRITICAL
```

Then a large progress indicator:

```text
1 / 2 units confirmed

██████████░░░░░░

50%
```

---

# 32. Request Timeline

Use a vertical timeline.

```text
● Submitted
│
● Verified
│
● Approved
│
● Donors Notified
│
● 1 Donor Confirmed
│
○ Fulfilled
```

Animate the timeline when status changes.

---

# 33. Admin Dashboard

Admin dashboard should prioritize information density without becoming ugly.

Use:

```text
Metric cards
+
Charts
+
Tables
```

---

# 34. Admin Graphs

Include real graphs.

## Requests Over Time

Line chart:

```text
Requests
  │       ╭───╮
  │   ╭───╯   ╰──╮
  │───╯          ╰──
  └─────────────────
       Days
```

---

## Blood Group Demand

Bar chart:

```text
O+   ███████████
A+   █████████
B+   ███████
O−   █████
AB+  ███
```

---

## Request Fulfillment

Donut chart:

```text
92%
FULFILLED
```

---

## Average Response Time

Area or line chart.

Use a charting library such as:

- Recharts

Charts should use the same typography and colors as the application.

Do not use rainbow charts.

---

# 35. Graph Color Rules

Primary:

```text
Blood Red
```

Secondary:

```text
Dark Charcoal
```

Supporting:

```text
Neutral Grey
Success Green
```

Use a maximum of 3–4 colors per graph.

---

# 36. Data Visualization Style

Charts should have:

- Minimal grid lines
- Small labels
- Clear tooltips
- Rounded bars
- No unnecessary legends
- No 3D effects

Tooltips should use shadcn styling.

---

# 37. Admin Tables

Tables should be clean and spacious.

Avoid old-fashioned dense admin tables.

Use:

```text
Request ID
Blood Group
Hospital
Urgency
Units
Status
Created
Action
```

Rows:

```text
64px – 72px
```

Use subtle hover state.

---

# 38. Status Colors

Use color sparingly.

```text
APPROVED
Green

PENDING
Amber

CRITICAL
Red

REJECTED
Dark Red

FULFILLED
Green

CANCELLED
Grey
```

Always include text/icon with color.

Do not rely solely on color.

---

# 39. Forms

Forms should feel calm and simple.

Input height:

```text
48px – 52px
```

Label:

```text
14px
500 weight
```

Input:

```text
16px
```

Use generous vertical spacing.

Do not place 5–6 inputs on the same row.

---

# 40. Blood Request Form Layout

Use a multi-step form.

```text
01
Requirement

02
Hospital

03
Details

04
Verification
```

Top progress indicator:

```text
●────●────○────○
```

Only show relevant fields at each step.

---

# 41. Buttons

Primary:

```text
Background: #C62828
Text: White
Height: 48–52px
Radius: 10px
```

Hover:

```text
Background → darker red
Transform → translateY(-1px)
```

Secondary:

```text
White
Border
Dark text
```

Ghost:

Transparent.

---

# 42. Button Microinteractions

On hover:

```text
translateY(-1px)
```

On click:

```text
scale(0.98)
```

Loading:

```text
spinner
+
button remains same width
```

Do not use exaggerated magnetic effects on every button.

---

# 43. Cards

Cards should generally use:

```text
background: white
border: 1px solid #E7E5E4
border-radius: 20px
```

Hover only where useful.

Example:

```text
transform: translateY(-2px)
```

Transition:

```text
200ms
```

---

# 44. Motion System

Use **Framer Motion**.

Motion should follow three principles:

### Fast

Micro interactions:

```text
150–250ms
```

### Medium

Cards:

```text
250–400ms
```

### Slow

Hero / storytelling:

```text
500–900ms
```

---

# 45. Scroll Animations

Use subtle:

```text
opacity: 0 → 1
y: 20 → 0
```

when sections enter the viewport.

Avoid:

- Excessive zooming
- Rotating cards
- Large parallax
- Constant movement

---

# 46. Page Transitions

Use subtle opacity/slide transitions.

Example:

```text
opacity
0 → 1
```

Duration:

```text
200–300ms
```

The application should feel responsive, not cinematic.

---

# 47. Loading States

Use shadcn Skeleton.

Example:

```text
████████████████
██████████
██████████████
```

Avoid spinners everywhere.

Use skeletons for:

- Dashboard cards
- Request cards
- Tables
- Charts

---

# 48. Empty States

Empty states should feel intentional.

Example:

```text
        ○
     No requests

There are currently no compatible
blood requests nearby.

We'll notify you when one appears.

[ Check Availability ]
```

Use a minimal illustration or icon.

---

# 49. Error States

Errors should be clear and human.

Instead of:

```text
ERROR 500
```

Use:

> Something went wrong while loading your requests.

```text
[ Try Again ]
```

---

# 50. Accessibility

The visual design must maintain:

- WCAG-conscious contrast
- Keyboard navigation
- Visible focus states
- Accessible labels
- Reduced motion support

If the user prefers reduced motion:

```text
prefers-reduced-motion
```

disable non-essential animations.

---

# 51. Responsive Layout

## Desktop

Use asymmetric layouts and large photography.

## Tablet

Reduce:

- Font sizes
- Section spacing
- Image sizes

## Mobile

Prioritize:

```text
Content
↓
Action
↓
Status
```

Hero becomes:

```text
Headline

Description

CTA

Image
```

Dashboard becomes single-column.

---

# 52. Mobile Navigation

Use a compact header.

Donor/requester dashboards can use a bottom navigation:

```text
Home
Requests
Notifications
Profile
```

Admin can use a menu drawer.

---

# 53. Iconography

Use **Lucide React**.

Icons should be:

```text
Stroke based
1.5–2px
Minimal
```

Do not mix multiple icon styles.

Recommended icons:

```text
Heart
MapPin
Droplets
ShieldCheck
Bell
Clock
Users
Hospital
Activity
CheckCircle
AlertCircle
```

---

# 54. Photography + UI Balance

Images should occupy meaningful visual space.

Recommended ratio:

```text
Photography: 25–35%
UI / typography: 65–75%
```

Do not turn the entire site into a photo gallery.

Photography should reinforce the human story.

---

# 55. Decorative Elements

Use very subtle decoration.

Possible:

- Fine grid
- Dotted network
- Small circles
- Thin connection lines
- Abstract blood-drop geometry

Opacity:

```text
5–15%
```

Avoid:

- Excessive blobs
- Neon glows
- Floating 3D objects
- Random gradients
- Decorative medical crosses everywhere

---

# 56. Cursor / Hover Effects

Optional subtle interactions:

### Image

Slight zoom:

```text
scale(1.02)
```

### Card

Slight elevation.

### CTA

Small upward movement.

### Interactive map

Donor nodes respond to hover.

Do not implement custom cursor effects unless they genuinely improve the experience.

---

# 57. Visual Hierarchy

Every page should have one clear primary action.

Example:

## Home

```text
Request Blood
```

## Donor

```text
View Nearby Request
```

## Requester

```text
Create Blood Request
```

## Admin

```text
Review Pending Request
```

Do not make every button red.

---

# 58. Design Tokens

Create CSS variables.

```css
--background: #FAFAF8;
--foreground: #171717;

--primary: #C62828;
--primary-dark: #8F1D2C;

--surface: #FFFFFF;
--surface-muted: #F4F3F0;

--border: #E7E5E4;

--muted: #737373;

--success: #16803C;
--warning: #C2410C;
--critical: #B91C1C;

--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 20px;
--radius-xl: 28px;
```

---

# 59. Recommended Technology Stack

Frontend:

```text
React
TypeScript
Vite
Tailwind CSS
```

Components:

```text
shadcn/ui
21st.dev
Lucide React
```

Animation:

```text
Framer Motion
```

Charts:

```text
Recharts
```

Maps:

```text
Mapbox
```

Backend:

```text
Supabase
PostgreSQL
PostGIS
Supabase Auth
Supabase Storage
Supabase Realtime
Edge Functions
```

---

# 60. Component Architecture

Organize UI components:

```text
src/
│
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   │
│   ├── marketing/
│   │   ├── Hero.tsx
│   │   ├── Stats.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── MatchingVisualization.tsx
│   │   ├── BloodGroups.tsx
│   │   ├── StorySection.tsx
│   │   └── CTA.tsx
│   │
│   ├── donor/
│   │   ├── DonorStatus.tsx
│   │   ├── NearbyRequestCard.tsx
│   │   ├── RequestDrawer.tsx
│   │   └── DonationHistory.tsx
│   │
│   ├── requester/
│   │   ├── RequestForm.tsx
│   │   ├── RequestProgress.tsx
│   │   ├── RequestTimeline.tsx
│   │   └── FulfillmentStatus.tsx
│   │
│   └── admin/
│       ├── MetricCard.tsx
│       ├── RequestTable.tsx
│       ├── UserTable.tsx
│       ├── HospitalTable.tsx
│       ├── AnalyticsCharts.tsx
│       └── AuditLog.tsx
```

---

# 61. Animation Library Rules

Use Framer Motion consistently.

Create reusable animation variants:

```text
fadeIn
fadeUp
fadeScale
staggerChildren
slideIn
```

Do not create unique animation logic for every component.

---

# 62. Important UX Rule

The user should never wonder:

> "What am I supposed to do next?"

Every major screen should have:

```text
Current State
        ↓
What it means
        ↓
Next Action
```

Example:

```text
REQUEST UNDER REVIEW

Your request has been submitted and is
waiting for verification.

[ View Request ]
```

---

# 63. Final Visual Target

The finished website should feel like:

```text
Premium health-tech startup
        +
Modern SaaS interface
        +
Editorial photography
        +
Human storytelling
        +
Subtle motion
```

It should be:

### Clean

Large whitespace and strong hierarchy.

### Attractive

Strong typography and photography.

### Trustworthy

Neutral colors and clear information.

### Human

Real photography and emotional storytelling.

### Modern

shadcn + 21st.dev + Framer Motion.

### Functional

Clear workflows and obvious actions.

---

# 64. Absolute Design Don'ts

DO NOT:

- Use red for every element.
- Use gradients everywhere.
- Use giant glowing red circles.
- Use excessive glassmorphism.
- Use random 3D medical illustrations.
- Use stock-photo collages.
- Use Poppins/Roboto-style generic typography.
- Use huge rounded pills everywhere.
- Put every section inside cards.
- Animate everything.
- Use rainbow charts.
- Create overly dense dashboards.
- Use tiny text.
- Use excessive icons.
- Make every section center-aligned.
- Sacrifice usability for visual effects.

---

# 65. Final Design Statement

BloodConnect should immediately communicate:

> **This is a serious platform built to help people connect during critical moments.**

The visual experience should combine:

```text
                    BLOODCONNECT

          HUMAN        TRUST        TECHNOLOGY
             \           |            /
              \          |           /
               \         |          /
                ─── CLEAN DESIGN ───
                       |
                 STRONG TYPE
                       |
                 REAL IMAGERY
                       |
                 SUBTLE MOTION
                       |
                CLEAR ACTIONS
```

The website should be visually impressive enough to feel like a polished startup product, while remaining calm, trustworthy, accessible, and extremely easy to use during an emergency.