# Render deployment guide (E-visitors)

This guide deploys the **backend** (`attendance-backend-main`) as a Node.js Web Service and the **frontend** (`E-visitors-main`) as a Static Site on Render.

## 1) Required database
Use the Render PostgreSQL connection string (set this as `DATABASE_URL` in the backend environment):

```
postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>
```

The backend auto-detects PostgreSQL when `DATABASE_URL` is set (see `attendance-backend-main/config/database.ts`).

## 2) Backend (Render Web Service)
Repo root: `attendance-backend-main`

### Build command
```bash
npm install && npm run build
```

### Start command
```bash
npm run start
```

### Environment variables (Render -> Environment)
| Variable | Example / Notes |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | Render provides this; default `3000` |
| `DATABASE_URL` | Your Render Postgres connection string |
| `JWT_SECRET` | Strong random secret (e.g. `openssl rand -base64 32`) |
| `FRONTEND_URL` | `https://<your-frontend>.onrender.com` |
| `COOKIE_DOMAIN` | `<your-frontend>.onrender.com` |
| `GOOGLE_CLIENT_ID` | Optional |
| `GOOGLE_CLIENT_SECRET` | Optional |
| `GOOGLE_CALLBACK_URL` | Optional |

**Note:** No MySQL vars (`DB_HOST`, `DB_USER`, etc.) are needed when `DATABASE_URL` is set.

## 3) Frontend (Render Static Site)
Repo root: `E-visitors-main`

### Build command
```bash
npm install && npm run build
```

### Publish directory
```
dist
```

### Environment variables
| Variable | Example / Notes |
|---|---|
| `VITE_API_URL` | `https://<your-backend>.onrender.com` |
| `VITE_APP_URL` | `https://<your-frontend>.onrender.com` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Optional |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Optional |

## 4) CORS
The backend allowlist reads `FRONTEND_URL` from env (`server.ts`). Make sure it matches the frontend Render URL exactly (including `https://`).

## 5) First-time database setup
If the Render Postgres database is empty, run the setup script once (Render Shell / local):
```bash
npm run setup:system
```

If migrations/sync is needed later:
```bash
npm run db:sync
```

