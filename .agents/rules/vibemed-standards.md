---
description: VibeMed Design System, Color Codes, Doctor Sitting Fee Rules, and Pre-Deployment Testing
globs: src/**/*
---

# VibeMed Project Memory & Rules

- **Brand Color Palette:**
  - Primary Teal: `#0d9488`
  - Dark Teal: `#0f766e`
  - Teal Light BG: `#f0fdfa`
  - Info Blue: `#0284c7`
  - Success Green: `#10b981`
  - Amber Warning: `#f59e0b`
  - Alert/Deduction Red: `#dc2626`
  - Specialty Purple: `#8b5cf6`
  - Dark Text: `#0f172a`, Muted Text: `#64748b`
  - Page Background: `#f8fafc`
  - Card/Table Border: `#e2e8f0`

- **Doctor Sitting Fee Model:**
  - Most doctors have different sitting fees per clinic. Always provide an editable `sittingFee` ($/day) input per clinic shift in the UI.
  - Revenue formulas:
    - `Gross = Visits * Fee`
    - `Sitting Fees = Days Worked * Doctor Sitting Fee at Clinic`
    - `Net Payout = Gross - Sitting Fees`

- **Pre-Deployment Rule:**
  - Run `npm run build` (`tsc -b && vite build`) before declaring tasks complete.
  - No Playwright is currently installed in package.json; compile checks and linting run via `npm run build` and `npm run lint`.
