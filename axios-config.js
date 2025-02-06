
import axios from 'axios'; 
axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          const response = await axios.post(
            'https://ahmedmahmoud10.pythonanywhere.com/refresh/',
            { refresh: refreshToken }
          );
          
          if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          console.error('Refresh failed:', refreshError);
          // Clear tokens and redirect to login
          localStorage.clear();
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );