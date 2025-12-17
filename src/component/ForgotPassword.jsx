import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_BASE_URL = 'https://localhost:7208/api/User';

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setMessage({ type: '', text: '' });
  };

  // Validate email
  const validateEmail = () => {
    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: 'Invalid email format' });
      return false;
    }
    return true;
  };

  // Validate OTP
  const validateOTP = () => {
    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter complete 6-digit OTP' });
      return false;
    }
    return true;
  };

  // Validate password
  const validatePassword = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send OTP
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/SendOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setMessage({ type: 'success', text: 'OTP sent successfully! Check your email.' });
        setTimeout(() => {
          const firstInput = document.getElementById('otp-0');
          if (firstInput) firstInput.focus();
        }, 100);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to send OTP.' });
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.match(/^[0-9]$/) || value === '') {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value;
      setOtpDigits(newOtpDigits);

      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }

      setMessage({ type: '', text: '' });
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtpDigits = pastedData.padEnd(6, '').split('');
      setOtpDigits(newOtpDigits);
      setMessage({ type: '', text: '' });
      
      setTimeout(() => {
        const lastIndex = Math.min(pastedData.length, 5);
        const lastInput = document.getElementById(`otp-${lastIndex}`);
        if (lastInput) lastInput.focus();
      }, 0);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    if (!validateOTP()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    const otp = otpDigits.join('');

    try {
      const response = await fetch(`${API_BASE_URL}/VerifyOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email: formData.email, 
          otp: otp 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpVerified(true);
        setMessage({ type: 'success', text: 'OTP verified successfully! Now set your new password.' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Invalid or expired OTP.' });
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    if (!validatePassword()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/ForgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Password reset successfully! Redirecting to login...' });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to reset password.' });
      }
    } catch (error) {
      console.error('Reset Password Error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Main form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      await handleSendOTP();
      return;
    }

    if (otpSent && !otpVerified) {
      await handleVerifyOTP();
      return;
    }

    if (otpVerified) {
      await handleResetPassword();
      return;
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    setOtpDigits(['', '', '', '', '', '']);

    try {
      const response = await fetch(`${API_BASE_URL}/SendOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'OTP resent successfully! Check your email.' });
        setTimeout(() => {
          const firstInput = document.getElementById('otp-0');
          if (firstInput) firstInput.focus();
        }, 100);
      } else {
        setMessage({ type: 'error', text: 'Failed to resend OTP.' });
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Change email - reset everything
  const handleChangeEmail = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setOtpDigits(['', '', '', '', '', '']);
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  // Get button text based on current step
  const getButtonText = () => {
    if (loading) {
      if (!otpSent) return 'Sending OTP...';
      if (!otpVerified) return 'Verifying OTP...';
      return 'Resetting Password...';
    }
    if (!otpSent) return 'Send OTP';
    if (!otpVerified) return 'Verify OTP';
    return 'Reset Password';
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        {/* Header */}
        <div className="login-header">
          <h2>Forgot Password</h2>
          <p className="subtitle">
            {!otpSent && 'Enter your email to receive OTP'}
            {otpSent && !otpVerified && 'Enter the OTP sent to your email'}
            {otpVerified && 'Create a new password for your account'}
          </p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Single Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <div className="email-input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
                disabled={loading || otpSent}
                autoComplete="email"
              />
              {otpSent && (
                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="change-email-btn"
                  disabled={loading}
                >
                  Change
                </button>
              )}
            </div>
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          {/* OTP Input */}
          {otpSent && !otpVerified && (
            <div className="form-group fade-in">
              <label className="otp-label">Enter 6-Digit OTP</label>
              <div className="otp-container" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="otp-input"
                    disabled={loading}
                    autoComplete="off"
                  />
                ))}
              </div>
              <div className="resend-container">
                <span style={{ fontSize: '14px', color: '#666' }}>
                  Didn't receive OTP?{' '}
                </span>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="resend-link"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          {/* Password Fields */}
          {otpVerified && (
            <>
              <div className="form-group fade-in">
                <label htmlFor="password">New Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password (min 6 characters)"
                  className={errors.password ? 'error' : ''}
                  disabled={loading}
                  autoComplete="new-password"
                />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <div className="form-group fade-in">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className={errors.confirmPassword ? 'error' : ''}
                  disabled={loading}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>
            </>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
          >
            {getButtonText()}
          </button>

          {/* Back to Login */}
          <p className="login-link">
            Remember your password?{' '}
            <span
              className="signup-link"
              style={{ 
                color: '#007bff', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                fontWeight: '500',
                opacity: loading ? 0.6 : 1
              }}
              onClick={() => !loading && navigate('/')}
            >
              Back to Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
