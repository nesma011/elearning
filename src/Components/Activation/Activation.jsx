/* import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Activation() {
    const { id, token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Activating your account...");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
    useEffect(() => {
        async function activateAccount() {
            try {
                const response = await fetch(`${API_BASE_URL}/activate/${id}/${token}/`, {
                    method: 'GET'
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage("🎉 Your account has been successfully activated! Redirecting...");
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                } else {
                    setMessage(`❌ Activation failed: ${data.error || "An error occurred"}`);
                }
            } catch (error) {
                setMessage(`❌ Activation failed: ${error.message || "Unknown connection error"}`);
            }
        }

        if (id && token) {
            activateAccount();
        } else {
            setMessage("❌ Invalid activation link. Please check your email for the correct link.");
        }
    }, [id, token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                <h1 className="text-2xl font-bold text-blue-700">Account Activation</h1>
                <p className="text-gray-700 mt-4">{message}</p>
            </div>
        </div>
    );
}
 */