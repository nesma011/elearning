const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
        setMessage("❌ Passwords do not match.");
        return;
    }

    try {
        const response = await fetch(`https://ahmedmahmoud10.pythonanywhere.com/password-reset-confirm/${id}/${token}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
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