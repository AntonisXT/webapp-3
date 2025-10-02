# El Greco Web App — Final (Cookie Auth, Mongo Users)

## Quick Start
### Backend
1) Δημιούργησε `.env` από το `backend/.env.example` και συμπλήρωσε τιμές.
2) Εγκατάσταση
   ```bash
   cd backend
   npm install
   node scripts/seed-admin.js admin ΔΥΝΑΤΟΣ_ΚΩΔΙΚΟΣ
   npm start
   ```

### Frontend (Vercel)
- Όλες οι κλήσεις είναι **relative** (`/api`, `/auth`) και περνούν από `vercel.json` rewrites.
- Ανάλογα βάλε το Render URL στο `vercel.json` (`<render-backend>`).

## Τι περιλαμβάνει
- **Mongo User model** + **seed-admin.js**.
- **Cookie-based auth** (HTTP-only), `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`.
- **Security**: helmet, rate-limit στο `/auth/login`, mongo-sanitize, CORS με credentials.
- **DOMPurify** για ασφαλές `innerHTML`.
- **Healthz** endpoint.
- 404 & κεντρικός error handler.
