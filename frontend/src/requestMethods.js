import axios from "axios";

// Backend origin. Set REACT_APP_API_URL in frontend/.env (local) or in Vercel env vars (production).
export const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:8000").replace(/\/$/, "");

const BASE_URL = `${API_ORIGIN}/api/`;

export const IMAGES_URL = `${API_ORIGIN}/images/`;
export const UPLOAD_URL = `${API_ORIGIN}/api/upload`;
export const pf = `${API_ORIGIN}/images`;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
});
