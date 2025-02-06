import { useEffect } from "react";
import axios from "axios";

const useAuthCheck = (settoken) => {
    useEffect(() => {
      const refreshAuthToken = async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        const accessToken = localStorage.getItem("access_token");
        
        if (!refreshToken) return;
  
        try {
          const { data } = await axios.post(
            "https://ahmedmahmoud10.pythonanywhere.com/refresh/",
            { refresh: refreshToken },
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (data.access) {
            settoken(data.access);
            localStorage.setItem("access_token", data.access);
          }
        } catch (error) {
          if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            settoken(null);
          }
          console.error("Refresh Error:", error.response?.data);
        }
      };
  
      refreshAuthToken();
      
      // Refresh token every 4 minutes
      const interval = setInterval(refreshAuthToken, 4 * 60 * 1000);
      return () => clearInterval(interval);
    }, [settoken]);
  };

export default useAuthCheck;
