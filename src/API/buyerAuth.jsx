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

        const data = await response.json();

        if (!response.ok) {
            // مدیریت خطاهای مختلف از سرور
            let errorMessage = 'خطا در ارسال ایمیل بازیابی';

            if (data.detail) {
                if (Array.isArray(data.detail)) {
                    // اگر detail آرایه از آبجکت‌های خطا باشه
                    errorMessage = data.detail.map(err => err.msg || err.message || JSON.stringify(err)).join(', ');
                } else if (typeof data.detail === 'string') {
                    errorMessage = data.detail;
                } else {
                    errorMessage = JSON.stringify(data.detail);
                }
            } else if (data.message) {
                errorMessage = data.message;
            } else if (Array.isArray(data)) {
                errorMessage = data.map(err => err.msg || err.message || JSON.stringify(err)).join(', ');
            }

            const error = new Error(errorMessage);
            error.response = { data };
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Forget Password error:', error);

        // اگر خطا از fetch نیامده و خطای شبکه یا چیز دیگه است
        if (!error.response) {
            error.message = 'خطا در اتصال به سرور';
        }

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

        const data = await response.json();

        if (!response.ok) {
            let errorMessage = 'خطا در ارسال مجدد کد';

            if (data.detail) {
                if (Array.isArray(data.detail)) {
                    errorMessage = data.detail.map(err => err.msg || err.message || JSON.stringify(err)).join(', ');
                } else if (typeof data.detail === 'string') {
                    errorMessage = data.detail;
                } else {
                    errorMessage = JSON.stringify(data.detail);
                }
            } else if (data.message) {
                errorMessage = data.message;
            }

            const error = new Error(errorMessage);
            error.response = { data };
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Resend OTP error:', error);

        if (!error.response) {
            error.message = 'خطا در اتصال به سرور';
        }

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

        const data = await response.json();

        if (!response.ok) {
            let errorMessage = 'کد تایید نادرست است';

            if (data.detail) {
                if (Array.isArray(data.detail)) {
                    errorMessage = data.detail.map(err => err.msg || err.message || JSON.stringify(err)).join(', ');
                } else if (typeof data.detail === 'string') {
                    errorMessage = data.detail;
                } else {
                    errorMessage = JSON.stringify(data.detail);
                }
            } else if (data.message) {
                errorMessage = data.message;
            }

            const error = new Error(errorMessage);
            error.response = { data };
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Verify OTP error:', error);

        if (!error.response) {
            error.message = 'خطا در اتصال به سرور';
        }

        throw error;
    }
};

// Reset Password - تغییر رمز عبور جدید
export const resetPassword = async (email, password, confirmPassword, website_id) => {
    try {
        const response = await fetch(`${iamBaseURL}/buyers/ForgetPassword`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                confirm_password: confirmPassword,
                website_id,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            let errorMessage = 'خطا در تغییر رمز عبور';

            if (data.detail) {
                errorMessage = Array.isArray(data.detail)
                    ? data.detail.map(err => err.msg || err.message).join(', ')
                    : data.detail;
            } else if (data.message) {
                errorMessage = data.message;
            }

            const error = new Error(errorMessage);
            error.response = { data };
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Reset Password error:', error);
        if (!error.response) error.message = 'خطا در اتصال به سرور';
        throw error;
    }
};





// otp.js

export const verifyOTP = async ({ email, websiteId, otp }) => {
    const response = await fetch(`${iamBaseURL}/buyers/VerifyOTP`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            website_id: websiteId,
            otp,
        }),
    });

    if (!response.ok) {
        throw new Error('کد تایید نامعتبر است');
    }

    return await response.json();
};

export const resendOTP = async ({ email, websiteId }) => {
    const response = await fetch(`${iamBaseURL}/buyers/ResendOTP`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            website_id: websiteId,
        }),
    });

    if (!response.ok) {
        throw new Error('خطا در ارسال مجدد کد');
    }

    return await response.json();
};
