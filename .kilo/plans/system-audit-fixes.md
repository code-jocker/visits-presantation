# System Audit & Fixes Plan

## Findings

### High Priority

1. **Secret Exposure in AGENTS.md**
   - AGENTS.md contains an exposed API key
   - controllers/face.ts:38 hardcodes an API key
   - Fix: Move secrets to .env, reference via process.env, and remove from AGENTS.md

2. **JWT Tokens Logged to Console**
   - middlewares/auth.ts:82 logs token prefix
   - controllers/auth.ts:344 logs full token on logout
   - Fix: Remove or redact token logging

3. **Missing Root .gitignore**
   - No .gitignore at D:\E-visitors root
   - Fix: Create .gitignore excluding node_modules/, .env, dist/, *.log, .kilo/

### Medium Priority

4. **tsoa SystemFeatureUpdateRequest Is a TS Interface, Not a Model Class**
   - controllers/visitor.ts:68 declares it as interface
   - Works because noImplicitAdditionalProperties: ignore in tsoa.json
   - Fix: Convert to tsoa model class pattern, regenerate routes

5. **Incorrect .env.example**
   - Values are swapped: DB_HOST=3306, DB_PORT=3000
   - Missing critical vars: JWT_SECRET, NODE_ENV, PORT, HOST, COOKIE_DOMAIN, FRONTEND_URL
   - Fix: Correct and complete .env.example

6. **Frontend .env Exposes Cloudinary API Key**
   - VITE_CLOUDINARY_API_KEY is bundled into client JS
   - Fix: Ensure upload preset is restricted in Cloudinary dashboard

7. **ScanningPage.tsx hasEquipment State Type Mismatch**
   - State typed as boolean but .toString() stores true/false strings
   - checked={visitorForm.hasEquipment} always truthy for string false
   - Fix: Store actual boolean in state

8. **ScanQr.tsx Scanner Restarts on Every Render**
   - handleQrResult in SelfCheckout.tsx is recreated each render
   - useEffect in ScanQr.tsx depends on onResult, causing restart loop
   - Fix: Wrap handleQrResult in useCallback

### Low Priority

9. **{''} Artifact in ClassName Strings**
   - ScanningPage.tsx:397,416 contain {''} in template literals
   - Fix: Remove the artifact

10. **Database ALTER on Every Startup**
    - config/database.ts:48-49 runs raw ALTER TABLE on each boot
    - Fix: Move to proper Sequelize migrations

11. **Backend Reads Vite-Specific Env Var**
    - config/config.ts:28 reads VITE_APP_URL
    - Fix: Rename to FRONTEND_URL in .env and config

12. **Unused Import in errorHandler.ts**
    - ForeignKeyConstraintError imported but unused
    - Fix: Remove unused import

## Planned Steps

1. Remove secrets from AGENTS.md and controllers/face.ts, move to .env
2. Redact/remove JWT token logging in middlewares/auth.ts and controllers/auth.ts
3. Create root .gitignore
4. Convert SystemFeatureUpdateRequest to tsoa model class + regenerate routes
5. Fix .env.example (swap DB_HOST/PORT, add missing vars)
6. Fix hasEquipment boolean state in ScanningPage.tsx
7. Wrap handleQrResult in useCallback in SelfCheckout.tsx
8. Remove {''} artifacts in ScanningPage.tsx
9. Remove unused ForeignKeyConstraintError import
