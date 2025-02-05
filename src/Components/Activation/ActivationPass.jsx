import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ActivationPass() {
    const { id, token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Processing...");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (newPassword !== confirmNewPassword) {
            setMessage("❌ Passwords do not match.");
            return;
        }
    
        try {
            const response = await fetch(`https://ahmedmahmoud10.pythonanywhere.com/password-reset-confirm/${id}/${token}/`, {
                method: 'POST', // Changed to POST
                headers: {
                    'Content-Type': 'application/json' // Added Content-Type header
                },
                body: JSON.stringify({
                    new_password: newPassword, 
                    confirm_new_password: confirmNewPassword
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMessage("🎉 Your Pass has been successfully renewed! Redirecting...");
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setMessage(`❌ Resetting Pass failed: ${data.error || "An error occurred"}`);
            }
        } catch (error) {
            setMessage(`❌ Resetting Pass failed: ${error.message || "Unknown connection error"}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                <h1 className="text-2xl font-bold text-blue-700">Reset Password</h1>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div>
                        <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            className="mt-2 p-2 border border-gray-300 rounded"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="confirmNewPassword" className="block text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            className="mt-2 p-2 border border-gray-300 rounded"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Submit</button>
                </form>
                <p className="text-gray-700 mt-4">{message}</p>
            </div>
        </div>
    );
}
