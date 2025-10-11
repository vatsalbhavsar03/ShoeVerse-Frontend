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
    otp: '',
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
    if (formData.otp.length !== 6) {
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
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/SendOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setMessage({ type: 'success', text: 'OTP sent successfully! Check your email.' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to send OTP.' });
      }
    } catch (error) {
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

      // Auto-focus next input
      if (value !== '' && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }

      // Update form data
      setFormData({
        ...formData,
        otp: newOtpDigits.join('')
      });
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtpDigits = pastedData.split('');
      while (newOtpDigits.length < 6) {
        newOtpDigits.push('');
      }
      setOtpDigits(newOtpDigits);
      setFormData({ ...formData, otp: pastedData });
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!validateOTP()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/VerifyOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: formData.otp 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpVerified(true);
        setMessage({ type: 'success', text: 'OTP verified successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Invalid or expired OTP.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Submit form - Reset Password
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If OTP not sent yet, send it
    if (!otpSent) {
      handleSendOTP(e);
      return;
    }

    // If OTP not verified yet, verify it
    if (!otpVerified) {
      handleVerifyOTP();
      return;
    }

    // Reset password
    if (!validatePassword()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/ForgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Password reset successfully! Redirecting to login...' });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to reset password.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/SendOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'OTP resent successfully!' });
        setOtpDigits(['', '', '', '', '', '']);
        setFormData({ ...formData, otp: '' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to resend OTP.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Change email
  const handleChangeEmail = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setOtpDigits(['', '', '', '', '', '']);
    setFormData({
      email: '',
      otp: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  // Get button text
  const getButtonText = () => {
    if (loading) {
      if (!otpSent) return 'Sending OTP...';
      if (!otpVerified) return 'Verifying...';
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
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {/* Single Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input - Always visible */}
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

          {/* OTP Input - Visible after OTP sent */}
          {otpSent && (
            <div className="form-group fade-in">
              <label className="otp-label">Enter OTP</label>
              <div className="otp-container" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="otp-input"
                    disabled={loading || otpVerified}
                  />
                ))}
              </div>
              {!otpVerified && (
                <div className="resend-container">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="resend-link"
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Password Fields - Visible after OTP verified */}
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
                  placeholder="Enter new password"
                  className={errors.password ? 'error' : ''}
                  disabled={loading}
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
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>
            </>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn-primary" disabled={loading}>
            {getButtonText()}
          </button>

          {/* Back to Login */}
          <p className="login-link">
            Remember your password?{' '}
            <span
              className="signup-link"
              style={{ color: '#007bff', cursor: 'pointer' }}
              onClick={() => navigate('/login')}
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
