# TODO - Render deployment (backend + frontend)

- [ ] Update backend to support PostgreSQL via `DATABASE_URL` and auto-select dialect.
  - [ ] Edit `attendance-backend-main/config/config.ts`
  - [ ] Edit `attendance-backend-main/config/database.ts`
- [ ] Update backend CORS allowlist to include Render frontend origin from `FRONTEND_URL`.
- [ ] Add Render deployment documentation.
  - [ ] Create `RENDER.md` with required env vars and steps to deploy frontend/backend.
- [ ] (Optional) Add `.env.example` files for backend/frontend to document required env vars.
- [ ] Run local checks:
  - [ ] `npm install` (backend + frontend if needed)
  - [ ] `npm run build` / `npm run start` for backend
  - [ ] `npm run build` for frontend

