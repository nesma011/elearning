export default function Activation() {
    const { id, token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Activating your account...");

    useEffect(() => {
        async function activateAccount() {
            try {
                // تغيير الرابط للباك إند
                const response = await fetch(`https://ahmedmahmoud10.pythonanywhere.com/activate/${id}/${token}/`, {
                    method: 'GET'
                });

                const data = await response.text();

                if (response.ok) {
                    setMessage("🎉 Your account has been successfully activated! Redirecting...");
                    setTimeout(() => {
                        navigate("/classes");
                    }, 3000);
                } else {
                    setMessage(`❌ Activation failed: ${data || "An error occurred"}`);
                }
            } catch (error) {
                setMessage(`❌ Activation failed: ${error.message || "Unknown connection error"}`);
            }
        }

        activateAccount();
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