import axios from 'axios';

const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_AUTH_STATUS_KEY = 'admin_auth_status';

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY) || '';

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_AUTH_STATUS_KEY);
};

export const saveAdminSession = (token) => {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }

  localStorage.setItem(ADMIN_AUTH_STATUS_KEY, 'true');
};

const decodeJwtPayload = (token) => {
  try {
    const payload = token?.split('.')?.[1];

    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '='));

    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
};

export const hasAdminRole = (data) => {
  if (!data) return false;

  const role = data.role || data.role_type || data.user_role || data.userType || data.user_type || data.type;

  return role === 'admin' || role === 'super_admin' || role === 1 || data.is_admin === true || data.isAdmin === true;
};

export const isAdminAuthResponse = (data) => {
  const tokenPayload = decodeJwtPayload(data?._token);
  const adminData = data?._data || data?.data || data?.admin || data?.user;

  return hasAdminRole(tokenPayload?.adminData) || hasAdminRole(tokenPayload) || hasAdminRole(adminData) || hasAdminRole(data);
};

export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

