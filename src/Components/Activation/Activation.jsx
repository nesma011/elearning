import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ActivationPage() {
  const { token, id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Activating your account...");

  useEffect(() => {
    async function activateAccount() {
      try {
        const response = await fetch("https://alex-medlearn.netlify.app", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, id }),
        });

        const data = await response.json();
        if (response.ok) {
          setMessage("🎉 Your account has been successfully activated! Redirecting...");
          
          // Navigate to '/classes' after 3 seconds
          setTimeout(() => {
            navigate("/classes");
          }, 3000);
        } else {
          setMessage(`❌ Activation failed: ${data.message || "An error occurred"}`);
        }
      } catch (error) {
        setMessage("❌ Activation failed: There was a problem connecting to the server.");
      }
    }

    if (token && id) {
      activateAccount();
    } else {
      setMessage("❌ Invalid activation link.");
    }
  }, [token, id, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-bold text-blue-700">Account Activation</h1>
        <p className="text-gray-700 mt-4">{message}</p>
      </div>
    </div>
  );
}
