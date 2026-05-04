import axios from "axios";

/**
 * Resolve API base URL for each request (proxy on deploy when NEXT_PUBLIC_API_URL is unset).
 */
export function resolveApiBaseURL() {
  const explicit = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/$/, "");
  if (explicit) return explicit;

  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/backend`;
  }

  const back = (process.env.BACKEND_URL || process.env.API_URL || "").trim().replace(/\/$/, "");
  if (back) return `${back}/api`;

  return "http://127.0.0.1:5000/api";
}

export const api = axios.create({});

api.interceptors.request.use((config) => {
  config.baseURL = resolveApiBaseURL();
  return config;
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
