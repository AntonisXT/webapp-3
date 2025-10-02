# El Greco Web App — Polished Build

- MongoDB **User model** (όχι admin σε env)
- **Cookie-based JWT auth** (HTTP-only)
- **Relative** API calls (Vercel rewrites)

## Backend Setup
1) Δημιούργησε `.env` από `.env.example` και γέμισε τα `MONGO_URI`, `JWT_SECRET`, `FRONTEND_ORIGIN` (προαιρετικά).
2) Εγκατάσταση:
```bash
cd backend
npm install
```
3) Αρχικοποίηση admin:
```bash
node scripts/seed-admin.js admin ΔΥΝΑΤΟΣ_ΚΩΔΙΚΟΣ
```
4) Εκκίνηση:
```bash
npm start
```

## Frontend
- Όλες οι κλήσεις είναι **relative** (`/api/...`, `/auth/...`).
- Τα requests που απαιτούν login στέλνουν `credentials: 'include'`.

