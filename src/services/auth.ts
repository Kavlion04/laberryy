import axios from 'axios';

const API_URL = 'http://localhost:8080';

interface LoginResponse {
  access: string;
  refresh: string;
}

interface RefreshResponse {
  access: string;
}

// Token saqlash uchun
export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
  setAuthHeader(access);
};

// Token o'chirish
export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  setAuthHeader(null);
};

// API headerga token qo'shish
export const setAuthHeader = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Access token olish
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// Refresh token olish
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Login
export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login/`, {
      username,
      password,
    });
    
    const { access, refresh } = response.data;
    setTokens(access, refresh);
    
    // Token yangilash intervalini boshlash
    startTokenRefreshInterval();
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout
export const logout = () => {
  clearTokens();
  stopTokenRefreshInterval();
};

// Token yangilash
export const refreshAccessToken = async () => {
  try {
    const refresh = getRefreshToken();
    if (!refresh) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<RefreshResponse>(`${API_URL}/auth/refresh/`, {
      refresh,
    });

    const { access } = response.data;
    setTokens(access, refresh);
    return access;
  } catch (error) {
    console.error('Token refresh error:', error);
    clearTokens();
    throw error;
  }
};

let refreshInterval: NodeJS.Timeout | null = null;

// Token yangilash intervalini boshlash (har 55 daqiqada)
export const startTokenRefreshInterval = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  refreshInterval = setInterval(async () => {
    try {
      await refreshAccessToken();
    } catch (error) {
      console.error('Auto token refresh failed:', error);
      clearTokens();
    }
  }, 55 * 60 * 1000); // 55 daqiqa
};

// Token yangilash intervalini to'xtatish
export const stopTokenRefreshInterval = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

// API instance yaratish
export const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - har bir so'rovga token qo'shish
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - token xatosi bo'lsa yangilash
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
); 