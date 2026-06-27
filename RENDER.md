# Render deployment guide (E-visitors)

This guide deploys the **backend** (`attendance-backend-main`) as a Node.js Web Service and the **frontend** (`E-visitors-main`) as a Web Service.

## 1) Required database
Use your provided Postgres connection string:

- `DATABASE_URL=postgresql://evisitors_user:RK0uvG8ZSkHH551BH2GZ7YWqtE25q37l@dpg-d8h6vtddt1ts7383hlu0-a/evisitors`

## 2) Backend (Render Web Service)
Service: `attendance-backend-main`

### Build command
- `npm install`
- `npm run build`

### Start command
- `npm run start`

### Environment variables (Render -> Environment)
Set at minimum:
- `NODE_ENV=production`
- `PORT=3000` (or whatever Render uses)
- `DATABASE_URL=<your connection string above>`

Also required by app if used/initialized at runtime:
- `JWT_SECRET=<set a strong random secret>`
- `FRONTEND_URL=<your frontend render URL e.g. https://your-frontend.onrender.com>`

Optional (if you use them):
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- `COOKIE_DOMAIN`

### Notes
- The backend CORS allowlist uses `FRONTEND_URL` plus existing defaults.
- No need to set MySQL `DB_HOST/DB_USER/DB_PASSWORD/DB_NAME` when `DATABASE_URL` is provided.

## 3) Frontend (Render Web Service)
Service: `E-visitors-main`

### Build command
- `npm install`
- `npm run build`

### Start command
Use Render’s static web hosting (recommended). If Render requires a start command, you can typically omit it for static.

### Environment variables
Set:
- `VITE_API_URL=<backend render URL e.g. https://your-backend.onrender.com>`
- `VITE_APP_URL=<frontend render URL e.g. https://your-frontend.onrender.com>`

Cloudinary vars (if used by the app):
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

## 4) CORS
After deploy, ensure the frontend origin is allowed.
- Make sure backend `FRONTEND_URL` matches the frontend Render URL exactly.

## 5) First-time database setup / migrations
If your Render database is empty, run the backend setup script locally or via Render console:
- `npm run setup:system`

If your Render DB already has tables, you may only need:
- `npm run db:sync`

(Which one to run depends on your current DB state.)

