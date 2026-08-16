// Every hook in lib/ (auth-context, useTickets, useAdmins, useNotifications,
// useComments) calls apiFetch() instead of fetch() directly, and apiFetch()
// is the only place that knows the backend's base URL — set via
// NEXT_PUBLIC_API_URL in .env.local.
//
// Auth is bearer-token only (no cookies/sessions), per the backend docs —
// the token is attached below whenever one's stored.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const TOKEN_KEY = "itsupport_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

// --- request wrapper -----------------------------------------------------

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detailMessage =
      typeof data.detail === "string" ? data.detail : data.detail?.error;
    const message = detailMessage || data.error || data.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}