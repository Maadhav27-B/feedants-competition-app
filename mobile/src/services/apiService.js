import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Interceptor to attach Authorization header automatically
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Error reading token from storage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export const competitionService = {
  getCompetitions: async () => {
    const res = await api.get('/competitions');
    return res.data;
  },
  getCompetitionById: async (id) => {
    const res = await api.get(`/competitions/${id}`);
    return res.data;
  },
  register: async (id) => {
    const res = await api.post(`/competitions/${id}/register`);
    return res.data;
  },
  unregister: async (id) => {
    const res = await api.post(`/competitions/${id}/unregister`);
    return res.data;
  }
};

export default api;
