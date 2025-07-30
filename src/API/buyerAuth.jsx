// API/buyers.js
import axios from 'axios';
import { iamBaseURL } from './api';

const api = axios.create({
    baseURL: iamBaseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const registerBuyer = async (websiteId, name, email, password, confirmPassword) => {
    try {
        const response = await api.post('/buyers/Register', {
            website_id: websiteId,
            name: name,
            email: email,
            password: password,
            confirm_password: confirmPassword
        });
        return response.data;
    } catch (error) {
        console.error('Error registering buyer:', error);
        throw error;
    }
};


// در فایل API/buyerAuth.js
export const loginBuyer = async (data) => {
    try {
        const response = await fetch(`${iamBaseURL}/buyers/login?website_id=${data.website_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username: data.username,
                password: data.password,
                grant_type: data.grant_type || 'password',
                scope: '',
                client_id: '',
                client_secret: ''
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'خطا در ورود');
        }

        const result = await response.json();

        // فقط این دو خط اضافه شده ▼
        localStorage.setItem(`buyer_token_${data.website_id}`, result.access_token);
        localStorage.setItem('current_store_website_id', data.website_id);
        // ▲ فقط همین تغییرات کافیست

        return result;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const resendOtp = async (email, website_id) => {
    try {
        const response = await fetch(`${iamBaseURL}/buyers/ResendOTP`, {  // تغییر URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                website_id: website_id
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || error.message || 'Resend OTP failed');
        }

        const result = await response.json();
        return result || { message: "OTP sent successfully" }; // fallback
    } catch (error) {
        console.error('Resend OTP error:', error);
        throw error;
    }
};









// Forget Password - ارسال ایمیل برای بازیابی رمز عبور
export const forgetPassword = async (email, website_id) => {
    try {
        const response = await fetch(`${iamBaseURL}/buyers/ForgetPassword`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                website_id: website_id
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || error.message || 'خطا در ارسال ایمیل بازیابی');
        }

        return await response.json();
    } catch (error) {
        console.error('Forget Password error:', error);
        throw error;
    }
};

// Resend OTP for Forget Password
export const resendOTPForgetPassword = async (email, website_id) => {
    try {
        const response = await fetch(`${iamBaseURL}/buyers/ResendOTP`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                website_id: website_id
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || error.message || 'خطا در ارسال مجدد کد');
        }

        return await response.json();
    } catch (error) {
        console.error('Resend OTP error:', error);
        throw error;
    }
};

// Verify OTP For Forget Password
export const verifyOTPForgetPassword = async (email, otp, website_id) => {
    try {
        const response = await fetch(`${iamBaseURL}/buyers/VerifyOTPForgetPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                otp: otp,
                website_id: website_id
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || error.message || 'کد تایید نادرست است');
        }

        return await response.json();
    } catch (error) {
        console.error('Verify OTP error:', error);
        throw error;
    }
};

// Reset Password - تغییر رمز عبور جدید
export const resetPassword = async (email, new_password, website_id) => {
    try {
        const response = await fetch(`${iamBaseURL}/buyers/ResetPassword`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                new_password: new_password,
                website_id: website_id
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || error.message || 'خطا در تغییر رمز عبور');
        }

        return await response.json();
    } catch (error) {
        console.error('Reset Password error:', error);
        throw error;
    }
};
// اضافه کردن این functionها به فایل API/buyerAuth.js

