import { useEffect } from "react";
import axios from "axios";

const useAuthCheck = (settoken) => {
  useEffect(() => {
    const refreshAuthToken = async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      
      if (!refreshToken) return;

      try {
        const { data } = await axios.post(
          "https://ahmedmahmoud10.pythonanywhere.com/refresh/",
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
