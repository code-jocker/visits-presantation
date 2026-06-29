# TODO - Fix hosted 500s (visitors recent taps/system features)

## Plan approved
- Align Render DB schema with Sequelize `Visitor` model so check-in no longer fails with missing columns.

## Steps
1. Identify missing columns in `visitors` table expected by `models/visitor.ts` (`passType`, `profilePhoto`, `exitTime`, `deletedAt`).
2. Run the existing DB sync script (`npm run db:sync`) locally to see if Sequelize can alter the schema.
3. If `sequelize.sync({ alter: true })` cannot add missing columns in the hosted DB, implement an explicit migration/ALTER script and run it on Render.
4. Re-deploy backend.
5. Verify endpoints:
   - POST `/api/visitors/check-in`
   - GET `/api/visitors/recent-taps`
   - GET `/api/visitors/system-features`
6. Optional: add runtime guard to avoid writing fields not present (only if needed).

