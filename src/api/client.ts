import axios from "axios";
import { useAuthStore } from "../domains/login/store/authStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});
console.log("Client config:", client.defaults);

//요청 인터셉터
client.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 토큰 갱신
const refreshAccessToken = async () => {
  const { login, logout } = useAuthStore.getState();
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    login(response.data);
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    logout();
    return false;
  }
};

//응답 인터셉터
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { logout } = useAuthStore.getState();
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const success = await refreshAccessToken();

      if (success) {
        const { accessToken } = useAuthStore.getState();
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return client(originalRequest);
      }
      logout();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default client;
