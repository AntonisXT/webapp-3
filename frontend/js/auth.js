// auth.js

const API_URL = "";

// -- Helpers: decode/validate JWT on the client --
function parseJwt(token){
    try{
        const base64Url = token.split('.')[1];
        if(!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }catch(e){ return null; }
}
function isTokenExpired(token){
    const payload = parseJwt(token);
    if(!payload || !payload.exp) return false; // if no exp, assume valid
    const nowSec = Math.floor(Date.now()/1000);
    return payload.exp <= nowSec;
}

// Είσοδος χρήστη
async function login(username, password) {
    try {
        const response = await fetch('/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Σφάλμα κατά την είσοδο");
        }

        const data = await response.json();
        // Αποθήκευση του JWT στο localStorage
        localStorage.setItem("token", data.token);
        //alert("Επιτυχής σύνδεση!");
        window.location.href = "index.html"; // Ανακατεύθυνση στην κύρια σελίδα
    } catch (error) {
        console.error("Σφάλμα σύνδεσης:", error.message);
        alert(error.message);
    }
}

// Έλεγχος αν ο χρήστης είναι συνδεδεμένος
function isLoggedIn() {
    const token = localStorage.getItem("token");
    if (!token) return false;
    if (isTokenExpired(token)) { try { localStorage.removeItem("token"); } catch{} return false; }
    return true;
}

// Λήψη του token
function getToken() {
    return localStorage.getItem("token");
}

// Αποσύνδεση χρήστη
function logout() {
    localStorage.removeItem("token");
    //alert("Έχετε αποσυνδεθεί!");
}

async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const isFormData = options && options.body instanceof FormData;
    const headers = {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    };
    const response = await fetch(url, {
      ...options,
      headers,
    });
    if (!response.ok) {
      if (response.status === 401) { try { logout(); } catch {} }
      // try to parse JSON error; if not JSON, fall back to text
      let message = 'API request failed';
      try {
        const err = await response.json();
        message = err.message || JSON.stringify(err);
      } catch (e) {
        try {
          message = await response.text();
        } catch {}
      }
      throw new Error(message);
    }
    return response;
}

// Εξαγωγή λειτουργιών
export { login, isLoggedIn, logout, fetchWithAuth };
