import axios from "axios";
import { startRequest, finishRequest } from "../utils/loadingStore";

const instance = axios.create({
  baseURL: "http://localhost:8000/api/", // "https://ekapitula.pythonanywhere.com/api/"
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Włącz loader jeśli nie pominięto
    if (!config.skipLoader) {
      startRequest();
    }
    return config;
  },
  (error) => {
    // Błąd przed wysłaniem requestu – zakończ potencjalny licznik
    finishRequest();
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    // Zakończ loader dla udanej odpowiedzi
    if (!response.config?.skipLoader) {
      finishRequest();
    }
    return response;
  },
  (error) => {
    // Zakończ loader dla błędnej odpowiedzi (o ile nie pominięto)
    try {
      if (!error.config?.skipLoader) {
        finishRequest();
      }
    } catch (_) {
      // ignore
    }
    return Promise.reject(error);
  }
);

export default instance;
