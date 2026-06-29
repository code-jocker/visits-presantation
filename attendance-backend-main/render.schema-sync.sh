@echo off
setlocal

REM One-time schema sync helper for Render.
REM Usage: FORCE_DB_SYNC=true npm run start

echo Running one-time schema sync...
set FORCE_DB_SYNC=true
npm run start

