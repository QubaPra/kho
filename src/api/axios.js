// filepath: /C:/Users/Quba.TPFMSPZOO/Documents/Github/KHO 2/frontend/src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://quba.pythonanywhere.com/api/',
});

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;