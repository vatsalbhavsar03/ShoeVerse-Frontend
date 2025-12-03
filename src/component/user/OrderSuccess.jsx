import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../layout/Layout';
import { BsCheckCircleFill, BsBoxSeam, BsEnvelope } from 'react-icons/bs';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        particleCount: 50,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2
        }
      });
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        particleCount: 50,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2
        }
      });
    }, 250);

    // Get order details from location state
    const order = location.state?.orderDetails;
    if (order) {
      setOrderDetails(order);
      setLoading(false);
    } else {
      // If no order details, redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate('/user/orders');
      }, 2000);
      setLoading(false);
    }

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [location, navigate]);

  const handleViewOrders = () => {
    navigate('/user/orders');
  };

  const handleContinueShopping = () => {
    navigate('/user/userDashboard');
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="success-container">
        <div className="container py-5">
          <div className="success-card">
            {/* Success Icon */}
            <div className="success-icon-wrapper">
              <BsCheckCircleFill className="success-icon" />
            </div>

            {/* Success Message */}
            <h1 className="success-title">Order Placed Successfully!</h1>
            <p className="success-subtitle">
              Thank you for your purchase. Your order has been confirmed.
            </p>

            {/* Order Details */}
            {orderDetails && (
              <div className="order-info-card">
                <div className="info-row">
                  <div className="info-item">
                    <span className="info-label">Order ID</span>
                    <span className="info-value">#{orderDetails.orderId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Amount</span>
                    <span className="info-value">₹{orderDetails.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-item">
                    <span className="info-label">Payment Method</span>
                    <span className="info-value">{orderDetails.paymentMethod}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Payment Status</span>
                    <span className="info-value status-badge">{orderDetails.paymentStatus}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Email Confirmation Notice */}
            <div className="email-notice">
              <BsEnvelope size={24} />
              <div>
                <strong>Order Confirmation Email Sent</strong>
                <p>We've sent a confirmation email with order details to your registered email address.</p>
              </div>
            </div>

            {/* What's Next */}
            <div className="whats-next">
              <h5>
                <BsBoxSeam size={20} /> What's Next?
              </h5>
              <ul>
                <li>You'll receive updates about your order via email</li>
                <li>Track your order status in the "My Orders" section</li>
                <li>Our team will process your order shortly</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="btn btn-primary btn-lg" onClick={handleViewOrders}>
                View My Orders
              </button>
              <button className="btn btn-outline-primary btn-lg" onClick={handleContinueShopping}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .success-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: calc(100vh - 100px);
          padding: 40px 0;
        }

        .success-card {
          background: white;
          border-radius: 24px;
          padding: 60px 40px;
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .success-icon-wrapper {
          margin-bottom: 30px;
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .success-icon {
          font-size: 100px;
          color: #10b981;
          filter: drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3));
        }

        .success-title {
          font-size: 36px;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 15px;
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        .success-subtitle {
          font-size: 18px;
          color: #6b7280;
          margin-bottom: 40px;
          animation: fadeInUp 0.6s ease-out 0.3s both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .order-info-card {
          background: #f9fafb;
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 30px;
          animation: fadeInUp 0.6s ease-out 0.4s both;
        }

        .info-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .info-row:last-child {
          margin-bottom: 0;
        }

        .info-item {
          text-align: left;
          padding: 15px;
          background: white;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
        }

        .info-label {
          display: block;
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          display: block;
          font-size: 20px;
          color: #1f2937;
          font-weight: 700;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 16px;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-radius: 20px;
          font-size: 16px;
        }

        .email-notice {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 25px;
          background: #dbeafe;
          border-radius: 16px;
          text-align: left;
          margin-bottom: 30px;
          animation: fadeInUp 0.6s ease-out 0.5s both;
        }

        .email-notice svg {
          color: #3b82f6;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .email-notice strong {
          display: block;
          color: #1e40af;
          font-size: 16px;
          margin-bottom: 5px;
        }

        .email-notice p {
          color: #1e40af;
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
        }

        .whats-next {
          text-align: left;
          padding: 25px;
          background: #f0fdf4;
          border-radius: 16px;
          margin-bottom: 40px;
          animation: fadeInUp 0.6s ease-out 0.6s both;
        }

        .whats-next h5 {
          color: #065f46;
          font-weight: 700;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .whats-next ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .whats-next li {
          color: #065f46;
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
          font-size: 15px;
        }

        .whats-next li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
          font-size: 18px;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeInUp 0.6s ease-out 0.7s both;
        }

        .btn {
          padding: 16px 32px;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.3s;
          font-size: 16px;
          border: 2px solid;
        }

        .btn-primary {
          background: #6366f1;
          border-color: #6366f1;
          color: white;
        }

        .btn-primary:hover {
          background: #4f46e5;
          border-color: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
        }

        .btn-outline-primary {
          background: white;
          border-color: #6366f1;
          color: #6366f1;
        }

        .btn-outline-primary:hover {
          background: #6366f1;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
        }

        @media (max-width: 768px) {
          .success-card {
            padding: 40px 20px;
          }

          .success-title {
            font-size: 28px;
          }

          .success-icon {
            font-size: 80px;
          }

          .info-row {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .email-notice {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }
      `}</style>
    </Layout>
  );
};

export default OrderSuccess;
