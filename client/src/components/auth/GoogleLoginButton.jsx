import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import API from "../../api/axios";
const GoogleLoginButton = () => {

    const [loading, setLoading] = useState(false);

    const handleGoogleSuccess = async (credentialResponse) => {

        try {

            setLoading(true);

            const response = await axios.post(
                `${API}/auth/google`,
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