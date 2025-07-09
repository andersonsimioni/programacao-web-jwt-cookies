const API = import.meta.env.VITE_API_BASE_URL;

export async function login(payload) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  return await res.json();
}

export async function register(payload) {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  return await res.json();
}

export async function getMe() {
  const res = await fetch(`${API}/me`, {
    method: 'GET',
    credentials: 'include'
  });
  return await res.json();
}

export async function logout() {
  await fetch(`${API}/logout`, {
    method: 'POST',
    credentials: 'include'
  });
}

export async function logCookies() {
  const res = await fetch(`${API}/log-cookies`, {
    method: 'GET',
    credentials: 'include'
  });
  return await res.json();
}

export async function getCookiesDB() {
  const res = await fetch(`${API}/cookies-db`, {
    credentials: 'include'
  });
  return await res.json();
}

export async function updateUser(body) {
  const res = await fetch(`${API}/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include', // garante envio do cookie
    body: JSON.stringify(body)
  });
  return await res.json();
}

export async function updateTokenData(body) {
  const res = await fetch(`${API}/me/token-data`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(body)
  });
  return await res.json();
}

export async function getTokenData() {
  const res = await fetch(`${API}/me/token-data`, {
    method: 'GET',
    credentials: 'include'
  });
  return await res.json();
}
