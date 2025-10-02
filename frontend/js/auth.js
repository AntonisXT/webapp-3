// auth.js — cookie-based auth (no localStorage)

export async function login(username, password){
  try{
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
  }catch(err){
    console.error('Σφάλμα σύνδεσης:', err.message);
    throw err;
  }
}

export async function logout(){
  await fetch('/auth/logout', { method:'POST', credentials:'include' });
}

export async function me(){
  const res = await fetch('/auth/me', { credentials: 'include' });
  if(!res.ok) return null;
  return await res.json();
}

// Helper fetch wrapper for protected routes
export async function fetchWithAuth(url, options={}){
  const res = await fetch(url, { credentials:'include', ...(options||{}) });
  return res;
}

// Utilities
async function safeJson(res){
  try{ return await res.json(); }catch{ return null; }
}
