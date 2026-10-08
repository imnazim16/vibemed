# VibeMed Project Standards, Design Theme & Pre-Deployment Rules

This document establishes the persistent guidelines, color system, and operational rules for the **VibeMed Healthcare Management System**. All agents and developers working on this codebase must adhere strictly to these principles.

---

## 1. Visual Theme & Color Palette

Never hardcode arbitrary hex colors; stick consistently to VibeMed's core medical brand palette:

| Token / Usage | Hex Code | Purpose / Context |
| :--- | :--- | :--- |
| **Primary Brand Teal** | `#0d9488` | Primary buttons, active tabs, header icons, key metric values |
| **Primary Hover / Deep** | `#0f766e` | Dark teal for brand headers, text emphasis, button hover states |
| **Teal Light Background** | `#f0fdfa` | Stat card backgrounds, badge backgrounds, selected row highlights |
| **Teal Border Accent** | `#ccfbf1` | Subtle container borders for teal elements |
| **Sky / Information Blue** | `#0284c7` | Secondary accents, patient statistics, info tags (`#e0f2fe` bg) |
| **Success Emerald** | `#10b981` | Completed appointments, positive trends (`#dcfce7` bg) |
| **Warning Amber** | `#f59e0b` | Pending / scheduled visits, warning alerts (`#fef3c7` bg) |
| **Danger / Red** | `#dc2626` | Sitting fee deductions, cancellations, errors (`#fee2e2` bg) |
| **Specialty / Purple** | `#8b5cf6` | Specialty and clinic location badges (`#f3e8ff` bg) |
| **Dark Slate Body Text** | `#0f172a` | Primary headings, titles, prominent table text |
| **Muted Slate Text** | `#64748b` | Subtitles, helper text, time stamps, secondary labels |
| **Surface Background** | `#f8fafc` | Layout body, section wrappers |
| **Border Slate** | `#e2e8f0` | Standard card, divider, and table borders |

### Component Framework
- **UI Components:** Ant Design v6 (`antd`) with `@ant-design/icons`.
- **Border Radius:** Default `8px` for buttons/inputs, `14px`–`16px` for cards and dashboard panels.

---

## 2. Business Logic: Multi-Clinic Doctor Sitting Fees

1. **Independent Negotiated Fees:**
   - Doctors negotiate individual clinic daily sitting charges per clinic location (`sittingFee`).
   - Doctors practicing at different clinic locations have distinct daily sitting fees per clinic (e.g. Dr. Sarah Connor may pay \$500/day at Downtown vs \$350/day at Westside).
   - In the Doctor Roster shift configuration UI, each shift slot must provide a customizable **Doctor Sitting Fee ($/day)** input, prefilled with the clinic's default charge but editable by the admin.
2. **Revenue Calculation Rule:**
   - `Gross Billing = Patients Treated × Consultation Fee`
   - `Total Sitting Fees = Days Worked at Clinic × Doctor Sitting Fee for that Clinic`
   - `Net Doctor Payout = Gross Billing - Total Sitting Fees`

---

## 3. Resilience & Blank Screen Prevention (React 19 Safe)

1. **Error Boundaries:**
   - Every layout (`AdminLayout`, `DoctorLayout`, `PatientLayout`, `ReceptionistLayout`) must wrap its `<Outlet />` inside `<ErrorBoundary>`.
   - Never let an unhandled render error crash the entire root SPA.
2. **Synchronous Auth Initialization:**
   - `AuthProvider` must initialize `user` synchronously from `localStorage` using `useState(() => authService.getCurrentUser())` to eliminate unauthenticated route flashes and redirect loops upon browser refresh.
3. **Safe String & Object Handling:**
   - In React 19, never render raw objects as React children (e.g., `{record.specialty}` where specialty is an object).
   - Always guard string methods (`.split()`, `.toLowerCase()`) and formatting methods (`(Number(val) || 0).toLocaleString()`).
4. **Role Normalization:**
   - All roles must be normalized (`admin`, `doctor`, `patient`, `receptionist`) at the `AuthContext` level so that `Sidebar`, `Header`, and `ProtectedRoute` remain 100% in sync.

---

## 4. Mandatory Pre-Deployment Verification

Before committing changes or deploying to production, ALWAYS run:
```bash
npm run build
```
(`tsc -b && vite build`) to verify compile-time TypeScript integrity, React syntax, and asset bundling with zero errors.

### Testing Framework
- **Current Status:** Playwright is not yet installed in `package.json`.
- **If End-to-End browser testing is requested:** Install Playwright via `npm install -D @playwright/test` and run `npx playwright test`.
