import { useState, useEffect } from "react";
import axios from "axios";

export default function OtpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const sendOtp = async () => {
    try {
      await axios.post("/api/send-otp", { email });
      setOtpSent(true);
      setTimer(120); // 2 minutes
      setError("");
    } catch (err) {
      setError("ارسال کد با مشکل مواجه شد.");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("/api/verify-otp", { email, otp });
      if (res.data.success) {
        setVerified(true);
        setError("");
      } else {
        setError("کد وارد شده معتبر نیست.");
      }
    } catch (err) {
      setError("خطا در تایید کد.");
    }
  };

  if (verified) {
    return <div>شما وارد شدید 🎉</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      {!otpSent ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">ورود با ایمیل</h2>
          <input
            type="email"
            placeholder="ایمیل خود را وارد کنید"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={sendOtp}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ارسال کد
          </button>
          {error && <div className="text-red-500">{error}</div>}
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">کد تایید را وارد کنید</h2>
          <input
            type="text"
            placeholder="کد ۶ رقمی"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={verifyOtp}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            تایید کد
          </button>
          <div>زمان باقی‌مانده: {timer} ثانیه</div>
          {timer === 0 && (
            <button
              onClick={sendOtp}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              ارسال مجدد کد
            </button>
          )}
          {error && <div className="text-red-500">{error}</div>}
        </div>
      )}
    </div>
  );
}
