// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();
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
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Save token and role
        localStorage.setItem('token', data.token);
        localStorage.setItem('roleId', data.roleId);

        setMessage({ type: 'success', text: 'Login successful!' });

        // Redirect based on roleId
        setTimeout(() => {
          if (data.roleId === 1 || data.roleId === "1") {
            navigate('/admin');
          } else if (data.roleId === 2 || data.roleId === "2") {
            navigate('/user/userDashboard');
          } else {
            setMessage({ type: 'error', text: 'Invalid role ID.' });
          }
        }, 1200);
      } else {
        setMessage({ type: 'error', text: data.message || 'Login failed.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your account</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <form className="form-step" onSubmit={handleLogin}>
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
              disabled={loading}
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
              disabled={loading}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="forgot-password-link">
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="login-link">
            Don’t have an account?{' '}
            <span
              className="signup-link"
              style={{ color: '#007bff', cursor: 'pointer' }}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
