import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { changeUserPassword } from "../../../API/auth";

export default function ChangePasswordForm() {
  const location = useLocation();
  const { first_name, last_name } = location.state || {};

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg("رمز عبور و تکرار آن مطابقت ندارند.");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      await changeUserPassword({
        password: formData.newPassword,
        confirm_password: formData.confirmPassword,
        first_name,
        last_name,
        token,
      });

      setSuccessMsg("رمز عبور با موفقیت تغییر یافت.");
      setRedirecting(true);

      setTimeout(() => {
        const websiteId = localStorage.getItem("website_id");
        navigate(`/Profile/${websiteId}`);
      }, 2000);
    } catch (error) {
      console.error("❌ خطا در تغییر رمز:", error);
      setErrorMsg(
        error.response?.data?.detail || "مشکلی در تغییر رمز عبور پیش آمد."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderEyeIcon = (field) => {
    const isVisible = showPassword[field];

    return (
      <button
        type="button"
        className="absolute left-3 top-1/2 -translate-y-1/2"
        onClick={() =>
          setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
        }
      >
        {isVisible ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#1E212D"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c1.83 0 3.548.508 5.025 1.382M21.542 12c-1.274 4.057-5.065 7-9.542 7-1.83 0-3.548-.508-5.025-1.382" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#1E212D"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.236 0 2.409.236 3.467.663M15 12a3 3 0 11-6 0 3 3 0 016 0zm3.536-6.536L4.5 19.5" />
          </svg>
        )}
      </button>
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/TradePageimages/BG_signup.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-md bg-[#1E212D] bg-opacity-70 p-8 rounded-xl text-[#FAF3E0]">
        <h2 className="text-xl font-medium text-center mb-6 font-modam">لطفاً رمز عبور جدید وارد کنید</h2>

        {errorMsg && (
          <div className="bg-red-200 text-red-800 text-sm rounded px-4 py-2 mb-4">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-200 text-green-800 text-sm rounded px-4 py-2 mb-4">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password */}
          <div className="relative">
            <input
              type={showPassword.new ? "text" : "password"}
              placeholder="رمز عبور جدید"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="w-full h-12 px-4 rounded-xl bg-[#EABF9F] text-[#1E212D] font-bold placeholder:text-[#1E212D]"
            />
            {renderEyeIcon("new")}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              placeholder="تکرار رمز عبور"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full h-12 px-4 rounded-xl bg-[#EABF9F] text-[#1E212D] font-bold placeholder:text-[#1E212D]"
            />
            {renderEyeIcon("confirm")}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading || redirecting}
            className="w-full bg-[#EABF9F] text-[#1E212D] font-bold py-2 rounded-full flex justify-center items-center gap-2"
          >
            {redirecting ? (
              <>
                <div className="w-4 h-4 border-2 border-[#1E212D] border-t-transparent rounded-full animate-spin"></div>
                <span>در حال بازگشت...</span>
              </>
            ) : isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#1E212D] border-t-transparent rounded-full animate-spin"></div>
                <span>در حال ارسال...</span>
              </>
            ) : successMsg ? (
              "بازگشت به داشبورد"
            ) : (
              "تغییر رمز عبور"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
