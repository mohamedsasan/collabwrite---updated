import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Inline CSS styles (merged from forgotpasswordpage.css)
const styles = `
/* --- Overall Container --- */
.forgot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f4f6f8;
  text-align: center;
}

/* --- Forgot Box --- */
.forgot-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  text-align: center;
}

.forgot-box h2 {
  color: #1a237e;
  margin-bottom: 30px;
}

/* --- Step Group Styling --- */
.step-group {
  margin-bottom: 30px;
  padding: 10px 0;
}

.step-label {
  display: block;
  text-align: left;
  font-weight: bold;
  font-size: 1.1em;
  color: #3949ab;
  margin-bottom: 15px;
}

/* --- Input Forms --- */
.email-form,
.reset-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: left;
}

.forgot-box input {
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
}

.forgot-box input:focus {
  border-color: #3949ab;
  outline: none;
}

/* --- Buttons --- */
.forgot-box button {
  padding: 12px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.send-otp-btn {
  background-color: #1a237e;
}

.send-otp-btn:hover {
  background-color: #303f9f;
}

.reset-password-btn {
  background-color: #00897b;
}

.reset-password-btn:hover {
  background-color: #00a896;
}

/* --- Separator Line --- */
hr {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
  margin: 30px 0;
}

/* --- Disabled State --- */
.disabled-step input,
.disabled-step button {
  opacity: 0.6;
  pointer-events: none;
}

.forgot-box input:disabled {
  background-color: #f0f0f0;
}

/* --- Message Styling --- */
.message {
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  color: #d32f2f;
  background-color: #ffebee;
  font-weight: bold;
  display: block;
  text-align: center;
}

.message.success {
  color: #388e3c;
  background-color: #e8f5e9;
}
`;

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: success
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // ✅ Inject CSS dynamically
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // ✅ Auto-navigate after success (2s delay)
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        navigate("/loginpage");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  // ✅ Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (!email) {
        setMessage("Please enter your registered email.");
        return;
      }
      const res = await axios.post("http://localhost:5000/users/send-otp", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    }
  };

  // ✅ Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (newPassword !== confirmPassword) {
        setMessage("New password and confirm password do not match.");
        return;
      }
      if (!otp || !newPassword) {
        setMessage("Please enter the OTP and a new password.");
        return;
      }

      const res = await axios.post("http://localhost:5000/users/reset-password", {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.message);
      setStep(3); // ✅ success step
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2>Forgot Password</h2>

        {/* Display message */}
        {message && <p className={`message ${step === 3 ? "success" : ""}`}>{message}</p>}

        {/* Step 1: Email Input */}
        <div className="step-group">
          <label className="step-label">Enter your registered email</label>
          <form onSubmit={handleSendOtp} className="email-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={step > 1}
            />
            {step === 1 && (
              <button type="submit" className="send-otp-btn">
                Send OTP
              </button>
            )}
          </form>
        </div>

        <hr />

        {/* Step 2: OTP + New Password */}
        <div className={`step-group ${step < 2 ? "disabled-step" : ""}`}>
          <label className="step-label">Reset your password</label>
          <form onSubmit={handleResetPassword} className="reset-form">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={step < 2 || step === 3}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={step < 2 || step === 3}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={step < 2 || step === 3}
            />
            {step === 2 && (
              <button type="submit" className="reset-password-btn">
                Reset Password
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
