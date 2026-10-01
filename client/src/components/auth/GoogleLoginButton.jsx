import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import API from "../../api/axios";

const GoogleLoginButton = ({ label = "Signing in" }) => {
    const [loading, setLoading] = useState(false);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);

            const response = await API.post(
                "/auth/google",
                {
                    credential: credentialResponse.credential
                }
            );

            const { token, user } = response.data;

            localStorage.setItem("token", token);

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            window.location.href = "/dashboard";

        } catch (error) {
            console.error(
                "Google Login Error:",
                error.response?.data || error.message
            );

            alert("Google login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading ? (
                <div
                    className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-600 bg-white text-sm font-medium text-slate-700"
                    role="status"
                    aria-live="polite"
                >
                    <svg
                        className="h-4 w-4 animate-spin text-blue-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    {label}…
                </div>
            ) : (
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        console.log("Google Login Failed");
                    }}
                />
            )}
        </div>
    );
};

export default GoogleLoginButton;
