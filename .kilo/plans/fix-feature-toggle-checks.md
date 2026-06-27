# Plan: Fix E-Visitors System Features Checkbox
## Context
- Open tabs / focus: `E-visitors-main/src/pages/dashboard/attendance/ScanningPage.tsx`, `attendance-backend-main/todo.md`
- Root task: The two feature toggles (`Self Registration`, `Self Checkout`) in `ScanningPage` are not updating/reflecting changes.

## Findings
- Backend route already hardened: `attendance-backend-main/controllers/visitor.ts:578-612` — `PUT /api/visitors/system-features` accepts `{ featureKey, isEnabled }` and uses loose `any` validation internally, so tsoa strict validation should not 400 on the existing payload shape.
- Frontend API is correct: `E-visitors-main/src/api/visitor.ts:142-151` sends `{ featureKey, isEnabled }` via `client.put('/visitors/system-features', payload)`.
- Likely root cause is frontend toggle wiring:
  - `handleToggleFeature` mutates state ONLY when `res?.success` is truthy. If backend ever returns a non-2xx or `success: false`, the UI stays unchanged and shared `tapsError` banner may persist, making it _look_ stuck.
  - The toggle payload is built with `as const` (`{ featureKey, isEnabled: !enabled } as const`). In some TS/Jake bundlers this can produce a readonly shape that `client.put` still serializes correctly, but it is an unnecessary fragility.
  - Both toggles share one `isSavingFeature` flag; while one is saving the other is disabled — acceptable UX, but it hides which specific toggle is actually failing if an error occurs.

## Fix Plan
1. Frontend: harden `handleToggleFeature` in `ScanningPage.tsx`
   - Replace `as const` payload with an explicit mutable object.
   - Use a per-toggle saving flag so the other toggle stays interactive (`isSavingSelfReg`, `isSavingSelfCheckout`).
   - On failure, surface the error on the relevant toggle (local state) in addition to the global banner, so users know exactly which control failed.
2. Backend: confirm 200 path and add request-shape logging in `updateSystemFeature` (`controllers/visitor.ts`) for the optional TODO item.
3. Tsoa config check: verify `noImplicitAdditionalProperties` is set to `ignore-on-defaults` (or similar) for this route so the loose `any` body does not get re-validated by tsoa schema. If it is still strict, disable it for this route or remove the explicit interface from the controller method.
4. Validate: run backend `npm run build` and frontend `npm run build` after edits.

## Constraints
- Plan file only in this phase. No source edits until approved.
