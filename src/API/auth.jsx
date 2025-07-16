import { iamBaseURL } from "./api";

export const verifyOtp = async ({ otp, email }) => {
    const response = await fetch(`${iamBaseURL}/users/VerifyOTP`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp, email }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'OTP verification failed');
    }

    return response.json();
};

export const resendOtp = async (email) => {
    const response = await fetch(`${iamBaseURL}/users/ResendOTP`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Resend OTP failed');
    }

    return response.json();
};



import axios from "axios";


export async function login({ email, password }) {
  console.log("🔑 Sending login request with:", email, password);

  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("username", email);
  params.append("password", password);
  params.append("client_id", "frontend-client");
  params.append("client_secret", "frontend-secret");
  params.append("scope", "");

  const response = await axios.post(
    `${iamBaseURL}/users/login`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}
