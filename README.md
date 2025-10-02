# El Greco Web App — Polished Build

## Users & Admin (Mongo-based)
Πλέον υπάρχει User model στη MongoDB και seed script για αρχικό admin.

### Δημιουργία/ενημέρωση admin
```bash
cd backend
node scripts/seed-admin.js admin ΔΥΝΑΤΟΣ_ΚΩΔΙΚΟΣ
```

### Login
Το token αποθηκεύεται σε **HTTP-only cookie**. Από το frontend στείλε `credentials: 'include'` όπου απαιτείται.
