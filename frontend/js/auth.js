// auth.js — cookie-based auth (HTTP-only), χωρίς localStorage

export async function login(username, password){
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });
  if(!res.ok){
    const e = await safeJson(res);
    throw new Error(e?.msg || 'Σφάλμα κατά την είσοδο');
  }
  return await res.json();
}

export async function logout(){
  await fetch('/auth/logout', { method:'POST', credentials:'include' });
}

export async function me(){
  const res = await fetch('/auth/me', { credentials: 'include' });
  if(!res.ok) return null;
  return await res.json();
}

// Συμβατότητα με παλαιό κώδικα
export async function isLoggedIn(){
  const data = await me();
  return !!(data && data.ok);
}

// Wrapper για protected κλήσεις: στέλνει πάντα credentials
export async function fetchWithAuth(url, options = {}){
  const res = await fetch(url, { credentials:'include', ...(options || {}) });
  return res;
}

// Helpers
async function safeJson(res){
  try { return await res.json(); } catch { return null; }
}
