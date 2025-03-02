import { useEffect } from "react";
import axios from "axios";

const useAuthCheck = (settoken) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  useEffect(() => {
    const refreshAuthToken = async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      
      if (!refreshToken) return;

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/refresh/`,
          { refresh: refreshToken },  
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (data.access) {
          settoken(data.access);
          localStorage.setItem("access_token", data.access);
        }
      } catch (error) {
        console.error("Refresh Token Error:", error.response?.data);

        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          settoken(null);
          window.location.href = "/login";
        }
      }
    };

    refreshAuthToken();

    const interval = setInterval(refreshAuthToken, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [settoken]);
};

export default useAuthCheck;
