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
  console.log(" Sending login request with:", email, password);

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





export const getMe = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${iamBaseURL}/users/Me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Read user:', error);
    throw error;
  }
};



export const changeUserPassword = async ({ password, confirm_password, token }) => {
  const response = await axios.put(
    `${iamBaseURL}/users/UpdateProfile`,
    {
      password,
      confirm_password,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};



export const changeUserProfile = async ({ first_name, last_name, token }) => {
  const response = await axios.put(
    `${iamBaseURL}/users/UpdateProfile`,
    {
      first_name,
      last_name
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};



export const sendForgotPasswordOTP = async (email) => {
  const response = await fetch(`${iamBaseURL}/users/ResendOTP`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send forgot password OTP');
  }

  return response.json();
};


export const verifyForgotPasswordOTP = async ({ otp, email }) => {
  const response = await fetch(`${iamBaseURL}/users/VerifyOTPForgetPassword`, {
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


export const resetPasswordWithOTP = async ({ email, new_password, confirm_password }) => {
  const response = await fetch(`${iamBaseURL}/users/ForgetPassword`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password: new_password,
      confirm_password
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Password reset failed');
  }

  return response.json();
};
