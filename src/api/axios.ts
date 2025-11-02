import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: intercept responses globally
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('[API ERROR]', error.response || error);
//     return Promise.reject(error);
//   }
// );
