"use client";

const TOKEN_KEY = "admin_token";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token) {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // private browsing / storage blocked -- the session just won't persist
  }
}

export function clearAdminToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

/**
 * fetch() wrapper for admin routes: attaches the bearer token and turns a
 * 401 into a thrown, tagged error so callers can redirect to login in one
 * place instead of repeating the check on every page. This is UX plumbing
 * only -- the real security boundary is the backend's own require_admin
 * check on every request, not anything enforced here.
 */
export async function adminFetch(url, options = {}) {
  const token = getAdminToken();
  const headers = { ...(options.headers || {}), Authorization: `Bearer ${token || ""}` };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    clearAdminToken();
    const err = new Error("Your admin session expired. Please sign in again.");
    err.isAuthError = true;
    throw err;
  }
  return res;
}
