import axios from 'axios';
// import { refreshToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL
// const API_URL ="https://aikyuu-staging.up.railway.app/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
});


// Response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is 401 Unauthorized
    if (error.response?.status === 401) {
      // Avoid redirecting if already on the signin page to prevent interfering with login errors
      if (!window.location.pathname.includes('/signin')) {
        // Clear auth data from local storage
        localStorage.removeItem('auth-storage');
        // Redirect to signin page
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
