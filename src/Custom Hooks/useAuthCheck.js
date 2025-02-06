import { useEffect } from "react";
import axios from "axios";

const useAuthCheck = (settoken) => {
  useEffect(() => {
    const refreshAuthToken = async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            "https://ahmedmahmoud10.pythonanywhere.com/refresh/",
            { refresh: refreshToken }
          );
          if (data.access) {
            settoken(data.access);
            localStorage.setItem("access_token", data.access);
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
    };

    refreshAuthToken();
  }, [settoken]);
};

export default useAuthCheck;
