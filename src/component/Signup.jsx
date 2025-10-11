// RegistrationPage.jsx
import React, { useState } from 'react';
import './Signup.css'

const Signup = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNo: '',
    profileImage: null
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_BASE_URL = 'https://localhost:7208/api/User';

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setErrors(prev => ({ ...prev, profileImage: 'File size should be less than 5MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, profileImage: file }));
      setErrors(prev => ({ ...prev, profileImage: '' }));
    }
  };

  // Validate Step 1
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNo)) {
      newErrors.phoneNo = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Send OTP
// Step 1: Send OTP
const handleSendOTP = async () => {
  if (!validateStep1()) return;

  setLoading(true);
  setMessage({ type: '', text: '' });

  try {
    const response = await fetch(`${API_BASE_URL}/SendOTP`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ✅ important for session cookie
      body: JSON.stringify({ email: formData.email })
    });

    const data = await response.json();

    if (data.success) {
      setMessage({ type: 'success', text: 'OTP sent to your email!' });
      setTimeout(() => {
        setStep(2);
        setMessage({ type: '', text: '' });
      }, 1500);
    } else {
      setMessage({ type: 'error', text: data.message || 'Failed to send OTP' });
    }
  } catch (error) {
    setMessage({ type: 'error', text: 'Network error. Please try again.' });
  } finally {
    setLoading(false);
  }
};


  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter complete OTP' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/VerifyOTP`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ important
        body: JSON.stringify({ email: formData.email, otp: otpCode }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'OTP verified successfully!' });
        setTimeout(() => {
          setStep(3);
          setMessage({ type: '', text: '' });
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Invalid OTP' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete Registration
  const handleRegister = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('Name', formData.name);
      formDataToSend.append('Email', formData.email);
      formDataToSend.append('Password', formData.password);
      formDataToSend.append('PhoneNo', formData.phoneNo);

      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      const response = await fetch(`${API_BASE_URL}/Register`, {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Registration successful!' });
        // Store token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setTimeout(() => {
          window.location.href = '/user/dashboard';
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setOtp(['', '', '', '', '', '']);
    await handleSendOTP();
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-circle">
              {step > 1 ? '✓' : '1'}
            </div>
            <span className="step-label">Details</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-circle">
              {step > 2 ? '✓' : '2'}
            </div>
            <span className="step-label">Verify</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <span className="step-label">Complete</span>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Step 1: User Details */}
        {step === 1 && (
          <div className="form-step">
            <h2>Create Your Account</h2>
            <p className="subtitle">Enter your details to get started</p>

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNo">Phone Number *</label>
              <input
                type="tel"
                id="phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                placeholder="10-digit phone number"
                maxLength="10"
                className={errors.phoneNo ? 'error' : ''}
              />
              {errors.phoneNo && <span className="error-text">{errors.phoneNo}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="profileImage">Profile Image</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label htmlFor="profileImage" className="file-label">
                  <span className="file-icon">📁</span>
                  {formData.profileImage ? formData.profileImage.name : 'Choose file'}
                </label>
              </div>
              {errors.profileImage && <span className="error-text">{errors.profileImage}</span>}
            </div>

            <button
              className="btn-primary"
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <p className="login-link">
              Already have an account? <a href="/login">Sign In</a>
            </p>
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <div className="form-step">
            <div className="otp-icon">📧</div>
            <h2>Verify Your Email</h2>
            <p className="subtitle">
              We've sent a 6-digit code to<br />
              <strong>{formData.email}</strong>
            </p>

            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="otp-input"
                />
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="resend-section">
              <p>Didn't receive the code?</p>
              <button
                className="btn-link"
                onClick={handleResendOTP}
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>

            <button
              className="btn-secondary"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              ← Back to Details
            </button>
          </div>
        )}

        {/* Step 3: Complete Registration */}
        {step === 3 && (
          <div className="form-step">
            <div className="success-icon">✓</div>
            <h2>Almost There!</h2>
            <p className="subtitle">Click below to complete your registration</p>

            <div className="summary-box">
              <h3>Registration Summary</h3>
              <div className="summary-item">
                <span className="summary-label">Name:</span>
                <span className="summary-value">{formData.name}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Email:</span>
                <span className="summary-value">{formData.email}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Phone:</span>
                <span className="summary-value">{formData.phoneNo}</span>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>

            <button
              className="btn-secondary"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              ← Edit Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
