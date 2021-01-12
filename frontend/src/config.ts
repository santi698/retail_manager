function fetchEnv(name: string, fallback: string): string {
  return process.env[name] || fallback;
}
export const API_URL = fetchEnv("REACT_APP_API_URL", "127.0.0.1:5000");
export const APP_DOMAIN = fetchEnv("REACT_APP_DOMAIN", "http://localhost:3000");
