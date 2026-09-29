import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import API from "../../api/axios";

const GoogleLoginButton = () => {
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
                <p>Signing in...</p>
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