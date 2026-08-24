// Strip any trailing slash so callers can safely do `${API_URL}/api/...`
// without risking a double slash if the env var is set with one (e.g.
// "https://example.com/" instead of "https://example.com").
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");
